// Finds the master baseline for the metrics gate: the summary.json of the
// closest successful master push run that is an ancestor of the commit being
// tested. Only runs triggered by a push to the branch of this repository count,
// so nothing a pull request (including one from a fork) uploads can become a
// baseline. The GitHub API, git and the clock are passed in for testing.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { summaryProblems } from './metrics-compare.mjs';

const maxArtifactBytes = 200 * 1024 * 1024;
const maxSummaryBytes = 1024 * 1024;
const maxCandidates = 10;
const maxDownloads = 3;

// Keeps completed, successful runs a push to `branch` of `repository` started
// in one of `workflows`, newest first.
export function trustedRuns(runs, { repository, branch, workflows }) {
  const unique = [...new Map(runs.filter(Boolean).map(run => [run.id, run])).values()];
  return unique
    .filter(run => run.event === 'push'
      && run.head_branch === branch
      && run.repository?.full_name === repository
      && run.head_repository?.full_name === repository
      && workflows.includes(path.posix.basename(String(run.path || '').split('@')[0]))
      && /^[0-9a-f]{40}$/.test(run.head_sha || ''))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export function gitHelpers(cwd) {
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  return {
    // Number of commits from `sha` to `base`, or null when `sha` is not an ancestor of `base`.
    distance(sha, base) {
      try {
        git('merge-base', '--is-ancestor', sha, base);
        return Number(git('rev-list', '--count', `${sha}..${base}`));
      } catch {
        return null;
      }
    },
    mergeBase(ref, branch) {
      return git('merge-base', ref, `refs/remotes/origin/${branch}`);
    },
    changed(sha, file) {
      try {
        git('diff', '--quiet', sha, 'HEAD', '--', file);
        return false;
      } catch {
        return true;
      }
    },
  };
}

// Returns `summary.json` from an artifact zip, read with `unzip -p` so nothing
// from the archive is written to disk.
export function readSummaryFromZip(zip) {
  const directory = mkdtempSync(path.join(tmpdir(), 'loveit-baseline-'));
  try {
    const file = path.join(directory, 'artifact.zip');
    writeFileSync(file, zip);
    return execFileSync('unzip', ['-p', file, 'summary.json'], { maxBuffer: maxSummaryBytes, stdio: ['ignore', 'pipe', 'ignore'] });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

// A minimal GitHub REST client: retries network errors, 5xx and 429 responses.
export function githubApi({ token, apiUrl = 'https://api.github.com', fetchImpl = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)) }) {
  async function request(pathname, { binary = false } = {}) {
    const url = new URL(pathname.replace(/^\//, ''), `${apiUrl.replace(/\/$/, '')}/`);
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        // fetch drops the Authorization header when an artifact download
        // redirects to another origin.
        const response = await fetchImpl(url, {
          headers: {
            accept: 'application/vnd.github+json',
            authorization: `Bearer ${token}`,
            'user-agent': 'loveit-metrics-gate',
            'x-github-api-version': '2022-11-28',
          },
          signal: AbortSignal.timeout(120_000),
        });
        if (response.ok) return binary ? Buffer.from(await response.arrayBuffer()) : response.json();
        lastError = new Error(`GitHub API ${url.pathname} returned ${response.status}`);
        lastError.status = response.status;
        if (response.status < 500 && response.status !== 429) break;
      } catch (error) {
        lastError = error;
      }
      if (attempt < 3) await sleep(attempt * 5000);
    }
    throw lastError;
  }
  return { request };
}

// Looks up, waits for (when the exact base is still running) and downloads the
// baseline. Returns { summary, run, distance, skipped } or { missing, skipped }.
export async function findBaseline({ api, git, repository, baseSha, config, sleep, now = Date.now, log = () => {}, readZip = readSummaryFromZip }) {
  const { branch, workflows, artifact, waitMinutes } = config;
  const skipped = [];
  const listRuns = async query => (await Promise.all(workflows.map(async workflow => {
    try {
      const page = await api.request(`/repos/${repository}/actions/workflows/${encodeURIComponent(workflow)}/runs?${query}`);
      return page.workflow_runs || [];
    } catch (error) {
      // A workflow listed in the budget may not exist on master (yet).
      if (error.status === 404) return [];
      throw error;
    }
  }))).flat();
  const branchQuery = `branch=${encodeURIComponent(branch)}&event=push`;

  // A pull request opened right after a merge would otherwise compare with the
  // commit before that merge; give the base commit's own run time to finish.
  const deadline = now() + waitMinutes * 60_000;
  for (;;) {
    const pending = trustedRuns(await listRuns(`${branchQuery}&head_sha=${baseSha}&per_page=20`), { repository, branch, workflows })
      .filter(run => run.status !== 'completed');
    if (!pending.length || now() >= deadline) {
      if (pending.length) skipped.push(`run ${pending[0].id} for the base commit was still ${pending[0].status} after waiting ${waitMinutes} min`);
      break;
    }
    log(`Waiting for run ${pending[0].id} (${pending[0].status}) on the base commit ${baseSha.slice(0, 7)}`);
    await sleep(Math.min(60_000, Math.max(0, deadline - now())));
  }

  const runs = trustedRuns(await listRuns(`${branchQuery}&status=success&per_page=50`), { repository, branch, workflows })
    .filter(run => run.conclusion === 'success' && run.status === 'completed');
  const candidates = [];
  for (const run of runs) {
    const distance = git.distance(run.head_sha, baseSha);
    if (distance === null) continue;
    candidates.push({ run, distance });
  }
  // Closest commit first; for re-runs of one commit, the newest run.
  candidates.sort((a, b) => a.distance - b.distance);

  let downloads = 0;
  for (const { run, distance } of candidates.slice(0, maxCandidates)) {
    const label = `run ${run.id} (${run.head_sha.slice(0, 7)})`;
    try {
      const { artifacts = [] } = await api.request(`/repos/${repository}/actions/runs/${run.id}/artifacts?name=${encodeURIComponent(artifact)}&per_page=10`);
      const found = artifacts.find(item => item.name === artifact && !item.expired);
      if (!found) {
        skipped.push(`${label} has no unexpired "${artifact}" artifact`);
        continue;
      }
      if (found.size_in_bytes > maxArtifactBytes) {
        skipped.push(`${label}: the artifact is larger than ${maxArtifactBytes / 1024 / 1024} MiB`);
        continue;
      }
      if (downloads >= maxDownloads) break;
      downloads += 1;
      const zip = await api.request(`/repos/${repository}/actions/artifacts/${found.id}/zip`, { binary: true });
      let summary;
      try {
        summary = JSON.parse(readZip(zip).toString('utf8'));
      } catch (error) {
        skipped.push(`${label}: cannot read summary.json (${error.message.split('\n')[0]})`);
        continue;
      }
      const problems = summaryProblems(summary);
      if (problems.length) {
        skipped.push(`${label}: summary.json has an unexpected format (${problems.slice(0, 3).join('; ')})`);
        continue;
      }
      return { summary, run, distance, skipped };
    } catch (error) {
      skipped.push(`${label}: ${error.message}`);
    }
  }
  const reason = candidates.length
    ? `no usable baseline among the ${Math.min(candidates.length, maxCandidates)} closest successful ${branch} runs`
    : `no successful ${branch} push run of ${workflows.join(' or ')} is an ancestor of ${baseSha.slice(0, 7)}`;
  return { missing: reason, skipped };
}

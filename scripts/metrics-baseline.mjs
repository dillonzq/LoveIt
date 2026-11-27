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
const perPage = 100;
const maxPages = 5;

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
    // The file's content at commit `sha`, or null when it does not exist
    // there. Any other failure (an unknown commit, a git error) throws.
    show(sha, file) {
      git('cat-file', '-e', `${sha}^{commit}`);
      if (!git('ls-tree', '--name-only', sha, '--', file)) return null;
      return git('show', `${sha}:${file}`);
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
// baseline: a run of the base commit itself first, then the closest successful
// run of an older commit on `branch`. Returns { summary, run, distance, skipped }
// or { missing, skipped }.
export async function findBaseline({ api, git, repository, branch, baseSha, config, sleep, now = Date.now, log = () => {}, readZip = readSummaryFromZip }) {
  const { workflows, artifact, waitMinutes } = config;
  const skipped = [];
  const trust = runs => trustedRuns(runs, { repository, branch, workflows });
  const succeeded = run => run.status === 'completed' && run.conclusion === 'success';
  const branchQuery = `branch=${encodeURIComponent(branch)}&event=push&per_page=${perPage}`;
  // Returns the runs of every listed workflow and whether all lists are exhausted.
  const listRuns = async query => {
    const pages = await Promise.all(workflows.map(async workflow => {
      try {
        const page = await api.request(`/repos/${repository}/actions/workflows/${encodeURIComponent(workflow)}/runs?${branchQuery}&${query}`);
        return page.workflow_runs || [];
      } catch (error) {
        // A workflow listed in the budget may not exist on the branch (yet).
        if (error.status === 404) return [];
        throw error;
      }
    }));
    return { runs: trust(pages.flat()), exhausted: pages.every(page => page.length < perPage) };
  };

  // A pull request opened right after a merge would otherwise compare with the
  // commit before that merge; give the base commit's own run time to finish.
  const deadline = now() + waitMinutes * 60_000;
  let exact;
  for (;;) {
    ({ runs: exact } = await listRuns(`head_sha=${baseSha}`));
    const pending = exact.filter(run => run.status !== 'completed');
    if (!pending.length || now() >= deadline) {
      if (pending.length) skipped.push(`run ${pending[0].id} for the base commit was still ${pending[0].status} after waiting ${waitMinutes} min`);
      break;
    }
    log(`Waiting for run ${pending[0].id} (${pending[0].status}) on the base commit ${baseSha.slice(0, 7)}`);
    await sleep(Math.min(60_000, Math.max(0, deadline - now())));
  }

  const tried = new Set();
  let downloads = 0;
  // Returns the run's summary, or null after recording why it cannot be used.
  async function summaryOf(run) {
    tried.add(run.id);
    const label = `run ${run.id} (${run.head_sha.slice(0, 7)})`;
    try {
      const { artifacts = [] } = await api.request(`/repos/${repository}/actions/runs/${run.id}/artifacts?name=${encodeURIComponent(artifact)}&per_page=100`);
      // A re-run adds another artifact of the same name; the newest comes first.
      const matches = artifacts.filter(item => item.name === artifact && !item.expired).sort((a, b) => b.id - a.id);
      if (!matches.length) skipped.push(`${label} has no unexpired "${artifact}" artifact`);
      for (const found of matches) {
        if (found.size_in_bytes > maxArtifactBytes) {
          skipped.push(`${label}: artifact ${found.id} is larger than ${maxArtifactBytes / 1024 / 1024} MiB`);
          continue;
        }
        if (downloads >= maxDownloads) return null;
        downloads += 1;
        let summary;
        try {
          const zip = await api.request(`/repos/${repository}/actions/artifacts/${found.id}/zip`, { binary: true });
          summary = JSON.parse(readZip(zip).toString('utf8'));
        } catch (error) {
          skipped.push(`${label}: cannot read summary.json from artifact ${found.id} (${error.message.split('\n')[0]})`);
          continue;
        }
        const problems = summaryProblems(summary);
        if (!problems.length) return summary;
        skipped.push(`${label}: summary.json in artifact ${found.id} has an unexpected format (${problems.slice(0, 3).join('; ')})`);
      }
    } catch (error) {
      skipped.push(`${label}: ${error.message}`);
    }
    return null;
  }

  for (const run of exact.filter(succeeded)) {
    const summary = await summaryOf(run);
    if (summary) return { summary, run, distance: 0, skipped };
  }
  // Older commits: gather the ancestors on up to `maxPages` pages of every
  // workflow's successful runs before choosing, because a workflow's first page
  // may hold only a distant ancestor while a closer one sits on a later page of
  // another. Even the base commit's parent might have no usable artifact.
  const candidates = new Map();
  const distances = new Map();
  for (let page = 1; page <= maxPages; page += 1) {
    const { runs, exhausted } = await listRuns(`status=success&page=${page}`);
    for (const run of runs) {
      if (!succeeded(run) || tried.has(run.id) || candidates.has(run.id)) continue;
      if (!distances.has(run.head_sha)) distances.set(run.head_sha, git.distance(run.head_sha, baseSha));
      const distance = distances.get(run.head_sha);
      if (distance !== null) candidates.set(run.id, { run, distance });
    }
    if (exhausted) break;
  }
  // The closest commit first; for re-runs of one commit, the newest run.
  const ranked = [...candidates.values()].sort((a, b) => a.distance - b.distance
    || String(b.run.created_at).localeCompare(String(a.run.created_at)));
  for (const { run, distance } of ranked.slice(0, maxCandidates)) {
    if (downloads >= maxDownloads) break;
    const summary = await summaryOf(run);
    if (summary) return { summary, run, distance, skipped };
  }
  const reason = tried.size
    ? `no usable baseline among the ${tried.size} closest successful ${branch} runs`
    : `no successful ${branch} push run of ${workflows.join(' or ')} is an ancestor of ${baseSha.slice(0, 7)}`;
  return { missing: reason, skipped };
}

// Posts the Metrics results of a pull request's CI run as one comment on the
// pull request and updates that comment on later runs. The Metrics comment
// workflow runs it on `workflow_run`, from the default branch, with a token
// that can write to pull requests from forks too.
//
// The CI run's artifact is untrusted: a pull request controls what its run
// writes. Only `summary.json`, `comparison.json` and `pull-request.json` are
// read from it, as data. The first two are validated and the comment is
// rendered here, by the default branch's code, so the artifact cannot add
// links, mentions or markup. The pull request is found from the run; the
// number in `pull-request.json` (or `comparison.json`) can only choose among
// open pull requests whose head is the commit the run tested.
//
// The workflow runs it twice: with --resolve to find the pull request (written
// to GITHUB_OUTPUT as `pull-request`), then, serialized per pull request, to
// write the comment, with that number in LOVEIT_METRICS_PULL_REQUEST.
//
//   GITHUB_TOKEN=… GITHUB_REPOSITORY=owner/repo GITHUB_EVENT_PATH=event.json \
//     node scripts/metrics-comment.mjs [--resolve]
import { appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { githubApi, readFromZip } from './metrics-baseline.mjs';
import { renderComparison, summaryProblems, summaryTextProblems, trustedComparison } from './metrics-compare.mjs';
import { renderMarkdown } from './metrics-report.mjs';

// Identifies the comment on later runs. Only a comment by `bot` that starts
// with it is updated.
export const MARKER = '<!-- loveit-metrics -->';
const bot = 'github-actions[bot]';
const ciWorkflow = '.github/workflows/ci.yml';
const artifactPrefix = 'metrics-attempt-';
// The Metrics job as the jobs API names it: ci.yml's `metrics` job calling
// metrics.yml's `metrics` job.
const metricsJobs = ['metrics / metrics', 'metrics'];
const maxArtifactBytes = 200 * 1024 * 1024;
const maxFileBytes = 1024 * 1024;
// GitHub rejects comment bodies longer than 65,536 characters.
const maxBody = 65_000;
// Comments are read 100 at a time; past this many pages nothing is created,
// so an earlier comment that was not reached is never duplicated.
const maxCommentPages = 100;

const short = sha => String(sha).slice(0, 7);

// Returns the Metrics job of the run's latest attempt up to `attempt` (the one
// whose completion started this workflow; a later re-run may already be
// listed) and, as parsed JSON,
// `summary.json` and `comparison.json` from the artifact that job uploaded.
// Pull request runs name their artifact after the attempt
// (`metrics-attempt-N`), so a re-run whose Metrics job uploaded nothing never
// shows an earlier attempt's results. When only other jobs were re-run, the
// earlier Metrics job is listed again under the new attempt, with the same
// times, and its artifact is used. A missing or unreadable file is null;
// `pullRequest` is the run's pull-request.json, written before anything else.
export async function readArtifact({ api, repository, runId, attempt = Infinity, readZip = readFromZip }) {
  const none = job => ({ job, summary: null, comparison: null, pullRequest: null });
  const jobs = [];
  for (let page = 1; page <= 10; page += 1) {
    const { jobs: list = [] } = await api.request(`/repos/${repository}/actions/runs/${runId}/jobs?filter=all&per_page=100&page=${page}`);
    jobs.push(...list.filter(item => metricsJobs.includes(item.name) && Number.isSafeInteger(item.run_attempt) && item.run_attempt <= attempt));
    if (list.length < 100) break;
  }
  jobs.sort((a, b) => b.run_attempt - a.run_attempt);
  const job = jobs[0] ?? null;
  if (job?.status !== 'completed' || !job.started_at) return none(job);
  const names = new Set(jobs
    .filter(item => item.started_at === job.started_at)
    .map(item => `${artifactPrefix}${item.run_attempt}`));
  const artifacts = [];
  for (let page = 1; page <= 10; page += 1) {
    const { artifacts: list = [] } = await api.request(`/repos/${repository}/actions/runs/${runId}/artifacts?per_page=100&page=${page}`);
    artifacts.push(...list);
    if (list.length < 100) break;
  }
  const found = artifacts
    .filter(item => names.has(item.name) && !item.expired && item.size_in_bytes <= maxArtifactBytes)
    .sort((a, b) => b.id - a.id)[0];
  if (!found) return none(job);
  const zip = await api.request(`/repos/${repository}/actions/artifacts/${found.id}/zip`, { binary: true });
  const read = name => {
    try {
      return JSON.parse(readZip(zip, name, { maxBytes: maxFileBytes }).toString('utf8'));
    } catch {
      return null;
    }
  };
  return { job, summary: read('summary.json'), comparison: read('comparison.json'), pullRequest: read('pull-request.json') };
}

// An open pull request into `repository` whose head is the commit the run
// tested, opened before the run started.
const matches = (pull, repository, run) => pull?.state === 'open'
  && pull.head?.sha === run.head_sha
  && pull.base?.repo?.full_name === repository
  && !(Date.parse(pull.created_at) > Date.parse(run.created_at));

// Returns the pull request the run tested, or why none can be chosen.
// Same-repository pull requests come with the run, and only those are
// considered. Fork ones are looked up by head repository and branch, which also
// finds pull requests the run did not test, so there `hint`, the pull request
// number the run recorded, is required. The hint can only choose among the
// candidates: when it names none of them, or several remain without it,
// nothing is chosen.
export async function findPullRequest({ api, repository, run, hint = null }) {
  const found = new Map();
  const listed = (run.pull_requests || []).map(item => item?.number).filter(Number.isSafeInteger);
  for (const number of new Set(listed)) {
    const pull = await api.request(`/repos/${repository}/pulls/${number}`);
    if (matches(pull, repository, run)) found.set(number, pull);
  }
  const owner = run.head_repository?.owner?.login;
  if (!listed.length && owner && run.head_branch) {
    const head = encodeURIComponent(`${owner}:${run.head_branch}`);
    for (let page = 1; page <= 10; page += 1) {
      const pulls = await api.request(`/repos/${repository}/pulls?state=open&head=${head}&per_page=100&page=${page}`);
      for (const pull of pulls) if (matches(pull, repository, run)) found.set(pull.number, pull);
      if (pulls.length < 100) break;
    }
  }
  const names = [...found.keys()].map(number => `#${number}`).join(', ');
  if (!listed.length && hint === null) return { reason: 'the run lists no pull request and recorded none, so a pull request from a fork cannot be identified' };
  if (hint !== null) {
    if (found.has(hint)) return { pull: found.get(hint) };
    return { reason: `the run recorded #${hint}, which is not an open pull request with ${short(run.head_sha)} as its head${found.size ? ` (${names} are)` : ''}` };
  }
  if (found.size === 1) return { pull: [...found.values()][0] };
  if (found.size > 1) return { reason: `pull requests ${names} all have ${short(run.head_sha)} as their head, and the run did not record which one it tested` };
  return { reason: `no open pull request has ${short(run.head_sha)} as its head` };
}

// Splits renderMarkdown's output into its "###" sections.
const sectionsOf = summary => renderMarkdown(summary).replace(/^## Metrics\s*/, '').split(/^(?=### )/m).map(section => section.trim()).filter(Boolean);

// Renders the comment from validated data. `summary` and `comparison` are the
// parsed files (or null), `job` the Metrics job from the jobs API, `number` the
// pull request. With a comparison, its heading gives the verdict, then come the
// checks over budget, the Lighthouse overview and, folded, every measurement.
// Without one, this run's Lighthouse tables are shown instead.
export function renderComment({ summary, comparison, job, run, repository, number }) {
  const sha = short(run.head_sha);
  const repositoryUrl = `https://github.com/${repository}`;
  const runLink = `[CI run](${run.html_url})`;
  const commit = Number.isSafeInteger(number) ? `[\`${sha}\`](${repositoryUrl}/pull/${number}/commits/${run.head_sha})` : `\`${sha}\``;
  const footer = `<sub>Commit ${commit} · ${runLink} · Full Lighthouse reports and axe results are in the run's artifacts. This comment is updated on every push.</sub>`;
  const only = (heading, text) => [MARKER, `## ${heading}`, '', text, '', footer, ''].join('\n');

  if (!summary) return only('❌ Metrics: no results', `The Metrics job did not produce results for \`${sha}\`; see the ${runLink}.`);
  if (summaryProblems(summary).length || summaryTextProblems(summary).length) {
    return only('❌ Metrics: results unreadable', `The results of \`${sha}\` are not in the expected format; see the ${runLink}.`);
  }
  let data = null;
  let unreadable = false;
  if (comparison) {
    try {
      data = trustedComparison(comparison);
    } catch {
      unreadable = true;
    }
  }

  let compared;
  if (data?.compared) {
    if (job?.conclusion === 'success' && data.failed && !data.accepted) {
      // The job passes only when no blocking check fails or the label accepts them.
      return only('⚠️ Metrics: results do not match the job', `The comparison lists failing checks, but the Metrics job passed; see the ${runLink}.`);
    }
    const { baselineRun: from } = data;
    const source = from
      ? `[run ${from.id}](${repositoryUrl}/actions/runs/${from.id}) of master at \`${short(from.sha)}\`${from.distance ? `, ${from.distance} ${from.distance === 1 ? 'commit' : 'commits'} before the base commit` : ''}.`
      : undefined;
    const notes = data.noteCount ? [`The job summary of the ${runLink} has ${data.noteCount} ${data.noteCount === 1 ? 'note' : 'notes'} on the baseline and the budget.`] : [];
    compared = renderComparison(data, { source, notes, accepted: data.accepted, baseline: data.baselineSummary, current: summary }).trim();
  } else {
    const why = unreadable
      ? `The comparison is not in the expected format; see the ${runLink}.`
      : `See the job summary of the ${runLink} for why.`;
    compared = `## ⚠️ Metrics: not compared with master\n\n${why}`;
  }
  // A failed job is a failure whatever the results say, unless they show why:
  // blocking checks over budget that no label accepted.
  if (job?.conclusion !== 'success' && !(data?.compared && data.failed && !data.accepted)) {
    const [heading, ...rest] = compared.split('\n');
    const reported = heading.replace(/^## /, '');
    compared = [`## ❌ Metrics: the job ${job?.conclusion === 'failure' ? 'failed' : 'did not finish'}`, '',
      `The Metrics job ${job?.conclusion === 'failure' ? 'failed' : 'did not finish'}; see the ${runLink}. Before that it reported: ${reported}.`, ...rest].join('\n');
  }

  const sections = sectionsOf(summary);
  const shown = data?.compared ? [] : sections.filter(section => /^### Lighthouse\b/.test(section));
  const folded = sections.filter(section => !shown.includes(section));
  const measured = [
    ...shown.flatMap(section => [section, '']),
    ...folded.length ? [`<details><summary>${shown.length ? 'More measurements' : 'All measurements'} of this run</summary>`, '', ...folded.flatMap(section => [section, '']), '</details>', ''] : [],
  ];
  let body = [MARKER, compared, '', ...measured, footer, ''].join('\n');
  if (body.length > maxBody) body = [MARKER, compared, '', footer, ''].join('\n');
  if (body.length > maxBody) {
    const note = '\n\n… Truncated; the job summary of the run has everything.\n';
    const room = maxBody - MARKER.length - footer.length - note.length - 4;
    body = [MARKER, `${compared.slice(0, room)}${note}`, footer, ''].join('\n');
  }
  return body;
}

// The CI run a comment shows, as [run id, attempt], from the line stampRun adds
// below the marker; [0, 0] for a comment without one.
const runOf = body => {
  const match = /^<!-- loveit-metrics -->\n<!-- loveit-metrics-run: (\d+)\.(\d+) -->/.exec(body || '');
  return match ? [Number(match[1]), Number(match[2])] : [0, 0];
};
const newer = (a, b) => a[0] - b[0] || a[1] - b[1];

// Records the CI run below the marker, so a later run is never overwritten by
// an earlier one that finishes after it.
export const stampRun = (body, run) => body.replace(MARKER, `${MARKER}\n<!-- loveit-metrics-run: ${run.id}.${Number.isSafeInteger(run.run_attempt) ? run.run_attempt : 1} -->`);

// Updates this workflow's earlier comment on the pull request, or creates one,
// so that one comment remains and shows the latest CI run. Reads every page of
// comments first; a comment from a later run than `body`'s is left as it is.
// Calls `stillCurrent` right before writing `body`: false skips that write.
// Extra comments of this workflow (from an earlier race) are removed, the
// oldest one staying with the latest run's results.
export async function upsertComment({ api, repository, number, body, stillCurrent = async () => true }) {
  const { comments: ours, complete } = await ownComments({ api, repository, number });
  if (!ours.length && !complete) throw new Error(`#${number} has more than ${maxCommentPages * 100} comments; not creating another Metrics comment`);
  const [kept, ...extra] = ours;
  const latest = ours.reduce((best, comment) => (!best || newer(runOf(comment.body), runOf(best.body)) > 0 ? comment : best), null);
  let action;
  let shown;
  if (latest && newer(runOf(latest.body), runOf(body)) > 0) {
    action = 'kept a later run';
    shown = latest.body;
  } else if (kept?.body === body && !extra.length) {
    return { action: 'unchanged', id: kept.id };
  } else if (!await stillCurrent()) {
    action = 'skipped';
    shown = latest?.body;
  } else {
    action = kept ? 'updated' : 'created';
    shown = body;
  }
  if (kept) {
    if (shown !== kept.body) await api.request(`/repos/${repository}/issues/comments/${kept.id}`, { method: 'PATCH', body: { body: shown } });
    for (const comment of extra) await api.request(`/repos/${repository}/issues/comments/${comment.id}`, { method: 'DELETE' });
    return { action, id: kept.id };
  }
  if (action !== 'created') return { action, id: null };
  const created = await api.request(`/repos/${repository}/issues/${number}/comments`, { method: 'POST', body: { body } });
  // Should another job have created a comment at the same time, the oldest
  // comment stays, showing the later of the two runs, and this one is removed.
  const { comments: now } = await ownComments({ api, repository, number });
  const [first] = now;
  if (first && first.id !== created.id) {
    if (newer(runOf(body), runOf(first.body)) > 0) {
      await api.request(`/repos/${repository}/issues/comments/${first.id}`, { method: 'PATCH', body: { body } });
    }
    await api.request(`/repos/${repository}/issues/comments/${created.id}`, { method: 'DELETE' });
    return { action: 'deduplicated', id: first.id };
  }
  return { action: 'created', id: created.id };
}

// This workflow's comments on the pull request, oldest first, and whether
// every page was read.
async function ownComments({ api, repository, number }) {
  const comments = [];
  for (let page = 1; page <= maxCommentPages; page += 1) {
    const list = await api.request(`/repos/${repository}/issues/${number}/comments?per_page=100&page=${page}`);
    comments.push(...list.filter(comment => comment.user?.login === bot && comment.body?.startsWith(MARKER)));
    if (list.length < 100) return { comments: comments.sort((x, y) => x.id - y.id), complete: true };
  }
  return { comments: comments.sort((x, y) => x.id - y.id), complete: false };
}

// Finds the pull request and, unless `resolve`, writes the comment. Returns the
// pull request number, or null when nothing was chosen.
export async function main({ env = process.env, api, log = console.log, readZip = readFromZip, resolve = false } = {}) {
  const repository = env.GITHUB_REPOSITORY;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository || '')) throw new Error('Set GITHUB_REPOSITORY to owner/repo');
  if (!env.GITHUB_EVENT_PATH) throw new Error('Set GITHUB_EVENT_PATH to a workflow_run event');
  const run = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8')).workflow_run;
  if (run?.event !== 'pull_request') {
    log(`Run ${run?.id} was not started by a pull request; nothing to comment on.`);
    return null;
  }
  if (!/^[0-9a-f]{40}$/.test(run.head_sha || '') || !Number.isSafeInteger(run.id)) throw new Error('The event has no workflow run id or head commit');
  // `workflow_run` matches workflows by name; only ci.yml runs the Metrics job.
  if (String(run.path || '').split('@')[0] !== ciWorkflow) {
    log(`Run ${run.id} is of ${run.path}, not ${ciWorkflow}; nothing to comment on.`);
    return null;
  }
  if (!api) {
    if (!env.GITHUB_TOKEN) throw new Error('Set GITHUB_TOKEN');
    api = githubApi({ token: env.GITHUB_TOKEN, apiUrl: env.GITHUB_API_URL });
  }
  const attempt = Number.isSafeInteger(run.run_attempt) ? run.run_attempt : Infinity;
  const artifact = await readArtifact({ api, repository, runId: run.id, attempt, readZip });
  const recorded = artifact.pullRequest?.pullRequest;
  let hint = Number.isSafeInteger(recorded) && recorded > 0 ? recorded : null;
  if (hint === null && artifact.comparison) {
    try {
      hint = trustedComparison(artifact.comparison).pullRequest;
    } catch {
      // An unreadable comparison records no pull request.
    }
  }
  const { pull, reason } = await findPullRequest({ api, repository, run, hint });
  if (!pull) {
    log(`Not commenting: ${reason}.`);
    return null;
  }
  if (resolve) {
    if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `pull-request=${pull.number}\n`);
    log(`Pull request: #${pull.number}.`);
    return pull.number;
  }
  // This job is serialized for the pull request the first job found.
  const expected = env.LOVEIT_METRICS_PULL_REQUEST;
  if (expected && String(pull.number) !== expected) {
    log(`Not commenting: the run now resolves to #${pull.number}, not #${expected}.`);
    return null;
  }
  const body = stampRun(renderComment({ ...artifact, run, repository, number: pull.number }), run);
  // The pull request may have moved on while the artifact was read.
  const stillCurrent = async () => matches(await api.request(`/repos/${repository}/pulls/${pull.number}`), repository, run);
  const { action, id } = await upsertComment({ api, repository, number: pull.number, body, stillCurrent });
  log(action === 'skipped'
    ? `Not commenting: #${pull.number} no longer has ${short(run.head_sha)} as its open head.`
    : `Comment ${id} on #${pull.number}: ${action}.`);
  return pull.number;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main({ resolve: process.argv.includes('--resolve') });
}

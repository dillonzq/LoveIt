import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { MARKER, findPullRequest, main, readArtifact, renderComment, stampRun, upsertComment } from '../scripts/metrics-comment.mjs';
import { githubApi, readFromZip } from '../scripts/metrics-baseline.mjs';
import { compareSummaries, parseBudget, renderComparison, trustedComparison } from '../scripts/metrics-compare.mjs';

const readJson = file => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));
const budget = parseBudget(readJson('../metrics-budget.json'));
const masterRuns = readJson('./metrics-fixtures/master-runs.json');
const clone = value => structuredClone(value);
const repository = 'owner/repo';
const sha = char => char.repeat(40);
const run = (extra = {}) => ({
  id: 42, run_attempt: 1, created_at: '2026-11-28T09:59:00Z', path: '.github/workflows/ci.yml', event: 'pull_request', head_sha: sha('a'), head_branch: 'feature', html_url: 'https://github.com/owner/repo/actions/runs/42',
  head_repository: { full_name: 'fork/repo', owner: { login: 'fork' } }, pull_requests: [], ...extra,
});
const pull = (number, head = sha('a'), { state = 'open', base = repository, created = '2026-11-28T09:00:00Z' } = {}) => ({ number, state, created_at: created, head: { sha: head }, base: { repo: { full_name: base } } });
const job = (conclusion = 'success', extra = {}) => ({ name: 'metrics / metrics', run_attempt: 1, status: 'completed', conclusion, started_at: '2026-11-28T10:00:00Z', completed_at: '2026-11-28T10:10:00Z', ...extra });

// comparison.json as scripts/metrics-gate.mjs writes it, after a JSON round trip.
const comparisonOf = (baseline, current, extra = {}) => JSON.parse(JSON.stringify({
  schema: 1, pullRequest: 7, compared: true, accepted: false, ...compareSummaries(baseline, current, budget),
  notes: [], baselineRun: { id: 99, sha: sha('b'), distance: 0 }, baselineSummary: baseline, ...extra,
}));

// Answers requests from `routes` ("METHOD path" → value or function) and records them.
function fakeApi(routes) {
  const requests = [];
  return {
    requests,
    async request(pathname, { method = 'GET', body, binary } = {}) {
      requests.push(body === undefined ? [method, pathname] : [method, pathname, body]);
      const route = routes[`${method} ${pathname}`];
      if (route === undefined) throw new Error(`unexpected request ${method} ${pathname}`);
      return typeof route === 'function' ? route({ body, binary }) : route;
    },
  };
}
const headQuery = 'GET /repos/owner/repo/pulls?state=open&head=fork%3Afeature&per_page=100&page=1';

test('a fork pull request is found by its head repository and branch and the number the run recorded', async () => {
  const api = fakeApi({ [headQuery]: [pull(7), pull(8, sha('a'), { base: 'other/repo' }), pull(9, sha('a'), { created: '2026-11-28T10:30:00Z' })] });
  assert.equal((await findPullRequest({ api, repository, run: run(), hint: 7 })).pull.number, 7);
  // #9 was opened after the run started, so the run did not test it.
  assert.match((await findPullRequest({ api, repository, run: run(), hint: 9 })).reason, /recorded #9, which is not an open pull request/);
  // Without a recorded number a fork's pull request is never guessed, even when only one is open.
  assert.match((await findPullRequest({ api, repository, run: run() })).reason, /recorded none, so a pull request from a fork cannot be identified/);
});

test('the pull requests listed in the run come first and must still have the tested head', async () => {
  const api = fakeApi({
    'GET /repos/owner/repo/pulls/8': pull(8),
    'GET /repos/owner/repo/pulls/9': pull(9, sha('a'), { state: 'closed' }),
  });
  const own = run({ head_repository: { full_name: repository, owner: { login: 'owner' } }, pull_requests: [{ number: 8 }, { number: 9 }] });
  assert.equal((await findPullRequest({ api, repository, run: own })).pull.number, 8);
  assert.ok(!api.requests.some(([, pathname]) => pathname.includes('head=')));
});

test('a pull request that moved past the tested commit gets no comment', async () => {
  const api = fakeApi({ [headQuery]: [pull(7, sha('b'))] });
  assert.match((await findPullRequest({ api, repository, run: run(), hint: 7 })).reason, /recorded #7, which is not an open pull request with aaaaaaa as its head$/);
});

test('of several pull requests with the tested head, only the recorded one is chosen', async () => {
  const api = fakeApi({ 'GET /repos/owner/repo/pulls/7': pull(7), 'GET /repos/owner/repo/pulls/8': pull(8) });
  const both = run({ pull_requests: [{ number: 7 }, { number: 8 }] });
  assert.equal((await findPullRequest({ api, repository, run: both, hint: 8 })).pull.number, 8);
  assert.match((await findPullRequest({ api, repository, run: both })).reason, /#7, #8 all have aaaaaaa as their head/);
  // A recorded number that is not one of them chooses nothing.
  assert.equal((await findPullRequest({ api, repository, run: both, hint: 9 })).pull, undefined);
});

test('a pull request closed since the run is not replaced by another one', async () => {
  // The run tested #7, which was closed; #8 proposes the same branch elsewhere.
  const api = fakeApi({ 'GET /repos/owner/repo/pulls/7': pull(7, sha('a'), { state: 'closed' }), [headQuery]: [pull(8)] });
  const result = await findPullRequest({ api, repository, run: run({ pull_requests: [{ number: 7 }] }) });
  assert.match(result.reason, /no open pull request has aaaaaaa as its head/);
  assert.ok(!api.requests.some(([, pathname]) => pathname.includes('head=')));
  // From a fork, the number the run recorded must be among the candidates.
  const fork = fakeApi({ [headQuery]: [pull(8)] });
  assert.match((await findPullRequest({ api: fork, repository, run: run(), hint: 7 })).reason, /recorded #7, which is not an open pull request with aaaaaaa as its head \(#8 are\)/);
  assert.equal((await findPullRequest({ api: fork, repository, run: run(), hint: 8 })).pull.number, 8);
});

test('a comparison renders with its verdict, overview and folded measurements', () => {
  const [baseline, current] = masterRuns;
  const body = renderComment({ summary: current, comparison: comparisonOf(baseline, current), job: job(), run: run(), repository, number: 7 });
  assert.ok(body.startsWith(`${MARKER}\n## ✅ Metrics: within budget\n\nBaseline: [run 99](https://github.com/owner/repo/actions/runs/99) of master at \`bbbbbbb\`.\n`));
  assert.match(body, /### Lighthouse \(mobile\), change from master\n/);
  assert.match(body, /<details><summary>All measurements of this run<\/summary>\n\n### Lighthouse \(mobile, representative of 3 runs\)/);
  assert.match(body, /Commit \[`aaaaaaa`\]\(https:\/\/github.com\/owner\/repo\/pull\/7\/commits\/a{40}\) · \[CI run\]\(https:\/\/github.com\/owner\/repo\/actions\/runs\/42\)/);
});

test('the comment renders a comparison exactly as the gate does', () => {
  for (const [index, baseline] of masterRuns.entries()) {
    const current = clone(masterRuns[(index + 1) % masterRuns.length]);
    current.lighthouse[1].scores.accessibility -= 2;
    current.axe[0].counts.serious.nodes += 1;
    current.axe[1].rules.push('label (serious)');
    const original = compareSummaries(baseline, current, budget);
    const trusted = trustedComparison(comparisonOf(baseline, current));
    assert.equal(trusted.failed, original.failed);
    assert.equal(renderComparison(trusted, { baseline, current }), renderComparison(original, { baseline, current }));
  }
});

test('nothing from the artifact can add markup to the comment', () => {
  const [baseline, current] = masterRuns;
  const evil = '[pass](https://evil.example) @maintainer <img src=x>';
  // A label is rebuilt from the metric definitions, whatever the file says.
  const relabelled = comparisonOf(baseline, current);
  relabelled.checks[0].label = evil;
  relabelled.notes = [evil];
  let body = renderComment({ summary: current, comparison: relabelled, job: job(), run: run(), repository, number: 7 });
  assert.ok(!body.includes('evil') && !body.includes('@maintainer') && !body.includes('<img'));
  assert.match(body, /has 1 note on the baseline and the budget/);
  // A name, rule or reason outside the expected patterns makes the comparison unreadable.
  for (const change of [
    data => { data.checks[0].page = evil; },
    data => { data.checks[0].reason = evil; },
    data => { data.checks[0].metric = 'constructor'; },
    data => { data.checks.push({ ...data.checks.find(item => item.metric === 'rules'), added: [evil], status: 'fail' }); },
    data => { data.baselineRun = { id: 1, sha: evil, distance: 0 }; },
    data => { data.baselineSummary.lighthouse[0].name = evil; },
  ]) {
    const data = comparisonOf(baseline, current);
    change(data);
    body = renderComment({ summary: current, comparison: data, job: job(), run: run(), repository, number: 7 });
    assert.ok(!body.includes('evil') && !body.includes('@maintainer'), body);
    assert.match(body, /## ⚠️ Metrics: not compared with master\n\nThe comparison is not in the expected format/);
  }
  // In this run's own summary, the whole result is unreadable.
  for (const change of [
    summary => { summary.lighthouse[0].name = evil; },
    summary => { summary.axe[0].rules = [evil]; },
    summary => { summary.build.hugo = evil; },
    // GitHub links bare domains, so the version has to look like a version.
    summary => { summary.build.hugo = 'www.evil.example'; },
  ]) {
    const summary = clone(current);
    change(summary);
    body = renderComment({ summary, comparison: comparisonOf(baseline, current), job: job(), run: run(), repository, number: 7 });
    assert.ok(!body.includes('evil'));
    assert.match(body, /^<!-- loveit-metrics -->\n## ❌ Metrics: results unreadable\n/);
  }
  // Names that GitHub would link (GH-26, a commit hash) are shown as code.
  const linkable = clone(current);
  linkable.lighthouse[0].name = 'GH-26';
  linkable.axe[0].name = 'deadbeef';
  const named = renderComment({ summary: linkable, comparison: comparisonOf(linkable, linkable), job: job(), run: run() });
  assert.ok(named.includes('| `GH-26` |') && named.includes('| `deadbeef` |'));
  assert.doesNotMatch(named, /\| (GH-26|deadbeef) \|/);
  for (const hugo of ['v0.170.1', 'v0.170.1 extended', 'unknown']) {
    const summary = clone(current);
    summary.build.hugo = hugo;
    assert.match(renderComment({ summary, comparison: null, job: job(), run: run() }), new RegExp(`- Hugo: \`${hugo}\``));
  }
});

test('the verdict must agree with how the Metrics job ended', () => {
  const [baseline] = masterRuns;
  const current = clone(baseline);
  current.axe[0].counts.serious.nodes += 1;
  const failing = comparisonOf(baseline, current);
  // Blocking checks over budget explain the failure.
  assert.match(renderComment({ summary: current, comparison: failing, job: job('failure'), run: run() }), /^<!-- loveit-metrics -->\n## ❌ Metrics: 1 check over budget\n/);
  assert.match(renderComment({ summary: current, comparison: failing, job: job('success'), run: run() }), /## ⚠️ Metrics: results do not match the job\n/);
  assert.match(renderComment({ summary: current, comparison: { ...failing, accepted: true }, job: job('success'), run: run() }), /## ⚠️ Metrics: 1 check over budget, accepted/);
  // Anything else that failed says so first.
  const failed = /^<!-- loveit-metrics -->\n## ❌ Metrics: the job failed\n\nThe Metrics job failed; see the \[CI run\]\([^)]+\)\. Before that it reported: /;
  for (const [summary, comparison, reported] of [
    [baseline, comparisonOf(baseline, baseline), '✅ Metrics: within budget'],
    [current, { ...failing, accepted: true }, '⚠️ Metrics: 1 check over budget, accepted'],
    [baseline, null, '⚠️ Metrics: not compared with master'],
  ]) {
    const body = renderComment({ summary, comparison, job: job('failure'), run: run() });
    assert.match(body, failed);
    assert.ok(body.includes(`Before that it reported: ${reported}.`), body.slice(0, 300));
  }
  assert.match(renderComment({ summary: baseline, comparison: null, job: job('cancelled'), run: run() }), /## ❌ Metrics: the job did not finish\n/);
});

test('without a comparison, this run\'s Lighthouse tables are shown', () => {
  const summary = clone(masterRuns[0]);
  summary.lighthouseDesktop = clone(summary.lighthouse);
  for (const comparison of [null, { schema: 1, compared: false, pullRequest: 7 }]) {
    const body = renderComment({ summary, comparison, job: job(), run: run() });
    assert.match(body, /^<!-- loveit-metrics -->\n## ⚠️ Metrics: not compared with master\n\nSee the job summary of the \[CI run\]\([^)]+\) for why\.\n\n### Lighthouse \(mobile, representative of 3 runs\)\n[\s\S]*\n### Lighthouse \(desktop, representative of 3 runs\)\n[\s\S]*<details><summary>More measurements of this run<\/summary>\n\n### Transfer sizes/);
    // Without a pull request number the commit is not linked.
    assert.match(body, /Commit `aaaaaaa` ·/);
  }
  assert.match(renderComment({ summary: null, comparison: null, job: job('failure'), run: run() }), /^<!-- loveit-metrics -->\n## ❌ Metrics: no results\n\nThe Metrics job did not produce results for `aaaaaaa`/);
});

test('a comment longer than GitHub allows drops the measurements, then truncates', () => {
  const [baseline, current] = masterRuns;
  const many = comparisonOf(baseline, current);
  many.checks = Array.from({ length: 1000 }, () => ({ ...many.checks[0], status: 'fail', blocking: false }));
  const body = renderComment({ summary: current, comparison: many, job: job(), run: run() });
  assert.ok(body.length <= 65_536);
  assert.doesNotMatch(body, /All measurements/);
  assert.match(body, /Truncated/);
  assert.match(body, /<sub>Commit/);
});

const comments = (count, extra = []) => [...Array.from({ length: count }, (_, id) => ({ id, user: { login: 'someone' }, body: 'hi' })), ...extra];

test('the earlier comment by the workflow is updated, not one by anyone else', async () => {
  const api = fakeApi({
    'GET /repos/owner/repo/issues/7/comments?per_page=100&page=1': [
      { id: 1, user: { login: 'someone' }, body: `${MARKER}\nold` },
      { id: 2, user: { login: 'github-actions[bot]' }, body: 'another bot comment' },
      { id: 3, user: { login: 'github-actions[bot]' }, body: `${MARKER}\nold` },
    ],
    'PATCH /repos/owner/repo/issues/comments/3': {},
  });
  assert.deepEqual(await upsertComment({ api, repository, number: 7, body: `${MARKER}\nnew` }), { action: 'updated', id: 3 });
  assert.deepEqual(api.requests.at(-1), ['PATCH', '/repos/owner/repo/issues/comments/3', { body: `${MARKER}\nnew` }]);
  assert.deepEqual(await upsertComment({ api, repository, number: 7, body: `${MARKER}\nold` }), { action: 'unchanged', id: 3 });
});

test('every page of comments is read before one is created', async () => {
  const routes = {};
  for (let page = 1; page <= 11; page += 1) routes[`GET /repos/owner/repo/issues/7/comments?per_page=100&page=${page}`] = comments(100);
  routes['GET /repos/owner/repo/issues/7/comments?per_page=100&page=11'] = comments(99, [{ id: 1001, user: { login: 'github-actions[bot]' }, body: `${MARKER}\nold` }]);
  routes['GET /repos/owner/repo/issues/7/comments?per_page=100&page=12'] = [];
  routes['PATCH /repos/owner/repo/issues/comments/1001'] = {};
  assert.deepEqual(await upsertComment({ api: fakeApi(routes), repository, number: 7, body: `${MARKER}\nnew` }), { action: 'updated', id: 1001 });

  const short = fakeApi({
    'GET /repos/owner/repo/issues/7/comments?per_page=100&page=1': comments(100),
    'GET /repos/owner/repo/issues/7/comments?per_page=100&page=2': [],
    'POST /repos/owner/repo/issues/7/comments': { id: 99 },
  });
  assert.deepEqual(await upsertComment({ api: short, repository, number: 7, body: 'b' }), { action: 'created', id: 99 });

  // When the pages never end, nothing is created.
  const endless = { async request(pathname, { method = 'GET' } = {}) { assert.equal(method, 'GET'); return comments(100); } };
  await assert.rejects(upsertComment({ api: endless, repository, number: 7, body: 'b' }), /more than 10000 comments; not creating/);
});

test('of two comments created at the same time, one stays and shows the later run', async () => {
  const comment = (id, runId, text) => ({ id, user: { login: 'github-actions[bot]' }, body: stampRun(`${MARKER}\n${text}`, { id: runId, run_attempt: 1 }) });
  // Run 50 posts comment 6 while run 40, which posted comment 5, is still writing.
  let listed = [];
  const routes = {
    'GET /repos/owner/repo/issues/7/comments?per_page=100&page=1': () => listed,
    'POST /repos/owner/repo/issues/7/comments': ({ body }) => { listed = [comment(5, 40, 'old'), { ...comment(6, 50, ''), body: body.body }]; return { id: 6 }; },
    'PATCH /repos/owner/repo/issues/comments/5': ({ body }) => { listed[0] = { ...listed[0], body: body.body }; return {}; },
    'DELETE /repos/owner/repo/issues/comments/6': () => { listed = listed.filter(item => item.id !== 6); return null; },
  };
  const later = stampRun(`${MARKER}\nnew`, { id: 50, run_attempt: 1 });
  assert.deepEqual(await upsertComment({ api: fakeApi(routes), repository, number: 7, body: later }), { action: 'deduplicated', id: 5 });
  assert.deepEqual(listed.map(item => [item.id, item.body]), [[5, later]]);
  // The earlier run removes its own comment and leaves the later one as it is.
  listed = [];
  routes['POST /repos/owner/repo/issues/7/comments'] = ({ body }) => { listed = [comment(5, 50, 'new'), { ...comment(6, 40, ''), body: body.body }]; return { id: 6 }; };
  routes['PATCH /repos/owner/repo/issues/comments/5'] = () => assert.fail('the later run must not be overwritten');
  const earlier = stampRun(`${MARKER}\nold`, { id: 40, run_attempt: 1 });
  assert.deepEqual(await upsertComment({ api: fakeApi(routes), repository, number: 7, body: earlier }), { action: 'deduplicated', id: 5 });
  assert.deepEqual(listed.map(item => item.id), [5]);
  assert.match(listed[0].body, /\nnew$/);
});

test('comments that already exist twice are merged into the oldest, with the latest run', async () => {
  const comment = (id, runId, text) => ({ id, user: { login: 'github-actions[bot]' }, body: stampRun(`${MARKER}\n${text}`, { id: runId, run_attempt: 1 }) });
  let listed;
  const api = () => fakeApi({
    'GET /repos/owner/repo/issues/7/comments?per_page=100&page=1': () => listed,
    'PATCH /repos/owner/repo/issues/comments/5': ({ body }) => { listed[0] = { ...listed[0], body: body.body }; return {}; },
    'DELETE /repos/owner/repo/issues/comments/6': () => { listed = listed.filter(item => item.id !== 6); return null; },
  });
  // This run is the latest: its results go to the oldest comment.
  listed = [comment(5, 40, 'a'), comment(6, 45, 'b')];
  const body = stampRun(`${MARKER}\nc`, { id: 50, run_attempt: 1 });
  assert.deepEqual(await upsertComment({ api: api(), repository, number: 7, body }), { action: 'updated', id: 5 });
  assert.deepEqual(listed.map(item => [item.id, item.body]), [[5, body]]);
  // A duplicate shows a later run than this one: that run's results are kept.
  listed = [comment(5, 40, 'a'), comment(6, 60, 'later')];
  const result = await upsertComment({ api: api(), repository, number: 7, body });
  assert.deepEqual(result, { action: 'kept a later run', id: 5 });
  assert.deepEqual(listed.map(item => item.id), [5]);
  assert.match(listed[0].body, /\nlater$/);
});

test('a comment from a later run is not overwritten by an earlier one', async () => {
  const shown = stampRun(`${MARKER}\nnew`, { id: 50, run_attempt: 1 });
  const api = fakeApi({ 'GET /repos/owner/repo/issues/7/comments?per_page=100&page=1': [{ id: 3, user: { login: 'github-actions[bot]' }, body: shown }] });
  for (const earlier of [{ id: 40, run_attempt: 3 }, { id: 50, run_attempt: 0 }]) {
    assert.deepEqual(await upsertComment({ api, repository, number: 7, body: stampRun(`${MARKER}\nold`, earlier) }), { action: 'kept a later run', id: 3 });
  }
  assert.ok(!api.requests.some(([method]) => method !== 'GET'));
  // A re-run of the same run, or a later run, replaces it; so does any run for a comment without a run line.
  const patched = fakeApi({
    'GET /repos/owner/repo/issues/7/comments?per_page=100&page=1': [{ id: 3, user: { login: 'github-actions[bot]' }, body: shown }],
    'PATCH /repos/owner/repo/issues/comments/3': {},
  });
  assert.equal((await upsertComment({ api: patched, repository, number: 7, body: stampRun(`${MARKER}\nrerun`, { id: 50, run_attempt: 2 }) })).action, 'updated');
});

test('nothing is written when the pull request moved on in the meantime', async () => {
  const api = fakeApi({
    'GET /repos/owner/repo/issues/7/comments?per_page=100&page=1': [{ id: 3, user: { login: 'github-actions[bot]' }, body: `${MARKER}\nold` }],
  });
  assert.deepEqual(await upsertComment({ api, repository, number: 7, body: `${MARKER}\nnew`, stillCurrent: async () => false }), { action: 'skipped', id: 3 });
  assert.ok(!api.requests.some(([method]) => method !== 'GET'));
});

test('the artifact is the one the latest Metrics job uploaded', async () => {
  const jobsPath = 'GET /repos/owner/repo/actions/runs/42/jobs?filter=all&per_page=100&page=1';
  const artifactsPath = 'GET /repos/owner/repo/actions/runs/42/artifacts?per_page=100&page=1';
  const artifact = (id, name, extra = {}) => ({ id, name, size_in_bytes: 10, ...extra });
  const readZip = (zip, name) => {
    if (name === 'summary.json') return Buffer.from(JSON.stringify({ zip: String(zip) }));
    throw new Error('missing');
  };
  const later = { run_attempt: 2, started_at: '2026-11-28T11:00:00Z', completed_at: '2026-11-28T11:10:00Z' };
  const read = async (jobs, artifacts) => readArtifact({
    api: fakeApi({
      [jobsPath]: { jobs },
      [artifactsPath]: { artifacts },
      'GET /repos/owner/repo/actions/artifacts/5/zip': ({ binary }) => (assert.ok(binary), Buffer.from('zip 5')),
      'GET /repos/owner/repo/actions/artifacts/6/zip': Buffer.from('zip 6'),
    }),
    repository, runId: 42, readZip,
  });
  const other = { name: 'build-and-validate (minimum, production) / build', run_attempt: 2 };
  // The newest unexpired artifact of the attempt whose Metrics job ran last.
  assert.deepEqual(await read([job(), job('success', later), other], [
    artifact(4, 'metrics-attempt-1'), artifact(5, 'metrics-attempt-2'), artifact(7, 'metrics-attempt-2', { expired: true }), artifact(8, 'metrics'),
  ]), { job: job('success', later), summary: { zip: 'zip 5' }, comparison: null, pullRequest: null });
  // A re-run whose Metrics job uploaded nothing does not show the earlier attempt,
  // however shortly before it that one was uploaded.
  assert.deepEqual(await read([job(), job('failure', later)], [artifact(4, 'metrics-attempt-1')]), { job: job('failure', later), summary: null, comparison: null, pullRequest: null });
  // Re-running only other jobs lists the earlier Metrics job again, with its times.
  const carried = job('success', { run_attempt: 2 });
  assert.deepEqual(await read([job(), carried, other], [artifact(6, 'metrics-attempt-1')]), { job: carried, summary: { zip: 'zip 6' }, comparison: null, pullRequest: null });
  // Handling attempt 1's completion while attempt 2 already runs: attempt 1's results.
  const running = job('success', { ...later, status: 'in_progress', conclusion: null, completed_at: null });
  const first = await readArtifact({
    api: fakeApi({
      [jobsPath]: { jobs: [job(), running] },
      [artifactsPath]: { artifacts: [artifact(6, 'metrics-attempt-1')] },
      'GET /repos/owner/repo/actions/artifacts/6/zip': Buffer.from('zip 6'),
    }),
    repository, runId: 42, attempt: 1, readZip,
  });
  assert.deepEqual(first, { job: job(), summary: { zip: 'zip 6' }, comparison: null, pullRequest: null });
  // A Metrics job that never ran has no artifact to read.
  assert.equal((await read([job('skipped', { started_at: null })], [artifact(4, 'metrics-attempt-1')])).summary, null);
});

// A zip holding summary.json ("{}\n"), so the test needs no zip tool.
const summaryZip = Buffer.from('UEsDBBQAAAAAABuafF0GsKHdAwAAAAMAAAAMAAAAc3VtbWFyeS5qc29ue30KUEsBAhQDFAAAAAAAG5p8XQawod0DAAAAAwAAAAwAAAAAAAAAAAAAAIABAAAAAHN1bW1hcnkuanNvblBLBQYAAAAAAQABADoAAAAtAAAAAAA=', 'base64');
let hasUnzip = true;
try {
  execFileSync('unzip', ['-v'], { stdio: 'ignore' });
} catch {
  hasUnzip = false;
}

test('readFromZip reads one file without extracting the archive', { skip: !hasUnzip && 'unzip is not installed' }, () => {
  assert.equal(readFromZip(summaryZip, 'summary.json').toString(), '{}\n');
  assert.throws(() => readFromZip(summaryZip, 'comparison.json'));
});

async function withEvent(workflowRun, callback) {
  const directory = mkdtempSync(path.join(tmpdir(), 'loveit-event-test-'));
  try {
    const event = path.join(directory, 'event.json');
    writeFileSync(event, JSON.stringify({ workflow_run: workflowRun }));
    await callback({ GITHUB_REPOSITORY: repository, GITHUB_EVENT_PATH: event });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('main ignores runs that a pull request did not start, and other workflows named CI', async () => {
  await withEvent(run({ event: 'push' }), async env => {
    const logs = [];
    await main({ env, api: fakeApi({}), log: line => logs.push(line) });
    assert.match(logs[0], /not started by a pull request/);
  });
  for (const other of ['.github/workflows/other-ci.yml', 'ci.yml', '.github/workflows/ci.yaml']) {
    await withEvent(run({ path: other, pull_requests: [{ number: 7 }] }), async env => {
      const logs = [];
      assert.equal(await main({ env, api: fakeApi({}), log: line => logs.push(line) }), null);
      assert.match(logs[0], /not \.github\/workflows\/ci\.yml; nothing to comment on/);
    });
  }
});

test('main picks the recorded pull request and checks its head again before writing', async () => {
  const [baseline, current] = masterRuns;
  const files = { 'summary.json': current, 'comparison.json': comparisonOf(baseline, current, { pullRequest: 8 }) };
  const readZip = (zip, name) => Buffer.from(JSON.stringify(files[name]));
  let head;
  const api = fakeApi({
    'GET /repos/owner/repo/actions/runs/42/jobs?filter=all&per_page=100&page=1': { jobs: [job()] },
    'GET /repos/owner/repo/actions/runs/42/artifacts?per_page=100&page=1': { artifacts: [{ id: 5, name: 'metrics-attempt-1', size_in_bytes: 10 }] },
    'GET /repos/owner/repo/actions/artifacts/5/zip': Buffer.from('zip'),
    [headQuery]: [pull(7), pull(8)],
    'GET /repos/owner/repo/issues/8/comments?per_page=100&page=1': [],
    'GET /repos/owner/repo/pulls/8': () => pull(8, head),
    'POST /repos/owner/repo/issues/8/comments': { id: 77 },
  });
  await withEvent(run(), async env => {
    const logs = [];
    // A push lands while the artifact is read: the head no longer matches.
    head = sha('c');
    await main({ env, api, log: line => logs.push(line), readZip });
    assert.deepEqual(logs, ['Not commenting: #8 no longer has aaaaaaa as its open head.']);
    assert.ok(!api.requests.some(([method]) => method !== 'GET'));
    // With the head unchanged, the comment goes to the recorded #8, not #7.
    head = sha('a');
    await main({ env, api, log: line => logs.push(line), readZip });
    assert.equal(logs.at(-1), 'Comment 77 on #8: created.');
    const [, , posted] = api.requests.find(([method]) => method === 'POST');
    assert.match(posted.body, /^<!-- loveit-metrics -->\n<!-- loveit-metrics-run: 42\.1 -->\n## ✅ Metrics: within budget/);
  });
});

test('a run whose install failed still reports to its pull request', async () => {
  // Only pull-request.json, written before installing, reached the artifact.
  const files = { 'pull-request.json': { pullRequest: 7 } };
  const readZip = (zip, name) => {
    if (!(name in files)) throw new Error('missing');
    return Buffer.from(JSON.stringify(files[name]));
  };
  const api = fakeApi({
    'GET /repos/owner/repo/actions/runs/42/jobs?filter=all&per_page=100&page=1': { jobs: [job('failure')] },
    'GET /repos/owner/repo/actions/runs/42/artifacts?per_page=100&page=1': { artifacts: [{ id: 5, name: 'metrics-attempt-1', size_in_bytes: 10 }] },
    'GET /repos/owner/repo/actions/artifacts/5/zip': Buffer.from('zip'),
    [headQuery]: [pull(7)],
    'GET /repos/owner/repo/pulls/7': pull(7),
    'GET /repos/owner/repo/issues/7/comments?per_page=100&page=1': [{ id: 3, user: { login: 'github-actions[bot]' }, body: stampRun(`${MARKER}\n## ✅ Metrics: within budget`, { id: 30, run_attempt: 1 }) }],
    'PATCH /repos/owner/repo/issues/comments/3': {},
  });
  await withEvent(run(), async env => {
    const logs = [];
    assert.equal(await main({ env: { ...env, LOVEIT_METRICS_PULL_REQUEST: '7' }, api, log: line => logs.push(line), readZip }), 7);
    assert.deepEqual(logs, ['Comment 3 on #7: updated.']);
    const [, , patched] = api.requests.find(([method]) => method === 'PATCH');
    assert.match(patched.body, /^<!-- loveit-metrics -->\n<!-- loveit-metrics-run: 42\.1 -->\n## ❌ Metrics: no results\n/);
  });
});

test('a run that failed before comparing still names its pull request', async () => {
  // #7's run failed early and #7 was closed; #8 proposes the same fork branch elsewhere.
  const routes = {
    'GET /repos/owner/repo/actions/runs/42/jobs?filter=all&per_page=100&page=1': { jobs: [job('failure')] },
    'GET /repos/owner/repo/actions/runs/42/artifacts?per_page=100&page=1': { artifacts: [{ id: 5, name: 'metrics-attempt-1', size_in_bytes: 10 }] },
    'GET /repos/owner/repo/actions/artifacts/5/zip': Buffer.from('zip'),
    [headQuery]: [pull(8)],
  };
  for (const files of [{ 'pull-request.json': { pullRequest: 7 } }, {}]) {
    const readZip = (zip, name) => {
      if (!(name in files)) throw new Error('missing');
      return Buffer.from(JSON.stringify(files[name]));
    };
    await withEvent(run(), async env => {
      const logs = [];
      await main({ env, api: fakeApi(routes), log: line => logs.push(line), readZip });
      assert.match(logs[0], /^Not commenting: the run (recorded #7, which is not an open pull request|lists no pull request and recorded none)/);
    });
  }
});

test('--resolve only names the pull request; the writing job checks it is still the one', async () => {
  const [baseline, current] = masterRuns;
  const files = { 'summary.json': current, 'comparison.json': comparisonOf(baseline, current), 'pull-request.json': { pullRequest: 7 } };
  const readZip = (zip, name) => Buffer.from(JSON.stringify(files[name]));
  const routes = {
    'GET /repos/owner/repo/actions/runs/42/jobs?filter=all&per_page=100&page=1': { jobs: [job()] },
    'GET /repos/owner/repo/actions/runs/42/artifacts?per_page=100&page=1': { artifacts: [{ id: 5, name: 'metrics-attempt-1', size_in_bytes: 10 }] },
    'GET /repos/owner/repo/actions/artifacts/5/zip': Buffer.from('zip'),
    [headQuery]: [pull(7)],
  };
  const directory = mkdtempSync(path.join(tmpdir(), 'loveit-output-test-'));
  try {
    const output = path.join(directory, 'output');
    writeFileSync(output, '');
    await withEvent(run(), async env => {
      const api = fakeApi(routes);
      assert.equal(await main({ env: { ...env, GITHUB_OUTPUT: output }, api, log: () => {}, readZip, resolve: true }), 7);
      assert.equal(readFileSync(output, 'utf8'), 'pull-request=7\n');
      assert.ok(!api.requests.some(([method, pathname]) => method !== 'GET' || pathname.includes('/comments')));
      const logs = [];
      assert.equal(await main({ env: { ...env, LOVEIT_METRICS_PULL_REQUEST: '8' }, api, log: line => logs.push(line), readZip }), null);
      assert.deepEqual(logs, ['Not commenting: the run now resolves to #7, not #8.']);
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('the API client sends a JSON body and does not retry a POST', async () => {
  const calls = [];
  const api = githubApi({ token: 't', fetchImpl: async (url, init) => { calls.push([init.method, init.body, init.headers['content-type']]); return new Response('busy', { status: 502 }); }, sleep: async () => {} });
  await assert.rejects(api.request('/x', { method: 'POST', body: { body: 'hi' } }), error => error.status === 502);
  assert.deepEqual(calls, [['POST', '{"body":"hi"}', 'application/json']]);
  calls.length = 0;
  await assert.rejects(api.request('/x', { method: 'PATCH', body: { body: 'hi' } }));
  assert.equal(calls.length, 3);
  const deleted = githubApi({ token: 't', fetchImpl: async () => new Response(null, { status: 204 }) });
  assert.equal(await deleted.request('/x', { method: 'DELETE' }), null);
});

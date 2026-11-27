import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { BOOTSTRAP_BASELINE, compareSummaries, parseBaselinePolicy, parseBudget, renderComparison, summaryProblems } from '../scripts/metrics-compare.mjs';
import { findBaseline, gitHelpers, githubApi, trustedRuns } from '../scripts/metrics-baseline.mjs';

const readJson = file => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));
const budget = parseBudget(readJson('../metrics-budget.json'));
// summary.json of seven Metrics runs of master commits, before the gate existed.
const masterRuns = readJson('./metrics-fixtures/master-runs.json');
const clone = value => structuredClone(value);
const failures = result => result.checks.filter(check => check.status === 'fail').map(check => `${check.page} ${check.metric}`);

test('the budget accepts every pair of recorded master runs', () => {
  for (const baseline of masterRuns) {
    assert.deepEqual(summaryProblems(baseline), []);
    for (const current of masterRuns) {
      const result = compareSummaries(baseline, current, budget);
      assert.deepEqual(failures(result), [], `run ${current.run} compared with run ${baseline.run}`);
    }
  }
});

test('the budget rejects deliberate regressions', () => {
  const baseline = masterRuns[0];
  const regressions = {
    // A 40% slower LCP on the home page (beyond the 30% spread between runs).
    'home lcp': summary => { summary.lighthouse[0].metrics.lcp = Math.max(...masterRuns.map(run => run.lighthouse[0].metrics.lcp)) * 1.4; },
    'home performance': summary => { summary.lighthouse[0].scores.performance -= 15; },
    'post accessibility': summary => { summary.lighthouse[1].scores.accessibility -= 1; },
    // 10 KiB more JavaScript.
    'home script': summary => { summary.lighthouse[0].transfer.script += 10 * 1024; },
    'post cls': summary => { summary.lighthouse[1].metrics.cls += 0.1; },
    'post requests': summary => { summary.lighthouse[1].requests += 3; },
    'list serious': summary => { summary.axe[2].counts.serious.nodes += 1; },
    '– cold': summary => { summary.build.cold = 3000; },
    '– assetsLib': summary => { summary.repository.assetsLib.bytes *= 1.1; },
  };
  for (const [name, change] of Object.entries(regressions)) {
    const current = clone(baseline);
    change(current);
    const result = compareSummaries(baseline, current, budget);
    assert.equal(result.failed, true, name);
    assert.deepEqual(failures(result), [name]);
  }
});

test('a new axe rule fails even when the node count does not grow', () => {
  const baseline = clone(masterRuns[0]);
  const current = clone(baseline);
  current.axe[4].rules = current.axe[4].rules.slice(1).concat('label (serious)');
  const result = compareSummaries(baseline, current, budget);
  assert.deepEqual(failures(result), ['search rules']);
  assert.match(renderComparison(result), /\| search \| New violated rules \| .* \| label \(serious\) \| no new rule \| ❌ worse \|/);
});

test('improvements pass and missing values are reported', () => {
  const baseline = clone(masterRuns[0]);
  const current = clone(baseline);
  current.lighthouse[0].metrics.lcp = 1000;
  current.lighthouse[0].metrics.tbt = null;
  baseline.lighthouse[1].metrics.tbt = null;
  current.lighthouse.push({ ...clone(current.lighthouse[0]), name: 'tags' });
  current.axe = current.axe.filter(page => page.name !== '404');
  const result = compareSummaries(baseline, current, budget);
  const find = (page, metric) => result.checks.find(check => check.page === page && check.metric === metric);
  assert.equal(find('home', 'lcp').status, 'improved');
  assert.equal(find('home', 'tbt').status, 'fail');
  assert.equal(find('post', 'tbt').status, 'skipped');
  assert.deepEqual(result.warnings, ['Lighthouse page "tags" has no baseline and was not compared.']);
  // A page the baseline measured but this run did not is a failure, not a warning.
  assert.equal(find('404', 'coverage').status, 'fail');
  assert.match(renderComparison(result), /\| 404 \| axe measured \| yes \| no \| – \| – \| ❌ worse \(page from the baseline was not measured\) \|/);
});

test('the allowed change is the larger of the relative and absolute tolerance', () => {
  const rules = parseBudget({ build: { cold: { relative: 0.5, absolute: 100 } } });
  const summary = cold => ({ ...clone(masterRuns[0]), build: { hugo: 'v0.170.1', cold, warm: 0 } });
  const allowed = (base, current) => compareSummaries(summary(base), summary(current), rules).checks[0];
  assert.equal(allowed(100, 200).status, 'pass');
  assert.equal(allowed(100, 201).status, 'fail');
  assert.equal(allowed(1000, 1500).status, 'pass');
  assert.equal(allowed(1000, 1501).allowed, 500);
  assert.equal(allowed(1000, 1501).status, 'fail');
});

test('budget mistakes are errors, not silently skipped checks', () => {
  assert.throws(() => parseBudget({ lighthouse: { lpc: { relative: 0.1 } } }), /lighthouse: unknown key "lpc"/);
  assert.throws(() => parseBudget({ lighthouse: { lcp: { relative: -1 } } }), /lighthouse\.lcp\.relative/);
  assert.throws(() => parseBudget({ lighthouse: { lcp: { note: 'x' } } }), /set "relative", "absolute" or both/);
  assert.throws(() => parseBudget({ baseline: { missing: 'ignore' } }), /baseline\.missing/);
  assert.throws(() => parseBudget({ baseline: { workflows: ['../ci.yml'] } }), /baseline\.workflows/);
  assert.throws(() => parseBudget({ axe: { newRules: 'yes' } }), /axe\.newRules/);
});

test('summaries in an unknown format are rejected', () => {
  assert.deepEqual(summaryProblems({ ...masterRuns[0], schema: 1 }), []);
  assert.deepEqual(summaryProblems({ ...masterRuns[0], schema: 2 }), ['schema 2 is not 1']);
  assert.deepEqual(summaryProblems([]), ['not a JSON object']);
  const broken = clone(masterRuns[0]);
  broken.lighthouse[0].metrics.lcp = '5 s';
  delete broken.lighthouse[0].metrics.tbt;
  delete broken.lighthouse[1].transfer;
  broken.axe[0].counts = {};
  broken.axe.push(clone(broken.axe[1]));
  delete broken.build;
  assert.deepEqual(summaryProblems(broken), [
    'lighthouse home: metrics.lcp is not valid',
    'lighthouse home: metrics.tbt missing',
    'lighthouse post: transfer missing',
    'axe home: critical missing',
    'axe home: serious missing',
    'axe home: moderate missing',
    'axe home: minor missing',
    'axe: duplicate page "post"',
    'build missing',
  ]);
  // Lighthouse may not measure a value; null is valid, a missing field is not.
  const unmeasured = clone(masterRuns[0]);
  unmeasured.lighthouse[0].metrics.tbt = null;
  assert.deepEqual(summaryProblems(unmeasured), []);
  assert.deepEqual(summaryProblems({ ...clone(masterRuns[0]), lighthouse: [] }), ['lighthouse: expected a list of pages']);
});

const repository = 'owner/repo';
const sha = digit => digit.repeat(40);
const run = (id, head, extra = {}) => ({
  id, head_sha: sha(head), event: 'push', head_branch: 'master', status: 'completed', conclusion: 'success',
  path: '.github/workflows/ci.yml', created_at: `2026-11-2${id % 10}T00:00:00Z`, html_url: `https://github.com/${repository}/actions/runs/${id}`,
  repository: { full_name: repository }, head_repository: { full_name: repository }, ...extra,
});

test('only successful pushes to master of this repository are trusted', () => {
  const runs = [
    run(1, 'a'),
    run(2, 'b', { event: 'pull_request' }),
    run(3, 'c', { head_repository: { full_name: 'fork/repo' } }),
    run(4, 'd', { head_branch: 'feature' }),
    run(5, 'e', { path: '.github/workflows/nightly.yml' }),
    run(6, 'f', { path: '.github/workflows/metrics.yml' }),
    run(1, 'a'),
  ];
  assert.deepEqual(trustedRuns(runs, { repository, branch: 'master', workflows: ['ci.yml', 'metrics.yml'] }).map(item => item.id), [6, 1]);
});

// `runs` are the successful runs of ci.yml (or { workflow: runs }), newest
// first, paged 100 at a time like the API; `exact` are all ci.yml runs of the
// base commit, whatever their state.
function fakeGitHub({ runs, exact = [], artifacts = {}, zips = {} }) {
  const requests = [];
  const api = {
    async request(pathname, { binary } = {}) {
      requests.push(pathname);
      let match;
      if ((match = /\/actions\/workflows\/([^/]+)\/runs\?(.*)$/.exec(pathname))) {
        const query = new URLSearchParams(match[2]);
        assert.equal(query.get('branch'), 'master');
        assert.equal(query.get('event'), 'push');
        const list = Array.isArray(runs) ? { 'ci.yml': runs } : runs;
        if (!(match[1] in list)) throw Object.assign(new Error('Not Found'), { status: 404 });
        if (query.get('head_sha')) return { workflow_runs: match[1] === 'ci.yml' ? exact.filter(item => item.head_sha === query.get('head_sha')) : [] };
        const page = Number(query.get('page'));
        return { workflow_runs: list[match[1]].slice((page - 1) * 100, page * 100) };
      }
      if ((match = /\/actions\/runs\/(\d+)\/artifacts/.exec(pathname))) return { artifacts: artifacts[match[1]] || [] };
      if ((match = /\/actions\/artifacts\/(\d+)\/zip$/.exec(pathname)) && binary) {
        if (!(match[1] in zips)) throw Object.assign(new Error('download failed'), { status: 500 });
        return Buffer.from(zips[match[1]]);
      }
      throw new Error(`unexpected request ${pathname}`);
    },
  };
  return { api, requests };
}
// Commits a ← b ← c ← d (base); x is on another branch.
const history = { [sha('d')]: 0, [sha('c')]: 1, [sha('b')]: 2, [sha('a')]: 3 };
const git = { distance: head => history[head] ?? null };
const config = { workflows: ['ci.yml', 'metrics.yml'], artifact: 'metrics', waitMinutes: 0 };
const artifact = (id, extra = {}) => [{ id, name: 'metrics', expired: false, size_in_bytes: 1000, ...extra }];
const good = JSON.stringify(masterRuns[0]);

const find = (github, extra = {}) => findBaseline({
  api: github.api, git, repository, branch: 'master', baseSha: sha('d'), config, sleep: async () => {}, readZip: zip => zip, ...extra,
});

test('the baseline is the closest ancestor with a usable artifact', async () => {
  const result = await find(fakeGitHub({
    runs: [run(11, 'x'), run(12, 'c'), run(13, 'd'), run(14, 'b')],
    exact: [run(13, 'd')],
    artifacts: { 13: artifact(103, { expired: true }), 12: artifact(102), 14: artifact(104) },
    zips: { 102: '{"schema": 7}', 104: good },
  }));
  assert.equal(result.run.id, 14);
  assert.equal(result.distance, 2);
  assert.deepEqual(result.summary, masterRuns[0]);
  assert.deepEqual(result.skipped, [
    'run 13 (ddddddd) has no unexpired "metrics" artifact',
    'run 12 (ccccccc): summary.json in artifact 102 has an unexpected format (schema 7 is not 1)',
  ]);
});

test('the base commit run is used even when many newer runs exist', async () => {
  // A re-run of an old pull request: its base is far behind the branch tip.
  const newer = Array.from({ length: 150 }, (_, index) => run(1000 + index, 'x'));
  const github = fakeGitHub({ runs: newer, exact: [run(13, 'd')], artifacts: { 13: artifact(103) }, zips: { 103: good } });
  const result = await find(github);
  assert.equal(result.run.id, 13);
  assert.equal(result.distance, 0);
  assert.equal(github.requests.some(pathname => pathname.includes('status=success')), false);
});

test('older commits are searched page by page', async () => {
  const newer = Array.from({ length: 100 }, (_, index) => run(1000 + index, 'x'));
  const github = fakeGitHub({ runs: [...newer, run(12, 'c')], artifacts: { 12: artifact(102) }, zips: { 102: good } });
  const result = await find(github);
  assert.equal(result.run.id, 12);
  assert.equal(result.distance, 1);
  assert.deepEqual(github.requests.filter(pathname => pathname.includes('/workflows/ci.yml/') && pathname.includes('status=success')).map(pathname => new URL(pathname, 'https://x').searchParams.get('page')), ['1', '2']);
});

test('the closest ancestor wins across pages and workflows', async () => {
  // ci.yml's first page holds only newer runs; metrics.yml's first page holds
  // a distant ancestor; the parent commit's run is on ci.yml's second page.
  const newer = Array.from({ length: 100 }, (_, index) => run(1000 + index, 'x'));
  const github = fakeGitHub({
    runs: { 'ci.yml': [...newer, run(12, 'c')], 'metrics.yml': [run(15, 'a', { path: '.github/workflows/metrics.yml' })] },
    artifacts: { 12: artifact(102), 15: artifact(105) },
    zips: { 102: good, 105: good },
  });
  const result = await find(github);
  assert.equal(result.run.id, 12);
  assert.equal(result.distance, 1);
});

test('a failed download moves on to the run\'s older artifact', async () => {
  const github = fakeGitHub({ runs: [], exact: [run(13, 'd')], artifacts: { 13: [...artifact(201), ...artifact(203)] }, zips: { 201: good } });
  const result = await find(github);
  assert.equal(result.run.id, 13);
  assert.deepEqual(result.skipped, ['run 13 (ddddddd): cannot read summary.json from artifact 203 (download failed)']);
});

test('the base budget is read from git, telling a missing file from an error', t => {
  const directory = mkdtempSync(path.join(tmpdir(), 'loveit-git-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const run = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8' }).trim();
  run('init', '-q');
  writeFileSync(path.join(directory, 'metrics-budget.json'), '{"baseline": {}}\n');
  run('add', '.');
  run('-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-q', '-m', 'one');
  const one = run('rev-parse', 'HEAD');
  run('rm', '-q', 'metrics-budget.json');
  run('-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-q', '-m', 'two');
  const two = run('rev-parse', 'HEAD');
  const helpers = gitHelpers(directory);
  assert.equal(helpers.show(one, 'metrics-budget.json'), '{"baseline": {}}');
  assert.equal(helpers.show(two, 'metrics-budget.json'), null);
  assert.throws(() => helpers.show('0'.repeat(40), 'metrics-budget.json'));
  assert.equal(helpers.distance(one, two), 1);
  assert.equal(helpers.distance(two, one), null);
});

test('the base commit\'s baseline settings are validated on their own', () => {
  assert.deepEqual(parseBaselinePolicy({ missing: 'fail' }), { workflows: ['ci.yml'], artifact: 'metrics', waitMinutes: 0, missing: 'fail', acceptLabel: null });
  assert.throws(() => parseBaselinePolicy({ branch: 'feature' }), /baseline: unknown key "branch"/);
  assert.throws(() => parseBaselinePolicy([]), /baseline: expected an object/);
  // The built-in settings are what the shipped budget asks for.
  assert.deepEqual(parseBaselinePolicy(BOOTSTRAP_BASELINE), budget.baseline);
});

test('the newest artifact of a re-run comes first, and older ones are tried next', async () => {
  const partial = JSON.stringify({ ...masterRuns[0], axe: undefined });
  const github = fakeGitHub({
    runs: [], exact: [run(13, 'd')],
    artifacts: { 13: [...artifact(201), ...artifact(203), { ...artifact(202)[0], name: 'other' }] },
    zips: { 201: good, 203: partial },
  });
  const result = await find(github);
  assert.equal(result.run.id, 13);
  assert.deepEqual(result.skipped, ['run 13 (ddddddd): summary.json in artifact 203 has an unexpected format (axe: expected a list of pages)']);
  assert.deepEqual(github.requests.filter(pathname => pathname.endsWith('/zip')), ['/repos/owner/repo/actions/artifacts/203/zip', '/repos/owner/repo/actions/artifacts/201/zip']);
});

test('a missing or unreadable baseline is reported, not thrown', async () => {
  let result = await find(fakeGitHub({ runs: [run(11, 'x')] }));
  assert.match(result.missing, /no successful master push run of ci\.yml or metrics\.yml is an ancestor of ddddddd/);
  result = await find(fakeGitHub({ runs: [run(12, 'c')], artifacts: { 12: artifact(102) } }));
  assert.match(result.missing, /no usable baseline among the 1 closest/);
  assert.deepEqual(result.skipped, ['run 12 (ccccccc): cannot read summary.json from artifact 102 (download failed)']);
  result = await find(fakeGitHub({ runs: [run(12, 'c')], artifacts: { 12: artifact(102) }, zips: { 102: 'not json' } }));
  assert.match(result.skipped[0], /cannot read summary\.json from artifact 102/);
});

test('waits for the base commit run, up to the configured time', async () => {
  let clock = 0;
  const exact = [run(13, 'd', { status: 'in_progress', conclusion: null })];
  const github = fakeGitHub({ runs: [run(12, 'c')], exact, artifacts: { 12: artifact(102), 13: artifact(103) }, zips: { 102: good, 103: good } });
  const sleep = async ms => {
    clock += ms;
    if (clock >= 120_000) exact[0] = { ...exact[0], status: 'completed', conclusion: 'success' };
  };
  let result = await find(github, { config: { ...config, waitMinutes: 10 }, sleep, now: () => clock });
  assert.equal(result.run.id, 13);
  assert.equal(clock, 120_000);

  clock = 0;
  exact[0] = run(13, 'd', { status: 'queued', conclusion: null });
  result = await find(github, { config: { ...config, waitMinutes: 1 }, sleep: async ms => { clock += ms; }, now: () => clock });
  assert.equal(result.run.id, 12);
  assert.deepEqual(result.skipped, ['run 13 for the base commit was still queued after waiting 1 min']);
});

test('the API client retries server errors but not client errors', async () => {
  const calls = [];
  const responses = [new Response('busy', { status: 502 }), Response.json({ ok: true })];
  const api = githubApi({ token: 't0ken', apiUrl: 'https://api.example/', fetchImpl: async (url, init) => { calls.push([String(url), init.headers.authorization]); return responses.shift(); }, sleep: async () => {} });
  assert.deepEqual(await api.request('/repos/o/r/actions/runs'), { ok: true });
  assert.deepEqual(calls, [['https://api.example/repos/o/r/actions/runs', 'Bearer t0ken'], ['https://api.example/repos/o/r/actions/runs', 'Bearer t0ken']]);
  const notFound = githubApi({ token: 't', fetchImpl: async () => new Response('', { status: 404 }), sleep: async () => {} });
  await assert.rejects(notFound.request('/x'), error => error.status === 404);
});

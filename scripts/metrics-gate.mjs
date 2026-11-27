// Compares build/metrics/summary.json with the master baseline using the
// tolerances in metrics-budget.json, and exits with 1 when a check is worse
// than allowed. In GitHub Actions the baseline is downloaded from the closest
// successful master push run; elsewhere pass one with --baseline <summary.json>.
//
//   node scripts/metrics-gate.mjs [--baseline file] [--current file] [--budget file]
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { root } from './tools.mjs';
import { BOOTSTRAP_BASELINE, compareSummaries, parseBaselinePolicy, parseBudget, renderComparison, summaryProblems } from './metrics-compare.mjs';
import { findBaseline, gitHelpers, githubApi } from './metrics-baseline.mjs';

const { values: options } = parseArgs({
  options: {
    baseline: { type: 'string' },
    current: { type: 'string', default: path.join(root, 'build/metrics/summary.json') },
    budget: { type: 'string', default: path.join(root, 'metrics-budget.json') },
  },
});
const out = path.join(root, 'build/metrics');
const env = process.env;
const readJson = (file, what) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read ${what} from ${file}: ${error.message}`);
  }
};

function report(markdown, result) {
  mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'comparison.md'), markdown);
  if (result) writeFileSync(path.join(out, 'comparison.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(`\n${markdown}`);
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, markdown);
}

const budget = parseBudget(readJson(options.budget, 'the metrics budget'));
const current = readJson(options.current, 'this run\'s metrics');
const currentProblems = summaryProblems(current);
if (currentProblems.length) throw new Error(`This run's metrics have an unexpected format: ${currentProblems.join('; ')}`);

const git = gitHelpers(root);
const notes = [];
// The branch whose push runs count as baselines; CI passes the default branch.
const branch = env.LOVEIT_METRICS_BRANCH || 'master';
if (!/^[\w./-]+$/.test(branch)) throw new Error(`Invalid baseline branch: ${branch}`);
const budgetFile = path.relative(root, options.budget).split(path.sep).join('/');
// Tolerances come from this pull request. Where the baseline comes from and
// what happens without one come from the base commit, so a pull request cannot
// loosen them for itself; changes to them take effect once merged.
let policy = budget.baseline;
let baseline;
let source;
let baselineSha;
const api = env.GITHUB_TOKEN && env.GITHUB_REPOSITORY
  ? githubApi({ token: env.GITHUB_TOKEN, apiUrl: env.GITHUB_API_URL })
  : null;

if (options.baseline) {
  baseline = readJson(options.baseline, 'the baseline');
  const problems = summaryProblems(baseline);
  if (problems.length) throw new Error(`The baseline has an unexpected format: ${problems.join('; ')}`);
  source = `\`${options.baseline}\``;
} else if (api) {
  // Without the base commit there is nothing to compare with; that is a setup
  // error (shallow clone, missing remote branch), not a missing baseline.
  const baseSha = env.LOVEIT_METRICS_BASE || git.mergeBase('HEAD', branch);
  // A read error throws here and fails the job; only a file that does not
  // exist at the base, or a broken one, falls back to the built-in settings.
  const trusted = git.show(baseSha, budgetFile);
  policy = BOOTSTRAP_BASELINE;
  if (trusted === null) {
    notes.push(`\`${budgetFile}\` does not exist at the base commit; the built-in \`baseline\` settings apply.`);
  } else {
    try {
      policy = parseBaselinePolicy(JSON.parse(trusted)?.baseline);
    } catch (error) {
      notes.push(`The \`baseline\` settings in \`${budgetFile}\` at the base commit are invalid (${error.message}); the built-in ones apply.`);
    }
  }
  if (JSON.stringify(policy) !== JSON.stringify(budget.baseline)) {
    notes.push(`This pull request's \`baseline\` settings in \`${budgetFile}\` differ from those used here; they apply once it is merged.`);
  }
  let result;
  try {
    result = await findBaseline({
      api, git, repository: env.GITHUB_REPOSITORY, branch, baseSha, config: policy,
      sleep: ms => new Promise(resolve => setTimeout(resolve, ms)), log: console.log,
    });
    if (result.summary) {
      baseline = result.summary;
      baselineSha = result.run.head_sha;
      const where = result.distance === 0
        ? `the base commit \`${baseSha.slice(0, 7)}\``
        : `\`${baselineSha.slice(0, 7)}\`, ${result.distance} ${result.distance === 1 ? 'commit' : 'commits'} before the base commit \`${baseSha.slice(0, 7)}\``;
      source = `[run ${result.run.id}](${result.run.html_url}) of ${branch} at ${where}.`;
      if (result.distance > 0) notes.push(`Changes merged after \`${baselineSha.slice(0, 7)}\` are counted as part of this pull request.`);
    }
  } catch (error) {
    result = { missing: error.message, skipped: [] };
  }
  // Explain why a closer master run was not used.
  if (!result.summary || result.distance > 0) for (const reason of result.skipped) notes.push(`Skipped ${reason}.`);
  if (!baseline) {
    const fail = policy.missing === 'fail';
    const message = `No ${branch} baseline: ${result.missing}.`;
    console.log(`::${fail ? 'error' : 'warning'} title=Metrics not compared::${message}`);
    report([
      '## Metrics compared with master', '',
      `**Not compared.** ${message} ${fail ? 'The budget requires a baseline, so the check fails.' : 'Re-run this job once a master run has uploaded its `metrics` artifact.'}`, '',
      ...notes.map(note => `- ${note}`), '',
    ].join('\n'));
    process.exit(fail ? 1 : 0);
  }
} else {
  throw new Error('Pass --baseline <summary.json>, or set GITHUB_TOKEN and GITHUB_REPOSITORY to download the master baseline');
}

if (baselineSha && git.changed(baselineSha, budgetFile)) {
  notes.push(`\`${budgetFile}\` differs from the baseline commit; the tolerances in this pull request apply.`);
}

const result = compareSummaries(baseline, current, budget);
let accepted = false;
if (result.failed && api && policy.acceptLabel && /^\d+$/.test(env.PR_NUMBER || '')) {
  // Read the labels now rather than from the event payload, so that adding the
  // label and re-running this job is enough.
  try {
    const labels = await api.request(`/repos/${env.GITHUB_REPOSITORY}/issues/${env.PR_NUMBER}/labels?per_page=100`);
    accepted = labels.some(label => label.name === policy.acceptLabel);
  } catch (error) {
    notes.push(`Cannot read the pull request's labels: ${error.message}.`);
  }
  if (accepted) notes.push(`The \`${policy.acceptLabel}\` label accepts these regressions; the check passes.`);
  else notes.push(`If the regressions are intended, a maintainer can add the \`${policy.acceptLabel}\` label and re-run this job.`);
}
report(renderComparison(result, { source, notes }), { baseline: source, accepted, ...result });
if (result.failed) {
  for (const item of result.checks.filter(check => check.status === 'fail')) {
    console.log(`::${accepted ? 'warning' : 'error'} title=Metrics regression::${item.page} ${item.label}: ${item.metric === 'rules' ? item.added.join(', ') : `${item.baseline} → ${item.current}`}`);
  }
  if (!accepted) process.exit(1);
}

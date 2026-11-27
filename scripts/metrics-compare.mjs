// Pure helpers for the metrics gate: validate metrics-budget.json and the
// summaries scripts/metrics.mjs writes, compare a pull request with the master
// baseline and render the result. No I/O, so they can be unit tested.

// Version of build/metrics/summary.json. Summaries written before the field
// existed have the same shape and count as version 1.
export const SUMMARY_SCHEMA = 1;

const impacts = ['critical', 'serious', 'moderate', 'minor'];
const lighthouseMetrics = {
  performance: { label: 'Performance', unit: 'score', better: 'higher', get: page => page.scores.performance },
  accessibility: { label: 'Accessibility', unit: 'score', better: 'higher', get: page => page.scores.accessibility },
  'best-practices': { label: 'Best practices', unit: 'score', better: 'higher', get: page => page.scores['best-practices'] },
  seo: { label: 'SEO', unit: 'score', better: 'higher', get: page => page.scores.seo },
  fcp: { label: 'FCP', unit: 'ms', get: page => page.metrics.fcp },
  lcp: { label: 'LCP', unit: 'ms', get: page => page.metrics.lcp },
  tbt: { label: 'TBT', unit: 'ms', get: page => page.metrics.tbt },
  cls: { label: 'CLS', unit: 'cls', get: page => page.metrics.cls },
  ...Object.fromEntries(['script', 'stylesheet', 'font', 'image', 'document', 'other', 'total']
    .map(type => [type, { label: `${type === 'total' ? 'Total' : type[0].toUpperCase() + type.slice(1)} bytes`, unit: 'bytes', get: page => page.transfer[type] }])),
  requests: { label: 'Requests', unit: 'count', get: page => page.requests },
};
const axeMetrics = Object.fromEntries(impacts.map(impact => [impact, {
  label: `${impact[0].toUpperCase()}${impact.slice(1)} nodes`, unit: 'count', get: page => page.counts[impact].nodes,
}]));
const buildMetrics = {
  cold: { label: 'Cold build', unit: 'ms', get: build => build.cold },
  warm: { label: 'Warm build', unit: 'ms', get: build => build.warm },
};
const repositoryMetrics = {
  assetsLib: { label: '`assets/lib` bytes', unit: 'bytes', get: repository => repository.assetsLib.bytes },
};
const baselineDefaults = {
  workflows: ['ci.yml'], artifact: 'metrics', waitMinutes: 0, missing: 'warn', acceptLabel: null,
};
// The `baseline` settings used when the base commit has no usable
// metrics-budget.json: before the gate existed, or when the file there is broken.
// Defined here rather than taken from the pull request, which could loosen them.
export const BOOTSTRAP_BASELINE = Object.freeze({
  workflows: Object.freeze(['ci.yml', 'metrics.yml']),
  artifact: 'metrics',
  waitMinutes: 20,
  missing: 'warn',
  acceptLabel: 'accept-metrics-regression',
});

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNumberOrNull = value => value === null || (typeof value === 'number' && Number.isFinite(value));

function checkKeys(object, allowed, where) {
  for (const key of Object.keys(object)) {
    if (!allowed.includes(key)) throw new Error(`${where}: unknown key "${key}" (expected one of ${allowed.join(', ')})`);
  }
}

function checkRule(rule, where) {
  if (!isObject(rule)) throw new Error(`${where}: expected an object with "relative" and/or "absolute"`);
  checkKeys(rule, ['relative', 'absolute', 'note'], where);
  for (const key of ['relative', 'absolute']) {
    if (key in rule && !(typeof rule[key] === 'number' && Number.isFinite(rule[key]) && rule[key] >= 0)) {
      throw new Error(`${where}.${key}: expected a number of at least 0`);
    }
  }
  if (!('relative' in rule) && !('absolute' in rule)) throw new Error(`${where}: set "relative", "absolute" or both`);
  if ('note' in rule && typeof rule.note !== 'string') throw new Error(`${where}.note: expected a string`);
  return { relative: rule.relative ?? 0, absolute: rule.absolute ?? 0 };
}

function checkRules(section, metrics, where, extra = []) {
  if (section === undefined) return {};
  if (!isObject(section)) throw new Error(`${where}: expected an object`);
  checkKeys(section, [...Object.keys(metrics), ...extra, '$comment'], where);
  return Object.fromEntries(Object.entries(section)
    .filter(([key]) => key in metrics)
    .map(([key, rule]) => [key, checkRule(rule, `${where}.${key}`)]));
}

// Returns the normalized `baseline` section of a budget, or throws.
export function parseBaselinePolicy(section) {
  if (!isObject(section ?? {})) throw new Error('baseline: expected an object');
  const baseline = { ...baselineDefaults, ...(section ?? {}) };
  checkKeys(baseline, Object.keys(baselineDefaults), 'baseline');
  if (!Array.isArray(baseline.workflows) || !baseline.workflows.length
    || !baseline.workflows.every(file => typeof file === 'string' && /^[\w.-]+\.ya?ml$/.test(file))) {
    throw new Error('baseline.workflows: expected a list of workflow file names');
  }
  if (typeof baseline.artifact !== 'string' || !baseline.artifact) throw new Error('baseline.artifact: expected an artifact name');
  if (!(Number.isFinite(baseline.waitMinutes) && baseline.waitMinutes >= 0 && baseline.waitMinutes <= 60)) {
    throw new Error('baseline.waitMinutes: expected a number from 0 to 60');
  }
  if (!['warn', 'fail'].includes(baseline.missing)) throw new Error('baseline.missing: expected "warn" or "fail"');
  if (baseline.acceptLabel !== null && (typeof baseline.acceptLabel !== 'string' || !baseline.acceptLabel)) {
    throw new Error('baseline.acceptLabel: expected a label name or null');
  }
  return baseline;
}

// Returns a normalized budget or throws with the path of the first mistake, so
// a typo cannot silently turn a check off.
export function parseBudget(budget) {
  if (!isObject(budget)) throw new Error('metrics budget: expected a JSON object');
  checkKeys(budget, ['$comment', 'baseline', 'lighthouse', 'axe', 'build', 'repository'], 'metrics budget');
  const baseline = parseBaselinePolicy(budget.baseline);
  if (budget.axe !== undefined && 'newRules' in (budget.axe ?? {}) && typeof budget.axe.newRules !== 'boolean') {
    throw new Error('axe.newRules: expected true or false');
  }
  return {
    baseline,
    lighthouse: checkRules(budget.lighthouse, lighthouseMetrics, 'lighthouse'),
    axe: checkRules(budget.axe, axeMetrics, 'axe', ['newRules']),
    newRules: budget.axe?.newRules === true,
    build: checkRules(budget.build, buildMetrics, 'build'),
    repository: checkRules(budget.repository, repositoryMetrics, 'repository'),
  };
}

const isCount = value => Number.isInteger(value) && value >= 0;
const isMeasurement = value => value === null || (typeof value === 'number' && Number.isFinite(value) && value >= 0);
const transferTypes = ['script', 'stylesheet', 'font', 'image', 'document', 'other', 'total'];

// Checks that a summary has every field scripts/metrics.mjs writes for this
// schema. Lighthouse scores and timings may be null (not measured); a missing
// field is a problem, so an incomplete artifact is never read as zeros. Returns
// a list of problems; an empty list means the summary can be compared.
export function summaryProblems(summary) {
  if (!isObject(summary)) return ['not a JSON object'];
  const problems = [];
  const schema = summary.schema ?? SUMMARY_SCHEMA;
  if (schema !== SUMMARY_SCHEMA) return [`schema ${JSON.stringify(schema)} is not ${SUMMARY_SCHEMA}`];
  const fields = (object, keys, valid, where) => {
    if (!isObject(object)) return problems.push(`${where} missing`);
    for (const key of keys) {
      if (!Object.hasOwn(object, key)) problems.push(`${where}.${key} missing`);
      else if (!valid(object[key])) problems.push(`${where}.${key} is not valid`);
    }
  };
  const pages = (list, where, check) => {
    if (!Array.isArray(list) || !list.length) return problems.push(`${where}: expected a list of pages`);
    const seen = new Set();
    for (const [index, page] of list.entries()) {
      if (!isObject(page) || typeof page.name !== 'string' || !page.name) {
        problems.push(`${where}[${index}]: missing name`);
        continue;
      }
      if (seen.has(page.name)) problems.push(`${where}: duplicate page "${page.name}"`);
      seen.add(page.name);
      check(page, `${where} ${page.name}`);
    }
  };
  if (!isCount(summary.lighthouseRuns) || !summary.lighthouseRuns) problems.push('lighthouseRuns is not a count');
  pages(summary.lighthouse, 'lighthouse', (page, where) => {
    fields(page.scores, ['performance', 'accessibility', 'best-practices', 'seo'], isMeasurement, `${where}: scores`);
    fields(page.metrics, ['fcp', 'lcp', 'tbt', 'cls'], isMeasurement, `${where}: metrics`);
    fields(page.transfer, transferTypes, isCount, `${where}: transfer`);
    fields(page, ['requests'], isCount, where);
  });
  pages(summary.axe, 'axe', (page, where) => {
    if (!Array.isArray(page.rules) || !page.rules.every(rule => typeof rule === 'string')) problems.push(`${where}: rules missing`);
    if (!isObject(page.counts)) return problems.push(`${where}: counts missing`);
    for (const impact of impacts) fields(page.counts[impact], ['rules', 'nodes'], isCount, `${where}: ${impact}`);
  });
  fields(summary.build, ['cold', 'warm'], value => typeof value === 'number' && Number.isFinite(value) && value >= 0, 'build');
  fields(summary.repository?.assetsLib, ['bytes', 'files'], isCount, 'repository.assetsLib');
  return problems;
}

function check({ group, page, key, metric, rule, baseline, current }) {
  const row = { group, page, metric: key, label: metric.label, unit: metric.unit, baseline, current, ...rule };
  if (typeof baseline !== 'number') return { ...row, status: 'skipped', reason: 'no baseline value' };
  if (typeof current !== 'number') return { ...row, status: 'fail', reason: 'no value in this run' };
  const worse = metric.better === 'higher' ? baseline - current : current - baseline;
  const allowed = Math.max(rule.relative * Math.abs(baseline), rule.absolute);
  // Allow for floating-point noise in values such as CLS.
  const status = worse > allowed + 1e-9 ? 'fail' : worse < 0 ? 'improved' : 'pass';
  return { ...row, worse, allowed, status };
}

const ruleId = rule => rule.replace(/\s*\([^)]*\)$/, '');

// Compares two valid summaries with a parsed budget. Returns every check,
// warnings about pages or settings that were not compared, and whether any
// check failed.
export function compareSummaries(baseline, current, budget) {
  const checks = [];
  const warnings = [];
  const pairs = (group, label, before, after) => {
    const afterByName = new Map(after.map(page => [page.name, page]));
    const beforeNames = new Set(before.map(page => page.name));
    for (const page of after) {
      if (!beforeNames.has(page.name)) warnings.push(`${label} page "${page.name}" has no baseline and was not compared.`);
    }
    return before.flatMap(page => {
      if (afterByName.has(page.name)) return [[page, afterByName.get(page.name)]];
      // Dropping or renaming a page would otherwise drop its checks silently.
      checks.push({
        group, page: page.name, metric: 'coverage', label: `${label} measured`, unit: 'text',
        baseline: 'yes', current: 'no', status: 'fail', reason: 'page from the baseline was not measured',
      });
      return [];
    });
  };
  for (const [before, after] of pairs('lighthouse', 'Lighthouse', baseline.lighthouse, current.lighthouse)) {
    for (const [key, rule] of Object.entries(budget.lighthouse)) {
      const metric = lighthouseMetrics[key];
      checks.push(check({ group: 'lighthouse', page: after.name, key, metric, rule, baseline: metric.get(before), current: metric.get(after) }));
    }
  }
  for (const [before, after] of pairs('axe', 'axe', baseline.axe, current.axe)) {
    for (const [key, rule] of Object.entries(budget.axe)) {
      const metric = axeMetrics[key];
      checks.push(check({ group: 'axe', page: after.name, key, metric, rule, baseline: metric.get(before), current: metric.get(after) }));
    }
    if (budget.newRules) {
      const known = new Set(before.rules.map(ruleId));
      const added = after.rules.filter(rule => !known.has(ruleId(rule)));
      checks.push({
        group: 'axe', page: after.name, metric: 'rules', label: 'New violated rules', unit: 'rules',
        baseline: before.rules.length, current: after.rules.length, added, status: added.length ? 'fail' : 'pass',
      });
    }
  }
  for (const [key, rule] of Object.entries(budget.build)) {
    const metric = buildMetrics[key];
    checks.push(check({ group: 'build', page: '–', key, metric, rule, baseline: metric.get(baseline.build), current: metric.get(current.build) }));
  }
  for (const [key, rule] of Object.entries(budget.repository)) {
    const metric = repositoryMetrics[key];
    checks.push(check({ group: 'repository', page: '–', key, metric, rule, baseline: metric.get(baseline.repository), current: metric.get(current.repository) }));
  }
  if (baseline.build.hugo && current.build.hugo && baseline.build.hugo !== current.build.hugo) {
    warnings.push(`The baseline was built with Hugo ${baseline.build.hugo}, this run with ${current.build.hugo}.`);
  }
  if (baseline.lighthouseRuns !== current.lighthouseRuns) {
    warnings.push(`The baseline used ${baseline.lighthouseRuns} Lighthouse runs, this run ${current.lighthouseRuns}.`);
  }
  return { checks, warnings, failed: checks.some(item => item.status === 'fail') };
}

function format(value, unit) {
  if (value === null || value === undefined) return '–';
  switch (unit) {
    case 'ms': return `${Math.round(value)} ms`;
    case 'bytes': return Math.abs(value) >= 1024 * 1024 ? `${(value / 1024 / 1024).toFixed(2)} MiB` : `${(value / 1024).toFixed(1)} KiB`;
    case 'cls': return value.toFixed(3);
    case 'text': return String(value);
    default: return String(Math.round(value));
  }
}

function change(item) {
  if (item.metric === 'rules') return item.added.length ? item.added.join(', ') : '–';
  if (item.metric === 'coverage') return '–';
  if (typeof item.baseline !== 'number' || typeof item.current !== 'number') return '–';
  const delta = item.current - item.baseline;
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : '±';
  const percent = item.baseline ? ` (${sign}${Math.abs(delta / item.baseline * 100).toFixed(1)}%)` : '';
  return `${sign}${format(Math.abs(delta), item.unit)}${item.unit === 'score' || item.unit === 'count' ? '' : percent}`;
}

const statusText = { pass: '✅', improved: '✅ better', fail: '❌ worse', skipped: '➖ skipped' };

function table(items) {
  const lines = ['| Page | Metric | Baseline | This run | Change | Allowed worse by | |', '|:--|:--|--:|--:|--:|--:|:--|'];
  for (const item of items) {
    const allowed = item.metric === 'rules' ? 'no new rule' : item.allowed === undefined ? '–' : format(item.allowed, item.unit);
    const status = item.reason ? `${statusText[item.status]} (${item.reason})` : statusText[item.status];
    lines.push(`| ${item.page} | ${item.label} | ${format(item.baseline, item.unit === 'rules' ? 'count' : item.unit)} | ${format(item.current, item.unit === 'rules' ? 'count' : item.unit)} | ${change(item)} | ${allowed} | ${status} |`);
  }
  return lines;
}

// Renders the comparison as Markdown for the job summary. `source` describes
// the baseline in one line; `notes` are extra lines shown before the tables.
export function renderComparison({ checks, warnings, failed }, { source, notes = [] } = {}) {
  const failures = checks.filter(item => item.status === 'fail');
  const lines = ['## Metrics compared with master', ''];
  if (source) lines.push(`Baseline: ${source}`, '');
  lines.push(failed
    ? `**${failures.length} ${failures.length === 1 ? 'check is' : 'checks are'} worse than \`metrics-budget.json\` allows.**`
    : `No check is worse than \`metrics-budget.json\` allows (${checks.length} checks).`, '');
  for (const note of [...notes, ...warnings]) lines.push(`- ${note}`);
  if (notes.length || warnings.length) lines.push('');
  if (failures.length) lines.push(...table(failures), '');
  if (checks.length) lines.push('<details><summary>All checks</summary>', '', ...table(checks), '', '</details>', '');
  return lines.join('\n');
}

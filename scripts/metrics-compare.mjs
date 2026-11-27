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
  label: `${impact[0].toUpperCase()}${impact.slice(1)} nodes`, unit: 'count', get: page => page.counts[impact]?.nodes ?? 0,
}]));
const buildMetrics = {
  cold: { label: 'Cold build', unit: 'ms', get: build => build.cold },
  warm: { label: 'Warm build', unit: 'ms', get: build => build.warm },
};
const repositoryMetrics = {
  assetsLib: { label: '`assets/lib` bytes', unit: 'bytes', get: repository => repository.assetsLib.bytes },
};
const baselineDefaults = {
  branch: 'master', workflows: ['ci.yml'], artifact: 'metrics', waitMinutes: 0, missing: 'warn', acceptLabel: null,
};

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

// Returns a normalized budget or throws with the path of the first mistake, so
// a typo cannot silently turn a check off.
export function parseBudget(budget) {
  if (!isObject(budget)) throw new Error('metrics budget: expected a JSON object');
  checkKeys(budget, ['$comment', 'baseline', 'lighthouse', 'axe', 'build', 'repository'], 'metrics budget');
  const baseline = { ...baselineDefaults, ...(budget.baseline ?? {}) };
  if (!isObject(budget.baseline ?? {})) throw new Error('baseline: expected an object');
  checkKeys(baseline, Object.keys(baselineDefaults), 'baseline');
  if (typeof baseline.branch !== 'string' || !/^[\w./-]+$/.test(baseline.branch)) throw new Error('baseline.branch: expected a branch name');
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

// Checks the shape of a summary written by scripts/metrics.mjs. Returns a list
// of problems; an empty list means the summary can be compared.
export function summaryProblems(summary) {
  if (!isObject(summary)) return ['not a JSON object'];
  const problems = [];
  const schema = summary.schema ?? SUMMARY_SCHEMA;
  if (schema !== SUMMARY_SCHEMA) return [`schema ${JSON.stringify(schema)} is not ${SUMMARY_SCHEMA}`];
  const names = (list, where) => {
    const seen = new Set();
    for (const [index, page] of list.entries()) {
      if (!isObject(page) || typeof page.name !== 'string' || !page.name) problems.push(`${where}[${index}]: missing name`);
      else if (seen.has(page.name)) problems.push(`${where}: duplicate page "${page.name}"`);
      else seen.add(page.name);
    }
  };
  if (!Array.isArray(summary.lighthouse)) problems.push('lighthouse: expected a list');
  else {
    names(summary.lighthouse, 'lighthouse');
    for (const page of summary.lighthouse.filter(isObject)) {
      const missing = ['scores', 'metrics', 'transfer'].filter(group => !isObject(page[group]));
      if (missing.length) {
        problems.push(`lighthouse ${page.name}: ${missing.join(', ')} missing`);
        continue;
      }
      for (const [key, metric] of Object.entries(lighthouseMetrics)) {
        if (!isNumberOrNull(metric.get(page) ?? null)) problems.push(`lighthouse ${page.name}: ${key} is not a number`);
      }
    }
  }
  if (!Array.isArray(summary.axe)) problems.push('axe: expected a list');
  else {
    names(summary.axe, 'axe');
    for (const page of summary.axe.filter(isObject)) {
      if (!isObject(page.counts) || !Array.isArray(page.rules) || !page.rules.every(rule => typeof rule === 'string')) {
        problems.push(`axe ${page.name}: counts or rules missing`);
        continue;
      }
      for (const impact of impacts) {
        const nodes = page.counts[impact]?.nodes ?? 0;
        if (!Number.isInteger(nodes) || nodes < 0) problems.push(`axe ${page.name}: ${impact} nodes is not a count`);
      }
    }
  }
  if (!isObject(summary.build) || !isNumberOrNull(summary.build.cold ?? null) || !isNumberOrNull(summary.build.warm ?? null)) {
    problems.push('build: cold and warm times missing');
  }
  if (!isObject(summary.repository?.assetsLib) || !isNumberOrNull(summary.repository.assetsLib.bytes ?? null)) {
    problems.push('repository: assets/lib size missing');
  }
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
  const pairs = (group, before, after) => {
    const afterByName = new Map(after.map(page => [page.name, page]));
    const beforeNames = new Set(before.map(page => page.name));
    for (const page of after) {
      if (!beforeNames.has(page.name)) warnings.push(`${group} page "${page.name}" has no baseline and was not compared.`);
    }
    return before.flatMap(page => {
      if (afterByName.has(page.name)) return [[page, afterByName.get(page.name)]];
      warnings.push(`${group} page "${page.name}" from the baseline was not measured in this run.`);
      return [];
    });
  };
  for (const [before, after] of pairs('Lighthouse', baseline.lighthouse, current.lighthouse)) {
    for (const [key, rule] of Object.entries(budget.lighthouse)) {
      const metric = lighthouseMetrics[key];
      checks.push(check({ group: 'lighthouse', page: after.name, key, metric, rule, baseline: metric.get(before) ?? null, current: metric.get(after) ?? null }));
    }
  }
  for (const [before, after] of pairs('axe', baseline.axe, current.axe)) {
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
    checks.push(check({ group: 'build', page: '–', key, metric, rule, baseline: metric.get(baseline.build) ?? null, current: metric.get(current.build) ?? null }));
  }
  for (const [key, rule] of Object.entries(budget.repository)) {
    const metric = repositoryMetrics[key];
    checks.push(check({ group: 'repository', page: '–', key, metric, rule, baseline: metric.get(baseline.repository) ?? null, current: metric.get(current.repository) ?? null }));
  }
  if (baseline.build.hugo && current.build.hugo && baseline.build.hugo !== current.build.hugo) {
    warnings.push(`The baseline was built with Hugo ${baseline.build.hugo}, this run with ${current.build.hugo}.`);
  }
  if (baseline.lighthouseRuns !== current.lighthouseRuns) {
    warnings.push(`The baseline used ${baseline.lighthouseRuns ?? 'an unknown number of'} Lighthouse runs, this run ${current.lighthouseRuns}.`);
  }
  return { checks, warnings, failed: checks.some(item => item.status === 'fail') };
}

function format(value, unit) {
  if (value === null || value === undefined) return '–';
  switch (unit) {
    case 'ms': return `${Math.round(value)} ms`;
    case 'bytes': return Math.abs(value) >= 1024 * 1024 ? `${(value / 1024 / 1024).toFixed(2)} MiB` : `${(value / 1024).toFixed(1)} KiB`;
    case 'cls': return value.toFixed(3);
    default: return String(Math.round(value));
  }
}

function change(item) {
  if (item.metric === 'rules') return item.added.length ? item.added.join(', ') : '–';
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

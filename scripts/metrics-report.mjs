// Pure helpers that turn Lighthouse, axe-core and build output into the
// metrics summary. Kept separate from scripts/metrics.mjs so they can
// be unit tested without a browser.

const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
const timings = {
  fcp: 'first-contentful-paint',
  lcp: 'largest-contentful-paint',
  tbt: 'total-blocking-time',
  cls: 'cumulative-layout-shift',
};
const impacts = ['critical', 'serious', 'moderate', 'minor'];

// Hugo ends a build with "Total in 984 ms" (or "Total in 1.2 s" on some versions).
export function parseHugoTotal(output) {
  const match = /Total in ([\d.]+)\s*(ms|s)\b/.exec(output);
  if (!match) return null;
  return Math.round(Number(match[1]) * (match[2] === 's' ? 1000 : 1));
}

// Summarizes one Lighthouse result: category scores (0-100), lab timings and
// the bytes actually transferred during the page load, grouped by type.
export function summarizeLighthouse(lhr) {
  const scores = {};
  for (const id of categories) {
    const score = lhr.categories?.[id]?.score;
    scores[id] = typeof score === 'number' ? Math.round(score * 100) : null;
  }
  const metrics = {};
  for (const [key, id] of Object.entries(timings)) {
    const value = lhr.audits?.[id]?.numericValue;
    metrics[key] = typeof value === 'number' ? value : null;
  }
  const transfer = { script: 0, stylesheet: 0, font: 0, image: 0, document: 0, other: 0, total: 0 };
  const items = lhr.audits?.['network-requests']?.details?.items || [];
  for (const item of items) {
    if (item.url?.startsWith('data:')) continue;
    const type = String(item.resourceType || '').toLowerCase();
    const size = item.transferSize || 0;
    transfer[type in transfer && type !== 'total' ? type : 'other'] += size;
    transfer.total += size;
  }
  const requests = items.filter(item => !item.url?.startsWith('data:')).length;
  return { url: lhr.finalDisplayedUrl || lhr.finalUrl || lhr.requestedUrl, scores, metrics, transfer, requests };
}

// Counts axe-core violations by impact: rules violated and affected nodes.
export function summarizeAxe(results) {
  const counts = Object.fromEntries(impacts.map(impact => [impact, { rules: 0, nodes: 0 }]));
  for (const violation of results.violations || []) {
    const bucket = counts[violation.impact || 'unknown'] ??= { rules: 0, nodes: 0 };
    bucket.rules += 1;
    bucket.nodes += violation.nodes?.length || 0;
  }
  const rules = (results.violations || []).map(violation => `${violation.id} (${violation.impact || 'unknown'})`);
  return { url: results.url, counts, rules };
}

// Page names and axe rules are shown as code, so GitHub never turns one into a
// link (a reference such as GH-26, a commit hash or a custom autolink prefix).
export const code = text => `\`${text}\``;
const kib = bytes => `${(bytes / 1024).toFixed(1)} KiB`;
const ms = value => value === null ? '–' : `${Math.round(value)} ms`;
// A Lighthouse score with the marker Lighthouse colours it by: 90–100 good,
// 50–89 needs improvement, below 50 poor.
export const scoreMark = value => value >= 90 ? '🟢' : value >= 50 ? '🟠' : '🔴';
const score = value => value === null ? '–' : `${scoreMark(value)} ${value}`;

export function renderMarkdown(summary) {
  const lines = ['## Metrics', ''];
  const scoresTable = (formFactor, list) => {
    lines.push(
      `### Lighthouse (${formFactor}, representative of ${summary.lighthouseRuns} runs)`, '',
      '| Page | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |',
      '|:--|--:|--:|--:|--:|--:|--:|--:|--:|',
    );
    for (const { name, scores, metrics } of list) {
      lines.push(`| ${code(name)} | ${score(scores.performance)} | ${score(scores.accessibility)} | ${score(scores['best-practices'])} | ${score(scores.seo)} | ${ms(metrics.fcp)} | ${ms(metrics.lcp)} | ${ms(metrics.tbt)} | ${metrics.cls === null ? '–' : metrics.cls.toFixed(3)} |`);
    }
    lines.push('');
  };
  if (summary.lighthouse?.length) scoresTable('mobile', summary.lighthouse);
  if (summary.lighthouseDesktop?.length) scoresTable('desktop', summary.lighthouseDesktop);
  if (summary.lighthouse?.length) {
    // A separate table keeps each one narrow enough for a pull request comment.
    lines.push('### Transfer sizes (Lighthouse, mobile)', '', '| Page | JS | CSS | Fonts | Total | Requests |', '|:--|--:|--:|--:|--:|--:|');
    for (const { name, transfer, requests } of summary.lighthouse) {
      lines.push(`| ${code(name)} | ${kib(transfer.script)} | ${kib(transfer.stylesheet)} | ${kib(transfer.font)} | ${kib(transfer.total)} | ${requests} |`);
    }
    lines.push('', 'Transferred (compressed) sizes, including third-party CDN requests.', '');
  }
  if (summary.axe?.length) {
    lines.push('### axe-core violations (rules / nodes)', '', '| Page | Critical | Serious | Moderate | Minor | Rules |', '|:--|--:|--:|--:|--:|:--|');
    for (const page of summary.axe) {
      const cell = impact => `${page.counts[impact]?.rules || 0} / ${page.counts[impact]?.nodes || 0}`;
      lines.push(`| ${code(page.name)} | ${impacts.map(cell).join(' | ')} | ${page.rules.map(code).join(', ') || '–'} |`);
    }
    lines.push('');
  }
  if (summary.build) {
    const { hugo, cold, warm } = summary.build;
    lines.push('### Build', '', `- Hugo: \`${hugo}\``, `- Cold build: ${ms(cold)}`, `- Warm build: ${ms(warm)}`);
  }
  if (summary.repository) {
    lines.push(`- \`assets/lib\`: ${(summary.repository.assetsLib.bytes / 1024 / 1024).toFixed(1)} MiB in ${summary.repository.assetsLib.files} files`);
  }
  lines.push('');
  return lines.join('\n');
}

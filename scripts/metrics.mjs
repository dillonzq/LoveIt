// Records metrics for the example site: Hugo build time (cold and warm),
// Lighthouse CI on mobile and desktop, axe-core violations and the size of
// assets/lib.
// Results are written to build/metrics and, in GitHub Actions, to the job
// summary; scripts/metrics-gate.mjs compares them with the master baseline.
import { spawn } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { getHugo, root } from './tools.mjs';
import { serve } from './serve.mjs';
import { parseHugoTotal, renderMarkdown, summarizeAxe, summarizeLighthouse } from './metrics-report.mjs';
import { SUMMARY_SCHEMA } from './metrics-compare.mjs';

const port = Number(process.env.LOVEIT_METRICS_PORT || 48138);
const origin = `http://127.0.0.1:${port}`;
const out = path.join(root, 'build/metrics');
const site = path.join(out, 'site');
const lighthouseConfig = JSON.parse(readFileSync(path.join(root, 'lighthouserc.json'), 'utf8'));

// Lighthouse covers the home page and an ordinary article; axe also checks a
// list page, the 404 page and the open search dialog.
const pages = [
  { name: 'home', path: '/', lighthouse: true },
  { name: 'post', path: '/basic-markdown-syntax/', lighthouse: true },
  { name: 'list', path: '/posts/' },
  { name: '404', path: '/this-page-does-not-exist/' },
  {
    name: 'search', path: '/', async prepare(page) {
      await page.locator('#search-toggle-desktop').click();
      await page.locator('#search-input').fill('markdown');
      await page.locator('#search-results .suggestion-title').first().waitFor();
    },
  },
];

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, ...options, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; process.stdout.write(chunk); });
    child.stderr.on('data', chunk => { output += chunk; process.stderr.write(chunk); });
    child.once('error', reject);
    child.once('close', code => code === 0 ? resolve(output) : reject(new Error(`${path.basename(args[0] || command)} ${args[1] || ''} exited with ${code}`)));
  });
}

async function build() {
  const env = { ...process.env, HUGO_RESOURCEDIR: path.join(out, 'resources') };
  const args = ['build', '--gc', '--minify', '--environment', 'production', '--panicOnWarning', '--noBuildLock',
    '--baseURL', `${origin}/`, '--destination', site, '--cacheDir', path.join(out, 'cache')];
  const times = [];
  // The first build starts from empty resource and file caches; the second reuses them.
  for (const label of ['cold', 'warm']) {
    console.log(`\n# ${label} build`);
    const total = parseHugoTotal(await run(process.execPath, [path.join(root, 'scripts/hugo.mjs'), ...args], { env }));
    if (total === null) throw new Error(`Cannot read the ${label} build time from Hugo's output`);
    times.push(total);
  }
  const { version } = await getHugo();
  // Only this shape is recorded: the Metrics comment workflow renders it from
  // pull requests' artifacts and rejects anything else.
  const number = version.match(/v\d+\.\d+\.\d+/)?.[0];
  const hugo = number ? `${number}${version.includes('+extended') ? ' extended' : ''}` : 'unknown';
  return { hugo, cold: times[0], warm: times[1] };
}

// Runs Lighthouse CI with lighthouserc.json (mobile, Lighthouse's default) or,
// for desktop, with a copy that adds the desktop preset and its own output
// directory. Each collect replaces the previous run's results in .lighthouseci.
async function lighthouse(formFactor) {
  let config = 'lighthouserc.json';
  let outputDir = path.join(root, lighthouseConfig.ci.upload.outputDir);
  if (formFactor === 'desktop') {
    outputDir = `${outputDir}-desktop`;
    const desktop = structuredClone(lighthouseConfig);
    desktop.ci.collect.settings = { ...desktop.ci.collect.settings, preset: 'desktop' };
    desktop.ci.upload.outputDir = path.relative(root, outputDir).split(path.sep).join('/');
    config = path.join(out, 'lighthouserc.desktop.json');
    writeFileSync(config, `${JSON.stringify(desktop, null, 2)}\n`);
  }
  console.log(`\n# Lighthouse (${formFactor})`);
  const urls = pages.filter(page => page.lighthouse).map(page => `--collect.url=${origin}${page.path}`);
  const env = { ...process.env, CHROME_PATH: process.env.CHROME_PATH || chromium.executablePath() };
  // Run the CLI's entry point through Node: Windows cannot spawn the .bin shim without a shell.
  const lhci = path.join(root, 'node_modules/@lhci/cli/src/cli.js');
  await run(process.execPath, [lhci, 'collect', `--config=${config}`, ...urls], { env });
  await run(process.execPath, [lhci, 'upload', `--config=${config}`], { env });
  const manifest = JSON.parse(readFileSync(path.join(outputDir, 'manifest.json'), 'utf8'));
  return pages.filter(page => page.lighthouse).map(page => {
    const entry = manifest.find(item => item.isRepresentativeRun && new URL(item.url).pathname === page.path);
    if (!entry) throw new Error(`No Lighthouse result for ${page.path}`);
    return { name: page.name, ...summarizeLighthouse(JSON.parse(readFileSync(entry.jsonPath, 'utf8'))) };
  });
}

async function axe() {
  const directory = path.join(out, 'axe');
  mkdirSync(directory, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  try {
    const results = [];
    for (const page of pages) {
      const context = await browser.newContext();
      const tab = await context.newPage();
      await tab.goto(`${origin}${page.path}`, { waitUntil: 'load' });
      await page.prepare?.(tab);
      const result = await new AxeBuilder({ page: tab }).analyze();
      writeFileSync(path.join(directory, `${page.name}.json`), `${JSON.stringify(result, null, 2)}\n`);
      results.push({ name: page.name, ...summarizeAxe(result) });
      await context.close();
    }
    return results;
  } finally {
    await browser.close();
  }
}

function directorySize(directory) {
  let bytes = 0;
  let files = 0;
  for (const entry of readdirSync(directory, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    bytes += statSync(path.join(entry.parentPath, entry.name)).size;
    files += 1;
  }
  return { bytes, files };
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
// The pull request this run belongs to, written first so the Metrics comment
// workflow can tell apart pull requests sharing a head commit even when a
// later step fails.
if (/^\d+$/.test(process.env.LOVEIT_METRICS_PULL_REQUEST || '')) {
  writeFileSync(path.join(out, 'pull-request.json'), `${JSON.stringify({ pullRequest: Number(process.env.LOVEIT_METRICS_PULL_REQUEST) })}\n`);
}
const summary = { schema: SUMMARY_SCHEMA, build: await build(), lighthouseRuns: lighthouseConfig.ci.collect.numberOfRuns };
const server = await serve(site, port);
try {
  summary.lighthouse = await lighthouse('mobile');
  // Shown next to mobile but not compared with master: metrics-budget.json has
  // no desktop tolerances yet.
  summary.lighthouseDesktop = await lighthouse('desktop');
  summary.axe = await axe();
} finally {
  server.close();
}
summary.repository = { assetsLib: directorySize(path.join(root, 'assets/lib')) };
writeFileSync(path.join(out, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
const markdown = renderMarkdown(summary);
writeFileSync(path.join(out, 'summary.md'), markdown);
console.log(`\n${markdown}`);
// When the job compares with master, the comparison step writes the job
// summary, verdict first, with these measurements folded below it.
if (process.env.GITHUB_STEP_SUMMARY && process.env.LOVEIT_METRICS_COMPARE !== '1') appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parseHugoTotal, renderMarkdown, summarizeAxe, summarizeLighthouse } from '../scripts/metrics-report.mjs';
import { serve } from '../scripts/serve.mjs';

test('reads the build time Hugo reports', () => {
  assert.equal(parseHugoTotal('Pages │ 57\n\nTotal in 984 ms\n'), 984);
  assert.equal(parseHugoTotal('Total in 1.25 s'), 1250);
  assert.equal(parseHugoTotal('Error: build failed'), null);
});

test('summarizes Lighthouse scores, timings and transferred bytes', () => {
  const lhr = {
    finalDisplayedUrl: 'http://127.0.0.1/',
    categories: { performance: { score: 0.8 }, accessibility: { score: 0.92 }, 'best-practices': { score: 1 }, seo: { score: null } },
    audits: {
      'first-contentful-paint': { numericValue: 750.4 },
      'largest-contentful-paint': { numericValue: 4780 },
      'cumulative-layout-shift': { numericValue: 0.11 },
      'network-requests': {
        details: {
          items: [
            { url: 'http://127.0.0.1/', resourceType: 'Document', transferSize: 5000 },
            { url: 'http://127.0.0.1/js/theme.min.js', resourceType: 'Script', transferSize: 30000 },
            { url: 'https://cdn.example/all.min.css', resourceType: 'Stylesheet', transferSize: 20000 },
            { url: 'https://cdn.example/fa.woff2', resourceType: 'Font', transferSize: 100000 },
            { url: 'http://127.0.0.1/index.json', resourceType: 'Fetch', transferSize: 700 },
            { url: 'data:image/svg+xml,...', resourceType: 'Image', transferSize: 0 },
          ],
        },
      },
    },
  };
  const summary = summarizeLighthouse(lhr);
  assert.deepEqual(summary.scores, { performance: 80, accessibility: 92, 'best-practices': 100, seo: null });
  assert.deepEqual(summary.metrics, { fcp: 750.4, lcp: 4780, tbt: null, cls: 0.11 });
  assert.deepEqual(summary.transfer, { script: 30000, stylesheet: 20000, font: 100000, image: 0, document: 5000, other: 700, total: 155700 });
  assert.equal(summary.requests, 5);
});

test('counts axe violations by impact', () => {
  const summary = summarizeAxe({
    url: 'http://127.0.0.1/',
    violations: [
      { id: 'color-contrast', impact: 'serious', nodes: [{}, {}, {}] },
      { id: 'link-name', impact: 'serious', nodes: [{}] },
      { id: 'aria-required-attr', impact: 'critical', nodes: [{}] },
    ],
  });
  assert.deepEqual(summary.counts.serious, { rules: 2, nodes: 4 });
  assert.deepEqual(summary.counts.critical, { rules: 1, nodes: 1 });
  assert.deepEqual(summary.counts.minor, { rules: 0, nodes: 0 });
  assert.deepEqual(summary.rules, ['color-contrast (serious)', 'link-name (serious)', 'aria-required-attr (critical)']);
});

test('renders every section of the summary', () => {
  const markdown = renderMarkdown({
    lighthouseRuns: 3,
    lighthouse: [{ name: 'home', requests: 2, scores: { performance: 80, accessibility: 92, 'best-practices': 100, seo: null }, metrics: { fcp: 750, lcp: 4780, tbt: null, cls: 0.11 }, transfer: { script: 2048, stylesheet: 1024, font: 0, total: 3072 } }],
    axe: [{ name: '404', counts: summarizeAxe({ violations: [] }).counts, rules: [] }],
    build: { hugo: 'v0.170.1', cold: 933, warm: 476 },
    repository: { assetsLib: { bytes: 3 * 1024 * 1024, files: 10 } },
  });
  assert.match(markdown, /\| home \| 80 \| 92 \| 100 \| – \| 750 ms \| 4780 ms \| – \| 0\.110 \| 2\.0 KiB \| 1\.0 KiB \| 0\.0 KiB \| 3\.0 KiB \| 2 \|/);
  assert.match(markdown, /\| 404 \| 0 \/ 0 \| 0 \/ 0 \| 0 \/ 0 \| 0 \/ 0 \| – \|/);
  assert.match(markdown, /Cold build: 933 ms/);
  assert.match(markdown, /`assets\/lib`: 3\.0 MiB in 10 files/);
});

test('static server gzips text, falls back to 404.html and stays inside the site', async t => {
  const site = mkdtempSync(path.join(tmpdir(), 'loveit-serve-'));
  t.after(() => rmSync(site, { recursive: true, force: true }));
  mkdirSync(path.join(site, 'post'));
  writeFileSync(path.join(site, 'post/index.html'), '<p>post</p>');
  writeFileSync(path.join(site, '404.html'), '<p>missing</p>');
  writeFileSync(path.join(site, 'font.woff2'), 'binary');
  const server = await serve(site, 0);
  t.after(() => server.close());
  const origin = `http://127.0.0.1:${server.address().port}`;
  const raw = async (pathname, headers = {}) => {
    const response = await fetch(`${origin}${pathname}`, { headers });
    return { response, body: Buffer.from(await response.arrayBuffer()) };
  };

  // fetch() decompresses transparently; request identity to compare raw bytes.
  let { response, body } = await raw('/post/', { 'Accept-Encoding': 'identity' });
  assert.equal(response.status, 200);
  assert.equal(body.toString(), '<p>post</p>');
  assert.equal(response.headers.get('content-encoding'), null);

  response = await fetch(`${origin}/post/`, { headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(response.headers.get('content-encoding'), 'gzip');
  assert.equal(await response.text(), '<p>post</p>');

  ({ response, body } = await raw('/font.woff2', { 'Accept-Encoding': 'gzip' }));
  assert.equal(response.headers.get('content-encoding'), null);
  assert.equal(response.headers.get('content-type'), 'font/woff2');

  ({ response, body } = await raw('/nowhere/', { 'Accept-Encoding': 'identity' }));
  assert.equal(response.status, 404);
  assert.equal(body.toString(), '<p>missing</p>');

  ({ response, body } = await raw('/x%2F..%2F..%2F..%2Fetc%2Fpasswd', { 'Accept-Encoding': 'identity' }));
  assert.equal(response.status, 404);
  assert.equal(body.toString(), '<p>missing</p>');
});

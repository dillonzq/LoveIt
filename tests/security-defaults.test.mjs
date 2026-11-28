import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getHugo, root, toolEnv } from '../scripts/tools.mjs';

const referrer = html => html.match(/<meta name="?referrer"? content="?([^">]*)"?/)?.[1];
const mermaidConfig = html => {
  const config = html.match(/window\.config=(\{.*?\});<\/script>/)?.[1];
  return config && JSON.parse(config).mermaid;
};

const pele = { renderer: 'pele', zoomLabels: { zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset zoom' } };
const mermaid = securityLevel => ({ renderer: 'mermaid', securityLevel });
// Selects the Mermaid renderer, whose securityLevel the security cases check.
const useMermaid = 'renderer = "mermaid"\n';

const cases = [
  { name: 'defaults', security: '', page: useMermaid, referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict') },
  { name: 'empty values', security: 'referrerPolicy = ""\nmermaidSecurityLevel = ""\n', page: useMermaid, referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict') },
  { name: 'explicit overrides', security: 'referrerPolicy = "no-referrer"\nmermaidSecurityLevel = "loose"\n', page: useMermaid, referrer: 'no-referrer', mermaid: mermaid('loose') },
  { name: 'explicit strict', security: 'referrerPolicy = "strict-origin-when-cross-origin"\nmermaidSecurityLevel = "strict"\n', page: useMermaid, referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict') },
  // Referrer-Policy tokens are case-insensitive; only the exact "loose" relaxes Mermaid.
  {
    name: 'other spellings', security: 'referrerPolicy = " Same-Origin "\nmermaidSecurityLevel = "LOOSE"\n', page: useMermaid,
    referrer: 'same-origin', mermaid: mermaid('strict'), warnings: [/mermaidSecurityLevel "LOOSE"/], noWarnings: [/referrerPolicy/],
  },
  {
    name: 'padded loose', security: 'mermaidSecurityLevel = " loose "\n', page: useMermaid,
    referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict'), warnings: [/mermaidSecurityLevel " loose "/],
  },
  {
    name: 'unknown values', security: 'referrerPolicy = "always"\nmermaidSecurityLevel = "antiscript"\n', page: useMermaid,
    referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict'), warnings: [/referrerPolicy "always"/, /mermaidSecurityLevel "antiscript"/],
  },
  {
    name: 'unknown Mermaid value without a diagram', security: 'mermaidSecurityLevel = "antiscript"\n',
    referrer: 'strict-origin-when-cross-origin', diagram: false, warnings: [/mermaidSecurityLevel "antiscript"/],
  },
  {
    name: 'arrays', security: 'referrerPolicy = ["no-referrer"]\nmermaidSecurityLevel = ["loose"]\n', page: useMermaid,
    referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict'), warnings: [/referrerPolicy "\[no-referrer\]"/, /mermaidSecurityLevel "\[loose\]"/],
  },
  {
    name: 'booleans', security: 'referrerPolicy = false\nmermaidSecurityLevel = true\n', page: useMermaid,
    referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict'), warnings: [/referrerPolicy "false"/, /mermaidSecurityLevel "true"/],
  },
  // Pele is the default renderer; it has no securityLevel, so "loose" only warns.
  { name: 'Pele by default', security: '', referrer: 'strict-origin-when-cross-origin', mermaid: pele, noWarnings: [/renderer/] },
  { name: 'Pele bundled', security: '', extra: '[params.cdn]\ndata = ""\n', referrer: 'strict-origin-when-cross-origin', mermaid: pele, localPele: true },
  // A CDN data file may point a library at its bundled path.
  {
    name: 'Pele by local path', security: '', extra: '[params.cdn]\ndata = "local.yml"\n',
    files: { 'assets/data/cdn/local.yml': 'prefix:\n  libFiles: ""\nlibFiles:\n  peleJS: lib/pele/pele.global.js\n' },
    referrer: 'strict-origin-when-cross-origin', mermaid: pele, localPele: true,
  },
  { name: 'Mermaid bundled', security: '', page: useMermaid, extra: '[params.cdn]\ndata = ""\n', referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict') },
  { name: 'Pele by name', security: '', page: 'renderer = "pele"\n', referrer: 'strict-origin-when-cross-origin', mermaid: pele, noWarnings: [/renderer/] },
  {
    name: 'Pele with loose', security: 'mermaidSecurityLevel = "loose"\n',
    referrer: 'strict-origin-when-cross-origin', mermaid: pele, warnings: [/mermaidSecurityLevel "loose" has no effect with the Pele renderer/],
  },
  {
    name: 'loose without a diagram', security: 'mermaidSecurityLevel = "loose"\n',
    referrer: 'strict-origin-when-cross-origin', diagram: false, noWarnings: [/Pele/],
  },
  {
    name: 'unknown renderer', security: '', page: 'renderer = "Mermaid"\n',
    referrer: 'strict-origin-when-cross-origin', mermaid: pele, warnings: [/params\.page\.mermaid\.renderer "Mermaid"/],
  },
  {
    name: 'boolean renderer', security: '', page: 'renderer = true\n',
    referrer: 'strict-origin-when-cross-origin', mermaid: pele, warnings: [/params\.page\.mermaid\.renderer "true"/],
  },
  {
    name: 'renderer from front matter', security: '', frontMatter: 'mermaid:\n  renderer: mermaid\n',
    referrer: 'strict-origin-when-cross-origin', mermaid: mermaid('strict'),
  },
  {
    name: 'front matter over the site', security: '', page: useMermaid, frontMatter: 'mermaid:\n  renderer: pele\n',
    referrer: 'strict-origin-when-cross-origin', mermaid: pele,
  },
];

test('referrer policy, Mermaid renderer and securityLevel defaults, overrides and fallbacks', async () => {
  const { binary } = await getHugo();
  const temporary = mkdtempSync(path.join(os.tmpdir(), 'loveit-security-'));
  try {
    for (const { name, security, page = '', extra = '', files = {}, localPele: expectedLocalPele = false, frontMatter = '', referrer: expectedReferrer, mermaid: expectedMermaid, diagram = true, warnings = [], noWarnings = [] } of cases) {
      for (const environment of ['production', 'development']) {
        const site = path.join(temporary, `${name.replaceAll(' ', '-')}-${environment}`);
        mkdirSync(path.join(site, 'content/posts'), { recursive: true });
        for (const [file, content] of Object.entries(files)) {
          mkdirSync(path.dirname(path.join(site, file)), { recursive: true });
          writeFileSync(path.join(site, file), content);
        }
        writeFileSync(path.join(site, 'hugo.toml'), [
          'baseURL = "https://example.org/"',
          `theme = ${JSON.stringify(path.basename(root))}`,
          `themesDir = ${JSON.stringify(path.dirname(root))}`,
          '[params.security]',
          security,
          '[params.page.mermaid]',
          page,
          extra,
        ].join('\n'));
        const content = diagram ? '```mermaid\ngraph LR;\n    A --> B\n```\n' : 'A post without a diagram.\n';
        writeFileSync(path.join(site, 'content/posts/post.md'), `---\ntitle: Test post\n${frontMatter}---\n\n${content}`);
        const result = spawnSync(binary, ['--source', site, '--environment', environment, '--noBuildLock'], { cwd: site, env: toolEnv, encoding: 'utf8' });
        assert.equal(result.status, 0, result.stderr);
        const label = `${name} (${environment})`;
        for (const warning of warnings) assert.match(result.stderr, warning, label);
        if (!warnings.length) assert.doesNotMatch(result.stderr, /params\.(security|page\.mermaid)/, label);
        for (const warning of noWarnings) assert.doesNotMatch(result.stderr, warning, label);
        assert.equal(referrer(readFileSync(path.join(site, 'public/index.html'), 'utf8')), expectedReferrer, label);
        const post = readFileSync(path.join(site, 'public/posts/post/index.html'), 'utf8');
        assert.deepEqual(mermaidConfig(post), diagram ? expectedMermaid : undefined, label);
        // Each page loads only the library of its renderer.
        const scripts = [...post.matchAll(/<script[^>]+src="?([^" >]+)/g)].map(match => match[1]);
        const renderer = diagram ? expectedMermaid.renderer : undefined;
        assert.equal(scripts.some(src => /pele[@./]/.test(src)), renderer === 'pele', label);
        assert.equal(scripts.some(src => /mermaid[@./]/.test(src)), renderer === 'mermaid', label);
        // A self-hosted Pele script (always in development) is deployed with its license.
        const localPele = renderer === 'pele' && (expectedLocalPele || environment === 'development');
        assert.equal(scripts.some(src => src.includes('lib/pele/')), localPele, label);
        assert.equal(existsSync(path.join(site, 'public/lib/pele/LICENSE')), localPele, label);
      }
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

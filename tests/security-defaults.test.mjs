import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getHugo, root, toolEnv } from '../scripts/tools.mjs';

const referrer = html => html.match(/<meta name="?referrer"? content="?([^">]*)"?/)?.[1];
const mermaidConfig = html => {
  const config = html.match(/window\.config=(\{.*?\});<\/script>/)?.[1];
  return config && JSON.parse(config).mermaid;
};

const cases = [
  { name: 'defaults', security: '', referrer: 'strict-origin-when-cross-origin', mermaid: 'strict' },
  { name: 'empty values', security: 'referrerPolicy = ""\nmermaidSecurityLevel = ""\n', referrer: 'strict-origin-when-cross-origin', mermaid: 'strict' },
  { name: 'explicit overrides', security: 'referrerPolicy = "no-referrer"\nmermaidSecurityLevel = "loose"\n', referrer: 'no-referrer', mermaid: 'loose' },
  { name: 'other spellings', security: 'referrerPolicy = " Same-Origin "\nmermaidSecurityLevel = "LOOSE"\n', referrer: 'same-origin', mermaid: 'loose' },
  {
    name: 'unknown values', security: 'referrerPolicy = "always"\nmermaidSecurityLevel = "antiscript"\n',
    referrer: 'strict-origin-when-cross-origin', mermaid: 'strict', warnings: [/referrerPolicy "always"/, /mermaidSecurityLevel "antiscript"/],
  },
];

test('referrer policy and Mermaid securityLevel defaults, overrides and fallbacks', async () => {
  const { binary } = await getHugo();
  const temporary = mkdtempSync(path.join(os.tmpdir(), 'loveit-security-'));
  try {
    for (const { name, security, referrer: expectedReferrer, mermaid, warnings = [] } of cases) {
      for (const environment of ['production', 'development']) {
        const site = path.join(temporary, `${name.replaceAll(' ', '-')}-${environment}`);
        mkdirSync(path.join(site, 'content/posts'), { recursive: true });
        writeFileSync(path.join(site, 'hugo.toml'), [
          'baseURL = "https://example.org/"',
          `theme = ${JSON.stringify(path.basename(root))}`,
          `themesDir = ${JSON.stringify(path.dirname(root))}`,
          '[params.security]',
          security,
        ].join('\n'));
        writeFileSync(path.join(site, 'content/posts/diagram.md'), '---\ntitle: Diagram\n---\n\n```mermaid\ngraph LR;\n    A --> B\n```\n');
        const result = spawnSync(binary, ['--source', site, '--environment', environment, '--noBuildLock'], { cwd: site, env: toolEnv, encoding: 'utf8' });
        assert.equal(result.status, 0, result.stderr);
        const label = `${name} (${environment})`;
        for (const warning of warnings) assert.match(result.stderr, warning, label);
        if (!warnings.length) assert.doesNotMatch(result.stderr, /params\.security/, label);
        assert.equal(referrer(readFileSync(path.join(site, 'public/index.html'), 'utf8')), expectedReferrer, label);
        assert.deepEqual(mermaidConfig(readFileSync(path.join(site, 'public/posts/diagram/index.html'), 'utf8')), { securityLevel: mermaid }, label);
      }
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

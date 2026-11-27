import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { readAliases, themeIcons, vendoredFile } from '../scripts/icons.mjs';

test('every Font Awesome icon the theme uses is vendored as SVG with its license comment', () => {
  const icons = themeIcons();
  const aliases = readAliases();
  assert.ok(icons.length > 50);
  for (const icon of icons) {
    const file = vendoredFile(icon, aliases);
    assert.ok(existsSync(file), `missing ${icon.style}/${icon.name}: run node scripts/icons.mjs`);
    const svg = readFileSync(file, 'utf8');
    assert.match(svg, /^<svg [^>]*viewBox="[^"]+"/);
    assert.match(svg, /<!--! Font Awesome Free \S+ by @fontawesome - https:\/\/fontawesome\.com License - https:\/\/fontawesome\.com\/license\/free/);
  }
});

test('legacy aliases resolve to vendored canonical names', () => {
  for (const [alias, name] of Object.entries(readAliases())) {
    assert.notEqual(alias, name);
    assert.ok(['solid', 'regular', 'brands'].some(style => existsSync(vendoredFile({ style, name }, {}))), `${alias} -> ${name}`);
  }
});

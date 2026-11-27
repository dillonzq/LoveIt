import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getHugo, root, toolEnv } from '../scripts/tools.mjs';

// Sites that use the theme from the repository root, with two languages and several pages each,
// so that a warning printed per page or per language would show up more than once.
const { binary } = await getHugo();
const temporary = mkdtempSync(path.join(os.tmpdir(), 'loveit-config-'));
test.after(() => rmSync(temporary, { recursive: true, force: true }));

const ids = ['params-compatibility-polyfill', 'params-compatibility-objectfit', 'params-cdn-autocompletejs']
  .map(key => `loveit-deprecated-${key}`);
const polyfill = 'cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js';
const objectFit = 'object-fit-images/ofi.min.js';

function site(name, config, files = {}) {
  const directory = path.join(temporary, name);
  const pages = {};
  for (let i = 1; i <= 3; i++) {
    for (const language of ['en', 'zh-cn']) pages[`content/posts/post-${i}.${language}.md`] = `---\ntitle: Post ${i}\n---\nText ${i}.\n`;
  }
  for (const [file, content] of Object.entries({ ...pages, ...files })) {
    mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
    writeFileSync(path.join(directory, file), content);
  }
  writeFileSync(path.join(directory, 'hugo.toml'), [
    'baseURL = "https://example.org/"',
    `themesDir = ${JSON.stringify(path.dirname(path.resolve(root)))}`,
    `theme = ${JSON.stringify(path.basename(path.resolve(root)))}`,
    'defaultContentLanguage = "en"',
    // Before the language tables, so that top-level keys stay top-level.
    config,
    '[languages.en]\nweight = 1',
    '[languages.zh-cn]\nweight = 2',
  ].join('\n'));
  return directory;
}

function build(directory, ...args) {
  const result = spawnSync(binary, ['--source', directory, '--environment', 'production', '--noBuildLock', ...args], {
    cwd: directory, env: toolEnv, encoding: 'utf8',
  });
  return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

const count = (text, search) => text.split(search).length - 1;
const page = (directory, file) => readFileSync(path.join(directory, 'public', file), 'utf8');

test('theme defaults and explicit false values do not warn', () => {
  const directory = site('defaults', '[params.compatibility]\npolyfill = false\nobjectFit = false\n[params.cdn]\nautocompleteJS = ""');
  const { status, output } = build(directory, '--panicOnWarning');
  assert.equal(status, 0, output);
  assert.doesNotMatch(output, /loveit-deprecated/);
  assert.doesNotMatch(page(directory, 'index.html'), /polyfill\.min\.js|ofi\.min\.js/);
});

test('each deprecated key warns once per build; the compatibility keys keep working until they are removed', () => {
  const config = '[params.compatibility]\npolyfill = true\nobjectFit = true\n[params.search]\nenable = true\n'
    + '[params.cdn]\ndata = ""\nautocompleteJS = "https://cdn.example.org/autocomplete.js"';
  const directory = site('deprecated', config);
  const { status, output } = build(directory);
  assert.equal(status, 0, output);
  for (const id of ids) assert.equal(count(output, `'${id}'`), 1, `${id}\n${output}`);
  assert.equal(count(output, 'is deprecated since v0.5.0 and will be removed in v0.7.0'), 3, output);
  assert.equal(count(output, '已于 v0.5.0 弃用, 将在 v0.7.0 移除'), 3, output);
  assert.equal(count(output, 'https://hugoloveit.com/theme-documentation-basics/#deprecated-options'), 3, output);
  for (const file of ['index.html', 'zh-cn/index.html', 'posts/post-1/index.html']) {
    const html = page(directory, file);
    assert.match(html, new RegExp(polyfill.replaceAll('.', '\\.')), file);
    assert.match(html, new RegExp(objectFit.replaceAll('.', '\\.')), file);
    // autocomplete.js is gone, so the old key only warns.
    assert.doesNotMatch(html, /autocomplete\.js/, file);
  }

  // They are warnings: builds that panic on warnings fail unless ignoreLogs silences them.
  assert.notEqual(build(directory, '--panicOnWarning').status, 0);
  const ignored = site('ignored', `ignoreLogs = ${JSON.stringify(ids)}\n${config}`);
  const quiet = build(ignored, '--panicOnWarning');
  assert.equal(quiet.status, 0, quiet.output);
  assert.doesNotMatch(quiet.output, /loveit-deprecated/);
});

test('language params follow Hugo merging and warn once', () => {
  const directory = site('language', '[languages.zh-cn.params.compatibility]\npolyfill = true');
  const { status, output } = build(directory);
  assert.equal(status, 0, output);
  assert.equal(count(output, `'${ids[0]}'`), 1, output);
  assert.doesNotMatch(output, new RegExp(`${ids[1]}|${ids[2]}`));
  assert.doesNotMatch(page(directory, 'index.html'), /polyfill\.min\.js/);
  assert.match(page(directory, 'zh-cn/index.html'), /polyfill\.min\.js/);
});

test('the normalized configuration maps old keys to unset new keys', () => {
  const table = [
    '- key: params.oldSection.someFlag\n  replacement: params.newSection.someFlag\n  since: 0.5.0\n  removal: 0.7.0',
    '- key: params.oldTop\n  replacement: params.newTop\n  since: 0.5.0\n  removal: 0.7.0',
    '- key: params.oldMap\n  replacement: params.newMap\n  since: 0.5.0\n  removal: 0.7.0',
    '- key: params.oldBoth\n  replacement: params.newBoth\n  since: 0.5.0\n  removal: 0.7.0\n  hint:\n    en: Custom hint.\n    zh: 自定义提示.',
    // Paths through missing sections and non-map values are unset.
    '- key: params.title.sub\n  replacement: params.newTitle\n  since: 0.5.0\n  removal: 0.7.0',
    '- key: params.missing.key\n  since: 0.5.0\n  removal: 0.7.0',
  ].join('\n');
  const show = '{{ $c := partialCached "function/config.html" .Site .Site.Language.Lang }}'
    + '{{ $c.newSection.someFlag }}|{{ $c.newsection.someflag }}|{{ $c.newSection.other }}|{{ $c.newTop }}|{{ $c.newtop }}'
    + '|{{ $c.newMap.current }}{{ $c.newMap.obsolete }}|{{ $c.newBoth }}|{{ $c.newTitle }}|{{ $c.compatibility.objectFit }}|{{ $c.defaultTheme }}|{{ $c.oldBoth }}\n';
  const directory = site('replacement', [
    'disableKinds = ["page", "section", "taxonomy", "term", "rss", "sitemap", "robotsTXT", "404"]',
    '[params]\ntitle = "Site"\noldTop = "top"\noldBoth = "old"\nnewBoth = "new"',
    '[params.oldSection]\nsomeFlag = "mapped"',
    '[params.newSection]\nother = "kept"',
    '[params.oldMap]\nobsolete = "obsolete"',
    '[params.newMap]\ncurrent = "current"',
    '[languages.zh-cn.params]\noldBoth = ""',
  ].join('\n'), { 'assets/data/deprecations.yml': table, 'layouts/home.html': show });
  const { status, output } = build(directory);
  assert.equal(status, 0, output);
  // Theme defaults keep their case-insensitive keys; the new key wins when both are set.
  // Mapped keys read in any case, next to the keys already in the section.
  assert.equal(page(directory, 'index.html'), 'mapped|mapped|kept|top|top|current|new||false|auto|old\n');
  assert.equal(page(directory, 'zh-cn/index.html'), 'mapped|mapped|kept|top|top|current|new||false|auto|\n');
  assert.equal(count(output, "'loveit-deprecated-params-oldsection-someflag'"), 1, output);
  assert.equal(count(output, 'Use "params.newSection.someFlag" instead.'), 1, output);
  assert.equal(count(output, '请改用 "params.newSection.someFlag".'), 1, output);
  assert.equal(count(output, 'Custom hint.'), 1, output);
  assert.equal(count(output, "'loveit-deprecated-params-oldmap'"), 1, output);
  assert.doesNotMatch(output, /params-title-sub|params-missing-key/);
});

test('a replacement under a section that does not exist fails the build', () => {
  const directory = site('absent-section', '[params]\noldFlag = true', {
    'assets/data/deprecations.yml': '- key: params.oldFlag\n  replacement: params.absentSection.flag\n  since: 0.5.0\n  removal: 0.7.0',
  });
  const { status, output } = build(directory);
  assert.notEqual(status, 0);
  assert.match(output, /the replacement "params\.absentSection\.flag" needs the section "absentsection"/);
});

test('deprecation keys and replacements must be keys under params', () => {
  for (const [name, entry] of Object.entries({
    'bad-key': '- key: config.oldFlag\n  since: 0.5.0\n  removal: 0.7.0',
    'empty-key': '- key: ""\n  replacement: params.newFlag\n  since: 0.5.0\n  removal: 0.7.0',
    'missing-key': '- replacement: params.newFlag\n  since: 0.5.0\n  removal: 0.7.0',
    'bad-replacement': '- key: params.oldFlag\n  replacement: config.newFlag\n  since: 0.5.0\n  removal: 0.7.0',
    'empty-segment': '- key: params.oldFlag\n  replacement: params..newFlag\n  since: 0.5.0\n  removal: 0.7.0',
  })) {
    const directory = site(name, '[params]\noldFlag = true', { 'assets/data/deprecations.yml': entry });
    const { status, output } = build(directory);
    assert.notEqual(status, 0, name);
    assert.match(output, /must be a key under "params\."/, name);
  }
});

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getHugo, root, toolEnv } from '../scripts/tools.mjs';

const { binary } = await getHugo();
const temporary = mkdtempSync(path.join(os.tmpdir(), 'loveit-llms-'));
test.after(() => rmSync(temporary, { recursive: true, force: true }));

const llms = [
  '[outputFormats.llms]',
  'baseName = "llms"',
  'mediaType = "text/plain"',
  'isPlainText = true',
  'notAlternative = true',
].join('\n');

const content = {
  'content/about.en.md': '---\ntitle: About\ndescription: Who writes here.\n---\nText.\n',
  'content/about.zh-cn.md': '---\ntitle: 关于\n---\nText.\n',
  'content/posts/_index.en.md': '---\ntitle: Articles\n---\n',
  'content/posts/first.en.md': '---\ntitle: First [draft] post\ndate: 2025-01-02\ndescription: |\n  Two\n  lines.\n---\nText.\n',
  'content/posts/html-only.en.md': '---\ntitle: HTML only\ndate: 2025-01-01\noutputs: [html]\n---\nText.\n',
  'content/posts/hidden.en.md': '---\ntitle: Hidden\nhiddenFromSearch: true\n---\nText.\n',
  'content/posts/nested/deep.en.md': '---\ntitle: Deep\ndate: 2024-12-31\n---\nText.\n',
  'content/notes/note.en.md': '---\ntitle: Note\n---\nText.\n',
  'content/empty/hidden.en.md': '---\ntitle: Only hidden\nhiddenFromSearch: true\n---\nText.\n',
  // Hugo lists a page that it does not render, but publishes no file to link.
  'content/posts/unrendered.en.md': '---\ntitle: Unrendered\ndate: 2025-01-03\nbuild:\n  render: never\n---\nText.\n',
  'content/posts/linked.en.md': '---\ntitle: Linked\ndate: 2025-01-03\nbuild:\n  render: link\n---\nText.\n',
  'content/posts/untitled.en.md': '---\ntitle: " "\ndate: 2024-12-29\n---\nText.\n',
  // A section titled like the heading of the pages outside any section joins it.
  'content/pages/guide.en.md': '---\ntitle: Guide\n---\nText.\n',
  'content/unrendered/only.en.md': '---\ntitle: Only unrendered\nbuild:\n  render: never\n---\nText.\n',
  // The HTML page, not the first output format, is the fallback.
  'content/posts/json-first.en.md': '---\ntitle: JSON first\ndate: 2024-12-30\noutputs: [json, html]\n---\nText.\n',
  'layouts/single.json': '{}\n',
  // A section that Hugo does not list keeps its published pages in llms.txt.
  'content/archive/_index.en.md': '---\ntitle: Archive\nbuild:\n  list: never\n---\n',
  'content/archive/old.en.md': '---\ntitle: Old\ndate: 2020-01-01\n---\nText.\n',
};

function site(name, config, files = {}, { check = true } = {}) {
  const directory = path.join(temporary, name);
  for (const [file, text] of Object.entries({ ...content, ...files })) {
    mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
    writeFileSync(path.join(directory, file), text);
  }
  writeFileSync(path.join(directory, 'hugo.toml'), [
    'baseURL = "https://example.org/blog/"',
    'title = "Test Site"',
    `themesDir = ${JSON.stringify(path.dirname(path.resolve(root)))}`,
    `theme = ${JSON.stringify(path.basename(path.resolve(root)))}`,
    'defaultContentLanguage = "en"',
    'disableKinds = ["taxonomy", "term"]',
    config,
    '[params]\ndescription = """Notes\nand posts"""',
    '[languages.en]\nweight = 1',
    '[languages.zh-cn]\nweight = 2',
  ].join('\n'));
  const result = spawnSync(binary, ['--source', directory, '--environment', 'production', '--noBuildLock', '--panicOnWarning'], {
    cwd: directory, env: toolEnv, encoding: 'utf8',
  });
  if (check) assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const read = file => {
    const target = path.join(directory, 'public', file);
    return existsSync(target) ? readFileSync(target, 'utf8') : undefined;
  };
  return check ? read : { status: result.status, output: `${result.stdout}\n${result.stderr}`, read };
}

const links = html => html.match(/<link rel="?(?:alternate|describedby)"?[^>]*>/g) || [];

test('without the markdown and llms outputs, pages link neither', () => {
  const page = site('plain', '');
  assert.equal(page('llms.txt'), undefined);
  for (const file of ['index.html', 'posts/first/index.html']) {
    const html = page(file);
    assert.doesNotMatch(html, /describedby|text\/markdown/, file);
  }
});

test('pages link their Markdown version and the llms.txt of their language', () => {
  const page = site('llms', `${llms}\n[outputs]\nhome = ["html", "rss", "llms"]\npage = ["html", "markdown"]`);

  const post = links(page('posts/first/index.html'));
  assert.ok(post.includes('<link rel="alternate" href="https://example.org/blog/posts/first/index.md" type="text/markdown" title="First [draft] post">'), post.join('\n'));
  assert.ok(post.includes('<link rel="describedby" href="https://example.org/blog/llms.txt">'), post.join('\n'));
  // A page without the Markdown output only links llms.txt.
  const html = links(page('posts/html-only/index.html'));
  assert.ok(!html.some(link => link.includes('text/markdown')), html.join('\n'));
  assert.ok(html.includes('<link rel="describedby" href="https://example.org/blog/llms.txt">'), html.join('\n'));
  // The home page and the other language link the llms.txt of their language.
  assert.ok(links(page('index.html')).includes('<link rel="describedby" href="https://example.org/blog/llms.txt">'));
  assert.ok(links(page('zh-cn/index.html')).includes('<link rel="describedby" href="https://example.org/blog/zh-cn/llms.txt">'));

  assert.equal(page('llms.txt'), [
    '# Test Site',
    '',
    '> Notes and posts',
    '',
    '## Pages',
    '',
    '- [About](https://example.org/blog/about/index.md): Who writes here.',
    '- [Guide](https://example.org/blog/pages/guide/index.md)',
    '',
    // Sections in the order of Hugo, here by the date of their newest page; nested sections join their top-level section.
    '## Articles',
    '',
    // llms.txt parsers end the link text at the first "]", even an escaped one.
    '- [First &#91;draft&#93; post](https://example.org/blog/posts/first/index.md): Two lines.',
    '- [HTML only](https://example.org/blog/posts/html-only/)',
    '- [Deep](https://example.org/blog/posts/nested/deep/index.md)',
    '- [JSON first](https://example.org/blog/posts/json-first/)',
    // llms.txt parsers need a link text.
    '- [/posts/untitled](https://example.org/blog/posts/untitled/index.md)',
    '',
    '## Notes',
    '',
    '- [Note](https://example.org/blog/notes/note/index.md)',
    '',
    '## Archive',
    '',
    '- [Old](https://example.org/blog/archive/old/index.md)',
    '',
  ].join('\n'));
  assert.equal(page('zh-cn/llms.txt'), [
    '# Test Site',
    '',
    '> Notes and posts',
    '',
    '## 页面',
    '',
    '- [关于](https://example.org/blog/zh-cn/about/index.md)',
    '',
  ].join('\n'));
});

test('a site that hides every page from search lists only the pages it shows', () => {
  const page = site('hidden', `${llms}\n[outputs]\nhome = ["html", "llms"]\n[params.page]\nhiddenFromSearch = true`, {
    'content/notes/note.en.md': '---\ntitle: Note\nhiddenFromSearch: false\n---\nText.\n',
  });
  assert.equal(page('llms.txt'), '# Test Site\n\n> Notes and posts\n\n## Notes\n\n- [Note](https://example.org/blog/notes/note/)\n');
});

test('the Markdown output of earlier example configurations keeps working', () => {
  // The example site of earlier versions published .md files as text/plain. The theme defines no
  // other text/plain output format, so Hugo still finds the Markdown template of the pages.
  const legacy = '[mediaTypes."text/plain"]\nsuffixes = ["md"]\n[outputFormats.MarkDown]\nmediaType = "text/plain"\nisPlainText = true\nisHTML = false\n[outputs]\npage = ["HTML", "MarkDown"]';
  const page = site('legacy', legacy);
  assert.match(page('posts/first/index.md'), /^# First \[draft\] post\n\nText\.\n/);
  const html = links(page('posts/first/index.html'));
  assert.ok(html.includes('<link rel="alternate" href="https://example.org/blog/posts/first/index.md" type="text/markdown" title="First [draft] post">'), html.join('\n'));
  assert.ok(!html.some(link => link.includes('describedby')), html.join('\n'));
  assert.equal(page('llms.txt'), undefined);
});

test('Hugo versions that still read "_build" leave out the pages it only links', t => {
  const { status, output, read } = site('legacy-build', `${llms}\n[outputs]\nhome = ["html", "llms"]`, {
    'content/notes/linked.en.md': '---\ntitle: Linked\n_build:\n  render: link\n---\nText.\n',
  }, { check: false });
  // Later versions refuse "_build" and fail the build.
  if (status !== 0 && /"_build" front matter key was deprecated/.test(output)) return t.skip('this Hugo version no longer reads "_build"');
  assert.equal(status, 0, output);
  assert.equal(read('notes/linked/index.html'), undefined);
  assert.doesNotMatch(read('llms.txt'), /Linked/);
});

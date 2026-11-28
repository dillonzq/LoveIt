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
};

function site(name, config, files = {}) {
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
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return file => {
    const target = path.join(directory, 'public', file);
    return existsSync(target) ? readFileSync(target, 'utf8') : undefined;
  };
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
    '- [About](https://example.org/blog/about/index.md): Who writes here.',
    '',
    // Sections in the order of Hugo, here by the date of their newest page; nested sections join their top-level section.
    '## Articles',
    '',
    '- [First \\[draft\\] post](https://example.org/blog/posts/first/index.md): Two lines.',
    '- [HTML only](https://example.org/blog/posts/html-only/)',
    '- [Deep](https://example.org/blog/posts/nested/deep/index.md)',
    '',
    '## Notes',
    '',
    '- [Note](https://example.org/blog/notes/note/index.md)',
    '',
  ].join('\n'));
  assert.equal(page('zh-cn/llms.txt'), [
    '# Test Site',
    '',
    '> Notes and posts',
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

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getHugo, root, toolEnv } from '../scripts/tools.mjs';

const byline = html => html.match(/<span class="?post-author"?>(.*?)<\/span>/s)?.[1];
const avatar = html => byline(html)?.match(/<img[^>]*>/)?.[0];
const attribute = (tag, name) => tag?.match(new RegExp(`\\s${name}=(?:"([^"]*)"|([^\\s>]*))`))?.slice(1).find(value => value !== undefined);
const author = html => JSON.parse(html.match(/<script type="?application\/ld\+json"?>(.*?)<\/script>/s)[1]).author;

const posts = {
  // No author of its own: the site author and avatar. The newest post, so it is on the home page.
  'site.md': 'date: 2025-01-02\n',
  // Another author does not get the site author's avatar.
  'guest.md': 'author: Guest\nauthorLink: https://guest.example.com/\n',
  // The site author named again keeps the site avatar.
  'named.md': 'author: Site Author\n',
  'bundle/index.md': 'author: Bundled\nauthorAvatar: face.svg\n',
  // A bundle file named like the site avatar does not replace it.
  'shadow/index.md': '',
  'remote.md': 'authorAvatar: https://cdn.example.com/face.png\n',
  // A file under static/ keeps the path of baseURL.
  'static.md': 'authorAvatar: images/static-face.svg\n',
  // A name that YAML reads as a number is still shown as written.
  'numeric.md': 'author: 123\nauthorAvatar: https://cdn.example.com/face.png\n',
};

const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1"/></svg>';
const assetsAvatar = { '@type': 'ImageObject', url: 'https://example.org/blog/images/avatar.png', width: 528, height: 560 };

const variants = {
  avatar: 'avatar = "/images/avatar.png"\n',
  plain: '',
  // An author inherited from params.page is another author than params.author.name,
  // and authorAvatar is only read from front matter.
  inherited: 'avatar = "/images/avatar.png"\n[params.page]\nauthor = "Staff"\nauthorAvatar = "images/static-face.svg"\n',
};

function build(site, config, top = '') {
  for (const [file, frontMatter] of Object.entries(posts)) {
    const target = path.join(site, 'content/posts', file);
    mkdirSync(path.dirname(target), { recursive: true });
    const date = frontMatter.startsWith('date:') ? '' : 'date: 2025-01-01\n';
    writeFileSync(target, `---\ntitle: ${file}\n${date}${frontMatter}---\n\nText.\n`);
  }
  writeFileSync(path.join(site, 'content/posts/bundle/face.svg'), svg);
  mkdirSync(path.join(site, 'content/posts/shadow/images'), { recursive: true });
  writeFileSync(path.join(site, 'content/posts/shadow/images/avatar.png'), svg);
  mkdirSync(path.join(site, 'static/images'), { recursive: true });
  writeFileSync(path.join(site, 'static/images/static-face.svg'), svg);
  // An asset at the resolved URL of the static file must not be looked up in its place.
  mkdirSync(path.join(site, 'assets/blog/images'), { recursive: true });
  writeFileSync(path.join(site, 'assets/blog/images/static-face.svg'), svg);
  mkdirSync(path.join(site, 'assets/images'), { recursive: true });
  copyFileSync(path.join(root, 'exampleSite/assets/images/avatar.png'), path.join(site, 'assets/images/avatar.png'));
  writeFileSync(path.join(site, 'hugo.toml'), [
    'baseURL = "https://example.org/blog/"',
    top,
    `theme = ${JSON.stringify(path.basename(root))}`,
    `themesDir = ${JSON.stringify(path.dirname(root))}`,
    '[params.author]',
    'name = "Site Author"',
    config,
  ].join('\n'));
}

test('author avatar in the byline and the structured data', async () => {
  const { binary, version } = await getHugo();
  const [, minor] = version.match(/v0\.(\d+)\./);
  // plugin/img.html keeps PNG files as they are before Hugo 0.155.0.
  const resizesPng = Number(minor) >= 155;
  const temporary = mkdtempSync(path.join(os.tmpdir(), 'loveit-avatar-'));
  try {
    for (const [variant, config] of Object.entries(variants)) {
      const site = path.join(temporary, variant);
      build(site, config);
      const result = spawnSync(binary, ['--source', site, '--noBuildLock', '--panicOnWarning'], { cwd: site, env: toolEnv, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      const read = file => readFileSync(path.join(site, 'public', file), 'utf8');
      const page = name => read(`posts/${name}/index.html`);
      const label = name => `${name} (${variant})`;

      // Posts without an avatar keep the user icon and the link as before.
      const guest = page('guest');
      assert.equal(avatar(guest), undefined, label('guest'));
      assert.match(byline(guest), /<svg class="?icon"?/, label('guest'));
      const link = byline(guest).match(/<a[^>]*>/)[0];
      assert.equal(attribute(link, 'href'), 'https://guest.example.com/');
      assert.equal(attribute(link, 'target'), '_blank');
      assert.equal(attribute(link, 'rel'), 'noopener noreferrer author');
      assert.equal(attribute(link, 'title'), 'Author');
      assert.deepEqual(author(guest), { '@type': 'Person', name: 'Guest' }, label('guest'));

      const siteAuthor = variant === 'inherited' ? 'Staff' : 'Site Author';
      for (const name of ['site', 'named', 'shadow']) {
        const html = page(name);
        const shown = name === 'named' ? 'Site Author' : siteAuthor;
        if (name === 'shadow' && variant !== 'avatar') continue;
        if (variant === 'plain' || shown !== 'Site Author') {
          assert.equal(avatar(html), undefined, label(name));
          assert.match(byline(html), new RegExp(`<svg class="?icon"?.*${shown}</a>$`, 's'), label(name));
          assert.deepEqual(author(html), { '@type': 'Person', name: shown }, label(name));
          continue;
        }
        // An image under assets/ is published below the base path, with resized copies.
        const img = avatar(html);
        assert.equal(attribute(img, 'src'), '/blog/images/avatar.png', label(name));
        if (resizesPng) assert.match(attribute(img, 'srcset'), /\/blog\/images\/avatar_[^ ]+\.webp 20w, .+ 40w, .+ 60w/, label(name));
        assert.equal(attribute(img, 'alt'), '', label(name));
        assert.equal(attribute(img, 'width'), '20', label(name));
        assert.equal(attribute(img, 'height'), '20', label(name));
        assert.doesNotMatch(byline(html), /<svg class="?icon"?/, label(name));
        assert.match(byline(html), /Site Author<\/a>$/, label(name));
        assert.deepEqual(author(html), { '@type': 'Person', name: 'Site Author', image: assetsAvatar }, label(name));
      }

      // The home page JSON-LD uses the site author; its summaries lazy-load the avatar.
      const home = read('index.html');
      const summary = home.split('<article').find(article => /href="?\/blog\/posts\/site\/"?/.test(article));
      if (variant === 'avatar') {
        assert.equal(attribute(avatar(page('site')), 'loading'), undefined);
        const img = avatar(summary);
        assert.equal(attribute(img, 'src'), '/blog/images/avatar.png');
        assert.equal(attribute(img, 'loading'), 'lazy');
        assert.deepEqual(author(home), { '@type': 'Person', name: 'Site Author', image: assetsAvatar });
      } else {
        assert.equal(avatar(summary), undefined, label('home'));
        assert.match(byline(summary), /<svg class="?icon"?/, label('home'));
        assert.equal(author(home).name, 'Site Author', label('home'));
      }

      // Front matter avatars: a page resource, a remote URL and a file under static/.
      const bundle = page('bundle');
      assert.equal(attribute(avatar(bundle), 'src'), '/blog/posts/bundle/face.svg');
      assert.deepEqual(author(bundle).image, { '@type': 'ImageObject', url: 'https://example.org/blog/posts/bundle/face.svg' });
      const remote = page('remote');
      assert.equal(attribute(avatar(remote), 'src'), 'https://cdn.example.com/face.png');
      assert.equal(author(remote).image, 'https://cdn.example.com/face.png');
      const fromStatic = page('static');
      assert.equal(attribute(avatar(fromStatic), 'src'), '/blog/images/static-face.svg');
      assert.equal(author(fromStatic).image, 'https://example.org/blog/images/static-face.svg');
      assert.equal(attribute(avatar(fromStatic), 'loading'), undefined);
      assert.equal(attribute(avatar(remote), 'alt'), '');
      const numeric = page('numeric');
      assert.match(byline(numeric), /<img[^>]*>123<\/a>$/);
      assert.equal(author(numeric).name, '123');
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test('a static author avatar keeps the path of baseURL with canonifyURLs', async () => {
  const { binary } = await getHugo();
  const site = mkdtempSync(path.join(os.tmpdir(), 'loveit-avatar-canonify-'));
  try {
    build(site, 'avatar = "images/static-face.svg"\n', 'canonifyURLs = true');
    const result = spawnSync(binary, ['--source', site, '--noBuildLock', '--panicOnWarning'], { cwd: site, env: toolEnv, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const read = file => readFileSync(path.join(site, 'public', file), 'utf8');
    const expected = 'https://example.org/blog/images/static-face.svg';
    const post = read('posts/site/index.html');
    assert.equal(attribute(avatar(post), 'src'), expected);
    assert.equal(author(post).image, expected);
    assert.equal(author(read('index.html')).image, expected);
  } finally {
    rmSync(site, { recursive: true, force: true });
  }
});

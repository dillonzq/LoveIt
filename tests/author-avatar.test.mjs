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
  // No author of its own: the site author and avatar.
  'site.md': '',
  // Another author does not get the site author's avatar.
  'guest.md': 'author: Guest\nauthorLink: https://guest.example.com/\n',
  // The site author named again keeps the site avatar.
  'named.md': 'author: Site Author\n',
  'bundle/index.md': 'author: Bundled\nauthorAvatar: face.svg\n',
  'remote.md': 'authorAvatar: https://cdn.example.com/face.png\n',
};

function build(site, avatarConfig) {
  for (const [file, frontMatter] of Object.entries(posts)) {
    const target = path.join(site, 'content/posts', file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, `---\ntitle: ${file}\ndate: 2025-01-01\n${frontMatter}---\n\nText.\n`);
  }
  writeFileSync(path.join(site, 'content/posts/bundle/face.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1"/></svg>');
  mkdirSync(path.join(site, 'assets/images'), { recursive: true });
  copyFileSync(path.join(root, 'exampleSite/assets/images/avatar.png'), path.join(site, 'assets/images/avatar.png'));
  writeFileSync(path.join(site, 'hugo.toml'), [
    'baseURL = "https://example.org/blog/"',
    `theme = ${JSON.stringify(path.basename(root))}`,
    `themesDir = ${JSON.stringify(path.dirname(root))}`,
    '[params.author]',
    'name = "Site Author"',
    avatarConfig,
  ].join('\n'));
}

test('author avatar in the byline and the structured data', async () => {
  const { binary, version } = await getHugo();
  const [, minor] = version.match(/v0\.(\d+)\./);
  // plugin/img.html keeps PNG files as they are before Hugo 0.155.0.
  const resizesPng = Number(minor) >= 155;
  const temporary = mkdtempSync(path.join(os.tmpdir(), 'loveit-avatar-'));
  try {
    for (const withAvatar of [true, false]) {
      const site = path.join(temporary, withAvatar ? 'avatar' : 'plain');
      build(site, withAvatar ? 'avatar = "/images/avatar.png"' : '');
      const result = spawnSync(binary, ['--source', site, '--noBuildLock', '--panicOnWarning'], { cwd: site, env: toolEnv, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      const read = file => readFileSync(path.join(site, 'public', file), 'utf8');
      const page = name => read(`posts/${name}/index.html`);

      // Posts without an avatar keep the user icon and the link as before.
      const guest = page('guest');
      assert.equal(avatar(guest), undefined);
      assert.match(byline(guest), /<svg class="?icon"?/);
      const link = byline(guest).match(/<a[^>]*>/)[0];
      assert.equal(attribute(link, 'href'), 'https://guest.example.com/');
      assert.equal(attribute(link, 'target'), '_blank');
      assert.equal(attribute(link, 'rel'), 'noopener noreferrer author');
      assert.equal(attribute(link, 'title'), 'Author');
      assert.deepEqual(author(guest), { '@type': 'Person', name: 'Guest' });

      for (const name of ['site', 'named']) {
        const html = page(name);
        if (!withAvatar) {
          assert.equal(avatar(html), undefined, name);
          assert.match(byline(html), /<svg class="?icon"?/, name);
          assert.deepEqual(author(html), { '@type': 'Person', name: 'Site Author' }, name);
          continue;
        }
        // An image under assets/ is published below the base path, with resized copies.
        const img = avatar(html);
        assert.match(attribute(img, 'src'), /^\/blog\/images\/avatar\.png$/, name);
        if (resizesPng) assert.match(attribute(img, 'srcset'), /\/blog\/images\/avatar_[^ ]+\.webp 20w, .+ 40w, .+ 60w/, name);
        assert.equal(attribute(img, 'alt'), '', name);
        assert.equal(attribute(img, 'width'), '20', name);
        assert.equal(attribute(img, 'height'), '20', name);
        assert.doesNotMatch(byline(html), /<svg class="?icon"?/, name);
        assert.match(byline(html), /Site Author<\/a>$/, name);
        assert.deepEqual(author(html), {
          '@type': 'Person', name: 'Site Author',
          image: { '@type': 'ImageObject', url: 'https://example.org/blog/images/avatar.png', width: 528, height: 560 },
        }, name);
      }
      // The single page loads the avatar at once; summaries lazy-load it.
      if (withAvatar) {
        assert.equal(attribute(avatar(page('site')), 'loading'), undefined);
        const home = read('index.html');
        assert.equal(attribute(home.match(/<span class="?post-author"?>.*?<img[^>]*>/s)[0].match(/<img[^>]*>/)[0], 'loading'), 'lazy');
        assert.deepEqual(author(home).image, { '@type': 'ImageObject', url: 'https://example.org/blog/images/avatar.png', width: 528, height: 560 });
      } else {
        assert.deepEqual(author(read('index.html')), { '@type': 'Person', name: 'Site Author' });
      }

      // Front matter avatars: a page resource and a remote URL.
      const bundle = page('bundle');
      assert.equal(attribute(avatar(bundle), 'src'), '/blog/posts/bundle/face.svg');
      assert.deepEqual(author(bundle).image, { '@type': 'ImageObject', url: 'https://example.org/blog/posts/bundle/face.svg' });
      const remote = page('remote');
      assert.equal(attribute(avatar(remote), 'src'), 'https://cdn.example.com/face.png');
      assert.equal(author(remote).image, 'https://cdn.example.com/face.png');
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

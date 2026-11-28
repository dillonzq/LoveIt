import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getHugo, root, toolEnv } from '../scripts/tools.mjs';

const posts = {
  // Mastodon, with a trailing slash; Pleroma and Akkoma; GoToSocial.
  mastodon: 'https://mastodon.example/@author/113456789012345678/',
  pleroma: 'https://pleroma.example/notice/AbC123xyz',
  gotosocial: 'https://gts.example/@author/statuses/01HZY3ABCDEF',
  // Not the https URL of a post: these warn and render no comments.
  insecure: 'http://mastodon.example/@author/1',
  profile: 'https://mastodon.example/@author',
  script: 'javascript:alert(1)//1',
  // urls.Parse fails on a bad %-escape; the page still builds.
  escape: 'https://mastodon.example/@author/%ZZ',
};

function build(binary, site, cdn) {
  for (const [name, url] of Object.entries(posts)) {
    mkdirSync(path.join(site, 'content/posts'), { recursive: true });
    writeFileSync(path.join(site, 'content/posts', `${name}.md`),
      `---\ntitle: ${name}\ndate: 2025-01-01\ncomment:\n  mastodon:\n    url: ${JSON.stringify(url)}\n---\n\nText.\n`);
  }
  // Enabled for the site, but a page without a post URL has no comments.
  writeFileSync(path.join(site, 'content/posts/none.md'), '---\ntitle: none\ndate: 2025-01-01\n---\n\nText.\n');
  writeFileSync(path.join(site, 'hugo.toml'), [
    'baseURL = "https://example.org/"',
    `theme = ${JSON.stringify(path.basename(root))}`,
    `themesDir = ${JSON.stringify(path.dirname(root))}`,
    '[params]',
    // With the CDN, SRI checks the CDN copy against the bundled file.
    `fingerprint = ${JSON.stringify(cdn ? 'sha384' : '')}`,
    '[params.cdn]',
    `data = ${JSON.stringify(cdn)}`,
    '[params.page.comment]',
    'enable = true',
    '[params.page.comment.mastodon]',
    'enable = true',
  ].join('\n'));
  return spawnSync(binary, ['--source', site, '--environment', 'production', '--noBuildLock'], { cwd: site, env: toolEnv, encoding: 'utf8' });
}

const integrity = `sha384-${createHash('sha384').update(readFileSync(path.join(root, 'assets/lib/dompurify/purify.min.js'))).digest('base64')}`;
const escape = text => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const config = html => JSON.parse(html.match(/window\.config=(\{.*?\});/s)[1]);

test('Mastodon comments read the post from its URL and load DOMPurify', async () => {
  const { binary } = await getHugo();
  const temporary = mkdtempSync(path.join(os.tmpdir(), 'loveit-mastodon-'));
  try {
    for (const cdn of ['', 'jsdelivr.yml']) {
      const site = path.join(temporary, cdn || 'local');
      const result = build(binary, site, cdn);
      assert.equal(result.status, 0, result.stderr);
      const output = result.stdout + result.stderr;
      const page = name => readFileSync(path.join(site, 'public/posts', name, 'index.html'), 'utf8');

      for (const [name, host, id] of [
        ['mastodon', 'mastodon.example', '113456789012345678'],
        ['pleroma', 'pleroma.example', 'AbC123xyz'],
        ['gotosocial', 'gts.example', '01HZY3ABCDEF'],
      ]) {
        const html = page(name);
        const mastodon = config(html).comment.mastodon;
        assert.equal(mastodon.host, host, name);
        assert.equal(mastodon.id, id, name);
        assert.equal(mastodon.i18n.loading, 'Loading comments…');
        assert.match(html, /<div id="?mastodon"? class="?comment"?>/, name);
        // The prompt links to the post, so it works without JavaScript too.
        const prompt = html.match(/<p class="?mastodon-prompt"?>(.*?)<\/p>/s)[1];
        assert.match(prompt, new RegExp(`^Reply to <a href="?${escape(posts[name])}"? rel="?noopener noreferrer"? target="?_blank"?>this post</a> from a Mastodon`), name);
        const scripts = html.match(/<script[^>]*src=[^>]*purify[^>]*>/g);
        assert.equal(scripts?.length, 1, name);
        if (cdn) {
          assert.match(scripts[0], /src="?https:\/\/cdn\.jsdelivr\.net\/npm\/dompurify@3\.4\.18\/dist\/purify\.min\.js"?/);
          assert.match(scripts[0], new RegExp(`integrity="?${escape(integrity)}"?`));
          assert.match(scripts[0], /crossorigin="?anonymous"?/);
        } else {
          assert.match(scripts[0], /src="?\/lib\/dompurify\/purify\.min\.js"?/);
          assert.doesNotMatch(scripts[0], /integrity/);
        }
      }

      for (const name of ['insecure', 'profile', 'script', 'escape', 'none']) {
        const html = page(name);
        assert.doesNotMatch(html, /id="?mastodon"?/, name);
        assert.doesNotMatch(html, /purify/, name);
        assert.equal(config(html).comment?.mastodon, undefined, name);
      }
      for (const name of ['insecure', 'profile', 'script', 'escape']) {
        assert.match(output, new RegExp(`WARN.*The Mastodon comment URL "${escape(posts[name])}" of "/posts/${name}"`), name);
      }
      assert.doesNotMatch(output, /posts\/(mastodon|pleroma|gotosocial|none)"/);
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

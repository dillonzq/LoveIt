import assert from 'node:assert/strict';
import test from 'node:test';
import { pagefindSearches, takeOption } from '../scripts/tools.mjs';

test('a language may select Pagefind while inheriting enabled and bundle path', () => {
  const searches = pagefindSearches({
    params: { search: { enable: true, type: 'fuse', pagefind: { basepath: '/search-index/' } } },
    languages: { en: {}, 'zh-cn': { params: { search: { type: 'pagefind' } } } },
  });
  assert.equal(searches.length, 1);
  assert.equal(searches[0].pagefind.basepath, '/search-index/');
});

test('language overrides can disable a global Pagefind engine', () => {
  assert.deepEqual(pagefindSearches({
    params: { search: { enable: true, type: 'pagefind' } },
    languages: { en: { params: { search: { type: 'fuse' } } }, fr: { params: { search: { enable: false } } } },
  }), []);
});

test('single-language builds use the root search configuration', () => {
  assert.equal(pagefindSearches({ params: { search: { enable: true, type: 'pagefind' } } }).length, 1);
});

test('wrapper options accept Hugo long and short spellings', () => {
  const args = ['-d', 'out', '--environment=production', '-b=http://x/?a=b', '--minify'];
  assert.equal(takeOption(args, '--destination', '-d'), 'out');
  assert.equal(takeOption(args, '--environment', '-e'), 'production');
  assert.equal(takeOption(args, '--baseURL', '-b'), 'http://x/?a=b');
  assert.equal(takeOption(args, '--source', '-s'), undefined);
  assert.deepEqual(args, ['--minify']);
});

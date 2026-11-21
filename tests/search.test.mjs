import assert from 'node:assert/strict';
import test from 'node:test';
import { SearchClient, escapeHTML, highlight } from '../assets/js/search.mjs';

test('search text and regex characters are rendered literally', () => {
    assert.equal(highlight('a <img> & a.b', 'a.b'), 'a &lt;img&gt; &amp; <em>a.b</em>');
    assert.equal(highlight('<script>', '<script>', 'script'), '<em>&lt;script&gt;</em>');
    assert.equal(highlight('a[b]', '['), 'a<em>[</em>b]');
    assert.equal(escapeHTML('"quoted"'), '&quot;quoted&quot;');
});

test('simultaneous first queries share one fetch and index', async () => {
    let fetches = 0;
    let indexes = 0;
    let release;
    const pending = new Promise(resolve => { release = resolve; });
    const client = new SearchClient({ type: 'fuse', fuseIndexURL: '/index.json' }, {
        fetcher: async () => { fetches++; await pending; return { ok: true, json: async () => [] }; },
        globals: { Fuse: class { constructor() { indexes++; } search() { return []; } } },
    });
    const first = client.search('alpha');
    const second = client.search('beta');
    release();
    await Promise.all([first, second]);
    assert.equal(fetches, 1);
    assert.equal(indexes, 1);
});

test('Fuse.js is imported once from fuseURL, and a failed import retries with a fresh URL', async () => {
    const imports = [];
    const client = new SearchClient({ type: 'fuse', fuseURL: '/lib/fuse/fuse.min.mjs', fuseIndexURL: '/index.json' }, {
        globals: {},
        fetcher: async () => ({ ok: true, json: async () => [{ uri: '/post/', title: 'Post', content: 'needle' }] }),
        importer: async url => {
            imports.push(url);
            // Like browsers before Chrome 156, the first URL keeps failing once its load failed.
            if (url === '/lib/fuse/fuse.min.mjs') throw new Error('offline');
            return { default: class { constructor(records) { this.records = records; } search() {
                return this.records.map(item => ({ item }));
            } } };
        },
    });
    await assert.rejects(client.search('needle'), /offline/);
    assert.deepEqual((await client.search('needle')).map(item => item.uri), ['/post/']);
    await client.search('needle');
    assert.deepEqual(imports, ['/lib/fuse/fuse.min.mjs', '/lib/fuse/fuse.min.mjs?retry=1']);
});

test('a UMD fuseURL override works through the Fuse global it sets', async () => {
    const globals = {};
    const client = new SearchClient({ type: 'fuse', fuseURL: 'https://cdn.example/fuse.js@7.0.0/dist/fuse.min.js' }, {
        globals,
        fetcher: async () => ({ ok: true, json: async () => [{ uri: '/post/', title: 'Post', content: 'needle' }] }),
        importer: async () => {
            globals.Fuse = class { constructor(records) { this.records = records; } search() {
                return this.records.map(item => ({ item }));
            } };
            return {};
        },
    });
    assert.deepEqual((await client.search('needle')).map(item => item.uri), ['/post/']);
});

test('failed index loads retry, and empty queries do not fetch', async () => {
    let calls = 0;
    const client = new SearchClient({ type: 'fuse' }, {
        fetcher: async () => (++calls === 1 ? { ok: false, status: 503 } : { ok: true, json: async () => [] }),
        globals: { Fuse: class { search() { return []; } } },
    });
    assert.deepEqual(await client.search(' '), []);
    assert.equal(calls, 0);
    await assert.rejects(client.search('alpha'), /503/);
    assert.deepEqual(await client.search('alpha'), []);
    assert.equal(calls, 2);
});

test('results keep ranking while deduplicating chunks and limiting count', async () => {
    const client = new SearchClient({ type: 'fuse', maxResultLength: 2 }, {
        fetcher: async () => ({ ok: true, json: async () => [] }),
        globals: { Fuse: class { search() {
            return ['/first/', '/first/', '/second/', '/third/'].map(uri => ({ item: { uri, title: uri, content: 'needle' } }));
        } } },
    });
    assert.deepEqual((await client.search('needle')).map(item => item.uri), ['/first/', '/second/']);
});

test('Algolia receives the query and returns plain data for safe rendering', async () => {
    let request;
    const client = new SearchClient({ type: 'algolia', algoliaIndex: 'posts', maxResultLength: 1 }, {
        globals: { 'algoliasearch/lite': { liteClient: () => ({ search: async input => {
            request = input;
            return { results: [{ hits: [{ uri: '/post/', title: '<unsafe>', content: 'needle', date: '2026-01-01' }] }] };
        } }) } },
    });
    const result = await client.search('needle');
    assert.equal(request.requests[0].query, 'needle');
    assert.equal(result[0].title, '<unsafe>');
    assert.equal(highlight(result[0].title, 'needle'), '&lt;unsafe&gt;');
});

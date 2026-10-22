export function escapeHTML(value = '') {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export function highlight(text, query, tag = 'em') {
    text = String(text || '');
    if (!query) return escapeHTML(text);
    if (!['em', 'mark', 'strong', 'b', 'span'].includes(tag)) tag = 'em';
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.split(new RegExp(`(${escaped})`, 'gi')).map((part, i) =>
        i % 2 ? `<${tag}>${escapeHTML(part)}</${tag}>` : escapeHTML(part)).join('');
}

function snippet(text, query, length, position) {
    text = String(text || '');
    const match = position ?? text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
    const start = Math.max(0, match - Math.floor(length / 5));
    return (start ? '…' : '') + text.slice(start, start + length);
}

// One client is shared by the desktop/mobile inputs. A failed load can be retried.
export class SearchClient {
    constructor(config, { globals = typeof window === 'undefined' ? globalThis : window, fetcher = (...args) => fetch(...args), importer = url => import(url) } = {}) {
        this.config = config;
        this.globals = globals;
        this.fetcher = fetcher;
        this.importer = importer;
    }

    async load() {
        if (!this.loading) this.loading = this.initialize().catch(error => {
            this.loading = undefined;
            throw error;
        });
        return this.loading;
    }

    async initialize() {
        const config = this.config;
        if (config.type === 'pagefind') {
            const pagefind = await this.importer(`${config.pagefindBasePath || '/_pagefind/'}pagefind.js`);
            await pagefind.options({ baseUrl: config.pagefindBaseURL || '/' });
            await pagefind.init();
            return pagefind;
        }
        if (config.type === 'algolia') {
            return this.globals['algoliasearch/lite'].liteClient(config.algoliaAppID, config.algoliaSearchKey);
        }
        const response = await this.fetcher(config.fuseIndexURL || config.lunrIndexURL);
        if (!response.ok) throw new Error(`Search index: HTTP ${response.status}`);
        const records = await response.json();
        if (config.type === 'fuse') return new this.globals.Fuse(records, {
            isCaseSensitive: false, minMatchCharLength: 2, threshold: 0.3,
            keys: [{ name: 'title', weight: 5 }, { name: 'tags', weight: 2 }, { name: 'categories', weight: 2 }, { name: 'content', weight: 1 }],
            ...config.fuseOpts, includeMatches: true,
        });
        const lunr = this.globals.lunr;
        this.records = Object.fromEntries(records.map(record => [record.objectID, record]));
        return lunr(function () {
            if (config.lunrLanguageCode) this.use(lunr[config.lunrLanguageCode]);
            this.ref('objectID');
            this.field('title', { boost: 50 });
            this.field('tags', { boost: 20 });
            this.field('categories', { boost: 20 });
            this.field('content', { boost: 10 });
            this.metadataWhitelist = ['position'];
            records.forEach(record => this.add(record));
        });
    }

    async search(query) {
        if (!query.trim()) return [];
        const engine = await this.load();
        const max = this.config.maxResultLength || 10;
        const length = this.config.snippetLength || 50;
        let results;
        if (this.config.type === 'fuse') {
            results = engine.search(query).map(({ item, matches }) => ({
                ...item,
                context: snippet(item.content, query, length, matches?.find(match => match.key === 'content')?.indices[0]?.[0]),
            }));
        } else if (this.config.type === 'pagefind') {
            const response = await engine.search(query);
            results = (await Promise.all(response.results.slice(0, max).map(result => result.data()))).map(item => ({
                uri: item.url, title: item.meta?.title || '', date: item.meta?.date || '',
                context: snippet(item.content || '', query, length),
            }));
        } else if (this.config.type === 'algolia') {
            const { results: [{ hits }] } = await engine.search({ requests: [{
                indexName: this.config.algoliaIndex, query, offset: 0, length: max * 8,
                attributesToHighlight: [], attributesToSnippet: [],
            }] });
            results = hits.map(item => ({ ...item, context: snippet(item.content, query, length) }));
        } else {
            let matches;
            try {
                const lunr = this.globals.lunr;
                matches = engine.search(lunr.queryHandler ? lunr.queryHandler(query) : query);
            } catch (error) {
                if (error.name === 'QueryParseError') return [];
                throw error;
            }
            results = matches.map(({ ref, matchData: { metadata } }) => {
                const item = this.records[ref];
                const positions = Object.values(metadata).flatMap(match => match.content?.position?.map(([start]) => start) || []);
                return { ...item, context: snippet(item.content, query, length, positions.length ? Math.min(...positions) : undefined) };
            });
        }
        const unique = new Map();
        for (const item of results) {
            if (!unique.has(item.uri)) unique.set(item.uri, item);
            if (unique.size === max) break;
        }
        return [...unique.values()];
    }
}

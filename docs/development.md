# Developing LoveIt

Use Node from `.nvmrc`, then run:

```sh
npm ci --ignore-scripts
npm run hugo:version
npm run dev
npm run build
```

The repository's `.hvm` pins the Hugo version **and edition**. The Node wrapper
works from any directory and does not depend on shell aliases. It bootstraps
hvm 1.0.0 from a checksum-verified release and caches tools under
`node_modules/.cache/loveit`. Set `HVM_BIN` to reuse an existing hvm executable,
or `LOVEIT_TOOLS_DIR` to relocate the cache. Normal builds never rewrite `.hvm`.
Commit `.hvm` when intentionally changing the default with `hvm use`.

For compatibility checks, temporarily override the version without editing the lock:

```sh
LOVEIT_HUGO_VERSION=minimum npm run build
LOVEIT_HUGO_VERSION=0.157.0 npm run build
LOVEIT_HUGO_VERSION=latest npm run build
```

`minimum` reads `module.hugoVersion.min`; `locked` reads `.hvm`. CI uses minimum
and locked versions in production and development. Nightly probes latest and
records the actual version. Scheduled Nightly runs, and manual runs of `latest`
on the default branch, maintain one issue titled "Nightly build against the
latest Hugo is failing": a failure opens it or comments on it, and a later such
run that passes in both environments closes it. Runs in which either build was
cancelled or skipped, and manual runs of other versions or branches, leave it
alone. Netlify calls the same build entry
point.

hvm looks up Hugo releases through the GitHub API, which allows 60 anonymous
requests an hour. CI passes the workflow token as `HVM_GITHUB_TOKEN`; set the
same variable to a token locally if you hit the limit.

## Hugo and Sass compatibility

The master branch supports Hugo 0.146.0 and later. Install **Dart Sass** even
with extended Hugo. `npm ci` supplies a pinned `sass-embedded` executable to the
wrapper; sites using the theme directly may install standalone Dart Sass instead.
Prebuilt LibSass resources are not a substitute for Dart Sass.

The example config uses `locale` and `label`. The wrapper adds
`exampleSite/config-legacy.toml` on Hugo before 0.158.0. If running Hugo directly
on those versions, pass both config files. Theme templates use a version-aware
helper for the language API; downstream sites should use the language keys
appropriate to their Hugo version.

`assets/css/_override.scss` (variables) and `assets/css/_custom.scss` (styles)
remain supported and are checked by browser fixtures that override both files.
Global deprecated Sass functions have been migrated. Only the `import` deprecation is silenced to keep
the public override API compatible; other warnings still fail strict builds.
Source maps are emitted in development only.

## Search

The example uses Fuse by default. To build all languages with another engine:

```sh
LOVEIT_SEARCH=pagefind npm run build
```

When Pagefind is enabled, the build generates its index after Hugo completes.
`params.search.pagefind.basePath` determines the output directory, defaulting to
`/_pagefind/`. It must be a local directory relative to the site's base URL.
The loader and result URLs account for deployment under a subpath. Pagefind
indexes regular page content and honors `hiddenFromSearch`, including site-wide
defaults and explicit page overrides. Navigation, comments and article metadata
are excluded.

`hugo server` does not run the Pagefind post-build step. For Pagefind preview,
build to disk and serve that output, for example:

```sh
LOVEIT_SEARCH=pagefind npm run build
npx --no-install pagefind --site exampleSite/public --output-subdir _pagefind --serve
```

For a custom `basePath`, use the same directory with `--output-subdir`. Rebuild
the index after editing content. Fuse and Lunr work with the normal live server.
Algolia requires an index and a search-only key; automated tests use a mock.

Search implementation lives in `assets/js/search.mjs`; Hugo bundles it with
`assets/js/theme.js` using `js.Build`. The independent, checked-in Lunr Chinese
segmenter is regenerated with `npm run compile-lunr-segmentit` (esbuild).

## Checks

```sh
npm test
npx --no-install playwright install chromium
npm run test:browser
bundle install
npm run htmlproofer
```

`npm test` also checks every `i18n/*.toml` against `i18n/en.toml`: duplicate
or unknown keys, a missing `other` form and placeholders English does not
provide fail the run. Keys a language has not translated yet are only reported
as warnings, because Hugo falls back to the default language for them. Keys
that only some languages need (`lunrLanguageLib`, `lunrSegmentitLib`) are
allowed without an English entry.

Browser tests build isolated multilingual fixtures for Fuse, Lunr, Pagefind and
mocked Algolia. They cover subpaths, hidden pages, literal HTML/regex characters,
concurrent index loads, stale responses, Mermaid, custom math delimiters,
Sass overrides, theme persistence, mobile navigation, the skip link and reduced
motion. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an installed Chrome
executable.

Hugo, npm and Ruby dependencies are cached in the reusable CI workflow. The
existing `ci-gate` remains the required aggregate check. Build logs and test
reports are uploaded even on failure.

For performance work, compare the same Hugo version, content and environment
with separate cold caches and repeated warm builds. Template cumulative times
overlap; never sum them as a build duration. Preserve page-specific Scratch
updates when adding partial caches.

## Baseline metrics

```sh
npx --no-install playwright install chromium
npm run metrics
```

`npm run metrics` builds the example site into `build/metrics/site` twice, from
empty caches and again with them warm, and records the build time Hugo reports.
It then serves the output locally with gzip and runs Lighthouse CI
(`lighthouserc.json`, mobile defaults, three runs) on the home page and an
article, and `@axe-core/playwright` on the home page, an article, the post list,
the 404 page and the open search dropdown. It also records the size of
`assets/lib`. `build/metrics/summary.md` and `summary.json` hold the results;
full Lighthouse reports and axe results sit next to them. Lighthouse and axe use
Playwright's Chromium unless `CHROME_PATH` is set; `LOVEIT_METRICS_PORT` changes
the local port (default 48138).

The Metrics workflow runs the same script on every pull request and push to
master, writes the summary to the job summary and uploads the reports as the
`metrics` artifact. It only records numbers: no score or violation fails it, and
it is not part of `ci-gate`. Lighthouse scores vary between runs and runners;
compare trends, not single values.

References: [hvm](https://github.com/jmooring/hvm),
[Hugo Sass](https://gohugo.io/functions/css/sass/),
[Pagefind](https://pagefind.app/docs/),
[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci),
[axe-core](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright).

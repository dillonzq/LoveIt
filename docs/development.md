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

## Theme script

`assets/js/theme.js` is the entry of the theme script, built by `js.Build` as an
ES2020 module and loaded with `<script type="module">`. It lists the features
and the order they start in; `assets/js/core.js` holds what every page has
(header, mobile menu, theme switch, scroll and resize events) and
`assets/js/util.js` the shared helpers. Each feature is a module under
`assets/js/features/` whose default export receives the core object, reads
`theme.config` and subscribes to its event sets. The entry imports a feature
with `import()` only when the page uses it; `js.Build` bundles every feature
into the one file, and a feature runs only once imported. A feature that throws
while starting is logged and the others still start. The theme starts on
`DOMContentLoaded` from a handler that the inline config script registers
(`window.loveitStart`) while the document is loading, so it runs before the
handlers of classic scripts that come after the theme script, as it did when the
theme script was classic.

## Theme version

`package.json` is the source of the theme version. Templates read it from
`layouts/_partials/loveit/version.html`, a partial generated from it by
`scripts/version.mjs` and checked in, so sites that run Hugo directly, with the
theme in a themes directory or as a Hugo Module, need no Node step.

To prepare a release:

```sh
npm version <version> --no-git-tag-version
```

This updates `package.json` and `package-lock.json`, and npm's `version`
script regenerates the partial. Review and commit the three files, then tag
the release (`v<version>`) once that commit is merged. If your npm
configuration sets `ignore-scripts`, add `--ignore-scripts=false`.

`npm test` fails when `package-lock.json` or the partial does not match
`package.json` (run `npm run version` to regenerate the partial), and checks
that the documented command changes the version in the footer of sites using
the theme from a themes directory and as a Hugo Module.

## Deprecating an option

Deprecated site configuration keys are listed in `assets/data/deprecations.yml`
with the version that deprecates them, the version that removes them and a
hint in English and Chinese. `layouts/_partials/function/config.html` reads the
table and returns the site params as Hugo merged them. Call it with
`partialCached "function/config.html" .Site .Site.Language.Lang` (`init.html`
already does for every page), so that a used key warns at most once per site
and language; Hugo also drops repeated identical warnings. Each warning has the
ID `loveit-deprecated-<key with dots as dashes, lowercase>` for `ignoreLogs`.

- A key is used when its value is truthy, so keep the theme default in
  `hugo.toml` at `false` or `""`, or remove it.
- With `replacement`, the old value fills the new key in the returned params
  while the new key is unset. Templates then read only the new key, which must
  not have a default in `hugo.toml`; apply it with `default` in the template.
  Every section above the new key must exist in `hugo.toml` (the build fails
  otherwise), so that the mapped key reads in any case like other params.
- Until a key is removed, templates that still read it should read it from the
  returned params rather than `.Site.Params`.
- Add the key to "Deprecated Options" in both languages of
  `exampleSite/content/posts/theme-documentation-basics` and to the
  **Deprecated** section of `CHANGELOG.md`.

`tests/config.test.mjs` builds sites with deprecated keys set and checks the
warnings and the returned params.

## Checks

```sh
npm test
npx --no-install playwright install chromium
npm run test:browser
bundle install
npm run htmlproofer
```

`npm test` also checks every `i18n/*.toml` against `i18n/en.toml`: duplicate,
unknown or missing keys, a missing `other` form and placeholders English does
not provide fail the run. Every language must define every English key, so a
missing translation cannot silently fall back to the site's default language
(`defaultContentLanguage`). Where a language has no better value, such as a
locale code a comment provider does not support, use the English one. Keys
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

## Metrics

```sh
npx --no-install playwright install chromium
npm run metrics
npm run metrics:compare -- --baseline path/to/master/summary.json
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

CI runs the Metrics workflow on every pull request and push to master and
uploads the reports as the `metrics` artifact. On a pull request,
`npm run metrics:compare` then compares the results with the master baseline
and the job, and with it `ci-gate`, fails when a value is worse than
`metrics-budget.json` allows. The comparison is written to the job summary and
to `build/metrics/comparison.md`.

- **Tolerances.** For each metric the budget sets a `relative` (fraction of the
  baseline) and an `absolute` tolerance; a value fails when it is worse by more
  than the larger of the two. Scores fail when they drop; timings, bytes,
  requests, axe nodes and build times fail when they grow, and so does any axe
  rule the baseline did not violate, and a page the baseline measured but this
  run did not. The `note` of each entry records the
  spread between master runs that the tolerance leaves room for; Lighthouse
  timings and build times vary much more between runners than bytes and axe
  results, which barely change. A metric left out of the budget is not checked,
  and an unknown key is an error.
- **Baseline.** The baseline is the `summary.json` of a successful run of a
  push to the default branch (`baseline.workflows`) for the pull request's base
  commit or, failing that, for the closest ancestor of it. Pull request runs,
  forks and other branches never count, and nothing from the artifact is run:
  only `summary.json` is read, and it must have every field the current summary
  format has, or the next older run is tried. When the base commit's own run is
  still in progress, the job waits for it up to `baseline.waitMinutes`, capped
  at 20 minutes. This lets a pull request updated just after another merge
  compare against the merged state. Otherwise the gate uses an older master
  commit and names it in the summary. The `baseline` settings come from the
  base commit's `metrics-budget.json`, so a pull request that changes them, unlike the
  tolerances, does not use its own version. Where the base commit has no such
  file, or its `baseline` settings are invalid, the gate uses built-in settings
  equal to the current ones; a failure to read the file fails the job.
- **No baseline.** When no baseline can be found or downloaded, or none has a
  format the gate understands, the job passes with a warning
  (`baseline.missing: "warn"`); set it to `"fail"` to require one. Re-run the job
  once a master run has uploaded its artifact.
- **Intended regressions.** A maintainer can add the `accept-metrics-regression`
  label (`baseline.acceptLabel`) and re-run the job: the regressions are still
  listed, but the check passes. Once merged, the new values become the baseline.
  To change a tolerance instead, edit `metrics-budget.json` in the pull request;
  the summary points out that it differs from the baseline's.

Master commits are not cancelled by later pushes, so each one leaves a
baseline. Lighthouse scores still vary between runs and runners; read a single
failure next to the tolerances, and re-run the job when only a timing is just
over its limit.

References: [hvm](https://github.com/jmooring/hvm),
[Hugo Sass](https://gohugo.io/functions/css/sass/),
[Pagefind](https://pagefind.app/docs/),
[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci),
[axe-core](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright).

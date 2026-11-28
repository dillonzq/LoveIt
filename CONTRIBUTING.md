# Contributing to LoveIt

Thanks for helping improve LoveIt! Bug reports, translations, documentation
fixes and code changes are all welcome.

To report a security vulnerability, do not open a public issue. Follow
[SECURITY.md](SECURITY.md) instead.

## Issues

- Read the [theme documentation](https://hugoloveit.com/categories/documentation/)
  and search [existing issues](https://github.com/dillonzq/LoveIt/issues)
  first.
- Use the bug report or feature request template. For a bug, include the theme
  version or commit, the Hugo version and edition (`hugo version`), and the
  smallest configuration or content that shows the problem.
- For a large change, such as a new feature, a new dependency or a change to
  the configuration format, open an issue to discuss it before writing the
  code.

## Development setup

[docs/development.md](docs/development.md) covers the toolchain: Node from
`.nvmrc`, the Hugo version pinned in `.hvm`, Dart Sass, search engines and the
test suites. In short:

```sh
npm ci --ignore-scripts
npm run dev     # live server for the example site
npm run build   # production build that fails on warnings
```

The example site in `exampleSite/` is both the demo and the documentation
site. Use it to try your change.

## Pull requests

1. Fork the repository and create a branch from `master`.
2. Keep each pull request to one topic. Unrelated fixes are easier to review
   in separate pull requests.
3. Write the pull request title as a
   [Conventional Commit](https://www.conventionalcommits.org/) message, for
   example `fix(toc): keep a long auto TOC within the viewport`. Pull requests
   are squash merged, so the title becomes the commit message on `master`.
   Common types are `feat`, `fix`, `docs`, `test`, `build`, `ci` and `chore`.
4. In the description, explain the problem, the change and how you tested it.
   Link related issues (`Fixes #123`).
5. Run the checks before you push:

   ```sh
   npm test
   npm run build
   npx --no-install playwright install chromium
   npm run test:browser
   ```

   CI also builds with the minimum supported Hugo version and runs
   html-proofer. A pull request can be merged when the `ci-gate` check passes.

### What to include

- **Tests** for bug fixes and new behavior, where the existing suites in
  `tests/` can cover them.
- **Documentation** for new or changed options, in both
  `index.en.md` and `index.zh-cn.md` of the relevant
  `exampleSite/content/posts/theme-documentation-*` page. Mark new options with
  `{{< version X.Y.Z >}}` and removed ones with
  `{{< version X.Y.Z deleted >}}`, using the next release version. That is
  a patch version (0.x.y), unless the release raises `module.hugoVersion.min`,
  which makes it a minor version (0.x.0).
- **A changelog entry** under `## [Unreleased]` in [CHANGELOG.md](CHANGELOG.md)
  for any change site owners may notice. Say what to do when upgrading if
  the change breaks existing sites.

### Compatibility

- The theme supports every Hugo version from `module.hugoVersion.min` in
  `hugo.toml` (currently 0.146.0) to the latest release. Test template changes
  with `LOVEIT_HUGO_VERSION=minimum npm run build` as well as the locked
  version.
- Configuration options and template paths are part of the public API. Before
  removing or renaming one, deprecate it: keep it working, list it in
  `assets/data/deprecations.yml` so that it logs a warning, and remove it in
  the next minor version.
- Keep `assets/css/_override.scss` and `assets/css/_custom.scss` working; sites
  use them to customize the theme.

## Translations

Translations live in `i18n/<language>.toml`, with `i18n/en.toml` as the
reference. To add or update a language:

1. Copy the keys from `i18n/en.toml` and translate the values. Keep
   placeholders such as `{{ .Count }}` unchanged.
2. Run `npm test`. It fails on missing, unknown and duplicate keys. If a
   comment provider has no locale for the language, use its English code.
3. For a new language, add it to the language tables in `README.md`,
   `README.zh-cn.md` and the
   [language compatibility](https://hugoloveit.com/theme-documentation-basics/#language-compatibility)
   section of the documentation.

## Third-party libraries

Bundled libraries are in `assets/lib/`, and their versions are listed in
`assets/lib/VERSION.md`. When you upgrade a library:

- Replace the files with the ones from the official npm package of the new
  version.
- Update `assets/lib/VERSION.md` and the CDN data files in `assets/data/cdn/`
  (`jsdelivr.yml`, `jsdelivr.fastly.yml`, `jsdelivr.cloudflare.yml` and
  `unpkg.yml`), and check that every changed CDN URL works.
- Note breaking or visible changes from the library's release notes in the pull
  request and in the changelog. Mention a license change too.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).

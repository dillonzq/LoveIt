# Changelog

All notable changes to LoveIt are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Before 1.0.0, a minor version (0.x.0) may contain breaking changes; they are
listed under **Changed** or **Removed** with what to do when upgrading.

This file starts at 0.4.0. Older releases are described on the
[GitHub Releases](https://github.com/dillonzq/LoveIt/releases) page.

## [Unreleased]

### Added

- A footnote, or the reference in the text that links to it, is outlined and
  highlighted after a link jumps to it. The outline animates in briefly unless
  reduced motion is preferred ([#993]).
- The "Read More" link of each post summary names its post: screen readers
  hear a localized label such as "Read More: Post title", and search engines
  see the title in visually hidden link text.
- A build warning, printed once per build, when the site configuration uses a
  deprecated option. Each warning names the version that removes the option
  and links to the
  [Deprecated Options](https://hugoloveit.com/theme-documentation-basics/#deprecated-options)
  section of the documentation. Builds with `--panicOnWarning` fail; add the
  ID shown in the warning to `ignoreLogs` to silence it.
- `params.page.fontawesomeCSS` (`"auto"` by default, or `true` / `false`)
  controls when the Font Awesome stylesheet and webfonts load.
- Keyboard shortcuts for search: `/` (outside text fields) and `Ctrl+K` or
  `⌘K` open it. Arrow keys move through the results, `Enter` opens one
  (`Ctrl`/`⌘`/`Shift+Enter` or a middle click opens it in a new tab), and
  `Esc` closes search and returns focus to where it was. Visitors can turn
  off the `/` shortcut with a checkbox below the search results; the choice
  is remembered in the browser.

### Changed

- The microdata `itemtype` of post summaries and the footer uses
  `https://schema.org`.
- Heading anchor links are built into the page by a Markdown render hook
  (`_markup/render-heading.html`) instead of being added by JavaScript, so
  they work without JavaScript. Each link is named by its heading for screen
  readers, and the `#` or `|` mark is no longer read as part of the heading.
  Feeds have no anchor links. Headings no longer get the `headerLink` class;
  custom CSS or scripts that use it can select `.single .content > h2`
  (and other levels) instead. A site with its own `render-heading` hook keeps
  it and gets no anchor links.
- The `<meta name="referrer">` tag defaults to `strict-origin-when-cross-origin`
  instead of `no-referrer`: requests to your own origin carry the full URL,
  cross-origin requests (including other subdomains) carry only your origin,
  and HTTPS-to-HTTP requests carry none. Set `referrerPolicy = "no-referrer"`
  in `[params.security]` to keep the old behaviour. Unknown values fall back
  to the default with a build warning.
- Mermaid diagrams render with `securityLevel` `strict` instead of `loose`,
  which disables `click` interactions and restricts HTML in labels. Set
  `mermaidSecurityLevel = "loose"` (exactly) in `[params.security]` if you
  trust your diagram sources and need these features. Invalid values produce
  a build warning and fall back to `strict`.
- Mermaid diagrams, from `mermaid` code blocks and the `mermaid` shortcode,
  are rendered with [Pele](https://pele.run) 1.13.0 instead of Mermaid
  ([#1120]). The script is about 83% smaller than Mermaid's, diagrams draw
  several times faster and are laid out again for narrow screens, and
  switching between light and dark only changes their colors. Diagrams
  shrunk to fit get zoom buttons named in the page language. Pele has its own
  layout and style, has no HTML labels, ignores JavaScript `click` callbacks
  and Mermaid themes, and typesets `$$...$$` in labels only on pages that load
  KaTeX. To keep Mermaid 12.3.0, set `renderer = "mermaid"` in
  `[params.page.mermaid]`, or `mermaid.renderer` in the front matter of a
  page. Sites with `mermaidSecurityLevel = "loose"` get a build warning until
  they choose the Mermaid renderer. Unknown renderers warn and use Pele.
  Custom code that called the `mermaid` global on diagram pages must also
  choose the Mermaid renderer.
- The theme's own icons (header, footer, social links, post meta, share
  buttons, admonitions, code blocks, task lists) are inline SVG rendered at
  build time, so pages no longer fetch icon files at runtime. Decorative icons
  are hidden from assistive technology; icon-only social links are named by
  their title. Task list checkboxes are named "Checked" or "Unchecked" in
  the page language.
- Font Awesome's stylesheet and webfonts load only on pages whose content uses
  the `:(fa…):` syntax or Font Awesome classes, or whose configured HTML still
  does (menu and title `pre`/`post` icons are inlined when the theme has them).
  Sites whose own layouts use Font Awesome classes should set
  `params.page.fontawesomeCSS = true`.
- Sites that override templates or styles: `_partials/plugin/icon.html` keeps
  its `Class`, `Src`, `Simpleicons` and `Prefix` options and adds `Label`;
  icons are `<svg class="icon …">` instead of `<i>`, so CSS that targets
  `i.icon` or `i.details-icon` should drop the `i`. Remote `Src` icons render
  as `<img>`.
- Images use Hugo's image processing instead of lazysizes ([#974]). Markdown
  images, the `image` shortcode, featured images and the home page avatar
  found in the page bundle or under `assets/` get `width` and `height`, which
  keep the page from shifting while they load, and JPEG, PNG and WebP images
  get a `srcset` with a WebP copy up to 800 pixels wide and `sizes`. The
  original file stays the `src`, the last `srcset` candidate when it is
  wider, and the lightGallery full-size image. Images are rotated as their
  Exif orientation says. Before Hugo 0.155.0, PNG and WebP images keep
  the original file so the browser can apply its orientation. GIF, BMP
  and TIFF images, animated PNG and WebP images and images Hugo cannot
  decode only get their size; SVG, files under `static/` and remote URLs are
  used as they are. The home page avatar can also be a resource of the home
  page bundle. WebP copies need the extended edition of Hugo before 0.153.0,
  and browsers without WebP support (Safari 13 and older) cannot show them.
  The first cold build of a site takes longer while Hugo makes the copies;
  later builds reuse them from `resources/_gen`.
- The featured image of a post and the home page avatar load with
  `fetchpriority="high"`; the header logo loads normally; other images use
  native lazy loading (`loading="lazy"` and `decoding="async"`) instead of a
  placeholder that JavaScript replaced. The featured image of a post now has
  `width` and `height` too. Without a `src_s`, the lightGallery thumbnail of a
  processed image is its smallest WebP copy.
- The `image` shortcode fills in a missing `width` or `height` from the
  image's aspect ratio when the other one is a number.
- Search is a native modal `<dialog>` with an ARIA combobox and listbox
  instead of autocomplete.js, and keeps the look of the inline header search.
  On desktop, the search button grows into the search field in the header
  and the results drop down below it; on mobile, the search field at the top
  of the menu slides up into the header. Screen readers hear the number of
  results. All four engines (Lunr.js, Fuse.js, Algolia, Pagefind) and every
  `params.search` option work as before. Sites that override
  `_partials/header.html` or style the old `#search-*-desktop`,
  `#search-*-mobile` or `.search-dropdown` elements need to follow the new
  markup in `_partials/header.html` and `_partials/search.html`.
- The page title entrance, the auto-hiding header, the fixed buttons and the
  copy feedback of code blocks use the theme's own CSS instead of animate.css.
  With reduced motion, page titles and copied code no longer animate.
- The copy button of code blocks uses the Clipboard API, and falls back to
  `document.execCommand("copy")` where the API is missing or refused, such as
  on pages served over plain HTTP. The button turns green when the code is
  copied. When copying fails, it turns red and the code is left selected so it
  can be copied by hand. Screen readers announce the result.
- The copy control and the code title that expands or collapses a code block
  are `<button>` elements, so keyboard users can reach them. The code title
  reports its state with `aria-expanded`. Sites that override
  `_partials/plugin/code-block.html` should compare it with the new one.

- The theme script loads as a JavaScript module (`<script type="module">`)
  built for ES2020 instead of ES2015. Its source is split into a core
  (`assets/js/core.js`) and a module per feature under
  `assets/js/features/` (search, table of contents, code blocks,
  lightGallery, KaTeX, diagrams, ECharts, TypeIt, Mapbox, Cookie Consent and
  each comment system); a feature starts only on pages that use it, and Hugo
  still bundles them all into the one `js/theme.js` file. A feature that fails
  to start, for example because its library did not load, is reported in the
  browser console and no longer stops the features after it. The table of
  contents and the comments start with the other features instead of 100 ms
  later. Sites that override `assets/js/theme.js` should move their changes
  to the file of the feature they change.

### Deprecated

- `params.compatibility.polyfill`, `params.compatibility.objectFit` and
  `params.cdn.autocompleteJS`. None of them has any effect any more, because
  the Polyfill service, object-fit-images and autocomplete.js were removed.
  All three warn until 0.7.0; remove them from your configuration. Setting
  them to `false` or `""` does not warn.

### Removed

- The runtime loader for `data-svg-src` icons in `theme.js`.
- lazysizes, the `lazysizesJS` key of the CDN data files and
  `svg/loading.svg`. Images no longer get the `lazyload`, `lazyloading` and
  `lazyloaded` classes or `data-src`/`data-srcset` attributes; update custom
  styles or scripts that rely on them.
- autocomplete.js 0.38.1. `params.cdn.autocompleteJS` no longer has any
  effect.
- object-fit-images, the cdnjs Polyfill service, clipboard.js and animate.css:
  their bundled files, the `objectFitImagesJS`, `clipboardJS` and `animateCSS`
  entries of the CDN data files, `assets/data/polyfill.yml` and
  `_partials/plugin/compatibility.html`. Browsers supported by the theme
  provide `object-fit`, the Clipboard API and CSS animations natively.
  `params.compatibility.polyfill` and `params.compatibility.objectFit` no
  longer load anything and only print the deprecation warning; remove them.
  Your own CDN data files can drop the
  three entries. Template overrides that add `animate__*` classes or scripts
  that call `ClipboardJS` must load those libraries themselves.

### Fixed

- After the window is resized, the table of contents beside a post measures
  the page again for following the scroll, instead of keeping the
  measurements taken when the page loaded.
- With the Mermaid renderer and `mermaidSecurityLevel = "loose"`, `click`
  callbacks in diagrams run: they are bound after the diagram is
  inserted.
- Table of contents links and the share buttons at the end of a post are at
  least 24×24 CSS px, to meet WCAG 2.2 success criterion 2.5.8 (Target Size,
  Minimum). Each TOC entry is clickable across its whole line, and the share
  icons are spaced slightly further apart.
- On right-to-left pages, the desktop header menu keeps its order when the menu
  names use a left-to-right script, and no menu link breaks into pieces too
  small to tap.

## [0.4.1] - 2026-11-27

Hugo 0.146.0 or later and Dart Sass are still required.

### Added

- Share buttons for Bluesky ([#1066]), Email, Douban, Qzone, Pinboard and
  WordPress ([#1069]). All are off by default.
- A "Skip to main content" link as the first focusable element of every page
  ([#1082]).
- Support for `prefers-reduced-motion: reduce`: transitions and animations
  finish instantly and TypeIt shows its full text at once ([#1082]).
- Right-to-left languages: `<html>` gets a `dir` attribute from the language
  direction (or from the language code when none is configured), and the
  header, search, table of contents and fixed buttons are mirrored ([#1084]).
  Article content styles are not mirrored yet.
- A build warning when `params.cdn.data` names a CDN data file that does not
  exist, instead of silently using the bundled files ([#1059]).

### Changed

- The theme switch, search, menu toggle, share and Back controls are
  `<button>` elements with accessible names instead of
  `<a href="javascript:void(0)">`. The theme switch label shows the current
  mode. Sites that override `_partials/header.html`,
  `_partials/plugin/theme-switch.html`, `_partials/plugin/share.html`,
  `_partials/single/footer.html` or `404.html` should compare them with the
  new templates ([#1083]).
- The home page and its RSS feed list every regular page in the `posts`
  section whatever its `type`, plus pages in other sections whose `type` is
  `posts` or `post` ([#1087]).
- JSON-LD structured data is built with `dict` and `jsonify`. `@context` is
  now `https://schema.org`, the word count property is `wordCount`, and empty
  values are omitted ([#1086]).
- Bundled libraries and their CDN data files are upgraded:
  Apache ECharts 6.1.0 ([#1074]), algoliasearch 5.65.0 ([#1071]),
  Font Awesome Free 7.3.1 ([#1068]), Fuse.js 7.5.0 ([#1070]),
  Gitalk 1.8.0 ([#1072]), KaTeX 0.19.1 ([#1063]),
  lightGallery 3.0.0 ([#1075]), Mapbox GL JS 3.35.2 ([#1077]),
  Mermaid 12.3.0 ([#1064]), MetingJS 2.0.2 ([#1073]),
  sharer.js 0.5.4 ([#1066]), simple-icons 16.38.0 ([#1060]),
  Twemoji 17.0.3 ([#1062]), TypeIt 8.8.7 ([#1065]) and Waline 3.16.2 ([#1076]).
  Changes that authors may notice:
  - **Mermaid 12** uses the ELK layout and the `neo` look by default, so some
    diagrams are laid out and styled differently. Set `layout: dagre` and
    `look: classic` under `config:` in a diagram's front matter to get the
    previous rendering.
    The library file is about twice as large, but it only loads on pages that
    use Mermaid.
  - **ECharts 6** places the legend at the bottom by default and keeps axis
    labels inside the grid. Set `legend.top` or `grid.outerBoundsMode: 'none'`
    to get the previous layout.
  - **Mapbox GL JS 3** requires WebGL 2, and the default styles switch to the
    globe view at low zoom levels.
  - **lightGallery 3** draws its controls with inline SVG icons. It is still
    licensed under GPLv3 or a commercial license.
  - **Mermaid 12** and **TypeIt 8.8** need newer browsers than the previous
    versions.
- The repository locks Hugo 0.170.1 (standard edition) for development and
  CI; the minimum supported version is unchanged ([#1061]). Development tools,
  GitHub Actions and Dependabot updates are refreshed ([#1078], [#1079],
  [#1089]).
- Open Graph, Twitter Cards and JSON-LD pick a page's images in one order:
  its `seo.images`, its `images`, its featured image, a bundle image named
  like `*feature*`, `*cover*` or `*thumbnail*`, then the site's
  `params.page.seo.images`, `params.images` and `params.seo.image`. JSON-LD
  now includes a page's `images` and `featuredImage`, and the home page's
  JSON-LD image follows the same order. The theme provides
  `_partials/opengraph.html` and `_partials/twitter_cards.html` in place of
  Hugo's embedded templates; a site's own copies still take precedence
  ([#1101]).
- The comment system documentation warns that Gitalk 1.x publishes its
  `clientSecret` in any page with Gitalk enabled and sends it through a
  third-party CORS proxy, and recommends giscus for new sites. It says that
  the hosted Commento script the theme loads no longer serves Commento and
  that the theme cannot use a self-hosted Commento server, and that Valine
  is licensed under GPL-2.0-only and stores comments in LeanCloud, which
  shuts down on January 12, 2027. The options themselves are unchanged
  ([#1098]).

### Removed

- The `Pocket`, `Skype` and `Baidu` share options, because those services
  have shut down. Sites that still set them keep building; the options are
  ignored ([#1069]).
- The `cdnjs.yml` CDN data file, which lagged behind the bundled library
  versions. Sites with `params.cdn.data = "cdnjs.yml"` should switch to
  `jsdelivr.yml`, `jsdelivr.fastly.yml`, `jsdelivr.cloudflare.yml` or
  `unpkg.yml`, or keep their own copy in `assets/data/cdn/` ([#1059]).
- The lightGallery icon font files, which lightGallery 3 no longer uses
  ([#1075]).

### Fixed

- `robots.txt` no longer blocks `/css/`, `/js/` and `/images/`, so search
  engines can render pages and index images ([#1080]).
- External links used `rel="noopener noreffer"`; they now use
  `noopener noreferrer` ([#1081]).
- A long automatic table of contents stays within the viewport and scrolls
  ([#1085], [#963]).
- The copy button no longer adds a blank line between code lines, and code
  blocks in a language Chroma does not know (or with no language) get line
  numbers and code block styles ([#1088]).
- Posts in `content/posts/` with a custom `type` no longer disappear from the
  home page and its RSS feed ([#1087], [#863]).
- Every translation now defines every English key: the `DEPRECATED` version
  badge label in 21 languages, the Swedish "Todo" admonition title, the
  traditional Chinese giscus language and the Waline language for Bengali,
  Dutch and Ukrainian (English, which Waline uses for languages it does not
  support). `npm test` fails when a translation misses a key ([#1095]).
- `og:image` and `twitter:image` ignored `seo.images` and featured images
  set with `featuredImage`, and pointed at files under `assets/` that were
  never published. Local images are now published and get
  `og:image:width` and `og:image:height`, and SVG images, which social
  networks cannot show, are skipped. The example site no longer sets
  `params.images` to a missing `/logo.png` ([#1101], [#789]).
- Valine comment avatars have an empty `alt` attribute, including avatars
  added by pagination, replies and new comments, since the commenter's name
  is next to them ([#1096]).
- An SVG image in `params.page.seo.images` or the publisher logo no longer
  fails the build ([#1086]).
- `unpkg.yml` pointed at four files that do not exist on unpkg ([#1067]).
- Server-side (passthrough) math is styled correctly on Hugo 0.166.0 and
  later ([#1063]).

## [0.4.0] - 2026-11-16

0.4.0 is a transitional release before 1.0.0. See
[Upgrade from 0.3.X](https://hugoloveit.com/theme-documentation-basics/#upgrade-from-0-3)
for the full upgrade guide.

### Added

- Fuse.js and Pagefind search engines ([#1026]).
- A Content-Security-Policy meta tag, configured with `[params.security]`
  ([#1028]).
- Render hooks for Markdown tables ([#1034]), blockquote alerts ([#1020]) and
  server-side math ([#1036]).
- A configurable Meting API for the `music` shortcode ([#1052]).
- Extra text below the subtitle of the home page profile ([#997]).
- A display name for `proto` code blocks ([#1038]).
- A new logo, wordmark and favicon set.

### Changed

- Hugo 0.146.0 or later is required; LoveIt 0.3.x supported Hugo 0.128.0 to
  0.145.0 ([#1012]).
- Dart Sass is required. The theme no longer compiles with LibSass and no
  longer ships prebuilt CSS.
- Templates follow Hugo's new template system and live in
  `layouts/_partials`, `layouts/_shortcodes` and `layouts/_markup`. Compare any
  templates your site overrides.
- The theme script is bundled with `js.Build` ([#1027]).
- The `admonition` shortcode is refactored ([#1019]).
- The bundled Waline client is v3, which requires a Waline server v1.27.0 or
  later ([#1053]).
- The polyfill loads from cdnjs instead of polyfill.io ([#1051]).

### Fixed

- Mermaid diagrams render when `hiddenFromHomePage` is false ([#1032]).
- The Discord server invite social link ([#1037]).
- Nested shortcodes, TypeIt, utterances and cached page content.

[Unreleased]: https://github.com/dillonzq/LoveIt/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/dillonzq/LoveIt/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/dillonzq/LoveIt/compare/v0.3.1...v0.4.0

[#789]: https://github.com/dillonzq/LoveIt/issues/789
[#863]: https://github.com/dillonzq/LoveIt/issues/863
[#963]: https://github.com/dillonzq/LoveIt/issues/963
[#974]: https://github.com/dillonzq/LoveIt/issues/974
[#993]: https://github.com/dillonzq/LoveIt/issues/993
[#997]: https://github.com/dillonzq/LoveIt/pull/997
[#1012]: https://github.com/dillonzq/LoveIt/pull/1012
[#1019]: https://github.com/dillonzq/LoveIt/pull/1019
[#1020]: https://github.com/dillonzq/LoveIt/pull/1020
[#1026]: https://github.com/dillonzq/LoveIt/pull/1026
[#1027]: https://github.com/dillonzq/LoveIt/pull/1027
[#1028]: https://github.com/dillonzq/LoveIt/pull/1028
[#1032]: https://github.com/dillonzq/LoveIt/pull/1032
[#1034]: https://github.com/dillonzq/LoveIt/pull/1034
[#1036]: https://github.com/dillonzq/LoveIt/pull/1036
[#1037]: https://github.com/dillonzq/LoveIt/pull/1037
[#1038]: https://github.com/dillonzq/LoveIt/pull/1038
[#1051]: https://github.com/dillonzq/LoveIt/pull/1051
[#1052]: https://github.com/dillonzq/LoveIt/pull/1052
[#1053]: https://github.com/dillonzq/LoveIt/pull/1053
[#1059]: https://github.com/dillonzq/LoveIt/pull/1059
[#1060]: https://github.com/dillonzq/LoveIt/pull/1060
[#1061]: https://github.com/dillonzq/LoveIt/pull/1061
[#1062]: https://github.com/dillonzq/LoveIt/pull/1062
[#1063]: https://github.com/dillonzq/LoveIt/pull/1063
[#1064]: https://github.com/dillonzq/LoveIt/pull/1064
[#1065]: https://github.com/dillonzq/LoveIt/pull/1065
[#1066]: https://github.com/dillonzq/LoveIt/pull/1066
[#1067]: https://github.com/dillonzq/LoveIt/pull/1067
[#1068]: https://github.com/dillonzq/LoveIt/pull/1068
[#1069]: https://github.com/dillonzq/LoveIt/pull/1069
[#1070]: https://github.com/dillonzq/LoveIt/pull/1070
[#1071]: https://github.com/dillonzq/LoveIt/pull/1071
[#1072]: https://github.com/dillonzq/LoveIt/pull/1072
[#1073]: https://github.com/dillonzq/LoveIt/pull/1073
[#1074]: https://github.com/dillonzq/LoveIt/pull/1074
[#1075]: https://github.com/dillonzq/LoveIt/pull/1075
[#1076]: https://github.com/dillonzq/LoveIt/pull/1076
[#1077]: https://github.com/dillonzq/LoveIt/pull/1077
[#1078]: https://github.com/dillonzq/LoveIt/pull/1078
[#1079]: https://github.com/dillonzq/LoveIt/pull/1079
[#1080]: https://github.com/dillonzq/LoveIt/pull/1080
[#1081]: https://github.com/dillonzq/LoveIt/pull/1081
[#1082]: https://github.com/dillonzq/LoveIt/pull/1082
[#1083]: https://github.com/dillonzq/LoveIt/pull/1083
[#1084]: https://github.com/dillonzq/LoveIt/pull/1084
[#1085]: https://github.com/dillonzq/LoveIt/pull/1085
[#1086]: https://github.com/dillonzq/LoveIt/pull/1086
[#1087]: https://github.com/dillonzq/LoveIt/pull/1087
[#1088]: https://github.com/dillonzq/LoveIt/pull/1088
[#1089]: https://github.com/dillonzq/LoveIt/pull/1089
[#1095]: https://github.com/dillonzq/LoveIt/pull/1095
[#1096]: https://github.com/dillonzq/LoveIt/pull/1096
[#1098]: https://github.com/dillonzq/LoveIt/pull/1098
[#1101]: https://github.com/dillonzq/LoveIt/pull/1101
[#1120]: https://github.com/dillonzq/LoveIt/issues/1120

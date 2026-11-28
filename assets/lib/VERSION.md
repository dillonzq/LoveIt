# Dependency Libraries Version

| Dependency Library                                                                  | Directory         | Version | License                                 |
|:------------------------------------------------------------------------------------|:------------------|--------:|:----------------------------------------|
| [Algolia Search Client](https://github.com/algolia/algoliasearch-client-javascript) | algoliasearch     |  5.65.0 | MIT                                     |
| [APlayer](https://github.com/MoePlayer/APlayer)                                     | aplayer           |  1.10.1 | MIT                                     |
| [Cookie Consent](https://github.com/osano/cookieconsent)                            | cookieconsent     |   3.1.1 | MIT                                     |
| [Apache ECharts](https://github.com/apache/echarts)                                 | echarts           |   6.1.0 | Apache-2.0                              |
| [emoji-data](https://github.com/iamcal/emoji-data)                                  | emoji-data        |  15.1.2 | MIT (see [Emoji images](#emoji-images)) |
| [Font Awesome Free](https://github.com/FortAwesome/Font-Awesome)                    | fontawesome-free  |   7.3.1 | CC-BY-4.0 AND OFL-1.1 AND MIT           |
| [Fuse.js](https://github.com/krisk/Fuse)                                            | fuse              |   7.5.0 | Apache-2.0                              |
| [Gitalk](https://github.com/gitalk/gitalk)                                          | gitalk            |   1.8.0 | MIT                                     |
| [KaTeX](https://github.com/KaTeX/KaTeX)                                             | katex             |  0.19.1 | MIT                                     |
| [lightGallery](https://github.com/sachinchoolur/lightgallery)                       | lightgallery      |   3.0.0 | **GPL-3.0-only OR Commercial**          |
| [Lunr.js](https://github.com/olivernn/lunr.js)                                      | lunr              |   2.3.9 | MIT (see [Lunr](#lunr))                 |
| [Mapbox GL JS](https://github.com/mapbox/mapbox-gl-js)                              | mapbox-gl         |  3.35.2 | **Proprietary (Mapbox ToS)**            |
| [Mermaid](https://github.com/mermaid-js/mermaid)                                    | mermaid           |  12.3.0 | MIT                                     |
| [MetingJS](https://github.com/metowolf/MetingJS)                                    | meting            |   2.0.2 | MIT                                     |
| [modern-normalize](https://github.com/sindresorhus/modern-normalize)                | modern-normalize  |   3.0.1 | MIT                                     |
| [Pele](https://github.com/obsidianmd/pele)                                          | pele              |  1.13.0 | MIT                                     |
| [sharer.js](https://github.com/ellisonleao/sharer.js)                               | sharer            |   0.5.4 | MIT                                     |
| [Simple Icons](https://github.com/simple-icons/simple-icons)                        | simple-icons      | 16.38.0 | CC0-1.0                                 |
| [Twemoji](https://github.com/jdecked/twemoji)                                       | twemoji           |  17.0.3 | MIT AND CC-BY-4.0                       |
| [TypeIt](https://github.com/alexmacarthur/typeit)                                   | typeit            |   8.8.7 | **GPL-3.0-only OR Commercial**          |
| [Valine](https://github.com/xCss/Valine)                                            | valine            |   1.5.3 | **GPL-2.0-only**                        |
| [Waline](https://github.com/walinejs/waline)                                        | waline            |  3.16.2 | MIT                                     |

Licenses are SPDX identifiers taken from each library's published package and
the license header of the bundled file. LoveIt itself is MIT-licensed, but every
library keeps its own license. Rows in **bold** are not permissive; check them
before you enable the feature that loads them.

## Licenses to check

### TypeIt and lightGallery

Both are dual-licensed: GPL-3.0 or a paid commercial license.

- **TypeIt** loads when any `typeit` option is on or a page uses the `typeit`
  shortcode. The default config turns it on for the home page subtitle
  (`params.home.profile.typeit = true`). Its author offers a paid license for
  commercial projects that cannot meet the GPL-3.0 terms:
  <https://www.typeitjs.com/licenses>.
- **lightGallery** loads only when `params.page.lightgallery` (or the page's
  `lightgallery` front matter) is `true`. The default is `false`. Terms are in
  `lightgallery/LICENSE` and `lightgallery/LICENSE-COMMERCIAL.md`.

A site that cannot meet GPL-3.0 should buy a commercial license or turn these
features off. Turning a feature off only keeps its library out of the generated
site. The theme source still contains the library, so anyone who redistributes
that source must still follow the library's license.

### Valine

GPL-2.0-only. It loads only when the Valine comment system is enabled.

### Mapbox GL JS

Since v2.0, Mapbox GL JS is not open source. Its use is governed by the
[Mapbox Terms of Service](https://www.mapbox.com/legal/tos/) and needs a Mapbox
access token. It loads only on pages that use the `mapbox` shortcode. The
bundled `mapbox-gl-language.js` plugin is BSD-3-Clause.

### Lunr

`lunr.min.js` is MIT. The language files come from
[lunr-languages](https://github.com/MihaiValentin/lunr-languages) and are
MPL-1.1. Some of them have their own license:

| File                    | Source                                                                            | License      |
|:------------------------|:----------------------------------------------------------------------------------|:-------------|
| `lunr.*.js` (languages) | [lunr-languages](https://github.com/MihaiValentin/lunr-languages)                 | MPL-1.1      |
| `lunr.TinySegmenter.js` | [TinySegmenter](http://chasen.org/~taku/software/TinySegmenter/)                  | BSD-3-Clause |
| `lunr.segmentit.js`     | [segmentit](https://github.com/linonetwo/segmentit), compiled from `src/lib/lunr` | MIT          |
| `wordcut.js`            | [wordcut](https://github.com/veer66/wordcut)                                      | LGPL-3.0     |

`wordcut.js` is shipped but no template loads it.

### Font Awesome icons

The theme's own icons (header, footer, social links, post meta, share buttons,
admonitions, code blocks) are inlined into the HTML as SVG at build time. They
come from Font Awesome Free 7.3.1, the same release as the bundled webfonts, and
are copied unchanged to `fontawesome-free/svgs/` by `scripts/icons.mjs`, which
also writes `svgs/aliases.json` for legacy icon names. The icons are CC-BY-4.0:
every SVG file keeps Font Awesome's attribution comment, and this section is the
attribution for the inlined copies. The stylesheet and webfonts (OFL-1.1 and
MIT) still load on pages whose content uses Font Awesome classes or the
`:(fa…):` syntax. Simple Icons are inlined the same way and are CC0-1.0.

### Emoji images

These images are loaded from a CDN, not bundled, and have their own terms:

- Twemoji graphics (`params.page.twemoji`, Valine `twitter.yml`): CC-BY-4.0,
  which requires attribution.
- Valine emoji presets come from emoji-data's image sets. `google.yml` (the
  default) uses Noto images under Apache-2.0. emoji-data says Apple images
  "are not licensed for commercial usage" and Facebook images "have no clear
  licensing", so avoid `apple.yml` and `facebook.yml` on commercial sites.

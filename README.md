# LoveIt Theme | Hugo [![Netlify Status](https://api.netlify.com/api/v1/badges/e60303f2-862c-4342-bf59-7c9adb10812e/deploy-status)](https://app.netlify.com/sites/hugo-loveit/deploys)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/releases)
[![Hugo](https://img.shields.io/badge/Hugo-%5E0.62.0-ff4088?style=flat-square&logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/github/license/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)
[![CircleCI](https://img.shields.io/circleci/build/github/dillonzq/LoveIt/develop?label=CI&style=flat-square&logo=circleci)](https://app.circleci.com/pipelines/github/dillonzq/LoveIt)

English README | [简体中文说明](https://github.com/dillonzq/LoveIt/blob/master/README.zh-cn.md)

> **LoveIt** is a **clean**, **elegant** but **advanced** blog theme for [Hugo](https://gohugo.io/).

It is based on the original [LeaveIt Theme](https://github.com/liuzc/LeaveIt) and [KeepIt Theme](https://github.com/Fastbyte01/KeepIt).

Since the three themes have a similar look, if you have questions about their differences,
read [Why choose LoveIt](#why-choose-loveit) so that you can choose the one that works best for you.

![Hugo Theme LoveIt](https://github.com/dillonzq/LoveIt/raw/master/images/Apple-Devices-Preview.png)

## [Demo Site](https://hugoloveit.com/)

To see this theme in action, here is a live [demo site](https://hugoloveit.com/) which is rendered with **LoveIt** theme.

## Why choose LoveIt

Compared to the original LeaveIt theme and the KeepIt theme, the LoveIt theme has the following modifications.

* Custom **Header**
* Custom **CSS Style**
* A new **home page**, compatible with the latest version of Hugo
* A lot of **style detail adjustments,** including color, font size, margins, code preview style
* More readable **dark mode**
* Some beautiful **CSS animations**
* Easy-to-use and self-expanding **table of contents**
* More **social links**, **share sites** and **comment system**
* **Search** supported by [Lunr.js](https://lunrjs.com/) or [algolia](https://www.algolia.com/)
* **Copy code** to clipboard with one click
* Extended Markdown syntax for **[Font Awesome](https://fontawesome.com/) icons**
* Extended Markdown syntax for **ruby annotation**
* Extended Markdown syntax for **fraction**
* **Mathematical formula** supported by [KaTeX](https://katex.org/)
* **Diagram syntax** shortcode supported by [mermaid](https://github.com/knsv/mermaid)
* **Interactive data visualization** shortcode supported by [ECharts](https://echarts.apache.org/)
* **Mapbox** shortcode supported by [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* Embedded **music player** supported by [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS)
* **Bilibili** player supported
* Kinds of **admonitions** shortcode supported
* Custom style shortcodes supported
* **CDN** for all third-party libraries supported
* ...

In short,
if you prefer the design language and freedom of the LoveIt theme,
if you want to use the extended Font Awesome icons conveniently,
if you want to embed mathematical formulas, flowcharts, music or Bilibili videos in your posts,
the LoveIt theme may be more suitable for you.

I hope you will LoveIt ❤️!

## Features

### Performance and SEO

* Optimized for **performance**: 99/100 on mobile and 100/100 on desktop in [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights)
* Optimized SEO performance with a correct **SEO SCHEMA** based on JSON-LD
* **[Google Analytics](https://analytics.google.com/analytics)** supported
* **[Fathom Analytics](https://usefathom.com/)** supported
* Search engine **verification** supported (Google, Bind, Yandex and Baidu)
* **CDN** for third-party libraries supported
* Automatically converted images with **Lazy Load** by [lazysizes](https://github.com/aFarkas/lazysizes)

### Appearance and Layout

* **Responsive** layout
* **Light/Dark** mode
* Globally consistent **design language**
* **Pagination** supported
* Easy-to-use and self-expanding **table of contents**
* **Multilanguage** supported and i18n ready
* Beautiful **CSS animation**

### Social and Comment Systems

* **Gravatar** supported by [Gravatar](https://gravatar.com)
* Local **Avatar** supported
* Up to **64** social links supported
* Up to **28** share sites supported
* **Disqus** comment system supported by [Disqus](https://disqus.com)
* **Gitalk** comment system supported by [Gitalk](https://github.com/gitalk/gitalk)
* **Valine** comment system supported by [Valine](https://valine.js.org/)
* **Facebook comments** system supported by [Facebook](https://developers.facebook.com/docs/plugins/comments/)
* **Telegram comments** system supported by [Telegram Comments](https://comments.app/)
* **Commento** comment system supported by [Commento](https://commento.io/)
* **Utterances** comment system supported by [Utterances](https://utteranc.es/)

### Extended Features

* **Search** supported by [Lunr.js](https://lunrjs.com/) or [algolia](https://www.algolia.com/)
* **Twemoji** supported
* Automatically **highlighting** code
* **Copy code** to clipboard with one click
* **Images gallery** supported by [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js)
* Extended Markdown syntax for **[Font Awesome](https://fontawesome.com/) icons**
* Extended Markdown syntax for **ruby annotation**
* Extended Markdown syntax for **fraction**
* **Mathematical formula** supported by [KaTeX](https://katex.org/)
* **Diagrams** shortcode supported by [mermaid](https://github.com/knsv/mermaid)
* **Interactive data visualization** shortcode supported by [ECharts](https://echarts.apache.org/)
* **Mapbox** shortcode supported by [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* **Music player** shortcode supported by [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS)
* **Bilibili player** shortcode
* Kinds of **admonitions** shortcode
* **Custom style** shortcode
* **Custom script** shortcode
* **Animated typing** supported by [TypeIt](https://typeitjs.com/)
* **Dynamic scroll** supported by [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* **Cookie consent banner** supported by [cookieconsent](https://github.com/osano/cookieconsent)
* ...

## [Documentation](https://hugoloveit.com/categories/documentation/)

Build Documentation Locally:

```bash
hugo server --source=exampleSite
```

## Multilingual and i18n

LoveIt supports the following languages:

* English
* Simplified Chinese
* French
* Polish
* Brazilian Portuguese
* Italian
* Spanish
* German
* Serbian
* Russian
* Romanian
* Vietnamese
* [Contribute with a new language](https://github.com/dillonzq/LoveIt/pulls)

[Languages Compatibility](https://hugoloveit.com/theme-documentation-basics/#language-compatibility)

## [Roadmap](https://github.com/dillonzq/LoveIt/projects/1)

## Questions, ideas, bugs, pull requests

All feedback is welcome! Head over to the [issue tracker](https://github.com/dillonzq/LoveIt/issues).

## License

LoveIt is licensed under the **MIT** license. Check the [LICENSE file](https://github.com/dillonzq/LoveIt/blob/master/LICENSE) for details.

Thanks to the authors of following resources included in the theme:

* [normalize.css](https://github.com/necolas/normalize.css)
* [Font Awesome](https://fontawesome.com/)
* [Simple Icons](https://github.com/simple-icons/simple-icons)
* [Animate.css](https://daneden.github.io/animate.css/)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [autocomplete.js](https://github.com/algolia/autocomplete.js)
* [Lunr.js](https://lunrjs.com/)
* [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript)
* [lazysizes](https://github.com/aFarkas/lazysizes)
* [object-fit-images](https://github.com/fregante/object-fit-images)
* [Twemoji](https://github.com/twitter/twemoji)
* [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js)
* [clipboard.js](https://github.com/zenorocha/clipboard.js)
* [Sharer.js](https://github.com/ellisonleao/sharer.js)
* [TypeIt](https://typeitjs.com/)
* [KaTeX](https://katex.org/)
* [mermaid](https://github.com/knsv/mermaid)
* [ECharts](https://echarts.apache.org/)
* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* [APlayer](https://github.com/MoePlayer/APlayer)
* [MetingJS](https://github.com/metowolf/MetingJS)
* [Gitalk](https://github.com/gitalk/gitalk)
* [Valine](https://valine.js.org/)
* [cookieconsent](https://github.com/osano/cookieconsent)

## Author

[Dillon](https://dillonzq.com)

## Sponsor

If you enjoy the theme, please consider buying me a coffee ☕️.

* [PayPal](https://paypal.me/dillonzq)
* [Alipay](https://github.com/dillonzq/LoveIt/raw/master/images/Alipay.jpg)
* [Wechat](https://github.com/dillonzq/LoveIt/raw/master/images/Wechat.jpg)

Thanks! ❤️

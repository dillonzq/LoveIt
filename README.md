# LoveIt Theme | Hugo

[![Netlify Status](https://api.netlify.com/api/v1/badges/e60303f2-862c-4342-bf59-7c9adb10812e/deploy-status)](https://app.netlify.com/sites/hugo-loveit-en/deploys)

English README | [中文说明](README.zh.md)

**LoveIt** is a **clean**, **elegant** but **advanced** blog theme for [Hugo](https://gohugo.io/).

It is based on the original [LeaveIt Theme](https://github.com/liuzc/LeaveIt/) and [KeepIt Theme](https://github.com/liuzc/LeaveIt/).

Since the three themes have a similar look, if you have questions about their differences,
read [Why choose LoveIt](#why-choose-loveit) so that you can choose the one that works best for you.

![Hugo Theme LoveIt](images/Apple-Devices-Preview.png)

## [Demo Site](https://hugo-loveit-en.netlify.com)

To see this theme in action, here is a live [demo site](https://hugo-loveit-en.netlify.com) which is rendered with **LoveIt** theme.

## Why choose LoveIt

Compared to the original LeaveIt theme and the KeepIt theme, the LoveIt theme has the following modifications.

* Fixed title bar
* System native fonts
* Home subtitles typewriter effect
* A new list of home posts, compatible with the latest version of Hugo
* Replace all theme icons with [Font Awesome](https://fontawesome.com/)
* A lot of style detail adjustments, including color, font size, margins, code preview style
* More readable dark mode
* Some beautiful CSS animations
* Easy-to-use and self-expanding article catalog, while adapting to the mobile side
* More suitable as a blog theme, the gallery function has been removed, but the image is lazy loaded to improve performance
* Extended markdown syntax for [Font Awesome](https://fontawesome.com/) icons
* Math formula support by [Katex](https://katex.org/)
* Diagram syntax shortcode support by [mermaid](https://github.com/knsv/mermaid)
* Embedded music player support by [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS)
* Bilibili player support
* Kinds of admonitions shortcode support
* Custom align and float style shortcodes support
* CDN for all third-party libraries support

In short,
if you prefer the design language and freedom of the LoveIt theme,
if you want to use the extended Font Awesome icons conveniently,
if you want to embed math formulas, flowcharts, music or Bilibili videos in your posts,
the LoveIt theme may be more suitable for you.

I hope you will LoveIt ❤️!

## Features

### Performance and SEO

* Optimized for performance: 99/100 on mobile and 100/100 on desktop in [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights)
* Optimized SEO performance with a correct SEO SCHEMA based on JSON-LD
* [Google Analytics](https://analytics.google.com/analytics) support
* Search engine verification support (Google, Bind, Yandex and Baidu)
* CDN for all third-party libraries support
* Automatically converted images with Lazy Load by [lazysizes](https://github.com/aFarkas/lazysizes)

### Appearance and Layout

* Desktops/Mobiles Responsive layout
* Dark/Light Mode
* A More coerent style beetwen page and sections
* Pagination support
* Easy-to-use and self-expanding article catalog, while adapting to the mobile side
* Multilanguage support and I18N ready
* Beautiful CSS animation

### Social and Comment Systems

* Gravatar support by [Gravatar](https://gravatar.com)
* Local Avatar support
* Up to 54 social sites supported
* Share post support
* Disqus comment system support by [Disqus](https://disqus.com)
* Gitalk comment system support by [Gitalk](https://github.com/gitalk/gitalk)
* Valine comment system support by [Valine](https://valine.js.org/)

### Extended Features

* Automatically highlighting code by chroma in Hugo
* Extended markdown syntax for [Font Awesome](https://fontawesome.com/) icons
* Math formula support by [Katex](https://katex.org/)
* Diagram syntax shortcode support by [mermaid](https://github.com/knsv/mermaid)
* Embedded music player support by [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS)
* Bilibili player support
* Kinds of admonitions shortcode support
* Custom align and float style shortcodes support
* Animated typing support by [TypeIt](https://typeitjs.com/)
* Animated coutdown support by [jQuery.countdown](https://github.com/hilios/jQuery.countdown)
* Dynamic to top support by [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* ...

## Getting Started

Clone this repository to your hugo theme directory.

```bash
  cd themes
  git clone https://github.com/dillonzq/LoveIt.git
```

Or, make this repository a submodule of your site directory.

```bash
  git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt
```

Next, open `config.toml` in the base of the Hugo site and ensure the theme option is set to KeepIt:

```bash
  theme = "LoveIt"
```

For more information read the [official setup guide](https://gohugo.io/documentation/) of Hugo.

## Site Configuration

Take a look in the `exampleSite` folder.

This directory contains an example config file and the content for the demo for `en` and `zh` languages.
It serves as an example setup for your website.

Copy the `config.toml` to the root directory of your website. Overwrite the existing config file if necessary.

## Content Suggestions

A few suggestions to help you get a good looking site quickly:

* Keep blog posts in the `content/posts` directory, for example: `content/posts/my-first-post.md`
* Keep static pages in the `content` directory, for example: `content/about.md`
* Keep media like images in the `static` directory, for example: `static/images/2019/9/screenshot.png`

## Customizing styles for your website

If you want to change some styling to fit your own website needs, you can edit them:

* `assets/css/_varibales.scss`: You can override the variables in `_variables.scss` to customize the style
* `assets/css/_custom.scss`: You can put your custom css in this file

## Favicons, Browserconfig, Manifest

It is recommended to put your own favicons

* apple-touch-icon.png (180x180)
* favicon-32x32.png (32x32)
* favicon-16x16.png (16x16)
* mstile-150x150.png (150x150)
* android-chrome-192x192.png (192x192)
* android-chrome-512x512.png (512x512)

into `/static`. They’re easily created via [https://realfavicongenerator.net/](https://realfavicongenerator.net/).

Customize `browserconfig.xml` and `site.webmanifest` to set theme-color and background-color.

## Tips

### Set `production` environment when generating site

Because some features are only in production mode, so you need to add a `production` environment variables when generating your site.

```bash
  HUGO_ENV=production hugo --gc --minify
```

### How to toggle dark-light mode

* You can click the circle icon to toggle dark-light mode. In the desktop version the circle icon is to the right and in the mobile version is positioned to the left, close to the site title.
* If you want to make your own theme toggle-able element, you can create an element with a class `.theme-switch`. See [here](https://github.com/dillonzq/LoveIt/blob/master/assets/js/blog.js#L14)

### Home Post model

If you want to show posts on index instead of a personal profile, just open `config.toml`, add the following line:

```toml
  [params]
    home_mode = "post"
```

### Add logo and cover for SEO

Add a logo image (127x40) and a cover image (800x600) in the `static` directory.

## Questions, ideas, bugs, pull requests

All feedback is welcome! Head over to the [issue tracker](https://github.com/dillonzq/LoveIt/issues).

## License

LoveIt is licensed under the MIT license. Check the [LICENSE file](https://github.com/dillonzq/LoveIt/blob/master/LICENSE) for details.

Thanks to the authors of following resources included in the theme:

* [Font Awesome](https://fontawesome.com/)
* [Animate.css](https://daneden.github.io/animate.css/)
* [lazysizes](https://github.com/aFarkas/lazysizes)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [TypeIt](https://typeitjs.com/)
* [jQuery](https://github.com/jquery/jquery)
* [jQuery.countdown](https://github.com/hilios/jQuery.countdown)
* [Katex](https://katex.org/)
* [mermaid](https://github.com/knsv/mermaid)
* [APlayer](https://github.com/MoePlayer/APlayer)
* [MetingJS](https://github.com/metowolf/MetingJS)
* [Gitalk](https://github.com/gitalk/gitalk)
* [Valine](https://valine.js.org/)

## Author

[Dillon](https://dillonzq.com)

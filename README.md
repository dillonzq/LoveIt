KeepIt Hugo Theme
========================

KeepIt is a clean, elegant, simple but not simpler blog theme for Hugo based on the original [LeaveIt Theme](https://raw.githubusercontent.com/liuzc/LeaveIt/) developed by [LiuZhichao](https://raw.githubusercontent.com/liuzc/).

![hugo-theme-KeepIt](https://github.com/Fastbyte01/KeepIt/blob/master/images/screenshot.png)

# Demo
To see this theme in action,  Here is a live [demo site](https://suspicious-archimedes-ab369d.netlify.com) which is rendered with this theme.

People that are using **KeepIt**:

* [PapEr](https://page.codespaper.com)
* [SilkeHenderickx](http://www.silkehenderickx.be)

# Features

* Optimized for performance: 99/100 on mobile and 100/100 on desktop in Google PageSpeed Insights
* Optimized SEO performance with a correct SEO SCHEMA based on JSON-LD
* A More coerent style beetwen page and sections
* Multilanguage support
* Pagination support
* Google Analytics support
* Disqus Comment System
* Gitalk Comment System
* Gravatar Support
* Local Avatar Support
* Share post support
* Search engine verification support (Google, Bind, Yandex and Baidu)
* Added configuration file for use on [Netlify](https://www.netlify.com)
* Dark/Light mode
* Up to 54 social sites supported out-of-the-box [see the list here](https://github.com/Fastbyte01/KeepIt/wiki/List-of-social-platforms-supported-out-of-box)
* Translation ready
* Wrap Image with Figure Tag without Shortcode. Thanks [Junian.Net](https://www.junian.net/hugo-image-figure-wrap/)
* Load images with Lazy Load By [lazysizes](https://github.com/aFarkas/lazysizes)
* Automatically highlighting code By [Google code-prettify](https://github.com/google/code-prettify), Customizable styles via CSS. See the [themes gallery](https://rawgit.com/google/code-prettify/master/styles/index.html).
* Automagical image gallery with [lightGallery](https://github.com/sachinchoolur/lightGallery)
* ...

# Getting Started
Clone this repository to your hugo theme directory.

```bash
cd themes
git clone https://github.com/Fastbyte01/KeepIt.git
```

Next, open config.toml in the base of the Hugo site and ensure the theme option is set to KeepIt:
```bash
theme = "KeepIt"
```
For more information read the [official setup guide](https://gohugo.io/documentation/) of Hugo.

# Site Configuration
Take a look in the `exampleSite` folder.

This directory contains an example config file and the content for the demo. It serves as an example setup for your documentation.

Copy the `config.toml` in the root directory of your website. Overwrite the existing config file if necessary.

# Content Suggestions

A few suggestions to help you get a good looking site quickly:

* Keep blog posts in the content/posts directory, for example: content/posts/my-first-post.md
* Keep static pages in the content directory, for example: content/about.md
* Keep media like images in the static directory, for example: static/images/2019/10/screenshot.png

# Customizing styles for your website

If you want to change some styling to fit your own website needs, you can edit them:

* `assets/css/_varibales/default.scss`:  You can override the variables in `_variables.scss` to customize the style
* `assets/css/_custom.scss` :  You can put your custom css in this file

# Favicons, Browserconfig, Manifest

It is recommended to put your own favicons

* apple-touch-icon.png (180x180)
* favicon-32x32.png (32x32)
* favicon-16x16.png (16x16)
* mstile-150x150.png (150x150)
* android-chrome-192x192.png (192x192)
* android-chrome-512x512.png (512x512)

into `/static`. They’re easily created via https://realfavicongenerator.net/.

Customize browserconfig.xml and site.webmanifest to set theme-color and background-color for example.

# Tips

#### Set production environment when generating site

Because some functions are only in production mode, So you **need to add a production** environment variables when generating your site.
```bash
HUGO_ENV=production hugo --gc --minify
```

#### Hugo “extended” Sass/SCSS version required

This theme write style with scss, So you must download and install the “extended” Sass/SCSS version

#### How to toggle dark-light mode
* You can click the sun logo to toggle dark-light mode. In the desktop version the sun logo is to the right and in the mobile version is positioned to the left, close to the site title.
* If you want to make your own theme toggle-able element, you can create an element with a class `.theme-switch`. See [here](https://github.com/Fastbyte01/KeepIt/blob/master/assets/js/main.js#L32)

# Home Post model
If you want to show posts on index instead of a personal profile, just open config.toml in the base of the Hugo site, add the following line to config.toml
```toml
[params]
 home_mode = "post" # post or other
```
# Add logo and cover for SEO

Add a logo image (127x40) and a cover image (800x600). This images are used for SEO.

# Questions, ideas, bugs, pull requests?
All feedback is welcome! Head over to the [issue tracker](https://github.com/Fastbyte01/KeepIt/issues).

For more configuration info or other tips you can see the [wiki](https://github.com/Fastbyte01/KeepIt/wiki).

# License
LeaveIt is licensed under the MIT license. Check the LICENSE file for details.
The following resources are included in the theme:

* lazysizes - https://github.com/aFarkas/lazysizes
* lightGallery - https://github.com/sachinchoolur/lightGallery
* code-prettify - https://github.com/google/code-prettify

# Author
[Fastbyte01](https://github.com/Fastbyte01)

# See Also

* [Hermitt](https://github.com/Track3/hermit)
* [Goa](https://github.com/shenoybr/hugo-goa)

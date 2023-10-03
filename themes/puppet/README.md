# Hugo Theme Puppet

[![Netlify Status](https://api.netlify.com/api/v1/badges/275ce227-7872-4314-8b54-5499ba237c18/deploy-status)](https://app.netlify.com/sites/hugo-theme-puppet/deploys)

> Ported Theme of [Hux Blog](https://github.com/Huxpro/huxpro.github.io), Thank [Huxpro](https://github.com/Huxpro) for designing such a flawless theme.

[Demo](https://hugo-theme-puppet.netlify.app/)

## Screenshot

![Home](https://raw.githubusercontent.com/roninro/hugo-theme-puppet/master/images/screenshot.png)

## Features

- [x] Responsive
- [x] SEO
- [x] Table of Contents
- [x] Image Zoom
- [x] Syntax Highlighting
- [x] Search
- [x] Comments
- [x] Google Analytics
- [x] Custom CSS and JS
- [x] Custom 404 Page
- [x] Custom Favicon
- [x] Custom Social Icons


## Installation

```bash
$ git clone https://github.com/roninro/hugo-theme-puppet.git themes/puppet
```

## Configuration

Take a look inside the [exampleSite](exampleSite) folder of this theme. You'll find a file called [config.toml](exampleSite/config.toml). 
To use it, copy the [config.toml](exampleSite/config.toml) in the root directory of your website. Overwrite the existing config file if necessary.

## Content

### Archive Page

add `archive/_index.md` to your `content` folder. This file will be used as the archive page.

### About Page

like the archive page, add `about/_index.md` to your `content` folder.


## Social Icons

The default data of social links is located in [social.toml](assets/data/social.toml)

You can directly set your `id` to get a default social link icon

```toml
[params.social]
mastodon = "@xxxxx"
```
Or You can set more options through a dict:

```toml
[params.social.mastodon]
weight = 56
icon = "fab fa-mastodon"
format = "https://mastodon.social/%v"
id = "johndoe"
url = ""
```

## License

[Apache](LICENSE)

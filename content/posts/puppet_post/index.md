---
author: "Marc Cubells"
title: "Puppet - Getting Started"
subtitle: "Discover the power of the HUGO theme Puppet"
description: "Discover the power of the HUGO theme Puppet"
date: "2023-01-25"

tags: ["development"]
header_img: "img/llm_post_header.png"
toc: true
series: ["Themes Guide"]
comment: true

draft: false
---

Puppet is a responsive, simple and clean [Hugo](https://gohugo.io/) theme based on the [Huxblog Jekyll theme](https://github.com/Huxpro/huxpro.github.io). 

<!--more-->

## Install Hugo

Make sure you have installed the latest version of [Hugo-extented](https://gohugo.io/getting-started/installing/).

## Create a New Site

```
hugo new site mysite
```

## Add the Theme

You can download and unpack the theme manually from Github or use git to clone the theme into your site's `themes` directory.

```bash
cd mysite
git init
git clone https://github.com/roninro/hugo-theme-puppet.git themes/puppet
```

Or you can add the theme as a submodule.

```bash
cd mysite
git init
git submodule add https://github.com/roninro/hugo-theme-puppet.git themes/puppet
git submodule update --init --recursive
```

That’s all, Puppet is ready to be used.


## Add Config Files

For getting started, you can copy the `config.toml` file from the theme's exampleSite directory to the root directory of your site.

```bash
cp themes/puppet/exampleSite/config.toml .
```

> Note: You may need to delete the `themesDir` line in the config file.

## Add Some Content

Create a new post with the following command.

```bash
hugo new posts/my-first-post.md
```

Edit the content of the post.

```markdown
+++
title = "{{ replace .Name "-" " " | title }}"
date = {{ .Date }}
description = ""
draft = true
subtitle = ""
header_img = ""
toc = true
tags = []
categories = []
series = []
comment = true
+++

Your content here...
```

Some front-matter used for SEO, others used for displaying contents, configuration, etc.

## Run example site

From the root of themes/puppet/exampleSite:

```bash
hugo server --themesDir ../..
```

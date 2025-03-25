---
weight: 4
title: "Theme Documentation - Extended Shortcodes"
date: 2020-03-03T16:29:41+08:00
lastmod: 2020-06-12T10:10:13+03:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "LoveIt theme provides multiple shortcodes on top of built-in ones in Hugo."
images: []
resources:
- name: "featured-image"
  src: "featured-image.jpg"
- name: "featured-image-preview"
  src: "featured-image-preview.jpg"

tags: ["shortcodes"]
categories: ["documentation"]

lightgallery: true

math:
  enable: true
---

**LoveIt** theme provides multiple shortcodes on top of built-in ones in Hugo.

<!--more-->

## 1 style

{{< version 0.2.0 changed >}}

{{< admonition >}}
Hugo **extended** version is necessary for `style` shortcode.
{{< /admonition >}}

`style` is a shortcode to insert custom style in your post.

The `style` shortcode has two positional parameters.

The **first** one is the custom style content,
which supports nesting syntax in [:(fab fa-sass fa-fw): SASS](https://sass-lang.com/documentation/style-rules/declarations#nesting)
and `&` referring to this parent HTML element.

And the **second** one is the tag name of the HTML element wrapping the content you want to change style, and whose default value is `div`.

Example `style` input:

```markdown
{{</* style "text-align:right; strong{color:#00b1ff;}" */>}}
This is a **right-aligned** paragraph.
{{</* /style */>}}
```

The rendered output looks like this:

{{< style "text-align:right; strong{color:#00b1ff;}" >}}
This is a **right-aligned** paragraph.
{{< /style >}}

## 2 link

{{< version 0.2.0 >}}

`link` shortcode is an alternative to [Markdown link syntax](../basic-markdown-syntax#links). `link` shortcode can provide some other features and can be used in code blocks.

{{< version 0.2.10 >}} The complete usage of [local resource references](../theme-documentation-content#contents-organization) is supported.

The `link` shortcode has the following named parameters:

* **href** *[required]* (**first** positional parameter)

    Destination of the link.

* **content** *[optional]* (**second** positional parameter)

    Content of the link, default value is the value of **href** parameter.

    *Markdown or HTML format is supported.*

* **title** *[optional]* (**third** positional parameter)

    `title` attribute of the HTML `a` tag, which will be shown when hovering on the link.

* **class** *[optional]*

    `class` attribute of the HTML `a` tag.

* **rel** *[optional]*

    Additional `rel` attributes of the HTML `a` tag.

Example `link` input:

```markdown
{{</* link "https://assemble.io" */>}}
Or
{{</* link href="https://assemble.io" */>}}

{{</* link "mailto:contact@revolunet.com" */>}}
Or
{{</* link href="mailto:contact@revolunet.com" */>}}

{{</* link "https://assemble.io" Assemble */>}}
Or
{{</* link href="https://assemble.io" content=Assemble */>}}
```

The rendered output looks like this:

* {{< link "https://assemble.io" >}}
* {{< link "mailto:contact@revolunet.com" >}}
* {{< link "https://assemble.io" Assemble >}}

Example `link` input with a title:

```markdown
{{</* link "https://github.com/upstage/" Upstage "Visit Upstage!" */>}}
Or
{{</* link href="https://github.com/upstage/" content=Upstage title="Visit Upstage!" */>}}
```

The rendered output looks like this (hover over the link, there should be a tooltip):

{{< link "https://github.com/upstage/" Upstage "Visit Upstage!" >}}

## 3 image {#image}

{{< version 0.2.0 changed >}}

`image` shortcode is an alternative to [`figure` shortcode](../theme-documentation-built-in-shortcodes#figure). `image` shortcode can take full advantage of the dependent libraries of [lazysizes](https://github.com/aFarkas/lazysizes) and [lightGallery](https://github.com/sachinchoolur/lightgallery).

{{< version 0.2.10 >}} The complete usage of [local resource references](../theme-documentation-content#contents-organization) is supported.

The `image` shortcode has the following named parameters:

* **src** *[required]* (**first** positional parameter)

    URL of the image to be displayed.

* **alt** *[optional]* (**second** positional parameter)

    Alternate text for the image if the image cannot be displayed, default value is the value of **src** parameter.

    *Markdown or HTML format is supported.*

* **caption** *[optional]* (**third** positional parameter)

    Image caption.

    *Markdown or HTML format is supported.*

* **title** *[optional]*

    Image title that will be shown when hovering on the image.

* **class** *[optional]*

    `class` attribute of the HTML `figure` tag.

* **src_s** *[optional]*

    URL of the image thumbnail, used for lightgallery, default value is the value of **src** parameter.

* **src_l** *[optional]*

    URL of the HD image, used for lightgallery, default value is the value of **src** parameter.

* **height** *[optional]*

    `height` attribute of the image.

* **width** *[optional]*

    `width` attribute of the image.

* **linked** *[optional]*

    Whether the image needs to be hyperlinked, default value is `true`.

* **rel** *[optional]*

    Additional `rel` attributes of the HTML `a` tag, if **linked** parameter is set to `true`.

Example `image` input:

```markdown
{{</* image src="/images/lighthouse.jpg" caption="Lighthouse (`image`)" src_s="/images/lighthouse-small.jpg" src_l="/images/lighthouse-large.jpg" */>}}
```

The rendered output looks like this:

{{< image src="/images/lighthouse.jpg" caption="Lighthouse (`image`)" src_s="/images/lighthouse-small.jpg" src_l="/images/lighthouse-large.jpg" >}}

## 4 admonition

The `admonition` shortcode supports **12** types of banners to help you put notice in your page.

*Markdown or HTML format in the content is supported.*

{{< admonition >}}
A **note** banner
{{< /admonition >}}

{{< admonition abstract >}}
An **abstract** banner
{{< /admonition >}}

{{< admonition info >}}
A **info** banner
{{< /admonition >}}

{{< admonition tip >}}
A **tip** banner
{{< /admonition >}}

{{< admonition success >}}
A **success** banner
{{< /admonition >}}

{{< admonition question >}}
A **question** banner
{{< /admonition >}}

{{< admonition warning >}}
A **warning** banner
{{< /admonition >}}

{{< admonition failure >}}
A **failure** banner
{{< /admonition >}}

{{< admonition danger >}}
A **danger** banner
{{< /admonition >}}

{{< admonition bug >}}
A **bug** banner
{{< /admonition >}}

{{< admonition example >}}
An **example** banner
{{< /admonition >}}

{{< admonition quote >}}
A **quote** banner
{{< /admonition >}}

The `admonition` shortcode has the following named parameters:

* **type** *[optional]* (**first** positional parameter)

    Type of the `admonition` banner, default value is `note`.

* **title** *[optional]* (**second** positional parameter)

    Title of the `admonition` banner, default value is the value of **type** parameter.

* **open** *[optional]* (**third** positional parameter) {{< version 0.2.0 changed >}}

    Whether the content will be expandable by default, default value is `true`.

Example `admonition` input:

```markdown
{{</* admonition type=tip title="This is a tip" open=false */>}}
A **tip** banner
{{</* /admonition */>}}
Or
{{</* admonition tip "This is a tip" false */>}}
A **tip** banner
{{</* /admonition */>}}
```

The rendered output looks like this:

{{< admonition tip "This is a tip" false >}}
A **tip** banner
{{< /admonition >}}

## 5 mermaid

The `mermaid` shortcode supports diagrams in Hugo with [Mermaid](https://mermaidjs.github.io/) library.

The full documentation is provided in [Theme Documentation - mermaid Shortcode](../theme-documentation-mermaid-shortcode).

## 6 echarts

The `echarts` shortcode supports data visualization in Hugo with [ECharts](https://echarts.apache.org/) library.

The full documentation is provided in [Theme Documentation - echarts Shortcode](../theme-documentation-echarts-shortcode).

## 7 mapbox

{{< version 0.2.0 >}}

The `mapbox` shortcode supports interactive maps in Hugo with [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) library.

The full documentation is provided in [Theme Documentation - mapbox Shortcode](../theme-documentation-mapbox-shortcode).

## 8 music

The `music` shortcode embeds a responsive music player based on [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS) library.

The full documentation is provided in [Theme Documentation - music Shortcode](../theme-documentation-music-shortcode).

## 9 bilibili

{{< version 0.2.0 changed >}}

The `bilibili` shortcode embeds a responsive video player for bilibili videos.

The full documentation is provided in [Theme Documentation - bilibili Shortcode](../theme-documentation-bilibili-shortcode).

## 10 typeit

The `typeit` shortcode provides typing animation based on [TypeIt](https://typeitjs.com/) library.

The full documentation is provided in [Theme Documentation - typeit Shortcode](../theme-documentation-typeit-shortcode).

## 11 script

{{< version 0.2.8 >}}

`script` is a shortcode to insert custom **:(fab fa-js fa-fw): Javascript** in your post.

{{< admonition >}}
The script content can be guaranteed to be executed in order after all third-party libraries are loaded. So you are free to use third-party libraries.
{{< /admonition >}}

Example `script` input:

```markdown
{{</* script */>}}
console.log('Hello LoveIt!');
{{</* /script */>}}
```

You can see the output in the console of the developer tool.

{{< script >}}
console.log('Hello LoveIt!');
{{< /script >}}

## 12 raw

{{< version 0.2.11 >}}

`raw` is a shortcode to insert raw **:(fab fa-html5 fa-fw): HTML** content in your post.
This is useful when you want to include some Markdown content to **avoid being rendered or escaped** by Hugo.

Example `raw` input:

```markdown
Inline Formula: {{</* raw */>}}\(\mathbf{E}=\sum_{i} \mathbf{E}_{i}=\mathbf{E}_{1}+\mathbf{E}_{2}+\mathbf{E}_{3}+\cdots\){{</* /raw */>}}

Block Formula:

{{</* raw */>}}
\[ a=b+c \\ d+e=f \]
{{</* /raw */>}}

Raw content using Markdown syntax: {{</* raw */>}}**Hello**{{</* /raw */>}}
```

The rendered output looks like this:

Inline Formula: {{< raw >}}\(\mathbf{E}=\sum_{i} \mathbf{E}_{i}=\mathbf{E}_{1}+\mathbf{E}_{2}+\mathbf{E}_{3}+\cdots\){{< /raw >}}

Block Formula:

{{< raw>}}
\[ a=b+c \\ d+e=f \]
{{< /raw >}}

Raw content using Markdown syntax: {{< raw >}}**Hello**{{< /raw >}}

## 13 person

`person` is a shortcode to insert a link to a personal webpage marked up as [h-card](https://microformats.org/wiki/h-card).

The `person` shortcode has the following named parameters:

* **url** *[required]* (**first** positional parameter)

    URL of the personal page.

* **name** *[required]* (**second** positional parameter)

    Name of the person.

* **text** *[optional]* (**third** positional parameter)

    Text to display as hover tooltip of the link.

* **picture** *[optional]* (**fourth** positional parameter)

    A picture to use as person's avatar.

* **nick** *[optional]*

    Nickame of the person.

Example `person` input:

```markdown
{{</* person url="https://evgenykuznetsov.org" name="Evgeny Kuznetsov" nick="nekr0z" text="author of this shortcode" picture="https://evgenykuznetsov.org/img/avatar.jpg" */>}}
```

This renders as {{< person url="https://evgenykuznetsov.org" name="Evgeny Kuznetsov" nick="nekr0z" text="author of this shortcode" picture="https://evgenykuznetsov.org/img/avatar.jpg" >}}.

Without an explicitly given picture, a generic icon is used. This input:

```markdown
{{</* person "https://dillonzq.com/" Dillon "author of the LoveIt theme" */>}}
```

This renders as {{< person "https://dillonzq.com/" Dillon "author of the LoveIt theme" >}}.

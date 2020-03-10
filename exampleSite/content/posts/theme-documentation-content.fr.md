---
weight: 2
title: "Thème Documentation - Contenu"
date: 2020-03-05T16:30:05+08:00
lastmod: 2020-03-05T16:30:05+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "Découvrez comment créer et organiser votre contenu rapidement et intuitivement dans le thème LoveIt."
license: ""

tags: ["contenu", "markdown"]
categories: ["documentation"]
hiddenFromHomePage: false

featuredImage: "/images/theme-documentation-content/featured-image.jpg"
featuredImagePreview: ""

toc: true
autoCollapseToc: false
math: true
lightgallery: true
linkToMarkdown: true
share:
  enable: true
comment: true
---

Découvrez comment créer et organiser votre contenu rapidement et intuitivement dans le thème **LoveIt**.

<!--more-->

{{< admonition warning >}}
Sorry, this article has not been completely translated into **French**.
Welcome to take the time to propose a translation by [making a PR](https://github.com/dillonzq/LoveIt/pulls) to the theme!
{{< /admonition >}}

## 1 Contents Organization

A few suggestions to help you get a good looking site quickly:

* Keep post pages in the `content/posts` directory, for example: `content/posts/my-first-post.md`
* Keep static pages in the `content` directory, for example: `content/about.md`
* Keep media like images in the `static` directory, for example: `static/images/screenshot.png`

## 2 Front Matter

**Hugo** allows you to add front matter in `yaml`, `toml` or `json` to your content files.

Here is a default front matter from the default archetype:

```yaml
---
title: "My First Post"
date: 2020-03-04T15:58:26+08:00
lastmod: 2020-03-04T15:58:26+08:00
draft: true
author: ""
authorLink: ""
description: ""
license: ""

tags: []
categories: []
hiddenFromHomePage: false

featuredImage: ""
featuredImagePreview: ""

toc: false
autoCollapseToc: true
math: true
lightgallery: true
linkToMarkdown: true
share:
  enable: true
comment: true
---
```

* **title**: the title for the content.
* **date**: the datetime assigned to this page, which is usually fetched from the `date` field in front matter, but this behaviour is configurabl in the [site configuration](../theme-documentation-basics/#site-configuration).
* **lastmod**: the datetime at which the content was last modified.
* **draft**: if `true`, the content will not be rendered unless the `--buildDrafts`/`-D` flag is passed to the `hugo` command.
* **author**: the author for the content.
* **authorLink**: the link of the author.
* **description**: the description for the content.
* **license**: the special lisence for this content.
* **tags**: the tags for the content.
* **categories**: the categories for the content.
* **hiddenFromHomePage**: if `true`, the content will not be shown in the home page, but this behaviour is configurabl in the [site configuration](../theme-documentation-basics/#site-configuration).
* **featuredImage**: the featured image for the content.
* **featuredImagePreview**: the featured image for the content preview in the home page.
* **toc**: if `true`, the content will show the table of the contents.
* **autoCollapseToc**: if `true`, the table of the contents will be automatically collapsed.
* **math**: if `true`, the mathematical formula in the content will be automatically rendered.
* **lightgallery**: if `true`, images in the content will be shown as the gallery.
* **linkToMarkdown**: if `true`, the footer of the content will show the link to the orignal Markdown file.
* **share**: the same as `params.share` in the [site configuration](../theme-documentation-basics/#site-configuration).
* **comment**: if `true`, the comment will be used.

## 3 Content Summaries

**LoveIt** theme uses the summary of the content to display abstract information in the home page. Hugo can generate summaries of your content.

![Summary Preview](/images/theme-documentation-content/summary.jpg "Summary Preview")

### Automatic Summary Splitting

By default, Hugo automatically takes the first 70 words of your content as its summary.

You may customize the summary length by setting `summaryLength` in the [site configuration](../theme-documentation-basics/#site-configuration).

If you are creating content in a [CJK]^(Chinese/Japanese/Korean) language and want to use Hugo’s automatic summary splitting, set `hasCJKLanguage` to `true` in your [site configuration](../theme-documentation-basics/#site-configuration).

### Manual Summary Splitting

Alternatively, you may add the `<!--more-->` summary divider where you want to split the article.

Content that comes before the summary divider will be used as that content’s summary.

{{< admonition >}}
Be careful to enter `<!--more-->` exactly; i.e., all lowercase and with no whitespace.
{{< /admonition >}}

### Front Matter Summary

You might want your summary to be something other than the text that starts the article. In this case you can provide a separate summary in the `summary` variable of the article front matter.

### Use Description as Summary

You might want your description in the `description` variable of the article front matter as the summary.

You may add the `<!--more-->` summary divider at the start of the article. Keep content that comes before the summary divider empty. Then **LoveIt** theme will use your description as the summary.

### Priority Order of Summary Selection

Because there are multiple ways in which a summary can be specified it is useful to understand the order. It is as follows:

1. If there is a `<!--more-->` summary divider present in the article but no content is before the divider, the description will be used as the summary.
2. If there is a `<!--more-->` summary divider present in the article the text up to the divider will be provided as per the manual summary split method.
3. If there is a summary variable in the article front matter the value of the variable will be provided as per the front matter summary method.
4. The text at the start of the article will be provided as per the automatic summary split method.

{{< admonition >}}
It is not recommended to include rich text block elements in the summary, which will cause typographic errors. Such as code blocks, pictures, tables, etc.
{{< /admonition >}}

## 4 Basic Markdown Syntax

This part is shown in the [basic markdown syntax page](../basic-markdown-syntax/).

## 5 Extended Markdown Syntax {#extended-markdown-syntax}

**LoveIt** theme has some extended syntax elements for you to write articles.

### Emoji Support

This part is shown in the [emoji support page](../emoji-support/).

### Mathematical Formula

**LoveIt** theme supports mathematical formulas based on [$ \KaTeX $](https://katex.org/).

Set the property `enable = true` under `[params.math]` in your [site configuration](../theme-documentation-basics/#site-configuration)
and the property `math: true` of the article front matter to enable the automatic rendering of mathematical formulas.

{{< admonition tip >}}
Here is a list of [$ \TeX $ functions supported by $ \KaTeX $](https://katex.org/docs/supported.html).
{{< /admonition >}}

#### Block Formula

The default block delimiters are `$$`/`$$` and `\\[`/`\\]`:

```markdown
$$ c = \pm\sqrt{a^2 + b^2} $$

\\[ f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\]
```

The rendered output looks like this:

$$ c = \pm\sqrt{a^2 + b^2} $$

\\[ f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\]

#### Inline Formula

The default block delimiters are `$`/`$` and `\\(`/`\\)`:

```markdown
$ c = \pm\sqrt{a^2 + b^2} $ and \\( f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\)
```

The rendered output looks like this:

$ c = \pm\sqrt{a^2 + b^2} $ and \\( f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\)

{{< admonition tip >}}
You can add more block and inline delimiters in your [site configuration](../theme-documentation-basics/#site-configuration).
{{< /admonition >}}

#### Copy-tex

**[Copy-tex](https://github.com/Khan/KaTeX/tree/master/contrib/copy-tex)** is an extension for **$ \KaTeX $**.

By the extension, when selecting and copying $ \KaTeX $ rendered elements, copies their $ \LaTeX $ source to the clipboard.

Set the property `copyTex = true` under `[params.math]` in your [site configuration](../theme-documentation-basics/#site-configuration) to enable Copy-tex.

Select and copy the formula rendered in the previous section, and you can find that the copied content is the LaTeX source code.

#### mhchem

**[mhchem](https://github.com/Khan/KaTeX/tree/master/contrib/mhchem)** is an extension for **$ \KaTeX $**.

By the extension, you can write beautiful chemical equations easily in the article.

Set the property `mhchem = true` under `[params.math]` in your [site configuration](../theme-documentation-basics/#site-configuration) to enable mhchem.

```markdown
$$ \ce{CO2 + C -> 2 CO} $$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$
```

The rendered output looks like this:

$$ \ce{CO2 + C -> 2 CO} $$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$

### Ruby Annotation

An extended Markdown syntax for **ruby annotation** is supported in **LoveIt** theme:

```markdown
[Hugo]{?^}(An open-source static site generator)
```

The rendered output looks like this:

[Hugo]^(An open-source static site generator)

### Font Awesome

**LoveIt** theme uses [Font Awesome](https://fontawesome.com/) as the icon library.
You can easily use these icons in your articles.

Get the `class` of icons you wanted from the [Font Awesome website](https://fontawesome.com/icons?d=gallery).

```markdown
Gone camping! {?:}(fas fa-campground): Be back soon.

That is so funny! {?:}(far fa-grin-tears):
```

The rendered output looks like this:

Gone camping! :(fas fa-campground): Be back soon.

That is so funny! :(far fa-grin-tears):

### Escape character {#escape-character}

In some special cases (when writing this theme documentation :(far fa-grin-squint-tears):),
your content will conflict with basic or extended Markdown syntax, and it is inevitable.

The escape character syntax can help you build the content you wanted:

```markdown
{{??}X} -> X
```

For example, two `:` will enable emoji syntax, which is not the behavior you want. The escape character syntax is like this:

```markdown
{{??}:}joy:
```

The rendered output looks like this:

**{?:}joy{?:}** instead of **:joy:**

{{< admonition tip >}}
This is related to **[an issue for Hugo](https://github.com/gohugoio/hugo/issues/4978)**, which has not been resolved.
{{< /admonition >}}

Another example is:

```markdown
[link{{??}]}(#escape-character)
```

The rendered output looks like this:

**[link{?]}(#escape-character)** instead of **[link](#escape-character)**.

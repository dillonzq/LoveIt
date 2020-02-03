---
author: "Hugo Authors"
author_link: "https://gohugo.io/"
title: "Markdown Syntax Guide"
date: 2019-12-01T21:57:40+08:00
lastmod: 2020-01-01T16:45:40+08:00
draft: false
description: "Sample article showcasing basic Markdown syntax and formatting for HTML elements."
show_in_homepage: true
description_as_summary: false
license: ""

tags: [
    "markdown",
    "css",
    "html",
]
categories: [
    "theme",
]

featured_image: /images/markdown.png
featured_image_preview: ""

comment: true
toc: true
auto_collapse_toc: true
math: true
---

This article offers a sample of basic Markdown syntax that can be used in Hugo content files, also it shows whether basic HTML elements are decorated with CSS in a Hugo theme.
<!--more-->

## Headings

The following HTML `<h2>`—`<h6>` elements represent six levels of section headings. `<h2>` is the highest section level while `<h6>` is the lowest.

## H2
### H3
#### H4
##### H5
###### H6

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum,
voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit
peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur,
offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur,
cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea
corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum
fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate
dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer
sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is
sinveli squiatum, core et que aut hariosam ex eat.

## Blockquotes

The blockquote element represents content that is quoted from another source, optionally
with a citation which must be within a `footer` or `cite` element, and optionally with
in-line changes such as annotations and abbreviations.

### Blockquote without attribution

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use *Markdown syntax* within a blockquote.

### Blockquote with attribution

> Don't communicate by sharing memory, share memory by communicating.</p>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

## Tables

Tables aren't part of the core Markdown spec, but Hugo supports supports them out-of-the-box.

   Name | Age
--------|------
    Bob | 27
  Alice | 23

### Inline Markdown within tables

| Inline&nbsp;&nbsp;&nbsp;     | Markdown&nbsp;&nbsp;&nbsp;  | In&nbsp;&nbsp;&nbsp;                | Table      |
| ---------- | --------- | ----------------- | ---------- |
| *italics*  | **bold**  | ~~strikethrough~~&nbsp;&nbsp;&nbsp; | `code`     |

## Code

### Inline code

Inline code: `print`

### Code block with backticks

```html {hl_lines=["8-9"],linenostart=10}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Example HTML5 Document</title>
    </head>
    <body>
        <p>Test</p>
    </body>
</html>
```

### Code block indented with four spaces

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Example HTML5 Document</title>
        </head>
        <body>
            <p>Test</p>
        </body>
    </html>

### Code block with Hugo's internal highlight shortcode

{{< highlight html "linenos=false" >}}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Example HTML5 Document</title>
    </head>
    <body>
        <p>Test</p>
    </body>
</html>
{{< /highlight >}}

## List Types

### Ordered List

1. First item
2. Second item
3. Third item

### Unordered List

* List item
* Another item
* And another item

### Nested list

* Item
  1. First Sub-item
  2. Second Sub-item

## Other Elements — abbr, sub, sup, kbd, mark

* `abbr`

  <abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

* Or ruby annotation

  [GIF]^(Graphics Interchange Format) is a bitmap image format.

* `sub`/`sup`

  H<sub>2</sub>O

  X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

* Or `LaTex` formula

  * Block

    $$ H_2O $$

    $$ X^n+Y^n=Z^n $$

  * Inline: \\( H_2O \\) \\( X^n+Y^n=Z^n \\)

* `kbd`

  Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

* `mark`

  Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms,
  and other small creatures.

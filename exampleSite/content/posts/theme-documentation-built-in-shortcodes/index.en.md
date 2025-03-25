---
weight: 3
title: "Theme Documentation - Built-in Shortcodes"
date: 2020-03-04T16:29:41+08:00
lastmod: 2020-03-04T16:29:41+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "Hugo provides multiple built-in shortcodes for author convenience and to keep your markdown content clean."
images: []
resources:
- name: "featured-image"
  src: "featured-image.png"

tags: ["shortcodes"]
categories: ["documentation"]

lightgallery: true
---

**Hugo** provides multiple built-in shortcodes for author convenience and to keep your markdown content clean.

<!--more-->

Hugo uses Markdown for its simple content format. However, there are a lot of things that Markdown doesn’t support well. You could use pure HTML to expand possibilities.

But this happens to be a bad idea. Everyone uses Markdown because it’s pure and simple to read even non-rendered. You should avoid HTML to keep it as simple as possible.

To avoid this limitations, Hugo created [shortcodes](https://gohugo.io/extras/shortcodes/).
A shortcode is a simple snippet that can generate reasonable HTML code and conforms to Markdown's design philosophy.

Hugo ships with a set of predefined shortcodes that represent very common usage. These shortcodes are provided for author convenience and to keep your markdown content clean.

## 1 figure {#figure}

[Documentation of `figure`](https://gohugo.io/shortcodes/figure/)

Example `figure` input:

```markdown
{{</* figure
    src="/images/zion-national-park.jpg"
    alt="A photograph of Zion National Park"
    link="https://www.nps.gov/zion/index.htm"
    caption="Zion National Park"
    class="ma0 w-75"
*/>}}
```

The rendered output looks like this:

{{< figure
    src="/images/zion-national-park.jpg"
    alt="A photograph of Zion National Park"
    link="https://www.nps.gov/zion/index.htm"
    caption="Zion National Park"
    class="ma0 w-75"
>}}

The HTML looks like this:

```html
<figure class="ma0 w-75">
    <a href="https://www.nps.gov/zion/index.htm">
        <img src="/images/zion-national-park.jpg" alt="A photograph of Zion National Park">
    </a>
    <figcaption>
        <p>Zion National Park</p>
    </figcaption>
</figure>
```

## 2 gist

[Documentation of `gist`](https://gohugo.io/shortcodes/gist/)

Example `gist` input:

```markdown
{{</* gist spf13 7896402 */>}}
```

The rendered output looks like this:

{{< gist spf13 7896402 >}}

The HTML looks like this:

```html
<script type="application/javascript" src="https://gist.github.com/spf13/7896402.js"></script>
```

## 3 highlight

[Documentation of `highlight`](https://gohugo.io/shortcodes/highlight/)

Example `highlight` input:

```markdown
{{</* highlight go */>}}
package main

import "fmt"

func main() {
    fmt.Println("Hello, 世界")
}
{{</* /highlight */>}}
```

The rendered output looks like this:

{{< highlight go >}}
package main

import "fmt"

func main() {
    fmt.Println("Hello, 世界")
}
{{< /highlight >}}

## 4 instagram

[Documentation of `instagram`](https://gohugo.io/shortcodes/instagram/)

Example `instagram` input:

```markdown
{{</* instagram CxOWiQNP2MO */>}}
```

The rendered output looks like this:

{{< instagram CxOWiQNP2MO >}}

## 5 param

[Documentation of `param`](https://gohugo.io/shortcodes/param/)

Example `param` input:

```markdown
{{</* param description */>}}
```

The rendered output looks like this:

{{< param description >}}

## 6 x

[Documentation of `x`](https://gohugo.io/shortcodes/x/)

Example `x` input:

```markdown
{{</* x user=GoHugoIO id=917359331535966209 */>}}
```

The rendered output looks like this:

{{< x user=GoHugoIO id=917359331535966209 >}}

## 7 vimeo

[Documentation of `vimeo`](https://gohugo.io/shortcodes/vimeo/)

Example `vimeo` input:

```markdown
{{</* vimeo 146022717 */>}}
```

The rendered output looks like this:

{{< vimeo 146022717 >}}

## 8 youtube

[Documentation of `youtube`](https://gohugo.io/shortcodes/youtube/)

Example `youtube` input:

```markdown
{{</* youtube w7Ft2ymGmfc */>}}
```

The rendered output looks like this:

{{< youtube w7Ft2ymGmfc >}}

## 9 ref

[Documentation of `ref`](https://gohugo.io/shortcodes/ref/)

## 10  relref

[Documentation of `relref`](https://gohugo.io/shortcodes/relref/)

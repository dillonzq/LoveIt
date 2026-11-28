---
weight: 2
title: "主题文档 - 内容"
date: 2020-03-05T16:30:05+08:00
lastmod: 2020-03-05T16:30:05+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "了解如何在 LoveIt 主题中快速, 直观地创建和组织内容."
images: []
resources:
- name: "featured-image"
  src: "featured-image.jpg"

tags: ["content", "Markdown"]
categories: ["documentation"]

lightgallery: true

toc:
  auto: false
math:
  enable: true
---

了解如何在 **LoveIt** 主题中快速, 直观地创建和组织内容.

<!--more-->

## 1 内容组织 {#contents-organization}

以下是一些方便你清晰管理和生成文章的目录结构建议:

* 保持博客文章存放在 `content/posts` 目录, 例如: `content/posts/我的第一篇文章.md`
* 保持简单的静态页面存放在 `content` 目录, 例如: `content/about.md`
* 本地资源组织

{{< admonition note "本地资源引用" >}}
{{< version 0.2.10 >}}

有三种方法来引用**图片**和**音乐**等本地资源:

1. 使用[页面包](https://gohugo.io/content-management/page-bundles/)中的[页面资源](https://gohugo.io/content-management/page-resources/).
   你可以使用适用于 `Resources.GetMatch` 的值或者直接使用相对于当前页面目录的文件路径来引用页面资源.
2. 将本地资源放在 **assets** 目录中, 默认路径是 `/assets`.
   引用资源的文件路径是相对于 assets 目录的.
3. 将本地资源放在 **static** 目录中, 默认路径是 `/static`.
   引用资源的文件路径是相对于 static 目录的.

引用的**优先级**符合以上的顺序.

在这个主题中的很多地方可以使用上面的本地资源引用,
例如 **链接**, **图片**, `image` shortcode, `music` shortcode 和**前置参数**中的部分参数.

{{< version 0.5.0 >}} 页面资源或者 **assets** 目录中的图片会经过 Hugo 的[图片处理](https://gohugo.io/content-management/image-processing/).
Markdown 图片, `image` shortcode, 文章特色图片和主页头像都会这样处理
(网站 logo 只会带上 `width` 和 `height`):

* JPEG, PNG 和 WebP 图片会带上 `width` 和 `height`, 避免图片加载时页面发生偏移,
  并带上包含宽度不超过 800 像素的 WebP 副本的 `srcset`,
  浏览器会下载适合屏幕的尺寸.
  原图比副本更宽时会作为 `srcset` 的最后一个候选, 同时也是图片的 `src`.
  图片会按照 Exif 方向信息旋转. Hugo 0.155.0 之前的版本会保留 PNG 和 WebP 原图,
  由浏览器按方向信息显示.
* GIF, BMP, TIFF 图片和 PNG, WebP 动图只会带上 `width` 和 `height`, 因此动图仍然会动.
  Hugo 无法解码的图片也是如此.
* SVG 等其他格式, **static** 目录中的文件和远程 URL 会原样使用.
  需要处理的图片请放在页面包或者 **assets** 目录中.

Hugo 0.153.0 之前的版本需要 extended 版本才能生成 WebP 副本; 这些版本的标准版只会为图片带上尺寸.

文章的特色图片和主页头像通常是首屏中最大的元素, 因此会立即以 `fetchpriority="high"` 加载.
其他图片使用浏览器原生的懒加载 (`loading="lazy"`).
{{< /admonition >}}

## 2 前置参数 {#front-matter}

**Hugo** 允许你在文章内容前面添加 `yaml`, `toml` 或者 `json` 格式的前置参数.

{{< admonition >}}
**不是所有**的以下前置参数都必须在你的每篇文章中设置.
只有在文章的参数和你的 [网站设置](../theme-documentation-basics#site-configuration) 中的 `page` 部分不一致时才有必要这么做.
{{< /admonition >}}

这是一个前置参数例子:

```yaml
---
title: "我的第一篇文章"
subtitle: ""
date: 2020-03-04T15:58:26+08:00
lastmod: 2020-03-04T15:58:26+08:00
draft: true
author: ""
authorLink: ""
authorAvatar: ""
description: ""
license: ""
images: []

tags: []
categories: []

featuredImage: ""
featuredImagePreview: ""

hiddenFromHomePage: false
hiddenFromSearch: false
twemoji: false
lightgallery: true
ruby: true
fraction: true
fontawesome: true
linkToMarkdown: true
rssFullText: false

toc:
  enable: true
  keepStatic: false
  auto: true
code:
  copy: true
  maxShownLines: 50
  render:
    goat: true
    mermaid: true
mermaid:
  renderer: pele
math:
  enable: false
  # ...
mapbox:
  # ...
share:
  enable: true
  # ...
comment:
  enable: true
  # ...
library:
  css:
    # someCSS = "some.css"
    # 位于 "assets/"
    # 或者
    # someCSS = "https://cdn.example.com/some.css"
  js:
    # someJS = "some.js"
    # 位于 "assets/"
    # 或者
    # someJS = "https://cdn.example.com/some.js"
seo:
  images: []
  # ...
---
```

* **title**: 文章标题.
* **subtitle**: {{< version 0.2.0 >}} 文章副标题.
* **date**: 这篇文章创建的日期时间. 它通常是从文章的前置参数中的 `date` 字段获取的, 但是也可以在 [网站配置](../theme-documentation-basics#site-configuration) 中设置.
* **lastmod**: 上次修改内容的日期时间.
* **draft**: 如果设为 `true`, 除非 `hugo` 命令使用了 `--buildDrafts`/`-D` 参数, 这篇文章不会被渲染.
* **author**: 文章作者.
* **authorLink**: 文章作者的链接.
* **authorAvatar**: {{< version 0.5.0 >}} 文章作者的头像, 在文章元信息中代替用户图标显示: 页面资源的名称, 位于 `static/` 或 `assets/` 下的路径, 或者 URL. 如果没有设置, 文章会显示 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.author.avatar`, 除非它的 `author` 是另一位作者.
* **description**: 文章内容的描述.
* **license**: 这篇文章特殊的许可.
* **images**: 页面图片, 用于 Open Graph 和 Twitter Cards.

* **tags**: 文章的标签.
* **categories**: 文章所属的类别.

* **featuredImage**: 文章的特色图片.
* **featuredImagePreview**: 用在主页预览的文章特色图片.

* **hiddenFromHomePage**: 如果设为 `true`, 这篇文章将不会显示在主页上.
* **hiddenFromSearch**: {{< version 0.2.0 >}} 如果设为 `true`, 这篇文章将不会显示在搜索结果中.
* **twemoji**: {{< version 0.2.0 >}} 如果设为 `true`, 这篇文章会使用 twemoji.
* **lightgallery**: 如果设为 `true`, 文章中的图片将可以按照画廊形式呈现.
* **ruby**: {{< version 0.2.0 >}} 如果设为 `true`, 这篇文章会使用 [上标注释扩展语法](#ruby).
* **fraction**: {{< version 0.2.0 >}} 如果设为 `true`, 这篇文章会使用 [分数扩展语法](#fraction).
* **fontawesome**: {{< version 0.2.0 >}} 如果设为 `true`, 这篇文章会使用 [Font Awesome 扩展语法](#fontawesome).
* **linkToMarkdown**: 如果设为 `true`, 内容的页脚将显示指向原始 Markdown 文件的链接.
* **rssFullText**: {{< version 0.2.4 >}} 如果设为 `true`, 在 RSS 中将会显示全文内容.

* **toc**: {{< version 0.2.9 changed >}} 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.toc` 部分相同, 包括 `enable`, `keepStatic` (是否保持使用文章前面的静态目录) 和 `auto`.
* **code**: {{< version 0.2.0 >}} 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.code` 部分相同, 包括 `copy`, `maxShownLines` 以及 `render.goat` / `render.mermaid` (见 [图表](#diagrams)).
* **mermaid**: {{< version 0.5.0 >}} 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.mermaid` 部分相同, 包括 `renderer` (见 [图表](#diagrams)).
* **math**: {{< version 0.2.0 changed >}} 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.math` 部分相同.
* **mapbox**: {{< version 0.2.0 >}} 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.mapbox` 部分相同.
* **share**: 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.share` 部分相同.
* **comment**: {{< version 0.2.0 changed >}} 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.comment` 部分相同. {{< version 0.4.2 >}} 将 `comment.mastodon.url` 设为一条帖子的链接, 该帖子的回复就是这个页面的评论 (见 [Mastodon 评论](../theme-documentation-basics#site-configuration)).
* **library**: {{< version 0.2.7 >}} 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.library` 部分相同.
* **seo**: {{< version 0.2.10 >}} 和 [网站配置](../theme-documentation-basics#site-configuration) 中的 `params.page.seo` 部分相同.

{{< admonition tip "自动更新 lastmod" >}}
主题把 `lastmod` 作为 "更新于" 日期显示在页面末尾, 并用于网站地图和结构化数据.
不需要手动设置它, 在网站配置中设置 `enableGitInfo = true` 即可:
Hugo 会使用最后一次修改该内容文件的 Git 提交的日期, 优先于前置参数中的 `lastmod`.
如果要改变这个顺序, 请配置 Hugo 的 [前置参数日期](https://gohugo.io/configuration/front-matter/#dates).
Hugo 会使用第一个有日期的来源. 下面的顺序让前置参数中的 `lastmod` 优先于 Git 日期,
对于 Git 没有跟踪的文件则使用文件的修改时间:

```toml
[frontmatter]
  lastmod = ["lastmod", ":git", ":fileModTime", ":default"]
```

如果要始终使用文件的修改时间, 把 `":fileModTime"` 放在第一位.

提交日期依赖 Git 历史: 如果构建服务只克隆了最新的一次提交,
所有页面都会得到这次提交的日期. 使用 GitHub Actions 时, 为 `actions/checkout` 设置 `fetch-depth: 0`.
{{< /admonition >}}

{{< admonition tip >}}
{{< version 0.2.10 >}}

**featuredImage** 和 **featuredImagePreview** 支持[本地资源引用](#contents-organization)的完整用法.

如果带有在前置参数中设置了 `name: featured-image` 或 `name: featured-image-preview` 属性的页面资源,
没有必要在设置 `featuredImage` 或 `featuredImagePreview`:

```yaml
resources:
- name: featured-image
  src: featured-image.jpg
- name: featured-image-preview
  src: featured-image-preview.jpg
```
{{< /admonition >}}

{{< admonition note "用于 Open Graph, Twitter Cards 和 SEO 的图片" >}}
{{< version 0.4.1 changed >}}

页面被分享到社交网络时显示的图片, 以及结构化数据中的图片, 来自以下第一个已设置的项:

1. 前置参数中的 `seo.images`
2. 前置参数中的 `images`
3. 特色图片: `featured-image` 资源或 `featuredImage`, 否则是 `featured-image-preview` 资源或 `featuredImagePreview`
4. 页面包中名称包含 `feature`, `cover` 或 `thumbnail` 的图片
5. 网站配置中的 `params.page.seo.images`, 其次是 `params.images`, 最后是 `params.seo.image`

每张图片可以是页面资源, `assets/` 或 `static/` 下文件的路径, 或者 URL.
SVG 图片不会用于 Open Graph 和 Twitter Cards, 因为社交网络无法显示它们.
{{< /admonition >}}

## 3 内容摘要

**LoveIt** 主题使用内容摘要在主页中显示大致文章信息。Hugo 支持生成文章的摘要.

![文章摘要预览](summary.zh-cn.png "文章摘要预览")

### 自动摘要拆分

默认情况下, Hugo 自动将内容的前 70 个单词作为摘要.

你可以通过在 [网站配置](../theme-documentation-basics#site-configuration) 中设置 `summaryLength` 来自定义摘要长度.

如果您要使用 [CJK]^(中文/日语/韩语) 语言创建内容, 并且想使用 Hugo 的自动摘要拆分功能，请在 [网站配置](../theme-documentation-basics#site-configuration) 中将 `hasCJKLanguage` 设置为 `true`.

### 手动摘要拆分

另外, 你也可以添加 `<!--more-->` 摘要分割符来拆分文章生成摘要.

摘要分隔符之前的内容将用作该文章的摘要.

{{< admonition >}}
请小心输入`<!--more-->` ; 即全部为小写且没有空格.
{{< /admonition >}}

### 前置参数摘要

你可能希望摘要不是文章开头的文字. 在这种情况下, 你可以在文章前置参数的 `summary` 变量中设置单独的摘要.

### 使用文章描述作为摘要

你可能希望将文章前置参数中的 `description` 变量的内容作为摘要.

你仍然需要在文章开头添加 `<!--more-->` 摘要分割符. 将摘要分隔符之前的内容保留为空. 然后 **LoveIt** 主题会将你的文章描述作为摘要.

### 摘要选择的优先级顺序

由于可以通过多种方式指定摘要, 因此了解顺序很有用. 如下:

1. 如果文章中有 `<!--more-->` 摘要分隔符, 并且分隔符之前有内容, 则将按照手动摘要拆分的方法获得摘要.
2. 否则, 如果文章前置参数中有摘要变量, 那么将以该值作为摘要.
3. 否则, 如果文章中没有 `<!--more-->` 摘要分隔符, 则按照自动摘要拆分方法获得摘要.
4. 如果摘要仍然为空 (例如, 文章中有 `<!--more-->` 摘要分隔符但分隔符之前没有内容, 并且前置参数中没有 `summary`), 则使用描述作为摘要.

也就是说, 描述只是后备选项: 即使文章以空的 `<!--more-->` 摘要分隔符开头, 前置参数中的 `summary` 也优先于描述.

{{< admonition >}}
不建议在摘要内容中包含富文本块元素, 这会导致渲染错误. 例如代码块, 图片, 表格等.
{{< /admonition >}}

## 4 Markdown 基本语法

这部分内容在 [Markdown 基本语法页面](../basic-markdown-syntax/) 中介绍.

## 5 Markdown 扩展语法 {#extended-markdown-syntax}

**LoveIt** 主题提供了一些扩展的语法便于你撰写文章.

### 图表 {#diagrams}

默认情况下, `goat` 和 `mermaid` 代码块会被渲染为图表.
在 [网站配置](../theme-documentation-basics#site-configuration) 的 `[params.page.code.render]` 下设置 `goat = false` 或 `mermaid = false` (或者在页面前置参数中设置 `code.render.goat` / `code.render.mermaid`) 可以关闭对应的代码块渲染钩子,
此时该代码块会回退为普通代码块.

{{< version 0.5.0 changed >}} Mermaid 图表默认使用 [Pele](https://pele.run) 渲染.
在 `[params.page.mermaid]` 下设置 `renderer = "mermaid"` (或者在前置参数中设置 `mermaid.renderer`) 可以改用 Mermaid 库渲染,
两者的区别见 [mermaid shortcode](../theme-documentation-mermaid-shortcode#renderer).

#### GoAT 图表 (ASCII)

```goat
      .               .                .               .--- 1          .-- 1     / 1
     / \              |                |           .---+            .-+         +
    /   \         .---+---.         .--+--.        |   '--- 2      |   '-- 2   / \ 2
   +     +        |       |        |       |    ---+            ---+          +
  / \   / \     .-+-.   .-+-.     .+.     .+.      |   .--- 3      |   .-- 3   \ / 3
 /   \ /   \    |   |   |   |    |   |   |   |     '---+            '-+         +
 1   2 3   4    1   2   3   4    1   2   3   4         '--- 4          '-- 4     \ 4
```

#### Mermaid 图表

```mermaid
graph TD
    A[输入图表定义] --> B(预览)
    B --> C{决定}
    C --> D[保持]
    C --> E[编辑定义]
    E --> B
    D --> F[保存图片和代码]
    F --> B
```

### 提示 (Alert) {#alerts}

{{< version 0.4.0 >}}

以提示类型开头的引用块, 会以和 [`admonition` shortcode](../theme-documentation-extended-shortcodes/#4-admonition) 相同的样式渲染, 支持的类型也相同.

```markdown
> [!NOTE]
> 使用默认标题的提示.

> [!TIP] 自定义标题
> 使用自定义标题的提示.

> [!WARNING]- 默认折叠
> 在类型后加 `-` 使提示默认折叠, 加 `+` 则保持展开.
```

呈现的输出效果如下:

> [!NOTE]
> 使用默认标题的提示.

> [!TIP] 自定义标题
> 使用自定义标题的提示.

> [!WARNING]- 默认折叠
> 在类型后加 `-` 使提示默认折叠, 加 `+` 则保持展开.

### Emoji 支持

这部分内容在 [Emoji 支持页面](../emoji-support/) 中介绍.

### 数学公式

{{< version 0.2.11 changed >}}

**LoveIt** 基于 [$\KaTeX$](https://katex.org/) 提供数学公式的支持.

在你的 [网站配置](../theme-documentation-basics#site-configuration) 中的 `[params.page.math]` 下面设置属性 `enable = true`,
并在文章的前置参数中设置属性 `math: true`来启用数学公式的自动渲染.
**$\KaTeX$** 根据 **特定的分隔符** 来自动渲染公式.

{{< admonition tip >}}
有一份 [$\KaTeX$ 中支持的 $\TeX$ 函数](https://katex.org/docs/supported.html) 清单.
{{< /admonition >}}

{{< admonition >}}
由于 Hugo 在渲染 Markdown 文档时会根据 `_`/`*`/`>>` 之类的语法生成 HTML 文档,
并且有些转义字符形式的文本内容 (如 `\(`/`\)`/`\[`/`\]`/`\\`) 会自动进行转义处理,
因此需要对这些地方进行额外的转义字符表达来实现自动渲染:

* `_` -> `\_`
* `*` -> `\*`
* `>>` -> `\>>`
* `\(` -> `\\(`
* `\)` -> `\\)`
* `\[` -> `\\[`
* `\]` -> `\\]`
* `\\` -> `\\\\`

**LoveIt** 主题支持 [`raw` shortcode](../theme-documentation-extended-shortcodes#12-raw) 以避免这些转义字符,
它可以帮助您编写原始数学公式内容.

一个 `raw` 示例:

```markdown
行内公式: {?{}{< raw >}}\(\mathbf{E}=\sum_{i} \mathbf{E}_{i}=\mathbf{E}_{1}+\mathbf{E}_{2}+\mathbf{E}_{3}+\cdots\){?{}{< /raw >}}

公式块:

{?{}{< raw >}}
\[ a=b+c \\ d+e=f \]
{?{}{< /raw >}}
```

呈现的输出效果如下:

行内公式: {{< raw >}}\(\mathbf{E}=\sum_{i} \mathbf{E}_{i}=\mathbf{E}_{1}+\mathbf{E}_{2}+\mathbf{E}_{3}+\cdots\){{< /raw >}}

公式块:

{{< raw >}}
\[ a=b+c \\ d+e=f \]
{{< /raw >}}
{{< /admonition >}}

#### 行内公式

默认的行内公式分割符有:

* `$ ... $`
* `\( ... \)` (转义的: `\\( ... \\)`)

例如:

```markdown
$c = \pm\sqrt{a^2 + b^2}$ 和 \\(f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi\\)
```

呈现的输出效果如下:

$c = \pm\sqrt{a^2 + b^2}$ 和 \\(f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi\\)

#### 公式块

默认的公式块分割符有:

* `$$ ... $$`
* `\[ ... \]` (转义的: `\\[ ... \\]`)
* `\begin{equation} ... \end{equation}` (不编号的: `\begin{equation*} ... \end{equation*}`)
* `\begin{align} ... \end{align}` (不编号的: `\begin{align*} ... \end{align*}`)
* `\begin{alignat} ... \end{alignat}` (不编号的: `\begin{alignat*} ... \end{alignat*}`)
* `\begin{gather} ... \end{gather}` (不编号的: `\begin{gather*} ... \end{gather*}`)
* `\begin{CD} ... \end{CD}`

例如:

```markdown
$$ c = \pm\sqrt{a^2 + b^2} $$

\\[ f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\]

\begin{equation*}
  \rho \frac{\mathrm{D} \mathbf{v}}{\mathrm{D} t}=\nabla \cdot \mathbb{P}+\rho \mathbf{f}
\end{equation*}

\begin{equation}
  \mathbf{E}=\sum_{i} \mathbf{E}\_{i}=\mathbf{E}\_{1}+\mathbf{E}\_{2}+\mathbf{E}_{3}+\cdots
\end{equation}

\begin{align}
  a&=b+c \\\\
  d+e&=f
\end{align}

\begin{alignat}{2}
   10&x+&3&y = 2 \\\\
   3&x+&13&y = 4
\end{alignat}

\begin{gather}
   a=b \\\\
   e=b+c
\end{gather}

\begin{CD}
   A @>a\>> B \\\\
@VbVV @AAcA \\\\
   C @= D
\end{CD}
```

呈现的输出效果如下:

$$ c = \pm\sqrt{a^2 + b^2} $$

\\[ f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\]

\begin{equation*}
  \rho \frac{\mathrm{D} \mathbf{v}}{\mathrm{D} t}=\nabla \cdot \mathbb{P}+\rho \mathbf{f}
\end{equation*}

\begin{equation}
  \mathbf{E}=\sum_{i} \mathbf{E}\_{i}=\mathbf{E}\_{1}+\mathbf{E}\_{2}+\mathbf{E}_{3}+\cdots
\end{equation}

\begin{align}
  a&=b+c \\\\
  d+e&=f
\end{align}

\begin{alignat}{2}
   10&x+&3&y = 2 \\\\
   3&x+&13&y = 4
\end{alignat}

\begin{gather}
   a=b \\\\
   e=b+c
\end{gather}

\begin{CD}
   A @>a\>> B \\\\
@VbVV @AAcA \\\\
   C @= D
\end{CD}

{{< admonition tip >}}
你可以在 [网站配置](../theme-documentation-basics#site-configuration) 中自定义行内公式和公式块的分割符.
{{< /admonition >}}

#### Copy-tex

**[Copy-tex](https://github.com/Khan/KaTeX/tree/master/contrib/copy-tex)** 是一个 **$\KaTeX$** 的插件.

通过这个扩展, 在选择并复制 $\KaTeX$ 渲染的公式时, 会将其 $\LaTeX$ 源代码复制到剪贴板.

启用数学公式后, Copy-tex 默认处于开启状态. 在你的 [网站配置](../theme-documentation-basics#site-configuration) 中的 `[params.page.math]` 下面设置属性 `copyTex = false` 可以禁用它.

选择并复制上一节中渲染的公式, 可以发现复制的内容为 $\LaTeX$ 源代码.

#### mhchem

**[mhchem](https://github.com/Khan/KaTeX/tree/master/contrib/mhchem)** 是一个 **$\KaTeX$** 的插件.

通过这个扩展, 你可以在文章中轻松编写漂亮的化学方程式.

启用数学公式后, mhchem 默认处于开启状态. 在你的 [网站配置](../theme-documentation-basics#site-configuration) 中的 `[params.page.math]` 下面设置属性 `mhchem = false` 可以禁用它.

```markdown
$$ \ce{CO2 + C -> 2 CO} $$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$
```

呈现的输出效果如下:

$$ \ce{CO2 + C -> 2 CO} $$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$

#### 服务端渲染

{{< version 0.4.0 >}}

**LoveIt** 主题还提供了一个 [直通渲染钩子 (passthrough render hook)](https://gohugo.io/render-hooks/passthrough/),
在构建时通过 Hugo 的 [`transform.ToMath`](https://gohugo.io/functions/transform/tomath/) 将公式渲染为 HTML.
这些公式既不需要上面那些额外的转义字符, 也不需要 JavaScript: 未启用 `[params.page.math]` 时, 包含它们的页面只会加载 $\KaTeX$ 的样式表.

Hugo 不会读取主题中的 `markup` 配置, 所以需要在你自己的 [网站配置](../theme-documentation-basics#site-configuration) 中启用 Goldmark 的 passthrough 扩展:

```toml
[markup.goldmark.extensions.passthrough]
  enable = true
  [markup.goldmark.extensions.passthrough.delimiters]
    block = [["\\[", "\\]"], ["$$", "$$"]]
    inline = [["\\(", "\\)"]]
```

{{< admonition note >}}
无论是否启用了 `[params.page.math]`, 这些定界符之间的公式都会在服务端渲染,
公式有误时构建会失败并给出其位置.
{{< /admonition >}}

### 字符注音或者注释 {#ruby}

**LoveIt** 主题支持一种 **字符注音或者注释** Markdown 扩展语法:

```markdown
[Hugo]{?^}(一个开源的静态网站生成工具)
```

呈现的输出效果如下:

[Hugo]^(一个开源的静态网站生成工具)

### 分数 {#fraction}

{{< version 0.2.0 >}}

**LoveIt** 主题支持一种 **分数** Markdown 扩展语法:

```markdown
[浅色]{?/}[深色]

[99]{?/}[100]
```

呈现的输出效果如下:

[浅色]/[深色]

[99]/[100]

### Font Awesome {#fontawesome}

**LoveIt** 主题使用 [Font Awesome](https://fontawesome.com/) 作为图标库.
你同样可以在文章中轻松使用这些图标.

从 [Font Awesome 网站](https://fontawesome.com/icons?d=gallery) 上获取所需的图标 `class`.

```markdown
去露营啦! {?:}(fas fa-campground): 很快就回来.

真开心! {?:}(far fa-grin-tears):
```

呈现的输出效果如下:

去露营啦! :(fas fa-campground): 很快就回来.

真开心! :(far fa-grin-tears):

### 转义字符 {#escape-character}

在某些特殊情况下 (编写这个主题文档时 :(far fa-grin-squint-tears):),
你的文章内容会与 Markdown 的基本或者扩展语法冲突, 并且无法避免.

转义字符语法可以帮助你渲染出想要的内容:

```markdown
{{??}X} -> X
```

例如, 两个 `:` 会启用 emoji 语法. 但有时候这不是你想要的结果. 可以像这样使用转义字符语法:

```markdown
{{??}:}joy:
```

呈现的输出效果如下:

**{?:}joy{?:}** 而不是 **:joy:**

{{< admonition tip >}}
这个方法可以间接解决一个还未解决的 **[Hugo 的 issue](https://github.com/gohugoio/hugo/issues/4978)**.
{{< /admonition >}}

另一个例子是:

```markdown
[link{{??}]}(#escape-character)
```

呈现的输出效果如下:

**[link{?]}(#escape-character)** 而不是 **[link](#escape-character)**.

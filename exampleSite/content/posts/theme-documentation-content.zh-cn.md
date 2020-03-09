---
weight: 2
title: "主题文档 - 内容"
date: 2020-03-05T16:30:05+08:00
lastmod: 2020-03-05T16:30:05+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "了解如何在 LoveIt 主题中快速, 直观地创建和组织内容."
license: ""

tags: ["内容", "markdown"]
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

了解如何在 **LoveIt** 主题中快速, 直观地创建和组织内容.

<!--more-->

## 1 内容组织

以下是一些方便你清晰管理和生成文章的目录结构建议:

* 保持博客文章存放在 `content/posts` 目录, 例如: `content/posts/我的第一篇文章.md`
* 保持简单的静态页面存放在 `content` 目录, 例如: `content/about.md`
* 保持图片之类的媒体资源存放在 `static` 目录, 例如: `static/images/screenshot.png`

## 2 前置参数

**Hugo** 允许你在文章内容前面添加 `yaml`, `toml` 或者 `json` 格式的前置参数.

这是默认文章模板中的默认前置参数:

```yaml
---
title: "我的第一篇文章"
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

* **title**: 文章标题.
* **date**: 这篇文章创建的日期时间. 它通常是从文章的前置参数中的 `date` 字段获取的, 但是也可以在 [网站配置](../theme-documentation-basics/#site-configuration) 中设置.
* **lastmod**: 上次修改内容的日期时间.
* **draft**: 如果设为 `true`, 除非 `hugo` 命令使用了 `--buildDrafts`/`-D` 参数, 这篇文章不会被渲染.
* **author**: 文章作者.
* **authorLink**: 文章作者的链接.
* **description**: 文章内容的描述.
* **license**: 这篇文章特殊的许可.
* **tags**: 文章的标签.
* **categories**: 文章所属的类别.
* **hiddenFromHomePage**: 如果设为 `true`, 这篇文章将不会显示在主页上, 但是此行为可以在 [网站配置](../theme-documentation-basics/#site-configuration) 中设置的.
* **featuredImage**: 文章的特色图片.
* **featuredImagePreview**: 用在主页预览的文章特色图片.
* **toc**: 如果设为 `true`, 这篇文章会显示右侧目录.
* **autoCollapseToc**: 如果设为 `true`, 文章目录会自动折叠.
* **math**: 如果设为 `true`, 将自动渲染文章中的数学公式.
* **lightgallery**: 如果设为 `true`, 文章中的图片将可以按照画廊形式呈现.
* **linkToMarkdown**: 如果设为 `true`, 内容的页脚将显示指向原始 Markdown 文件的链接.
* **share**: 和 [网站配置](../theme-documentation-basics/#site-configuration) 中的 `params.share` 对象相同.
* **comment**: 如果设为 `true`, 将启用评论系统.

## 3 内容摘要

**LoveIt** 主题使用内容摘要在主页中显示大致文章信息。Hugo 支持生成文章的摘要.

![文章摘要预览](/images/theme-documentation-content/summary.jpg "文章摘要预览")

### 自动摘要拆分

默认情况下, Hugo 自动将内容的前 70 个单词作为摘要.

你可以通过在 [网站配置](../theme-documentation-basics/#site-configuration) 中设置 `summaryLength` 来自定义摘要长度.

如果您要使用 [CJK]^(中文/日语/韩语) 语言创建内容, 并且想使用 Hugo 的自动摘要拆分功能，请在 [网站配置](../theme-documentation-basics/#site-configuration) 中将 `hasCJKLanguage` 设置为 `true`.

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

1. 如果文章中有 `<!--more-->` 摘要分隔符, 但分隔符之前没有内容, 则使用描述作为摘要.
2. 如果文章中有 `<!--more-->` 摘要分隔符, 则将按照手动摘要拆分的方法获得摘要.
3. 如果文章前置参数中有摘要变量, 那么将以该值作为摘要.
4. 按照自动摘要拆分方法.

{{< admonition >}}
不建议在摘要内容中包含富文本块元素, 这会导致渲染错误. 例如代码块, 图片, 表格等.
{{< /admonition >}}

## 4 Markdown 基本语法

这部分内容在 [Markdown 基本语法页面](../basic-markdown-syntax/) 中介绍.

## 5 Markdown 扩展语法 {#extended-markdown-syntax}

**LoveIt** 主题提供了一些扩展的语法便于你撰写文章.

### Emoji 支持

这部分内容在 [Emoji 支持页面](../emoji-support/) 中介绍.

### 数学公式

**LoveIt** 基于 [$ \KaTeX $](https://katex.org/) 提供数学公式的支持.

在你的 [网站配置](../theme-documentation-basics/#site-configuration) 中的 `[params.math]` 下面设置属性 `enable = true`,
并在文章的前置参数中设置属性 `math: true`来启用数学公式的自动渲染.

{{< admonition tip >}}
有一份 [$ \KaTeX $ 中支持的 $ \TeX $ 函数](https://katex.org/docs/supported.html) 清单.
{{< /admonition >}}

#### 公式块

默认的公式块分割符是 `$$`/`$$` 和 `\\[`/`\\]`:

```markdown
$$ c = \pm\sqrt{a^2 + b^2} $$

\\[ f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\]
```

呈现的输出效果如下:

$$ c = \pm\sqrt{a^2 + b^2} $$

\\[ f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\]

#### 行内公式

默认的行内公式分割符是  `$`/`$` 和 `\\(`/`\\)`:

```markdown
$ c = \pm\sqrt{a^2 + b^2} $ 和 \\( f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\)
```

呈现的输出效果如下:

$ c = \pm\sqrt{a^2 + b^2} $ 和 \\( f(x)=\int_{-\infty}^{\infty} \hat{f}(\xi) e^{2 \pi i \xi x} d \xi \\)

{{< admonition tip >}}
你可以在 [网站配置](../theme-documentation-basics/#site-configuration) 中自定义公式块和行内公式的分割符.
{{< /admonition >}}

#### Copy-tex

**[Copy-tex](https://github.com/Khan/KaTeX/tree/master/contrib/copy-tex)** 是一个 **$ \KaTeX $** 的插件.

通过这个扩展, 在选择并复制 $ \KaTeX $ 渲染的公式时, 会将其 $ \LaTeX $ 源代码复制到剪贴板.

在你的 [网站配置](../theme-documentation-basics/#site-configuration) 中的 `[params.math]` 下面设置属性 `copyTex = true` 来启用 Copy-tex.

选择并复制上一节中渲染的公式, 可以发现复制的内容为 LaTeX 源代码.

#### mhchem

**[mhchem](https://github.com/Khan/KaTeX/tree/master/contrib/mhchem)** 是一个 **$ \KaTeX $** 的插件.

通过这个扩展, 你可以在文章中轻松编写漂亮的化学方程式.

在你的 [网站配置](../theme-documentation-basics/#site-configuration) 中的 `[params.math]` 下面设置属性 `mhchem = true` 来启用 mhchem.

```markdown
$$ \ce{CO2 + C -> 2 CO} $$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$
```

呈现的输出效果如下:

$$ \ce{CO2 + C -> 2 CO} $$

$$ \ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-} $$

### 字符注音或者注释

**LoveIt** 主题支持一种 **字符注音或者注释** Markdown 扩展语法:

```markdown
[Hugo]{?^}(一个开源的静态网站生成工具)
```

呈现的输出效果如下:

[Hugo]^(一个开源的静态网站生成工具)

### Font Awesome

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

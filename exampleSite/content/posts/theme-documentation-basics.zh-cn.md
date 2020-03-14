---
weight: 1
title: "主题文档 - 基本概念"
date: 2020-03-06T21:40:32+08:00
lastmod: 2020-03-06T21:40:32+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "探索 Hugo - LoveIt 主题的全部内容和背后的核心概念."
license: ""

tags: ["安装", "配置"]
categories: ["documentation"]
hiddenFromHomePage: false

featuredImage: "/images/theme-documentation-basics/featured-image.jpg"
featuredImagePreview: ""

toc: true
autoCollapseToc: false
math: false
lightgallery: true
linkToMarkdown: true
share:
  enable: true
comment: true
---

探索 Hugo - **LoveIt** 主题的全部内容和背后的核心概念.

<!--more-->

## 1 准备

由于 Hugo 提供的便利性, [Hugo](https://gohugo.io/) 本身是这个主题唯一的依赖.

直接安装满足你操作系统 (**Windows**, **Linux**, **macOS**) 的最新版本 [:(far fa-file-archive): Hugo (> 0.62.0)](https://gohugo.io/getting-started/installing/).

{{< admonition note "为什么不支持早期版本的 Hugo?" >}}
由于 [Markdown 渲染钩子函数](https://gohugo.io/getting-started/configuration-markup/#markdown-render-hooks) 在 [Hugo 圣诞节版本](https://gohugo.io/news/0.62.0-relnotes/) 中被引入, 本主题只支持高于 **v0.62.0** 的 Hugo 版本.
{{< /admonition >}}

## 2 安装

以下步骤可帮助你初始化新网站. 如果你根本不了解 Hugo, 我们强烈建议你按照此 [快速入门文档](https://gohugo.io/getting-started/quick-start/) 进一步了解它.

### 2.1 创建你的项目

Hugo 提供了一个 `new` 命令来创建一个新的网站:

```bash
hugo new site my_website
cd my_website
```

### 2.2 安装主题

**LoveIt** 主题的仓库是: [https://github.com/dillonzq/LoveIt](https://github.com/dillonzq/LoveIt).

你可以下载主题的 [最新版本 :(far fa-file-archive): .zip 文件](https://github.com/dillonzq/LoveIt/releases) 并且解压放到 `themes` 目录.

另外, 也可以直接把这个主题克隆到 `themes` 目录:

```bash
git clone -b master https://github.com/dillonzq/LoveIt.git themes/LoveIt
```

或者, 初始化你的项目目录为 git 仓库, 并且把主题仓库作为你的网站目录的子模块:

```bash
git init
git submodule -b master add https://github.com/dillonzq/LoveIt.git themes/LoveIt
```

### 2.3 基础配置 {#basic-configuration}

以下是 LoveIt 主题的基本配置:

```toml
baseURL = "http://example.org/"
# [en, zh-cn, fr, ...] 设置默认的语言
defaultContentLanguage = "zh-cn"
# 网站语言, 仅在这里 CN 大写
languageCode = "zh-CN"
# 是否包括中日韩文字
hasCJKLanguage = true
# 网站标题
title = "我的全新 Hugo 网站"

# 更改使用 Hugo 构建网站时使用的默认主题
theme = "LoveIt"

[params]
  # LoveIt 主题版本
  version = "0.1.X"

[menu]
  [[menu.main]]
    identifier = "posts"
    # 你可以在名称 (允许 HTML 格式) 之前添加其他信息, 例如图标
    pre = ""
    name = "文章"
    url = "/posts/"
    # 当你将鼠标悬停在此菜单链接上时, 将显示的标题
    title = ""
    weight = 1
  [[menu.main]]
    identifier = "tags"
    pre = ""
    name = "标签"
    url = "/tags/"
    title = ""
    weight = 2
  [[menu.main]]
    identifier = "categories"
    pre = ""
    name = "分类"
    url = "/categories/"
    title = ""
    weight = 3
```

{{< admonition >}}
在构建网站时, 你可以使用 `--theme` 选项设置主题. 但是, 我建议你修改配置文件 (**config.toml**) 将本主题设置为默认主题.
{{< /admonition >}}

### 2.4 创建你的第一篇文章

以下是创建第一篇文章的方法:

```bash
  hugo new posts/first_post.md
```

通过添加一些示例内容并替换文件开头的标题, 你可以随意编辑文章.

{{< admonition >}}
默认情况下, 所有文章和页面均作为草稿创建. 如果想要渲染这些页面, 请从元数据中删除属性 `draft: true`, 或者设置属性 `draft: false`.
{{< /admonition >}}

### 2.5 在本地启动网站

使用以下命令启动网站:

```bash
hugo serve
```

去查看 `http://localhost:1313`.

![基本配置下的预览](/images/theme-documentation-basics/basic-configuration-preview.zh-cn.png "基本配置下的预览")

{{< admonition tip >}}
当你运行 `hugo serve` 时, 当文件内容更改时, 页面会随着更改自动刷新.
{{< /admonition >}}

### 2.6 构建网站

当你准备好部署你的网站时, 运行以下命令:

```bash
hugo
```

会生成一个 `public` 目录, 其中包含你网站的所有静态内容和资源. 现在可以将其部署在任何 Web 服务器上.

{{< admonition tip >}}
网站内容可以通过 [Netlify](https://www.netlify.com/) 自动发布和托管 (了解有关[通过 Netlify 进行 HUGO 自动化部署](https://www.netlify.com/blog/2015/07/30/hosting-hugo-on-netlifyinsanely-fast-deploys/) 的更多信息).
或者, 您可以使用 [AWS Amplify](https://gohugo.io/hosting-and-deployment/hosting-on-aws-amplify/), [Github pages](https://gohugo.io/hosting-and-deployment/hosting-on-github/), [Render](https://gohugo.io/hosting-and-deployment/hosting-on-render/) 以及更多...
{{< /admonition >}}

## 3 配置

### 3.1 网站配置 {#site-configuration}

除了 [Hugo 全局配置](https://gohugo.io/overview/configuration/) 和 [菜单配置](#basic-configuration) 之外, **LoveIt** 主题还允许您在网站配置中定义以下参数 (这是一个示例 `config.toml`, 其内容为默认值).

{{< admonition >}}
请注意, 本文档其他部分将详细解释其中一些参数.
{{< /admonition >}}

```toml
[params]
  # LoveIt 主题版本
  version = "0.1.X"
  # 网站描述
  description = "这是我的全新 Hugo 网站"
  # 网站关键词
  keywords = ["Theme", "Hugo"]
  # 网站默认主题样式 ("light", "dark", "auto")
  defaultTheme = "auto"
  # 公共 git 仓库路径，仅在 enableGitInfo 设为 true 时有效
  gitRepo = ""
  # LoveIt :(fas fa-greater-than-equal): :(far fa-file-archive): v0.1.1
  # 哪种哈希函数用来 SRI, 为空时表示不使用 SRI ("sha256", "sha384", "sha512", "md5")
  fingerprint = ""
  # 页面头部导航栏信息
  [params.header]
    # 桌面端导航栏模式 ("fixed", "normal", "auto")
    desktopMode = "fixed"
    # 移动端导航栏模式 ("fixed", "normal", "auto")
    mobileMode = "auto"
  # 页面底部版权信息设置
  [params.footer]
    # 网站创立年份
    since = 2019
    # ICP 备案信息，仅在中国使用 (允许使用 HTML 格式)
    icp = ""
    # 许可协议信息 (允许使用 HTML 格式)
    license= '<a rel="license external nofollow noopener noreffer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'
  # 文章页面配置
  [params.home]
    # 主页信息设置
    [params.home.profile]
      enable = true
      # Gravatar 邮箱，用于优先在主页显示的头像
      gravatarEmail = ""
      # 主页显示头像的 URL
      avatarURL = "/images/avatar.png"
      # 主页显示的网站副标题
      subtitle = "这是我的全新 Hugo 网站"
      # 是否为副标题显示打字机动画
      typeit = true
      # 是否显示社交账号
      social = true
    # 主页文章列表
    [params.home.posts]
      enable = true
      # 主页每页显示文章数量
      paginate = 6
      # 当你没有在文章前置参数中设置 "hiddenFromHomePage" 时的默认行为
      defaultHiddenFromHomePage = false
  # 主页的社交信息设置
  [params.social]
    GitHub = "xxxx"
    # Linkedin = "xxxx"
    # Twitter = "xxxx"
    # Instagram = "xxxx"
    Email = "xxxx@xxxx.com"
    # Facebook = "xxxx"
    # Telegram = "xxxx"
    # Medium = "xxxx"
    # Gitlab = "xxxx"
    # Youtubelegacy = "xxxx"
    # Youtubecustom = "xxxx"
    # Youtubechannel = "xxxx"
    # Tumblr ="xxxx"
    # Quora = "xxxx"
    # Keybase = "xxxx"
    # Pinterest = "xxxx"
    # Reddit = "xxxx"
    # Codepen = "xxxx"
    # FreeCodeCamp = "xxxx"
    # Bitbucket = "xxxx"
    # Stackoverflow = "xxxx"
    Weibo = "xxxx"
    # Odnoklassniki = "xxxx"
    # VK = "xxxx"
    # Flickr = "xxxx"
    # Xing = "xxxx"
    # Snapchat = "xxxx"
    # Soundcloud = "xxxx"
    # Spotify = "xxxx"
    # Bandcamp = "xxxx"
    # Paypal = "xxxx"
    # Fivehundredpx = "xxxx"
    # Mix = "xxxx"
    # Goodreads = "xxxx"
    # Lastfm = "xxxx"
    # Foursquare = "xxxx"
    # Hackernews = "xxxx"
    # Kickstarter = "xxxx"
    # Patreon = "xxxx"
    # Steam = "xxxx"
    # Twitch = "xxxx"
    # Strava = "xxxx"
    # Skype = "xxxx"
    # Whatsapp = "xxxx"
    Zhihu = "xxxx"
    Douban = "xxxx"
    # Angellist = "xxxx"
    # Slidershare = "xxxx"
    # Jsfiddle = "xxxx"
    # Deviantart = "xxxx"
    # Behance = "xxxx"
    # Dribble = "xxxx"
    # Wordpress = "xxxx"
    # Vine = "xxxx"
    # Googlescholar = "xxxx"
    # Researchgate = "xxxx"
    # Mastodon = "xxxx"
    # MastodonPrefix = "https://mastodon.technology/"
    # Thingiverse = "xxxx"
    # Devto = "xxxx"
    # Gitea = "xxxx"
    # XMPP = "xxxx"
    # Matrix = "xxxx"
    Bilibili = "xxxx"
  # 文章页面配置
  [params.page]
    # 是否在文章页面使用 lightgallery
    lightgallery = true
    # 是否在文章页面显示原始 Markdown 文档链接
    linkToMarkdown = true
  # 数学公式 (KaTeX https://katex.org/)
  [params.math]
    enable = true
    # 默认块定界符是 $$ ... $$ 和 \\[ ... \\]
    blockLeftDelimiter = ""
    blockRightDelimiter = ""
    # 默认内联定界符是 $ ... $ 和 \\( ... \\)
    inlineLeftDelimiter = ""
    inlineRightDelimiter = ""
    # KaTeX 插件 copy_tex
    copyTex = true
    # KaTeX 插件 mhchem
    mhchem = true
  # 文章页面的分享信息设置
  [params.share]
    enable = true
    Twitter = true
    Facebook = true
    # Linkedin = true
    # Whatsapp = true
    # Pinterest = true
    # Tumblr = true
    # HackerNews = true
    # Reddit = true
    # VK = true
    # Buffer = true
    # Xing = true
    # Line = true
    # Instapaper = true
    # Pocket = true
    # Digg = true
    # Stumbleupon = true
    # Flipboard = true
    Weibo = true
    # Renren = true
    # Myspace = true
    # Blogger = true
    # Baidu = true
    # Odnoklassniki = true
    Evernote = true
    # Skype = true
    # Trello = true
    # Mix = true
  # 评论系统设置
  [params.comment]
    enable = true
    # Disqus 评论系统设置 (https://disqus.com/)
    [params.comment.disqus]
      # LoveIt :(fas fa-greater-than-equal): :(far fa-file-archive): v0.1.1
      enable = false
      # Disqus 的 shortname，用来在文章中启用 Disqus 评论系统
      shortname = ""
    # Gitalk 评论系统设置 (https://github.com/gitalk/gitalk)
    [params.comment.gitalk]
      # LoveIt :(fas fa-greater-than-equal): :(far fa-file-archive): v0.1.1
      enable = false
      owner = ""
      repo = ""
      clientId = ""
      clientSecret = ""
    # Valine 评论系统设置 (https://github.com/xCss/Valine)
    [params.comment.valine]
      enable = false
      appId = ""
      appKey = ""
      placeholder = "Your comment ..."
      notify = false
      verify = true
      avatar = "mp"
      meta= ""
      pageSize = 10
      lang = "en"
      visitor = true
      recordIP = true
    # Facebook 评论系统设置 (https://developers.facebook.com/docs/plugins/comments)
    [params.comment.facebook]
      enable = false
      width = "100%"
      numPosts = 10
      appId = ""
      languageCode = "en_US"

  # 网站验证代码，用于 Google/Bing/Yandex/Pinterest/Baidu
  [params.verification]
    google = ""
    bing = ""
    yandex = ""
    pinterest = ""
    baidu = ""
  # 出版者信息，仅用于 SEO
  [params.publisher]
    name = "xxxx"
    [params.publisher.logo]
      url = "logo.png"
      width = 127
      height = 40
  # 网站 Logo 信息，仅用于 SEO
  [params.logo]
    url = "logo.png"
    width = 127
    height = 40
  # 网站图标信息，仅用于 SEO
  [params.image]
    url = "cover.png"
    width = 800
    height = 600
  # CSS 和 JS 文件的 CDN 设置
  [params.cdn]
    # fontawesome-free@5.12.1 https://fontawesome.com/
    fontawesomeFreeCSS = ''
    # animate.css@3.7.2 https://github.com/daneden/animate.css
    animateCSS = ''
    # smooth-scroll@16.1.2 https://github.com/cferdinandi/smooth-scroll
    smoothScrollJS = ''
    # sharer@0.4.0 https://github.com/ellisonleao/sharer.js
    sharerJS = ''
    # lazysizes@5.2.0 https://github.com/aFarkas/lazysizes
    lazysizesJS = ''
    # lightgallery@1.1.3 lg-thumbnail@1.1.0 lg-zoom@1.1.0 https://github.com/sachinchoolur/lightgallery.js
    lightgalleryCSS = ''
    lightgalleryJS = ''
    lightgalleryThumbnailJS = ''
    lightgalleryZoomJS = ''
    # typeit@6.5.1 https://github.com/alexmacarthur/typeit
    typeitJS = ''
    # katex@0.11.1 https://github.com/KaTeX/KaTeX
    katexCSS = ''
    katexJS = ''
    katexAutoRenderJS = ''
    katexCopyTexCSS = ''
    katexCopyTexJS = ''
    katexMhchemJS = ''
    # mermaid@8.4.8 https://github.com/knsv/mermaid
    mermaidJS = ''
    # aplayer@1.10.1 https://github.com/MoePlayer/APlayer
    aplayerCSS = ''
    aplayerJS = ''
    # meting@2.0.1 https://github.com/metowolf/MetingJS
    metingJS = ''
    # echarts@4.6.0 https://echarts.apache.org/
    echartsJS = ''
    echartsMacaronsJS = ''
    # gitalk@1.6.2 https://github.com/gitalk/gitalk
    gitalkCSS = ''
    gitalkJS = ''
    # valine@1.3.10 https://valine.js.org/
    valineJS = ''

# Hugo 解析文档的配置
[markup]
  # 语法高亮设置 (https://gohugo.io/content-management/syntax-highlighting)
  [markup.highlight]
    codeFences = true
    guessSyntax = true
    lineNoStart = 1
    lineNos = true
    lineNumbersInTable = true
    noClasses = false
    style = "monokai"
    tabWidth = 4
  # Goldmark 是 Hugo 0.60 以来的默认 Markdown 解析库
  [markup.goldmark]
    [markup.goldmark.extensions]
      definitionList = true
      footnote = true
      linkify = true
      strikethrough = true
      table = true
      taskList = true
      typographer = true
    [markup.goldmark.renderer]
      # 是否在文档中直接使用 HTML 标签
      unsafe = true
  # 目录设置
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 6

# 作者信息
[author]
  name = "xxxx"
  link = ""

# 网站地图信息
[sitemap]
  changefreq = "weekly"
  filename = "sitemap.xml"
  priority = 0.5

# Permalinks 信息 (https://gohugo.io/content-management/urls/#permalinks)
[Permalinks]
  # posts = ":year/:month/:filename"
  posts = ":filename"

# 隐私信息设置 (https://gohugo.io/about/hugo-and-gdpr/)
[privacy]
  [privacy.googleAnalytics]
    anonymizeIP = true

  [privacy.youtube]
    privacyEnhanced = true

# 用于输出 Markdown 格式文档的设置
[mediaTypes]
  [mediaTypes."text/plain"]
    suffixes = ["md"]

# 用于输出 Markdown 格式文档的设置
[outputFormats.MarkDown]
  mediaType = "text/plain"
  isPlainText = true
  isHTML = false

# 用于 Hugo 输出文档的设置
[outputs]
  home = ["HTML", "RSS"]
  page = ["HTML", "MarkDown"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML", "RSS"]
  taxonomyTerm = ["HTML"]
```

![完整配置下的预览](/images/theme-documentation-basics/complete-configuration-preview.zh-cn.png "完整配置下的预览")

### 3.2 网站图标, 浏览器配置, 网站清单

强烈建议你把:

* apple-touch-icon.png (180x180)
* favicon-32x32.png (32x32)
* favicon-16x16.png (16x16)
* mstile-150x150.png (150x150)
* android-chrome-192x192.png (192x192)
* android-chrome-512x512.png (512x512)

放在 `/static` 目录. 利用 [https://realfavicongenerator.net/](https://realfavicongenerator.net/) 可以很容易地生成这些文件.

可以自定义 `browserconfig.xml` 和 `site.webmanifest` 文件来设置 theme-color 和 background-color.

### 3.3 增加网站 logo 和封面用于 SEO 优化

在 `static` 目录增加一个 logo 图片 (127x40) 和一个封面图片 (800x600).

### 3.4 自定义样式

通过定义自定义 `.scss` 样式文件, **LoveIt** 主题支持可配置的样式.

包含自定义 `.scss` 样式文件的目录相对于 **你的项目根目录** 的路径为 `config/css`.

在 `config/css/_override.scss` 中, 你可以覆盖 `themes/LoveIt/assets/css/_variables.scss` 中的变量以自定义样式.

这是一个例子:

```scss
@import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,700&display=swap&subset=latin-ext');
$code-font-family: Fira Mono, Source Code Pro, Menlo, Consolas, Monaco, monospace;
```

在 `config/css/_custom.scss` 中, 你可以添加一些 CSS 样式代码以自定义样式.

## 4 多语言和 i18n

**LoveIt** 主题完全兼容 Hugo 的多语言模式.

支持:

* 多种语言的翻译字符串 (**英语**, **中文**和**法语**). **欢迎贡献!**
* 在浏览器内语言切换

![语言切换](/images/theme-documentation-basics/language-switch.gif "语言切换")

### 4.1 基本配置

学习了 [Hugo如何处理多语言网站](https://gohugo.io/content-management/multilingual) 之后, 请在 [站点配置](#site-configuration) 中定义你的网站语言.

例如, 一个支持英语, 中文和法语的网站配置:

```toml
# [en, zh-cn, fr, ...] 设置默认的语言
defaultContentLanguage = "zh-cn"

[languages]
  [languages.en]
    weight = 1
    title = "My New Hugo Site"
    languageCode = "en"
    languageName = "English"
    [[languages.en.menu.main]]
      identifier = "posts"
      pre = ""
      name = "Posts"
      url = "/posts/"
      title = ""
      weight = 1
    [[languages.en.menu.main]]
      identifier = "tags"
      pre = ""
      name = "Tags"
      url = "/tags/"
      title = ""
      weight = 2
    [[languages.en.menu.main]]
      identifier = "categories"
      pre = ""
      name = "Categories"
      url = "/categories/"
      title = ""
      weight = 3

  [languages.zh-cn]
    weight = 2
    title = "我的全新 Hugo 网站"
    # 网站语言, 仅在这里 CN 大写
    languageCode = "zh-CN"
    languageName = "简体中文"
    # 是否包括中日韩文字
    hasCJKLanguage = true
    [[languages.zh-cn.menu.main]]
      identifier = "posts"
      pre = ""
      name = "文章"
      url = "/posts/"
      title = ""
      weight = 1
    [[languages.zh-cn.menu.main]]
      identifier = "tags"
      pre = ""
      name = "标签"
      url = "/tags/"
      title = ""
      weight = 2
    [[languages.zh-cn.menu.main]]
      identifier = "categories"
      pre = ""
      name = "分类"
      url = "/categories/"
      title = ""
      weight = 3

  [languages.fr]
    weight = 3
    title = "Mon nouveau site Hugo"
    languageCode = "fr"
    languageName = "Français"
    [[languages.fr.menu.main]]
      identifier = "posts"
      pre = ""
      name = "Postes"
      url = "/posts/"
      title = ""
      weight = 1
    [[languages.fr.menu.main]]
      identifier = "tags"
      pre = ""
      name = "Balises"
      url = "/tags/"
      title = ""
      weight = 2
    [[languages.fr.menu.main]]
      identifier = "categories"
      name = "Catégories"
      pre = ""
      url = "/categories/"
      title = ""
      weight = 3
```

然后, 对于每个新页面, 将语言代码附加到文件名中.

单个文件 `my-page.md` 需要分为三个文件:

* 英语: `my-page.en.md`
* 中文: `my-page.zh-cn.md`
* 法语: `my-page.fr.md`

{{< admonition >}}
请注意, 菜单中仅显示翻译的页面. 它不会替换为默认语言内容.
{{< /admonition >}}

{{< admonition tip >}}
也可以使用 [文章前置参数](https://gohugo.io/content-management/multilingual/#translate-your-content) 来翻译网址.
{{< /admonition >}}

### 4.2 修改默认的翻译字符串

翻译字符串用于在主题中使用的常见默认值.
目前提供**英语**, **中文**和**法语**翻译, 但你可能自定义其他语言或覆盖默认值.

要覆盖默认值, 请在项目的 i18n 目录 `i18n/<languageCode>.toml` 中创建一个新文件，并从 `themes/LoveIt/i18n/en.toml` 中获得提示.

另外, 由于你的翻译可能会帮助到其他人, 请花点时间通过 [创建一个 PR](https://github.com/dillonzq/LoveIt/pulls) 来贡献主题翻译, 谢谢!

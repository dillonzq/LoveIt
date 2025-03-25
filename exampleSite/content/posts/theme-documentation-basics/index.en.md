---
weight: 1
title: "Theme Documentation - Basics"
date: 2020-03-06T21:29:01+08:00
lastmod: 2020-03-06T21:29:01+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "Discover what the Hugo - LoveIt theme is all about and the core-concepts behind it."
images: []
resources:
- name: "featured-image"
  src: "featured-image.jpg"

tags: ["installation", "configuration"]
categories: ["documentation"]

lightgallery: true

toc:
  auto: false
---

Discover what the Hugo - **LoveIt** theme is all about and the core-concepts behind it.

<!--more-->

## 1 Requirements

Thanks to the simplicity of Hugo, [Hugo](https://gohugo.io/) is the only dependency of this theme.

Just install latest edition of [:(far fa-file-archive fa-fw): Hugo](https://gohugo.io/getting-started/installing/) for your OS (**Windows**, **Linux**, **macOS**).

{{< admonition note "When you need to use Hugo extended edition?" false >}}
When you want [style customization](#style-customization), you need to use the Hugo **extended edition** for correct rendering.

![Hugo extended edition](hugo-extended-edition.png "Hugo extended edition")
{{< /admonition >}}

## 2 Installation

The following steps are here to help you initialize your new website. If you don’t know Hugo at all, we strongly suggest you learn more about it by following this [great documentation for beginners](https://gohugo.io/getting-started/quick-start/).

### 2.1 Create Your Project

Hugo provides a `new` command to create a new website:

```bash
hugo new site my_website
cd my_website
```

### 2.2 Install the Theme

The **LoveIt** theme's repository is: [https://github.com/dillonzq/LoveIt](https://github.com/dillonzq/LoveIt).

You can download the [release :(far fa-file-archive fa-fw): .zip file](https://github.com/dillonzq/LoveIt/releases) of the theme and extract it in the `themes` directory.

Alternatively, clone this repository to the `themes` directory:

```bash
git clone https://github.com/dillonzq/LoveIt.git themes/LoveIt
```

Or, create an empty git repository and make this repository a submodule of your site directory:

```bash
git init
git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt
```

{{< admonition note "LoveIt theme's compatibility" >}}

| LoveIt branch or version | Supported Hugo versions |
|:-------------------------|:-----------------------:|
| master(Unstable)         |        ≥ 0.128.0        |
| **0.3.X(Recommended)**   |    0.128.0 - 0.145.0    |
| 0.2.X(Outdated)          |    0.68.0 - 0.127.0     |

{{< /admonition >}}

### 2.3 Basic Configuration {#basic-configuration}

The following is a basic configuration for the LoveIt theme:

```toml
baseURL = "http://example.org/"

# Change the default theme to be use when building the site with Hugo
theme = "LoveIt"

# website title
title = "My New Hugo Site"

# language code ["en", "zh-CN", "fr", "pl", ...]
languageCode = "en"
# language name ["English", "简体中文", "Français", "Polski", ...]
languageName = "English"

# Menu config
[menu]
  [[menu.main]]
    weight = 1
    identifier = "posts"
    # you can add extra information before the name (HTML format is supported), such as icons
    pre = ""
    # you can add extra information after the name (HTML format is supported), such as icons
    post = ""
    name = "Posts"
    url = "/posts/"
    # title will be shown when you hover on this menu link
    title = ""
  [[menu.main]]
    weight = 2
    identifier = "tags"
    pre = ""
    post = ""
    name = "Tags"
    url = "/tags/"
    title = ""
  [[menu.main]]
    weight = 3
    identifier = "categories"
    pre = ""
    post = ""
    name = "Categories"
    url = "/categories/"
    title = ""

# Markup related configuration in Hugo
[markup]
  # Syntax Highlighting (https://gohugo.io/content-management/syntax-highlighting)
  [markup.highlight]
    # false is a necessary configuration (https://github.com/dillonzq/LoveIt/issues/158)
    noClasses = false
```

{{< admonition >}}
When building the website, you can set a theme by using `--theme` option. However, we suggest you modify the configuration file (**hugo.toml**) and set the theme as the default.
{{< /admonition >}}

### 2.4 Create Your First Post

Here is the way to create your first post:

```bash
hugo new posts/first_post.md
```

Feel free to edit the post file by adding some sample content and replacing the title value in the beginning of the file.

{{< admonition >}}
By default all posts and pages are created as a draft. If you want to render these pages, remove the property `draft: true` from the metadata, set the property `draft: false` or add `-D`/`--buildDrafts` parameter to `hugo` command.
{{< /admonition >}}

### 2.5 Launching the Website Locally

Launch by using the following command:

```bash
hugo serve
```

Go to `http://localhost:1313`.

![Basic configuration preview](basic-configuration-preview.png "Basic configuration preview")

{{< admonition tip >}}
When you run `hugo serve`, when the contents of the files change, the page automatically refreshes with the changes.
{{< /admonition >}}

{{< admonition >}}
Since the theme use `.Scratch` in Hugo to implement some features,
it is highly recommended that you add `--disableFastRender` parameter to `hugo server` command for the live preview of the page you are editing.

```bash
hugo serve --disableFastRender
```

{{< /admonition >}}

### 2.6 Build the Website

When your site is ready to deploy, run the following command:

```bash
hugo
```

A `public` folder will be generated, containing all static content and assets for your website. It can now be deployed on any web server.

{{< admonition tip >}}
The website can be automatically published and hosted with [Netlify](https://www.netlify.com/) (Read more about [Automated HUGO deployments with Netlify](https://www.netlify.com/blog/2015/07/30/hosting-hugo-on-netlifyinsanely-fast-deploys/)).
Alternatively, you can use [AWS Amplify](https://gohugo.io/hosting-and-deployment/hosting-on-aws-amplify/), [Github pages](https://gohugo.io/hosting-and-deployment/hosting-on-github/), [Render](https://gohugo.io/hosting-and-deployment/hosting-on-render/) and more...
{{< /admonition >}}

## 3 Configuration

### 3.1 Site Configuration {#site-configuration}

In addition to [Hugo global configuration](https://gohugo.io/overview/configuration/) and [menu configuration](#basic-configuration), **LoveIt** lets you define the following parameters in your site configuration (here is a `hugo.toml`, whose values are default).

Please open the code block below to view the complete sample configuration :(far fa-hand-point-down fa-fw)::

```toml
baseURL = "http://example.org/"

# Change the default theme to be use when building the site with Hugo
theme = "LoveIt"

# website title
title = "My New Hugo Site"

# language code ["en", "zh-CN", "fr", "pl", ...]
languageCode = "en"
# language name ["English", "简体中文", "Français", "Polski", ...]
languageName = "English"
# whether to include Chinese/Japanese/Korean
hasCJKLanguage = false

# copyright description used only for seo schema
copyright = ""

# whether to use robots.txt
enableRobotsTXT = true
# whether to use git commit log
enableGitInfo = true
# whether to use emoji code
enableEmoji = true

# ignore some build errors
ignoreErrors = ["error-remote-getjson", "error-missing-instagram-accesstoken"]

# Pagination config
[pagination]
  disableAliases = false
  pagerSize = 10
  path = "page"

# Menu config
[menu]
  [[menu.main]]
    weight = 1
    identifier = "posts"
    # you can add extra information before the name (HTML format is supported), such as icons
    pre = ""
    # you can add extra information after the name (HTML format is supported), such as icons
    post = ""
    name = "Posts"
    url = "/posts/"
    # title will be shown when you hover on this menu link
    title = ""
  [[menu.main]]
    weight = 2
    identifier = "tags"
    pre = ""
    post = ""
    name = "Tags"
    url = "/tags/"
    title = ""
  [[menu.main]]
    weight = 3
    identifier = "categories"
    pre = ""
    post = ""
    name = "Categories"
    url = "/categories/"
    title = ""

[params]
  # site default theme ["auto", "light", "dark"]
  defaultTheme = "auto"
  # public git repo url only then enableGitInfo is true
  gitRepo = ""
  # {{< version 0.1.1 >}} which hash function used for SRI, when empty, no SRI is used
  # ["sha256", "sha384", "sha512", "md5"]
  fingerprint = ""
  # {{< version 0.2.0 >}} date format
  dateFormat = "2006-01-02"
  # website title for Open Graph and Twitter Cards
  title = "My cool site"
  # website description for RSS, SEO, Open Graph and Twitter Cards
  description = "This is my cool site"
  # website images for Open Graph and Twitter Cards
  images = ["/logo.png"]

# Author config
  [params.author]
    name = "xxxx"
    email = ""
    link = ""

  # Header config
  [params.header]
    # desktop header mode ["fixed", "normal", "auto"]
    desktopMode = "fixed"
    # mobile header mode ["fixed", "normal", "auto"]
    mobileMode = "auto"
    # {{< version 0.2.0 >}} Header title config
    [params.header.title]
      # URL of the LOGO
      logo = ""
      # title name
      name = ""
      # you can add extra information before the name (HTML format is supported), such as icons
      pre = ""
      # you can add extra information after the name (HTML format is supported), such as icons
      post = ""
      # {{< version 0.2.5 >}} whether to use typeit animation for title name
      typeit = false

  # Footer config
  [params.footer]
    enable = true
    # {{< version 0.2.0 >}} Custom content (HTML format is supported)
    custom = ''
    # {{< version 0.2.0 >}} whether to show Hugo and theme info
    hugo = true
    # {{< version 0.2.0 >}} whether to show copyright info
    copyright = true
    # {{< version 0.2.0 >}} whether to show the author
    author = true
    # Site creation time
    since = 2019
    # ICP info only in China (HTML format is supported)
    icp = ""
    # license info (HTML format is supported)
    license = '<a rel="license external nofollow noopener noreffer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'

  # {{< version 0.2.0 >}} Section (all posts) page config
  [params.section]
    # special amount of posts in each section page
    paginate = 20
    # date format (month and day)
    dateFormat = "01-02"
    # amount of RSS pages
    rss = 10

  # {{< version 0.2.0 >}} List (category or tag) page config
  [params.list]
    # special amount of posts in each list page
    paginate = 20
    # date format (month and day)
    dateFormat = "01-02"
    # amount of RSS pages
    rss = 10

  # {{< version 0.2.0 >}} App icon config
  [params.app]
    # optional site title override for the app when added to an iOS home screen or Android launcher
    title = "My cool site"
    # whether to omit favicon resource links
    noFavicon = false
    # modern SVG favicon to use in place of older style .png and .ico files
    svgFavicon = ""
    # Android browser theme color
    themeColor = "#ffffff"
    # Safari mask icon color
    iconColor = "#5bbad5"
    # Windows v8-10 tile color
    tileColor = "#da532c"

  # {{< version 0.2.0 >}} Search config
  [params.search]
    enable = true
    # type of search engine ["lunr", "algolia"]
    type = "lunr"
    # max index length of the chunked content
    contentLength = 4000
    # placeholder of the search bar
    placeholder = ""
    # {{< version 0.2.1 >}} max number of results length
    maxResultLength = 10
    # {{< version 0.2.3 >}} snippet length of the result
    snippetLength = 30
    # {{< version 0.2.1 >}} HTML tag name of the highlight part in results
    highlightTag = "em"
    # {{< version 0.2.4 >}} whether to use the absolute URL based on the baseURL in search index
    absoluteURL = false
    [params.search.algolia]
      index = ""
      appID = ""
      searchKey = ""

  # Home page config
  [params.home]
    # {{< version 0.2.0 >}} amount of RSS pages
    rss = 10
    # Home page profile
    [params.home.profile]
      enable = true
      # Gravatar Email for preferred avatar in home page
      gravatarEmail = ""
      # URL of avatar shown in home page
      avatarURL = "/images/avatar.png"
      # {{< version 0.2.7 changed >}} title shown in home page (HTML format is supported)
      title = ""
      # subtitle shown in home page (HTML format is supported)
      subtitle = "This is My New Hugo Site"
      # whether to use typeit animation for subtitle
      typeit = true
      # whether to show social links
      social = true
      # {{< version 0.2.0 >}} disclaimer (HTML format is supported)
      disclaimer = ""
    # Home page posts
    [params.home.posts]
      enable = true
      # special amount of posts in each home posts page
      paginate = 6
      # {{< version 0.2.0 deleted >}} replaced with hiddenFromHomePage in params.page
      # default behavior when you don't set "hiddenFromHomePage" in front matter
      defaultHiddenFromHomePage = false

  # Social config about the author
  [params.social]
    GitHub = "xxxx"
    Linkedin = ""
    X = "xxxx" # {{< version 0.3.1 >}}
    Twitter = "" # {{< version 0.3.1 deprecated >}}
    Instagram = "xxxx"
    Facebook = "xxxx"
    Telegram = "xxxx"
    Medium = ""
    Gitlab = ""
    Youtubelegacy = ""
    Youtubecustom = ""
    Youtubechannel = ""
    Tumblr = ""
    Quora = ""
    Keybase = ""
    Pinterest = ""
    Reddit = ""
    Codepen = ""
    FreeCodeCamp = ""
    Bitbucket = ""
    Stackoverflow = ""
    Weibo = ""
    Odnoklassniki = ""
    VK = ""
    Flickr = ""
    Xing = ""
    Snapchat = ""
    Soundcloud = ""
    Spotify = ""
    Bandcamp = ""
    Paypal = ""
    Fivehundredpx = ""
    Mix = ""
    Goodreads = ""
    Lastfm = ""
    Foursquare = ""
    Hackernews = ""
    Kickstarter = ""
    Patreon = ""
    Steam = ""
    Twitch = ""
    Strava = ""
    Skype = ""
    Whatsapp = ""
    Zhihu = ""
    Douban = ""
    Angellist = ""
    Slidershare = ""
    Jsfiddle = ""
    Deviantart = ""
    Behance = ""
    Dribbble = ""
    Wordpress = ""
    Vine = ""
    Googlescholar = ""
    Researchgate = ""
    Mastodon = ""
    Thingiverse = ""
    Devto = ""
    Gitea = ""
    XMPP = ""
    Matrix = ""
    Bilibili = ""
    Discord = ""
    DiscordInvite = ""
    Lichess = ""
    ORCID = ""
    Pleroma = ""
    Kaggle = ""
    MediaWiki = ""
    Plume = ""
    HackTheBox = ""
    RootMe = ""
    Malt = "" # {{< version 0.3.0 >}}
    TikTok = "" # {{< version 0.3.0 >}}
    TryHackMe = "" # {{< version 0.3.0 >}}
    Codeberg = "" # {{< version 0.3.0 >}}
    HuggingFace = "" # {{< version 0.3.1 >}}
    Threads = "" # {{< version 0.3.1 >}}
    Phone = ""
    Email = "xxxx@xxxx.com"
    RSS = true # {{< version 0.2.0 >}}

  # {{< version 0.2.0 changed >}} Page global config
  [params.page]
    # {{< version 0.2.0 >}} whether to hide a page from home page
    hiddenFromHomePage = false
    # {{< version 0.2.0 >}} whether to hide a page from search results
    hiddenFromSearch = false
    # {{< version 0.2.0 >}} whether to enable twemoji
    twemoji = false
    # whether to enable lightgallery
    lightgallery = false
    # {{< version 0.2.0 >}} whether to enable the ruby extended syntax
    ruby = true
    # {{< version 0.2.0 >}} whether to enable the fraction extended syntax
    fraction = true
    # {{< version 0.2.0 >}} whether to enable the fontawesome extended syntax
    fontawesome = true
    # whether to show link to Raw Markdown content of the content
    linkToMarkdown = true
    # {{< version 0.2.4 >}} whether to show the full text content in RSS
    rssFullText = false
    # {{< version 0.2.0 >}} Table of the contents config
    [params.page.toc]
      # whether to enable the table of the contents
      enable = true
      # {{< version 0.2.9 >}} whether to keep the static table of the contents in front of the post
      keepStatic = false
      # whether to make the table of the contents in the sidebar automatically collapsed
      auto = true
    # {{< version 0.2.0 changed >}} {{< link "https://katex.org/" KaTeX >}} mathematical formulas
    [params.page.math]
      enable = true
      # {{< version 0.2.11 changed >}} default inline delimiter is $ ... $ and \( ... \)
      inlineLeftDelimiter = ""
      inlineRightDelimiter = ""
      # {{< version 0.2.11 changed >}} default block delimiter is $$ ... $$, \[ ... \], \begin{equation} ... \end{equation} and some other functions
      blockLeftDelimiter = ""
      blockRightDelimiter = ""
      # KaTeX extension copy_tex
      copyTex = true
      # KaTeX extension mhchem
      mhchem = true
    # {{< version 0.2.0 >}} Code config
    [params.page.code]
      # whether to show the copy button of the code block
      copy = true
      # the maximum number of lines of displayed code by default
      maxShownLines = 50
    # {{< version 0.2.0 >}} {{< link "https://docs.mapbox.com/mapbox-gl-js" "Mapbox GL JS" >}} config
    [params.page.mapbox]
      # access token of Mapbox GL JS
      accessToken = ""
      # style for the light theme
      lightStyle = "mapbox://styles/mapbox/light-v10?optimize=true"
      # style for the dark theme
      darkStyle = "mapbox://styles/mapbox/dark-v10?optimize=true"
      # whether to add {{< link "https://docs.mapbox.com/mapbox-gl-js/api#navigationcontrol" NavigationControl >}}
      navigation = true
      # whether to add {{< link "https://docs.mapbox.com/mapbox-gl-js/api#geolocatecontrol" GeolocateControl >}}
      geolocate = true
      # whether to add {{< link "https://docs.mapbox.com/mapbox-gl-js/api#scalecontrol" ScaleControl >}}
      scale = true
      # whether to add {{< link "https://docs.mapbox.com/mapbox-gl-js/api#fullscreencontrol" FullscreenControl >}}
      fullscreen = true
    # {{< version 0.2.0 changed >}} social share links in post page
    [params.page.share]
      enable = true
      X = true # {{< version 0.3.1 >}}
      Twitter = false # {{< version 0.3.1 deprecated >}}
      Threads = true # {{< version 0.3.1 >}}
      Facebook = true
      Linkedin = false
      Whatsapp = false
      Pinterest = false
      Tumblr = false
      HackerNews = true
      Reddit = false
      VK = false
      Buffer = false
      Xing = false
      Line = true
      Instapaper = false
      Pocket = false
      Flipboard = false
      Weibo = true
      Blogger = false
      Baidu = false
      Odnoklassniki = false
      Evernote = false
      Skype = false
      Trello = false
      Diaspora = true # {{< version 0.3.1 >}}
      Mix = false
      Telegram = true # {{< version 0.3.1 >}}
    # {{< version 0.2.0 changed >}} Comment config
    [params.page.comment]
      enable = false
      # {{< link "https://disqus.com/" Disqus >}} comment config
      [params.page.comment.disqus]
        # {{< version 0.1.1 >}}
        enable = false
        # Disqus shortname to use Disqus in posts
        shortname = ""
      # {{< link "https://github.com/gitalk/gitalk" Gitalk >}} comment config
      [params.page.comment.gitalk]
        # {{< version 0.1.1 >}}
        enable = false
        owner = ""
        repo = ""
        clientId = ""
        clientSecret = ""
      # {{< link "https://github.com/xCss/Valine" Valine >}} comment config
      [params.page.comment.valine]
        enable = false
        appId = ""
        appKey = ""
        placeholder = ""
        avatar = "mp"
        meta= ""
        pageSize = 10
        # automatically adapt the current theme i18n configuration when empty
        lang = ""
        visitor = true
        recordIP = true
        highlight = true
        enableQQ = false
        serverURLs = ""
        # {{< version 0.2.6 >}} emoji data file name, default is "google.yml"
        # ["apple.yml", "google.yml", "facebook.yml", "twitter.yml"]
        # located in "themes/LoveIt/assets/lib/valine/emoji/" directory
        # you can store your own data files in the same path under your project:
        # "assets/lib/valine/emoji/"
        emoji = ""
      # {{< link "https://developers.facebook.com/docs/plugins/comments" "Facebook comment" >}} config
      [params.page.comment.facebook]
        enable = false
        width = "100%"
        numPosts = 10
        appId = ""
        # automatically adapt the current theme i18n configuration when empty
        languageCode = ""
      # {{< version 0.2.0 >}} {{< link "https://comments.app/" "Telegram comments" >}} config
      [params.page.comment.telegram]
        enable = false
        siteID = ""
        limit = 5
        height = ""
        color = ""
        colorful = true
        dislikes = false
        outlined = false
      # {{< version 0.2.0 >}} {{< link "https://commento.io/" "Commento" >}} comment config
      [params.page.comment.commento]
        enable = false
      # {{< version 0.2.5 >}} {{< link "https://utteranc.es/" "utterances" >}} comment config
      [params.page.comment.utterances]
        enable = false
        # owner/repo
        repo = ""
        issueTerm = "pathname"
        label = ""
        lightTheme = "github-light"
        darkTheme = "github-dark"
      # giscus comment config (https://giscus.app/)
      [params.page.comment.giscus]
        # You can refer to the official documentation of giscus to use the following configuration.
        enable = false
        repo = ""
        repoId = ""
        category = "Announcements"
        categoryId = ""
        # automatically adapt the current theme i18n configuration when empty
        lang = ""
        mapping = "pathname"
        reactionsEnabled = "1"
        emitMetadata = "0"
        inputPosition = "bottom"
        lazyLoading = false
        lightTheme = "light"
        darkTheme = "dark"
    # {{< version 0.2.7 >}} Third-party library config
    [params.page.library]
      [params.page.library.css]
        # someCSS = "some.css"
        # located in "assets/"
        # Or
        # someCSS = "https://cdn.example.com/some.css"
      [params.page.library.js]
        # someJavascript = "some.js"
        # located in "assets/"
        # Or
        # someJavascript = "https://cdn.example.com/some.js"
    # {{< version 0.2.10 changed >}} Page SEO config
    [params.page.seo]
      # image URL
      images = []
      # Publisher info
      [params.page.seo.publisher]
        name = ""
        logoUrl = ""

  # {{< version 0.2.5 >}} TypeIt config
  [params.typeit]
    # typing speed between each step (measured in milliseconds)
    speed = 100
    # blinking speed of the cursor (measured in milliseconds)
    cursorSpeed = 1000
    # character used for the cursor (HTML format is supported)
    cursorChar = "|"
    # cursor duration after typing finishing (measured in milliseconds, "-1" means unlimited)
    duration = -1

  # Site verification code config for Google/Bing/Yandex/Pinterest/Baidu
  [params.verification]
    google = ""
    bing = ""
    yandex = ""
    pinterest = ""
    baidu = ""

  # {{< version 0.2.10 >}} Site SEO config
  [params.seo]
    # image URL
    image = ""
    # thumbnail URL
    thumbnailUrl = ""

  # {{< version 0.2.0 >}} Analytics config
  [params.analytics]
    # {{< version 0.3.1 deleted >}}
    enable = true
    # Google Analytics
    [params.analytics.google]
      id = ""
      # {{< version 0.3.1 deleted >}} whether to anonymize IP
      anonymizeIP = true
      # {{< version 0.3.1 >}} whether to respect the browser’s “do not track” setting
      respectDoNotTrack = false
    # Fathom Analytics
    [params.analytics.fathom]
      id = ""
      # server url for your tracker if you're self hosting
      server = ""
    # Plausible Analytics
    [params.analytics.plausible]
      dataDomain = ""
    # Yandex Metrica
    [params.analytics.yandexMetrica]
      id = ""

  # {{< version 0.2.7 >}} Cookie consent config
  [params.cookieconsent]
    enable = true
    # text strings used for Cookie consent banner
    [params.cookieconsent.content]
      message = ""
      dismiss = ""
      link = ""

  # {{< version 0.2.7 changed >}} CDN config for third-party library files
  [params.cdn]
    # CDN data file name, disabled by default
    # ["jsdelivr.yml"]
    # located in "themes/LoveIt/assets/data/cdn/" directory
    # you can store your own data files in the same path under your project:
    # "assets/data/cdn/"
    data = ""

  # {{< version 0.2.8 >}} Compatibility config
  [params.compatibility]
    # whether to use Polyfill.io to be compatible with older browsers
    polyfill = false
    # whether to use object-fit-images to be compatible with older browsers
    objectFit = false

# Markup related config in Hugo
[markup]
  # {{< link "https://gohugo.io/content-management/syntax-highlighting" "Syntax Highlighting" >}}
  [markup.highlight]
    codeFences = true
    guessSyntax = true
    lineNos = true
    lineNumbersInTable = true
    # false is a necessary configuration
    # ({{< link "https://github.com/dillonzq/LoveIt/issues/158" >}})
    noClasses = false
  # Goldmark is from Hugo 0.60 the default library used for Markdown
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
      # whether to use HTML tags directly in the document
      unsafe = true
  # Table Of Contents settings
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 6

# Sitemap config
[sitemap]
  changefreq = "weekly"
  filename = "sitemap.xml"
  priority = 0.5

# {{< link "https://gohugo.io/content-management/urls#permalinks" "Permalinks config" >}}
[Permalinks]
  # posts = ":year/:month/:filename"
  posts = ":filename"

# {{< link "https://gohugo.io/about/hugo-and-gdpr/" "Privacy config" >}}
[privacy]
  # {{< version 0.3.1 changed >}} privacy of the Google Analytics (can also be configured in params.analytics.google)
  [privacy.googleAnalytics]
    # ...
  [privacy.twitter]
    # ...
  [privacy.youtube]
    # ...

# Options to make output .md files
[mediaTypes]
  [mediaTypes."text/plain"]
    suffixes = ["md"]

# Options to make output .md files
[outputFormats.MarkDown]
  mediaType = "text/plain"
  isPlainText = true
  isHTML = false

# Options to make hugo output files
[outputs]
  # {{< version 0.2.0 changed >}}
  home = ["HTML", "RSS", "JSON"]
  page = ["HTML", "MarkDown"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML", "RSS"]
```

{{< admonition >}}
Note that some of these parameters are explained in details in other sections of this documentation.
{{< /admonition >}}

{{< admonition note "Hugo environments" >}}
Default environments are `development` with `hugo serve` and `production` with `hugo`.

Due to limitations in the local `development` environment,
the **comment system**, **CDN** and **fingerprint** will not be enabled in the `development` environment.

You could enable these features with `hugo serve -e production`.
{{< /admonition >}}

{{< admonition tip "Tips about CDN Configuration" >}}
{{< version 0.2.7 changed >}}

```toml
[params.cdn]
  # CDN data file name, disabled by default
  # ["jsdelivr.yml"]
  data = ""
````

The default CDN data file is located in `themes/LoveIt/assets/data/cdn/` directory.
You can store your own data file in the same path under your project: `assets/data/cdn/`.
{{< /admonition >}}

{{< admonition tip "Tips about social Configuration" >}}
{{< version 0.2.0 >}}

You can directly set your ID to get a default social link and its icon:

```toml
[params.social]
  Mastodon = "@xxxx"
```

The social link generated is `https://mastodon.technology/@xxxx`.

Or You can set more options through a dict:

```toml
[params.social]
  [params.social.Mastodon]
    # weight when arranging icons (the greater the weight, the later the icon is positioned)
    weight = 0
    # your social ID
    id = "@xxxx"
    # prefix of your social link
    prefix = "https://mastodon.social/"
    # content hovering on the icon
    title = "Mastodon"
```

The default data of all supported social links is located in `themes/LoveIt/assets/data/social.yaml`,
which is you can refer to.
{{< /admonition >}}

![Complete configuration preview](complete-configuration-preview.png "Complete configuration preview")

### 3.2 Favicons, Browserconfig, Manifest

It is recommended to put your own favicons:

* apple-touch-icon.png (180x180)
* favicon-32x32.png (32x32)
* favicon-16x16.png (16x16)
* mstile-150x150.png (150x150)
* android-chrome-192x192.png (192x192)
* android-chrome-512x512.png (512x512)

into `/static`. They’re easily created via [https://realfavicongenerator.net/](https://realfavicongenerator.net/).

Customize `browserconfig.xml` and `site.webmanifest` to set theme-color and background-color.

### 3.3 Style Customization {#style-customization}

{{< version 0.2.8 changed >}}

{{< admonition note "Hugo extended version is necessary" >}}
Since Hugo need to processes :(fab fa-sass fa-fw): SCSS to :(fab fa-css3 fa-fw): CSS,
Hugo **extended** version is necessary for the style customization.
{{< /admonition >}}

**LoveIt** theme has been built to be as configurable as possible by defining custom `.scss` style files.

The directory including the custom `.scss` style files is `assets/css` relative to **your project root directory**.

In `assets/css/_override.scss`, you can override the variables in `themes/LoveIt/assets/css/_variables.scss` to customize the style.

Here is a example:

```scss
@import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,700&display=swap&subset=latin-ext');
$code-font-family: Fira Mono, Source Code Pro, Menlo, Consolas, Monaco, monospace;
```

In `assets/css/_custom.scss`, you can add some css style code to customize the style.

## 4 Multilingual and i18n

**LoveIt** theme is fully compatible with Hugo multilingual mode, which provides in-browser language switching.

![Language Switch](language-switch.gif "Language Switch")

### 4.1 Compatibility {#language-compatibility}

{{< version 0.2.10 changed >}}

| Language            | Hugo Code | HTML `lang` Attribute |          Theme Docs           |        Lunr.js Support        |
|:--------------------|:---------:|:---------------------:|:-----------------------------:|:-----------------------------:|
| English             |   `en`    |         `en`          | :(far fa-check-square fa-fw): | :(far fa-check-square fa-fw): |
| Simplified Chinese  |  `zh-cn`  |        `zh-CN`        | :(far fa-check-square fa-fw): | :(far fa-check-square fa-fw): |
| Traditional Chinese |  `zh-tw`  |        `zh-TW`        |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| French              |   `fr`    |         `fr`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Polish              |   `pl`    |         `pl`          |    :(far fa-square fa-fw):    |    :(far fa-square fa-fw):    |
| Portuguese (Brazil) |  `pt-br`  |        `pt-BR`        |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Italian             |   `it`    |         `it`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Spanish             |   `es`    |         `es`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| German              |   `de`    |         `de`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| German              |   `de`    |         `de`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Serbian             |   `sr`    |         `sr`          |    :(far fa-square fa-fw):    |    :(far fa-square fa-fw):    |
| Russian             |   `ru`    |         `ru`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Romanian            |   `ro`    |         `ro`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Vietnamese          |   `vi`    |         `vi`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Arabic              |   `ar`    |         `ar`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Catalan             |   `ca`    |         `ca`          |    :(far fa-square fa-fw):    |    :(far fa-square fa-fw):    |
| Thai                |   `th`    |         `th`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Telugu              |   `te`    |         `te`          |    :(far fa-square fa-fw):    |    :(far fa-square fa-fw):    |
| Indonesian          |   `id`    |         `id`          |    :(far fa-square fa-fw):    |    :(far fa-square fa-fw):    |
| Turkish             |   `tr`    |         `tr`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Korean              |   `ko`    |         `ko`          |    :(far fa-square fa-fw):    |    :(far fa-square fa-fw):    |
| Hindi               |   `hi`    |         `hi`          |    :(far fa-square fa-fw):    |    :(far fa-square fa-fw):    |
| Dutch               |   `nl`    |         `nl`          |    :(far fa-square fa-fw):    | :(far fa-check-square fa-fw): |
| Bengali             |   `hi`    |         `hi`          |    :(far fa-square fa-fw):    |    :(far fa-square fa-fw):    |

### 4.2 Basic Configuration

After learning [how Hugo handle multilingual websites](https://gohugo.io/content-management/multilingual), define your languages in your [site configuration](#site-configuration).

For example with English, Chinese and French website:

```toml
# determines default content language ["en", "zh-cn", "fr", "pl", ...]
defaultContentLanguage = "en"

[languages]
  [languages.en]
    weight = 1
    title = "My New Hugo Site"
    languageCode = "en"
    languageName = "English"
    [[languages.en.menu.main]]
      weight = 1
      identifier = "posts"
      pre = ""
      post = ""
      name = "Posts"
      url = "/posts/"
      title = ""
    [[languages.en.menu.main]]
      weight = 2
      identifier = "tags"
      pre = ""
      post = ""
      name = "Tags"
      url = "/tags/"
      title = ""
    [[languages.en.menu.main]]
      weight = 3
      identifier = "categories"
      pre = ""
      post = ""
      name = "Categories"
      url = "/categories/"
      title = ""

  [languages.zh-cn]
    weight = 2
    title = "我的全新 Hugo 网站"
    languageCode = "zh-CN"
    languageName = "简体中文"
    hasCJKLanguage = true
    [[languages.zh-cn.menu.main]]
      weight = 1
      identifier = "posts"
      pre = ""
      post = ""
      name = "文章"
      url = "/posts/"
      title = ""
    [[languages.zh-cn.menu.main]]
      weight = 2
      identifier = "tags"
      pre = ""
      post = ""
      name = "标签"
      url = "/tags/"
      title = ""
    [[languages.zh-cn.menu.main]]
      weight = 3
      identifier = "categories"
      pre = ""
      post = ""
      name = "分类"
      url = "/categories/"
      title = ""

  [languages.fr]
    weight = 3
    title = "Mon nouveau site Hugo"
    languageCode = "fr"
    languageName = "Français"
    [[languages.fr.menu.main]]
      weight = 1
      identifier = "posts"
      pre = ""
      post = ""
      name = "Postes"
      url = "/posts/"
      title = ""
    [[languages.fr.menu.main]]
      weight = 2
      identifier = "tags"
      pre = ""
      post = ""
      name = "Balises"
      url = "/tags/"
      title = ""
    [[languages.fr.menu.main]]
      weight = 3
      identifier = "categories"
      name = "Catégories"
      pre = ""
      post = ""
      url = "/categories/"
      title = ""
```

Then, for each new page, append the language code to the file name.

Single file `my-page.md` is split in three files:

* in English: `my-page.en.md`
* in Chinese: `my-page.zh-cn.md`
* in French: `my-page.fr.md`

{{< admonition >}}
Be aware that only translated pages are displayed in menu. It’s not replaced with default language content.
{{< /admonition >}}

{{< admonition tip >}}
Use [Front Matter parameter](https://gohugo.io/content-management/multilingual#translate-your-content) to translate urls too.
{{< /admonition >}}

### 4.3 Overwrite Translation Strings

Translations strings are used for common default values used in the theme. Translations are available in [some languages](#language-compatibility), but you may use another language or want to override default values.

To override these values, create a new file in your local i18n folder `i18n/<languageCode>.toml` and inspire yourself from `themes/LoveIt/i18n/en.toml`.

By the way, as these translations could be used by other people, please take the time to propose a translation by [:(fas fa-code-branch fa-fw): making a PR](https://github.com/dillonzq/LoveIt/pulls) to the theme!

## 5 Search

{{< version 0.2.0 >}}

Based on [Lunr.js](https://lunrjs.com/) or [algolia](https://www.algolia.com/), searching is supported in **LoveIt** theme.

### 5.1 Output Configuration

In order to generate `index.json` for searching, add `JSON` output file type to the `home` of the `outputs` part in your [site configuration](#site-configuration).

```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

### 5.2 Search Configuration

Based on `index.json` generated by Hugo, you could activate searching.

Here is the search configuration in your [site configuration](#site-configuration):

```toml
[params.search]
  enable = true
  # type of search engine ["lunr", "algolia"]
  type = "lunr"
  # max index length of the chunked content
  contentLength = 4000
  # placeholder of the search bar
  placeholder = ""
  # {{< version 0.2.1 >}} max number of results length
  maxResultLength = 10
  # {{< version 0.2.3 >}} snippet length of the result
  snippetLength = 30
  # {{< version 0.2.1 >}} HTML tag name of the highlight part in results
  highlightTag = "em"
  # {{< version 0.2.4 >}} whether to use the absolute URL based on the baseURL in search index
  absoluteURL = false
  [params.search.algolia]
    index = ""
    appID = ""
    searchKey = ""
```

{{< admonition note "How to choose search engine?" >}}
The following is a comparison of two search engines:

* `lunr`: simple, no need to synchronize `index.json`, no limit for `contentLength`,
  but high bandwidth and low performance (Especially for Chinese which needs a large segmentit library)
* `algolia`: high performance and low bandwidth, but need to synchronize `index.json` and limit for `contentLength`

{{< version 0.2.3 >}} The content of the post is separated by `h2` and `h3` HTML tag to improve query performance and basically implement full-text search.
`contentLength` is used to limit the max index length of the part starting with `h2` and `h3` HTML tag.
{{< /admonition >}}

{{< admonition tip "Tips about algolia" >}}
You need to upload `index.json` files to algolia to activate searching.
You could upload the `index.json` files by browsers but a CLI tool may be better.
The official [Algolia CLI](https://github.com/algolia/algolia-cli) is a good choice.
To be compatible with Hugo multilingual mode,
you need to upload different `index.json` for each language to the different index of algolia, such as `zh-cn/index.json` or `fr/index.json`...
{{< /admonition >}}

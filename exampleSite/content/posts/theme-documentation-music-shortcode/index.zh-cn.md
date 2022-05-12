---
weight: 8
title: "主题文档 - music Shortcode"
date: 2020-03-03T12:29:59+08:00
lastmod: 2020-03-03T12:29:59+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "music shortcode 基于 APlayer 和 MetingJS 库提供了一个内嵌的响应式音乐播放器."
images: []
resources:
- name: "featured-image"
  src: "featured-image.png"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true
---

`music` shortcode 基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 库提供了一个内嵌的响应式音乐播放器.

<!--more-->

有三种方式使用 `music` shortcode.

## 1 自定义音乐 URL {#custom-music-url}

{{< version 0.2.10 >}} 支持[本地资源引用](../theme-documentation-content#contents-organization)的完整用法.

`music` shortcode 有以下命名参数来使用自定义音乐 URL:

* **server** *[必需]*

    音乐的链接.

* **type** *[可选]*

    音乐的名称.

* **artist** *[可选]*

    音乐的创作者.

* **cover** *[可选]*

    音乐的封面链接.

一个使用自定义音乐 URL 的 `music` 示例:

```markdown
{{</* music url="/music/Wavelength.mp3" name=Wavelength artist=oldmanyoung cover="/images/Wavelength.jpg" */>}}
```

呈现的输出效果如下:

{{< music url="/music/Wavelength.mp3" name=Wavelength artist=oldmanyoung cover="/images/Wavelength.jpg" >}}

## 2 音乐平台 URL 的自动识别 {#automatic-identification}

`music` shortcode 有一个命名参数来使用音乐平台 URL 的自动识别:

* **auto** *[必需]]* (**第一个**位置参数)

    用来自动识别的音乐平台 URL, 支持 `netease`, `tencent` 和 `xiami` 平台.

一个使用音乐平台 URL 的自动识别的 `music` 示例:

```markdown
{{</* music auto="https://music.163.com/#/playlist?id=60198" */>}}
或者
{{</* music "https://music.163.com/#/playlist?id=60198" */>}}
```

呈现的输出效果如下:

{{< music auto="https://music.163.com/#/playlist?id=60198" >}}

## 3 自定义音乐平台, 类型和 ID {#custom-server}

`music` shortcode 有以下命名参数来使用自定义音乐平台:

* **server** *[必需]* (**第一个**位置参数)

    [`netease`, `tencent`, `kugou`, `xiami`, `baidu`]

    音乐平台.

* **type** *[必需]* (**第二个**位置参数)

    [`song`, `playlist`, `album`, `search`, `artist`]

    音乐类型.

* **id** *[必需]* (**第三个**位置参数)

    歌曲 ID, 或者播放列表 ID, 或者专辑 ID, 或者搜索关键词, 或者创作者 ID.

一个使用自定义音乐平台的 `music` 示例:

```markdown
{{</* music server="netease" type="song" id="1868553" */>}}
或者
{{</* music netease song 1868553 */>}}
```

呈现的输出效果如下:

{{< music netease song 1868553 >}}

## 4 其它参数 {#other-parameters}

`music` shortcode 有一些可以应用于以上三种方式的其它命名参数:

* **theme** *[可选]*

    {{< version 0.2.0 changed >}} 音乐播放器的主题色, 默认值是 `#448aff`.

* **fixed** *[可选]*

    是否开启固定模式, 默认值是 `false`.

* **mini** *[可选]*

    是否开启迷你模式, 默认值是 `false`.

* **autoplay** *[可选]*

    是否自动播放音乐, 默认值是 `false`.

* **volume** *[可选]*

    第一次打开播放器时的默认音量, 会被保存在浏览器缓存中, 默认值是 `0.7`.

* **mutex** *[可选]*

    是否自动暂停其它播放器, 默认值是 `true`.

`music` shortcode 还有一些只适用于音乐列表方式的其它命名参数:

* **loop** *[可选]*

    [`all`, `one`, `none`]

    音乐列表的循环模式, 默认值是 `none`.

* **order** *[可选]*

    [`list`, `random`]

    音乐列表的播放顺序, 默认值是 `list`.

* **list-folded** *[可选]*

    初次打开的时候音乐列表是否折叠, 默认值是 `false`.

* **list-max-height** *[可选]*

    音乐列表的最大高度, 默认值是 `340px`.

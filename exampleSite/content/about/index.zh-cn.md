---
title: "关于 LoveIt"
date: 2019-08-02T11:04:49+08:00
draft: false
description: "关于 LoveIt"
images: ["/Apple-Devices-Preview.png"]

lightgallery: true

math:
  enable: true
---

{{< style "img { height: 1.25rem; }" >}}
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/releases)
[![Hugo](https://img.shields.io/badge/Hugo-%5E0.128.0-ff4088?style=flat-square&logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/github/license/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/dillonzq/LoveIt?style=social)](https://github.com/dillonzq/LoveIt)
[![GitHub forks](https://img.shields.io/github/forks/dillonzq/LoveIt?style=social)](https://github.com/dillonzq/LoveIt/fork)
{{< /style >}}

> [:(far fa-kiss-wink-heart): LoveIt](https://github.com/dillonzq/LoveIt) 是一个由 {{< person "https://dillonzq.com/" Dillon "LoveIt 主题的作者" "/Dillon.png" >}} 开发的**简洁**、**优雅**且**高效**的 [Hugo](https://gohugo.io/) 博客主题。
>
> 它的原型基于 [LeaveIt 主题](https://github.com/liuzc/LeaveIt) 和 [KeepIt 主题](https://github.com/Fastbyte01/KeepIt)。

![Hugo 主题 LoveIt](/images/Apple-Devices-Preview.png "Hugo 主题 LoveIt")

## 特性

### 性能和 SEO

* :(fas fa-rocket): **性能**优化：在 [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights) 中， [99]/[100] 的移动设备得分和 [100]/[100] 的桌面设备得分
* :(fab fa-searchengin): 使用基于 JSON-LD 格式 的 **SEO SCHEMA** 文件进行 SEO 优化
* :(fab fa-google): 支持 **[Google Analytics](https://analytics.google.com/analytics)**
* :(far fa-chart-bar): 支持 **[Fathom Analytics](https://usefathom.com/)**
* :(fas fa-chart-column): 支持 **[Plausible Analytics](https://plausible.io/)**
* :(fab fa-yandex-international): 支持 **[Yandex Metrica](https://metrica.yandex.com/)**
* :(fas fa-sitemap): 支持搜索引擎的**网站验证** (Google, Bind, Yandex 和 Baidu)
* :(fas fa-tachometer-alt): 支持所有第三方库的 **CDN**
* :(fas fa-cloud-download-alt): 基于 [lazysizes](https://github.com/aFarkas/lazysizes) 自动转换图片为**懒加载**

### 外观和布局

* :(fas fa-mobile-screen): **[桌面端]/[移动端] 响应式**布局
* :(fas fa-circle-half-stroke fa-rotate-180): **[浅色]/[深色]** 主题模式
* :(fas fa-layer-group): 全局一致的**设计语言**
* :(fas fa-ellipsis-h): 支持**分页**
* :(far fa-list-alt): 易用和自动展开的**文章目录**
* :(fas fa-language): 支持**多语言**和国际化
* :(fab fa-css3-alt): 美观的 **CSS 动画**

#### 社交和评论系统

* :(far fa-user): 支持 **[Gravatar](https://gravatar.com)** 头像
* :(fas fa-user-circle): 支持本地**头像**
* :(far fa-id-card): 支持多达 **82** 种社交链接
* :(fas fa-share-square): 支持多达 **27** 种网站分享
* :(far fa-comment): 支持 **[Disqus](https://disqus.com)** 评论系统
* :(far fa-comment-dots): 支持 **[Gitalk](https://github.com/gitalk/gitalk)** 评论系统
* :(far fa-comment-alt): 支持 **[Valine](https://valine.js.org/)** 评论系统
* :(far fa-comments): 支持 **[Facebook comments](https://developers.facebook.com/docs/plugins/comments/)** 评论系统
* :(fas fa-comment): 支持 **[Telegram comments](https://comments.app/)** 评论系统
* :(fas fa-comment-dots): 支持 **[Commento](https://commento.io/)** 评论系统
* :(far fa-comment-alt): 支持 **[utterances](https://utteranc.es/)** 评论系统
* :(fas fa-comments): 支持 **[giscus](https://giscus.app/)** 评论系统

### 扩展功能

* :(fas fa-search): 支持基于 [Lunr.js](https://lunrjs.com/) 或 [algolia](https://www.algolia.com/) 的**搜索**
* :(far fa-grin-tongue-wink): 支持 **Twemoji**
* :(fas fa-code): 支持**代码高亮**
* :(far fa-copy): 一键**复制代码**到剪贴板
* :(far fa-images): 支持基于 [lightGallery](https://github.com/sachinchoolur/lightgallery) 的**图片画廊**
* :(fab fa-font-awesome): 支持 **[Font Awesome](https://fontawesome.com/) 图标**的扩展 Markdown 语法
* :(fas fa-superscript): 支持**上标注释**的扩展 Markdown 语法
* :(fas fa-percentage): 支持**分数**的扩展 Markdown 语法
* :(fas fa-square-root-alt): 支持基于 [$\KaTeX$](https://katex.org/) 的**数学公式**
* :(fas fa-project-diagram): 支持基于 [mermaid](https://github.com/mermaid-js/mermaid) 的**图表** shortcode
* :(fas fa-chart-pie): 支持基于 [ECharts](https://echarts.apache.org/) 的**交互式数据可视化** shortcode
* :(fas fa-map-marked-alt): 支持基于 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) 的 **Mapbox** shortcode
* :(fas fa-music): 支持基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 的**音乐播放器** shortcode
* :(fab fa-bilibili): 支持 **Bilibili 视频** shortcode
* :(fas fa-note-sticky): 支持多种**注释**的 shortcode
* :(fab fa-css3): 支持**自定义样式**的 shortcode
* :(fab fa-js-square): 支持**自定义脚本**的 shortcode
* :(fas fa-i-cursor): 支持基于 [TypeIt](https://typeitjs.com/) 的**打字动画** shortcode
* :(fas fa-cookie-bite): 支持基于 [cookieconsent](https://github.com/osano/cookieconsent) 的 **Cookie 许可横幅**
* :(far fa-user-circle): 支持**人物标签**的 shortcode
* ...

## 许可协议

LoveIt 根据 **MIT** 许可协议授权。

更多信息请查看 [LICENSE 文件](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)。

## 特别感谢

LoveIt 主题中用到了以下项目，感谢它们的作者：

* [modern-normalize](https://github.com/sindresorhus/modern-normalize)
* [Font Awesome](https://fontawesome.com/)
* [Simple Icons](https://github.com/simple-icons/simple-icons)
* [Animate.css](https://daneden.github.io/animate.css/)
* [autocomplete](https://github.com/algolia/autocomplete)
* [Lunr.js](https://lunrjs.com/)
* [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript)
* [lazysizes](https://github.com/aFarkas/lazysizes)
* [object-fit-images](https://github.com/fregante/object-fit-images)
* [Twemoji](https://github.com/twitter/twemoji)
* [emoji-data](https://github.com/iamcal/emoji-data)
* [lightGallery](https://github.com/sachinchoolur/lightgallery)
* [clipboard.js](https://github.com/zenorocha/clipboard.js)
* [Sharer.js](https://github.com/ellisonleao/sharer.js)
* [TypeIt](https://typeitjs.com/)
* [$\KaTeX$](https://katex.org/)
* [mermaid](https://github.com/mermaid-js/mermaid)
* [ECharts](https://echarts.apache.org/)
* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* [APlayer](https://github.com/MoePlayer/APlayer)
* [MetingJS](https://github.com/metowolf/MetingJS)
* [Gitalk](https://github.com/gitalk/gitalk)
* [Valine](https://valine.js.org/)
* [cookieconsent](https://github.com/osano/cookieconsent)

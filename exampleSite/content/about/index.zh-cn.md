---
title: "关于 LoveIt"
date: 2019-08-02T11:04:49+08:00
draft: false

lightgallery: true

math:
  enable: true
---

{{< style "img { height: 1.25rem; }" >}}
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/releases)
[![Hugo](https://img.shields.io/badge/Hugo-%5E0.62.0-ff4088?style=flat-square&logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/github/license/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/dillonzq/LoveIt?style=social)](https://github.com/dillonzq/LoveIt)
[![GitHub forks](https://img.shields.io/github/forks/dillonzq/LoveIt?style=social)](https://github.com/dillonzq/LoveIt/fork)
{{< /style >}}

> [:(far fa-kiss-wink-heart fa-fw): LoveIt](https://github.com/dillonzq/LoveIt) 是一个由 [Dillon](https://dillonzq.com) 开发的**简洁**、**优雅**且**高效**的 [Hugo](https://gohugo.io/) 博客主题。
>
> 它的原型基于 [LeaveIt 主题](https://github.com/liuzc/LeaveIt) 和 [KeepIt 主题](https://github.com/Fastbyte01/KeepIt)。

![Hugo 主题 LoveIt](/images/Apple-Devices-Preview.png "Hugo 主题 LoveIt")

### 特性

#### 性能和 SEO

* :(fas fa-rocket fa-fw): **性能**优化：在 [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights) 中， [99]/[100] 的移动设备得分和 [100]/[100] 的桌面设备得分
* :(fab fa-searchengin fa-fw): 使用基于 JSON-LD 格式 的 **SEO SCHEMA** 文件进行 SEO 优化
* :(fab fa-google fa-fw): 支持 **[Google Analytics](https://analytics.google.com/analytics)**
* :(far fa-chart-bar fa-fw): 支持 **[Fathom Analytics](https://usefathom.com/)**
* :(fas fa-search fa-fw): 支持搜索引擎的**网站验证** (Google, Bind, Yandex and Baidu)
* :(fas fa-tachometer-alt fa-fw): 支持所有第三方库的 **CDN**
* :(fas fa-cloud-download-alt fa-fw): 基于 [lazysizes](https://github.com/aFarkas/lazysizes) 自动转换图片为**懒加载**

#### 外观和布局

* [:(fas fa-desktop):]/[:(fas fa-mobile):] **响应式**布局
* [:(fas fa-sun):]/[:(fas fa-moon):] **[浅色]/[深色]** 主题模式
* :(fas fa-layer-group fa-fw): 全局一致的**设计语言**
* :(fas fa-ellipsis-h fa-fw): 支持**分页**
* :(far fa-list-alt fa-fw): 易用和自动展开的**文章目录**
* :(fas fa-language fa-fw): 支持**多语言**和国际化
* :(fab fa-css3-alt fa-fw): 美观的 **CSS 动画**

#### 社交和评论系统

* :(far fa-user fa-fw): 支持 **[Gravatar](https://gravatar.com)** 头像
* :(fas fa-user-circle fa-fw): 支持本地**头像**
* :(far fa-id-card fa-fw): 支持多达 **64** 种社交链接
* :(fas fa-share-square fa-fw): 支持多达 **28** 种网站分享
* :(far fa-comment fa-fw): 支持 **[Disqus](https://disqus.com)** 评论系统
* :(far fa-comment-dots fa-fw): 支持 **[Gitalk](https://github.com/gitalk/gitalk)** 评论系统
* :(far fa-comment-alt fa-fw): 支持 **[Valine](https://valine.js.org/)** 评论系统
* :(far fa-comments fa-fw): 支持 **[Facebook](https://developers.facebook.com/docs/plugins/comments/) 评论**系统
* :(fas fa-comment fa-fw): 支持 **[Telegram comments](https://comments.app/) 评论**系统
* :(fas fa-comment-dots fa-fw): 支持 **[Commento](https://commento.io/)** 评论系统
* :(far fa-comment-alt fa-fw): 支持 **[Utterances](https://utteranc.es/)** 评论系统

#### 扩展功能

* :(fas fa-search fa-fw): 支持基于 [Lunr.js](https://lunrjs.com/) 或 [algolia](https://www.algolia.com/) 的**搜索**
* :(far fa-grin-tongue-wink fa-fw): 支持 **Twemoji**
* :(fas fa-code fa-fw): 支持**代码高亮**
* :(far fa-copy fa-fw): 一键**复制代码**到剪贴板
* :(far fa-images fa-fw): 支持基于 [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js) 的**图片画廊**
* :(fab fa-font-awesome fa-fw): 支持 **[Font Awesome](https://fontawesome.com/) 图标**的扩展 Markdown 语法
* :(far fa-sticky-note fa-fw): 支持**上标注释**的扩展 Markdown 语法
* :(fas fa-percentage fa-fw): 支持**分数**的扩展 Markdown 语法
* :(fas fa-square-root-alt fa-fw): 支持基于 [$ \KaTeX $](https://katex.org/) 的**数学公式**
* :(fas fa-project-diagram fa-fw): 支持基于 [mermaid](https://github.com/knsv/mermaid) 的**图表** shortcode
* :(fas fa-chart-pie fa-fw): 支持基于 [ECharts](https://echarts.apache.org/) 的**交互式数据可视化** shortcode
* :(fas fa-map-marked-alt fa-fw): 支持基于 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) 的 **Mapbox** shortcode
* :(fas fa-music fa-fw): 支持基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 的**音乐播放器** shortcode
* :(fas fa-video fa-fw): 支持 **Bilibili 视频** shortcode
* :(far fa-bell fa-fw): 支持多种**注释**的 shortcode
* :(fas fa-align-left fa-fw): 支持**自定义样式**的 shortcode
* :(fab fa-js-square fa-fw): 支持**自定义脚本**的 shortcode
* :(fas fa-i-cursor fa-fw): 支持基于 [TypeIt](https://typeitjs.com/) 的**打字动画** shortcode
* :(fas fa-arrow-down fa-fw): 支持基于 [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll) 的**滚动动画**
* :(fas fa-cookie-bite fa-fw): 支持基于 [cookieconsent](https://github.com/osano/cookieconsent) 的 **Cookie 许可横幅**
* ...

### 许可协议

LoveIt 根据 **MIT** 许可协议授权。

更多信息请查看 [LICENSE 文件](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)。

LoveIt 主题中用到了以下项目，感谢它们的作者：

* [normalize.css](https://github.com/necolas/normalize.css)
* [Font Awesome](https://fontawesome.com/)
* [Simple Icons](https://github.com/simple-icons/simple-icons)
* [Animate.css](https://daneden.github.io/animate.css/)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [autocomplete.js](https://github.com/algolia/autocomplete.js)
* [Lunr.js](https://lunrjs.com/)
* [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript)
* [lazysizes](https://github.com/aFarkas/lazysizes)
* [object-fit-images](https://github.com/fregante/object-fit-images)
* [Twemoji](https://github.com/twitter/twemoji)
* [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js)
* [clipboard.js](https://github.com/zenorocha/clipboard.js)
* [Sharer.js](https://github.com/ellisonleao/sharer.js)
* [TypeIt](https://typeitjs.com/)
* [$ \KaTeX $](https://katex.org/)
* [mermaid](https://github.com/knsv/mermaid)
* [ECharts](https://echarts.apache.org/)
* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* [APlayer](https://github.com/MoePlayer/APlayer)
* [MetingJS](https://github.com/metowolf/MetingJS)
* [Gitalk](https://github.com/gitalk/gitalk)
* [Valine](https://valine.js.org/)
* [cookieconsent](https://github.com/osano/cookieconsent)

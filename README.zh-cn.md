# LoveIt 主题 | Hugo

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/releases)
[![Hugo](https://img.shields.io/badge/Hugo-%5E0.128.0-ff4088?style=flat-square&logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/github/license/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e60303f2-862c-4342-bf59-7c9adb10812e/deploy-status)](https://app.netlify.com/sites/hugo-loveit/deploys)
[![CircleCI](https://circleci.com/gh/dillonzq/LoveIt/tree/master.svg?style=svg)](https://circleci.com/gh/dillonzq/LoveIt/tree/master)

[English README](https://github.com/dillonzq/LoveIt/blob/master/README.md) | 简体中文说明

> [LoveIt](https://github.com/dillonzq/LoveIt) 是一个**简洁**、**优雅**且**高效**的 [Hugo](https://gohugo.io/) 博客主题。

它的原型基于 [LeaveIt 主题](https://github.com/liuzc/LeaveIt) 和 [KeepIt 主题](https://github.com/Fastbyte01/KeepIt)。

由于三个主题外观的相似性，如果你对于它们的不同之处有疑问，请阅读 [为什么选择 LoveIt](#为什么选择-LoveIt)，以便你能选择最适合你的一个。

![Hugo 主题 LoveIt](https://github.com/dillonzq/LoveIt/raw/master/images/Apple-Devices-Preview.png)

## 主题[预览](https://hugoloveit.com/zh-cn/)

为了直观地浏览主题特性，这里有一个基于 **LoveIt** 主题渲染的 [预览网站](https://hugoloveit.com/zh-cn/)。

## 为什么选择 LoveIt

相较于 LeaveIt 主题 和 KeepIt 主题，LoveIt 主题主要有以下修改

* 自定义**标题栏**
* 自定义**CSS 样式**
* 焕然一新的**主页**，已经兼容最新版 Hugo
* 大量的**样式细节调整**，包括颜色、字体大小、边距、代码预览样式
* 可读性更强的**深色模式**
* 一些美观的 **CSS 动画**
* 易用和自动展开的**文章目录**
* 支持更多的**社交链接**、**网站分享**和**评论系统**
* 支持基于 [Lunr.js](https://lunrjs.com/) 或 [algolia](https://www.algolia.com/) 的**搜索**
* 一键**复制代码**到剪贴板
* 支持基于 **[Font Awesome](https://fontawesome.com/) 图标**的扩展 Markdown 语法
* 支持**上标注释**的扩展 Markdown 语法
* 支持**分数**的扩展 Markdown 语法
* 支持基于 [KaTeX](https://katex.org/) 的**数学公式**
* 支持基于 [mermaid](https://github.com/mermaid-js/mermaid) 的**图表**生成功能
* 支持基于 [ECharts](https://echarts.apache.org/) 的**交互式数据可视化**生成功能
* 支持基于 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) 的 **Mapbox** 地图显示功能
* 支持基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 的内嵌**音乐播放器**
* 支持内嵌 **Bilibili** 视频
* 支持多种**注释**的 shortcode
* 支持自定义样式的 shortcode
* 支持所有第三方库的 **CDN**
* ...

所以，如果你更偏好 LoveIt 主题的设计语言和自由度，如果你想便捷地使用扩展的 Font Awesome 图标，如果你想在文章内嵌数学公式、流程图、音乐或是 Bilibili 视频，
那么，LoveIt 主题可能是更适合你。
希望你会 LoveIt ❤️!

## 特性

### 性能和 SEO

* **性能**优化：在 [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights) 中， 99/100 的移动设备得分和 100/100 的桌面设备得分
* 使用基于 JSON-LD 格式 的 **SEO SCHEMA** 文件进行 SEO 优化
* 支持 **[Google Analytics](https://analytics.google.com/analytics)**
* 支持 **[Fathom Analytics](https://usefathom.com/)**
* 支持 **[Plausible Analytics](https://plausible.io/)**
* 支持 **[Yandex Metrica](https://metrica.yandex.com/)**
* 支持搜索引擎的**网站验证** (Google, Bind, Yandex 和 Baidu)
* 支持所有第三方库的 **CDN**
* 基于 [lazysizes](https://github.com/aFarkas/lazysizes) 自动转换图片为**懒加载**

### 外观和布局

* **桌面端/移动端 响应式**布局
* **浅色/深色** 主题模式
* 全局一致的**设计语言**
* 支持**分页**
* 易用和自动展开的**文章目录**
* 支持**多语言**和国际化
* 美观的 **CSS 动画**

### 社交和评论系统

* 支持 **[Gravatar](https://gravatar.com)** 头像
* 支持本地**头像**
* 支持多达 **81** 种社交链接
* 支持多达 **27** 种网站分享
* 支持 **[Disqus](https://disqus.com)** 评论系统
* 支持 **[Gitalk](https://github.com/gitalk/gitalk)** 评论系统
* 支持 **[Valine](https://valine.js.org/)** 评论系统
* 支持 **[Facebook comments](https://developers.facebook.com/docs/plugins/comments/)** 评论系统
* 支持 **[Telegram comments](https://comments.app/)** 评论系统
* 支持 **[Commento](https://commento.io/)** 评论系统
* 支持 **[utterances](https://utteranc.es/)** 评论系统
* 支持 **[giscus](https://giscus.app/)** 评论系统

### 扩展功能

* 支持基于 [Lunr.js](https://lunrjs.com/) 或 [algolia](https://www.algolia.com/) 的**搜索**
* 支持 **Twemoji**
* 支持**代码高亮**
* 一键**复制代码**到剪贴板
* 支持基于 [lightGallery](https://github.com/sachinchoolur/lightgallery) 的**图片画廊**
* 支持 **[Font Awesome](https://fontawesome.com/) 图标**的扩展 Markdown 语法
* 支持**上标注释**的扩展 Markdown 语法
* 支持**分数**的扩展 Markdown 语法
* 支持基于 [KaTeX](https://katex.org/) 的**数学公式**
* 支持基于 [mermaid](https://github.com/mermaid-js/mermaid) 的**图表** shortcode
* 支持基于 [ECharts](https://echarts.apache.org/) 的**交互式数据可视化** shortcode
* 支持基于 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) 的 **Mapbox** shortcode
* 支持基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 的**音乐播放器** shortcode
* 支持 **Bilibili 视频** shortcode
* 支持多种**注释**的 shortcode
* 支持**自定义样式**的 shortcode
* 支持**自定义脚本**的 shortcode
* 支持基于 [TypeIt](https://typeitjs.com/) 的**打字动画** shortcode
* 支持基于 [cookieconsent](https://github.com/osano/cookieconsent) 的 **Cookie 许可横幅**
* 支持**人物标签**的 shortcode
* ...

## [文档](https://hugoloveit.com/zh-cn/categories/documentation/)

在本地构建文档:

```bash
hugo server --source=exampleSite
```

## 兼容性

| LoveIt 分支或版本  |    支持的 Hugo 版本    |
|:--------------|:-----------------:|
| master(不稳定)   |     ≥ 0.128.0     |
| **0.3.X(推荐)** | 0.128.0 - 0.145.0 |
| 0.2.X(过时)     | 0.68.0 - 0.127.0  |

## 多语言和国际化

LoveIt 支持下列语言:

* 英语
* 简体中文
* 繁体中文
* 法语
* 波兰语
* 葡萄牙语(巴西)
* 意大利语
* 西班牙语
* 德语
* 塞尔维亚语
* 俄语
* 罗马尼亚语
* 越南语
* 阿拉伯语
* 加泰罗尼亚语
* 泰语
* 泰卢固语
* 印尼语
* 土耳其语
* 韩语
* 印地语
* 荷兰语
* 孟加拉语
* [贡献一种新的语言](https://github.com/dillonzq/LoveIt/pulls)

[语言兼容性](https://hugoloveit.com/zh-cn/theme-documentation-basics/#language-compatibility)

## [路线图](https://github.com/dillonzq/LoveIt/projects/1)

## 问题、想法、 bugs 和 PRs

所有的反馈都是欢迎的！详见 [issue tracker](https://github.com/dillonzq/LoveIt/issues)。

## 许可协议

LoveIt 根据 **MIT** 许可协议授权。 更多信息请查看 [LICENSE 文件](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)。

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
* [KaTeX](https://katex.org/)
* [mermaid](https://github.com/mermaid-js/mermaid)
* [ECharts](https://echarts.apache.org/)
* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
* [APlayer](https://github.com/MoePlayer/APlayer)
* [MetingJS](https://github.com/metowolf/MetingJS)
* [Gitalk](https://github.com/gitalk/gitalk)
* [Valine](https://valine.js.org/)
* [cookieconsent](https://github.com/osano/cookieconsent)

## 作者

[Dillon](https://dillonzq.com)

## 赞助支持

如果你喜爱这个主题, 请考虑给我买杯咖啡 ☕️.

* [PayPal](https://paypal.me/dillonzq)
* [支付宝](https://github.com/dillonzq/LoveIt/raw/master/images/Alipay.jpg)
* [微信支付](https://github.com/dillonzq/LoveIt/raw/master/images/Wechat.jpg)

谢谢! ❤️

## Star 数目趋势

[![Star 数目趋势](https://starchart.cc/dillonzq/LoveIt.svg)](https://starchart.cc/dillonzq/LoveIt)

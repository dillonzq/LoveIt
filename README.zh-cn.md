# LoveIt 主题 | Hugo [![Netlify Status](https://api.netlify.com/api/v1/badges/e60303f2-862c-4342-bf59-7c9adb10812e/deploy-status)](https://app.netlify.com/sites/hugo-loveit/deploys)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/releases)
[![Hugo](https://img.shields.io/badge/Hugo-%5E0.62.0-ff4088?style=flat-square&logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/github/license/dillonzq/LoveIt?style=flat-square)](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)
[![CircleCI](https://img.shields.io/circleci/build/github/dillonzq/LoveIt/develop?label=CI&style=flat-square&logo=circleci)](https://app.circleci.com/pipelines/github/dillonzq/LoveIt)

[English README](README.md) | 中文说明

[LoveIt](https://github.com/dillonzq/LoveIt) 是一个**简洁**、**优雅**且**高效**的 [Hugo](https://gohugo.io/) 博客主题。

它的原型基于 [LeaveIt 主题](https://github.com/liuzc/LeaveIt/) 和 [KeepIt 主题](https://github.com/liuzc/LeaveIt/)。

由于三个主题外观的相似性，如果你对于它们的不同之处有疑问，请阅读 [为什么选择 LoveIt](#为什么选择-LoveIt)，以便你能选择最适合你的一个。

![Hugo 主题 LoveIt](https://github.com/dillonzq/LoveIt/raw/develop/images/Apple-Devices-Preview.png)

## 主题[预览](https://hugoloveit.com/zh-cn/)

为了直观地浏览主题特性，这里有一个基于 **LoveIt** 主题渲染的 [预览网站](https://hugoloveit.com/zh-cn/)。

## 为什么选择 LoveIt

相较于 LeaveIt 主题 和 KeepIt 主题，LoveIt 主题主要有以下修改

* 自定义**标题栏**
* 自定义**CSS 样式**
* 焕然一新的**主页**，已经兼容最新版 Hugo
* 大量的**样式细节调整**，包括颜色、字体大小、边距、代码预览样式
* 可读性更强的**暗黑模式**
* 一些美观的 **CSS 动画**
* 易用和自动展开的**文章目录**
* 支持基于 **[Font Awesome](https://fontawesome.com/) 图标**的扩展 Markdown 语法
* 支持**上标注释**的扩展 Markdown 语法
* 支持基于 [KaTeX](https://katex.org/) 的**数学公式**
* 支持基于 [mermaid](https://github.com/knsv/mermaid) 的**图表**生成功能
* 支持基于 [ECharts](https://echarts.apache.org/) 的**交互式数据可视化**生成功能
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
* 支持搜索引擎的**网站验证** (Google, Bind, Yandex and Baidu)
* 支持所有第三方库的 **CDN**
* 基于 [lazysizes](https://github.com/aFarkas/lazysizes) 自动转换图片为**懒加载**

### 外观和布局

* **响应式**布局
* **夜晚/白天** 主题模式
* 全局一致的**设计语言**
* 支持**分页**
* 易用和自动展开的**文章目录**
* 支持**多语言**和国际化
* 美观的 **CSS 动画**

### 社交和评论系统

* 支持 **[Gravatar](https://gravatar.com)** 头像
* 支持本地**头像**
* 支持多达 **59** 种社交链接
* 支持多达 **28** 种网站分享
* 支持 **[Disqus](https://disqus.com)** 评论系统
* 支持 **[Gitalk](https://github.com/gitalk/gitalk)** 评论系统
* 支持 **[Valine](https://valine.js.org/)** 评论系统
* 支持 **[Facebook](https://developers.facebook.com/docs/plugins/comments/) 评论**系统

### 扩展功能

* 支持**代码高亮**
* 支持基于 [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js) 的**图片画廊**
* 支持 **[Font Awesome](https://fontawesome.com/) 图标**的扩展 Markdown 语法
* 支持**上标注释**的扩展 Markdown 语法
* 支持基于 [KaTeX](https://katex.org/) 的**数学公式**
* 支持基于 [mermaid](https://github.com/knsv/mermaid) 的**图表** shortcode
* 支持基于 [ECharts](https://echarts.apache.org/) 的**交互式数据可视化** shortcode
* 支持基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 的**音乐播放器** shortcode
* 支持 **Bilibili 视频** shortcode
* 支持多种**注释**的 shortcode
* 支持**自定义样式**的 shortcode
* 支持基于 [TypeIt](https://typeitjs.com/) 的**打字动画** shortcode
* 支持基于 [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll) 的**滚动动画**
* ...

## 文档

* [文档页面](https://hugoloveit.com/zh-cn/categories/documentation/)
* 在本地构建文档:

    ```bash
    hugo server --source=exampleSite
    ```

## 问题、想法、 bugs 和 PRs

所有的反馈都是欢迎的！详见 [issue tracker](https://github.com/dillonzq/LoveIt/issues)。

## 许可协议

LoveIt 根据 MIT 许可协议授权。 更多信息请查看 [LICENSE 文件](https://github.com/dillonzq/LoveIt/blob/master/LICENSE)。

LoveIt 主题中用到了以下项目，感谢它们的作者：

* [Font Awesome](https://fontawesome.com/)
* [Fork Awesome](https://forkaweso.me/Fork-Awesome/)
* [Animate.css](https://daneden.github.io/animate.css/)
* [lazysizes](https://github.com/aFarkas/lazysizes)
* [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [TypeIt](https://typeitjs.com/)
* [KaTeX](https://katex.org/)
* [mermaid](https://github.com/knsv/mermaid)
* [ECharts](https://echarts.apache.org/)
* [APlayer](https://github.com/MoePlayer/APlayer)
* [MetingJS](https://github.com/metowolf/MetingJS)
* [Gitalk](https://github.com/gitalk/gitalk)
* [Valine](https://valine.js.org/)

## 作者

[Dillon](https://dillonzq.com)

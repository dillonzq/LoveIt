---
weight: 7
title: "主题文档 - mapbox Shortcode"
date: 2020-03-03T13:29:59+08:00
lastmod: 2020-03-03T13:29:59+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "mapbox shortcode 使用 Mapbox GL JS 库提供互动式地图的功能."
images: []
resources:
- name: "featured-image"
  src: "featured-image.jpg"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true

toc:
  enable: false
mapbox:
  lightStyle: mapbox://styles/mapbox/light-zh-v1?optimize=true
  darkStyle: mapbox://styles/mapbox/dark-zh-v1?optimize=true
---

{{< version 0.2.0 >}}

`mapbox` shortcode 使用 [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) 库提供互动式地图的功能.

<!--more-->

**Mapbox GL JS** 是一个 JavaScript 库，它使用 WebGL, 以 [vector tiles](https://docs.mapbox.com/help/glossary/vector-tiles/) 和 [Mapbox styles](https://docs.mapbox.com/mapbox-gl-js/style-spec/) 为来源, 将它们渲染成互动式地图.

`mapbox` shortcode 有以下命名参数来使用 Mapbox GL JS:

* **lng** *[必需]* (**第一个**位置参数)

    地图初始中心点的经度, 以度为单位.

* **lat** *[必需]* (**第二个**位置参数)

    地图初始中心点的纬度, 以度为单位.

* **zoom** *[可选]* (**第三个**位置参数)

    地图的初始缩放级别, 默认值是 `10`.

* **marked** *[可选]* (**第四个**位置参数)

    是否在地图的初始中心点添加图钉, 默认值是 `true`.

* **light-style** *[可选]* (**第五个**位置参数)

    浅色主题的地图样式, 默认值是[前置参数](../theme-documentation-content#front-matter)或者[网站配置](../theme-documentation-basics#site-configuration)中设置的值.

* **dark-style** *[可选]* (**第六个**位置参数)

    深色主题的地图样式, 默认值是[前置参数](../theme-documentation-content#front-matter)或者[网站配置](../theme-documentation-basics#site-configuration)中设置的值.

* **navigation** *[可选]*

    是否添加 [NavigationControl](https://docs.mapbox.com/mapbox-gl-js/api#navigationcontrol), 默认值是[前置参数](../theme-documentation-content#front-matter)或者[网站配置](../theme-documentation-basics#site-configuration)中设置的值.

* **geolocate** *[可选]*

    是否添加 [GeolocateControl](https://docs.mapbox.com/mapbox-gl-js/api#geolocatecontrol), 默认值是[前置参数](../theme-documentation-content#front-matter)或者[网站配置](../theme-documentation-basics#site-configuration)中设置的值.

* **scale** *[可选]*

    是否添加 [ScaleControl](https://docs.mapbox.com/mapbox-gl-js/api#scalecontrol), 默认值是[前置参数](../theme-documentation-content#front-matter)或者[网站配置](../theme-documentation-basics#site-configuration)中设置的值.

* **fullscreen** *[可选]*

   是否添加 [FullscreenControl](https://docs.mapbox.com/mapbox-gl-js/api#fullscreencontrol), 默认值是[前置参数](../theme-documentation-content#front-matter)或者[网站配置](../theme-documentation-basics#site-configuration)中设置的值.

* **width** *[可选]*

    地图的宽度, 默认值是 `100%`.

* **height** *[可选]*

    地图的高度, 默认值是 `20rem`.

一个简单的 `mapbox` 示例:

```markdown
{{</* mapbox 121.485 31.233 12 */>}}
或者
{{</* mapbox lng=121.485 lat=31.233 zoom=12 */>}}
```

呈现的输出效果如下:

{{< mapbox 121.485 31.233 12 >}}

一个带有自定义样式的 `mapbox` 示例:

```markdown
{{</* mapbox -122.252 37.453 10 false "mapbox://styles/mapbox/streets-zh-v1?optimize=true" */>}}
或者
{{</* mapbox lng=-122.252 lat=37.453 zoom=10 marked=false light-style="mapbox://styles/mapbox/streets-zh-v1?optimize=true" */>}}
```

呈现的输出效果如下:

{{< mapbox -122.252 37.453 10 false "mapbox://styles/mapbox/streets-zh-v1?optimize=true" >}}

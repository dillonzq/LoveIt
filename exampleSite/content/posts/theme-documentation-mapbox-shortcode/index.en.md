---
weight: 7
title: "Theme Documentation - mapbox Shortcode"
date: 2020-03-03T13:29:41+08:00
lastmod: 2020-03-03T13:29:41+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "The mapbox shortcode supports interactive maps in Hugo with Mapbox GL JS library."
images: []
resources:
- name: "featured-image"
  src: "featured-image.jpg"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true

toc:
  enable: false
---

{{< version 0.2.0 >}}

The `mapbox` shortcode supports interactive maps in Hugo with [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js) library.

<!--more-->

**Mapbox GL JS** is a JavaScript library that uses WebGL to render interactive maps from [vector tiles](https://docs.mapbox.com/help/glossary/vector-tiles/) and [Mapbox styles](https://docs.mapbox.com/mapbox-gl-js/style-spec/).

{{< admonition note >}}
An access token is required to load Mapbox maps. Set it with `accessToken` under `[params.page.mapbox]` in the [site configuration](../theme-documentation-basics#site-configuration). Mapbox GL JS v3 also requires a browser with WebGL 2 support; without it, maps are skipped and a warning is logged to the browser console.
{{< /admonition >}}

The `mapbox` shortcode has the following named parameters to use Mapbox GL JS:

* **lng** *[required]* (**first** positional parameter)

    Longitude of the initial centerpoint of the map, measured in degrees.

* **lat** *[required]* (**second** positional parameter)

    Latitude of the initial centerpoint of the map, measured in degrees.

* **zoom** *[optional]* (**third** positional parameter)

    The initial zoom level of the map, default value is `10`.

* **marked** *[optional]* (**fourth** positional parameter)

    Whether to add a marker at the initial centerpoint of the map, default value is `true`.

* **light-style** *[optional]* (**fifth** positional parameter)

    Style for the light theme, default value is the value set in the [front matter](../theme-documentation-content#front-matter) or the [site configuration](../theme-documentation-basics#site-configuration).

* **dark-style** *[optional]* (**sixth** positional parameter)

    Style for the dark theme, default value is the value set in the [front matter](../theme-documentation-content#front-matter) or the [site configuration](../theme-documentation-basics#site-configuration).

* **navigation** *[optional]*

    Whether to keep the [NavigationControl](https://docs.mapbox.com/mapbox-gl-js/api#navigationcontrol). The control is only added when it is enabled in the [front matter](../theme-documentation-content#front-matter) or the [site configuration](../theme-documentation-basics#site-configuration); setting this parameter to `false` removes it from this map, but `true` cannot enable a control that is disabled there.

* **geolocate** *[optional]*

    Whether to keep the [GeolocateControl](https://docs.mapbox.com/mapbox-gl-js/api#geolocatecontrol). The control is only added when it is enabled in the [front matter](../theme-documentation-content#front-matter) or the [site configuration](../theme-documentation-basics#site-configuration); setting this parameter to `false` removes it from this map, but `true` cannot enable a control that is disabled there.

* **scale** *[optional]*

    Whether to keep the [ScaleControl](https://docs.mapbox.com/mapbox-gl-js/api#scalecontrol). The control is only added when it is enabled in the [front matter](../theme-documentation-content#front-matter) or the [site configuration](../theme-documentation-basics#site-configuration); setting this parameter to `false` removes it from this map, but `true` cannot enable a control that is disabled there.

* **fullscreen** *[optional]*

    Whether to keep the [FullscreenControl](https://docs.mapbox.com/mapbox-gl-js/api#fullscreencontrol). The control is only added when it is enabled in the [front matter](../theme-documentation-content#front-matter) or the [site configuration](../theme-documentation-basics#site-configuration); setting this parameter to `false` removes it from this map, but `true` cannot enable a control that is disabled there.

* **width** *[optional]*

    Width of the map, default value is `100%`.

* **height** *[optional]*

    Height of the map, default value is `20rem`.

Example simple `mapbox` input:

```markdown
{{</* mapbox 121.485 31.233 12 */>}}
Or
{{</* mapbox lng=121.485 lat=31.233 zoom=12 */>}}
```

The rendered output looks like this:

{{< mapbox 121.485 31.233 12 >}}

Example `mapbox` input with the custom style:

```markdown
{{</* mapbox -122.252 37.453 10 false "mapbox://styles/mapbox/navigation-preview-day-v4" "mapbox://styles/mapbox/navigation-preview-night-v4" */>}}
Or
{{</* mapbox lng=-122.252 lat=37.453 zoom=10 marked=false light-style="mapbox://styles/mapbox/navigation-preview-day-v4" dark-style="mapbox://styles/mapbox/navigation-preview-night-v4" */>}}
```

The rendered output looks like this:

{{< mapbox -122.252 37.453 10 false "mapbox://styles/mapbox/navigation-preview-day-v4?optimize=true" "mapbox://styles/mapbox/navigation-preview-night-v4?optimize=true" >}}

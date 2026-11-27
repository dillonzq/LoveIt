---
title: Image processing
date: 2020-01-01
hiddenFromSearch: true
resources:
- name: featured-image
  src: featured-image.jpg
---

The bundle's featured image is 600×400. The JPEG below is stored 600×400 with Exif orientation 6, so it is shown 400×600.

![Rotated](rotated.jpg)

{{< image src="rotated.jpg" alt="Narrow" width="200" linked=false >}}

![Static](/android-chrome-192x192.png)

![Remote](https://cdn.example.com/remote.png)

A PNG stored 60×40 with Exif orientation 6 is shown 40×60.

![Oriented PNG](oriented.png)

Animated PNG and WebP keep their animation, so they get no WebP copies.

![Animated PNG](animated.png)

![Animated WebP](animated.webp)

A width of 0 counts as missing.

{{< image src="rotated.jpg" alt="Zero" width="0" linked=false >}}

A JPEG with Exif orientation 6 whose image data is cut short keeps its size and is used as it is.

![Broken](broken.jpg)

A JPEG truncated before its size can be read keeps the original URL and any explicit dimensions.

{{< image src="truncated.jpg" alt="Truncated JPEG" width="120" linked=false >}}

An APNG with a large metadata chunk before its animation control stays animated.

![APNG with metadata](animated-metadata.png)

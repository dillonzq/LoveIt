---
weight: 10
title: "主题文档 - typeit Shortcode"
date: 2020-03-03T10:29:59+08:00
lastmod: 2020-03-03T10:29:59+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "typeit shortcode 基于 TypeIt 库提供了打字动画."
images: []
resources:
- name: "featured-image"
  src: "featured-image.png"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true
---

`typeit` shortcode 基于 [TypeIt](https://typeitjs.com/) 库提供了打字动画.

<!--more-->

只需将你需要打字动画的内容插入 `typeit` shortcode 中即可.

`typeit` shortcode 有以下命名参数:

* **tag** *[可选]*

    包裹打字内容的 HTML 标签, 默认值是 `div`.

* **class** *[可选]*

    添加到打字元素上的额外 CSS 类名.

* **code** *[可选]*

    用于高亮内容的代码语言, 参见[代码内容](#code-content).

* **code-link** *[可选]*

    仅与 `code` 一起使用. 启用后, 高亮代码的某个词法单元 (例如注释或字符串) 中以 `[文本](链接)` 形式书写的内容会被渲染为可点击的链接.

* **group** *[可选]*

    分组名称, 同一分组的内容会依次开始打字动画, 参见[分组内容](#group-content).

## 1 简单内容 {#simple-content}

允许使用 `Markdown` 格式的简单内容, 并且 **不包含** 富文本的块内容, 例如图像等等...

一个 `typeit` 示例:

```markdown
{{</* typeit */>}}
这一个带有基于 [TypeIt](https://typeitjs.com/) 的 **打字动画** 的 *段落*...
{{</* /typeit */>}}
```

呈现的输出效果如下:

{{< typeit >}}
这一个带有基于 [TypeIt](https://typeitjs.com/) 的 **打字动画** 的 *段落*...
{{< /typeit >}}

另外, 你也可以自定义 **HTML 标签**.

一个带有 `h4` 标签的 `typeit` 示例:

```markdown
{{</* typeit tag=h4 */>}}
这一个带有基于 [TypeIt](https://typeitjs.com/) 的 **打字动画** 的 *段落*...
{{</* /typeit */>}}
```

呈现的输出效果如下:

{{< typeit tag=h4 >}}
这一个带有基于 [TypeIt](https://typeitjs.com/) 的 **打字动画** 的 *段落*...
{{< /typeit >}}

## 2 代码内容 {#code-content}

代码内容也是允许的, 并且通过使用参数 `code` 指定语言类型可以实现语法高亮.

一个带有 `code` 参数的 `typeit` 示例:

```markdown
{{</* typeit code=java */>}}
public class HelloWorld {
    public static void main(String []args) {
        System.out.println("Hello World");
    }
}
{{</* /typeit */>}}
```

呈现的输出效果如下:

{{< typeit code=java >}}
public class HelloWorld {
    public static void main(String []args) {
        System.out.println("Hello World");
    }
}
{{< /typeit >}}

## 3 分组内容 {#group-content}

默认情况下, 所有打字动画都是同时开始的.
但是有时你可能需要按顺序开始一组 `typeit` 内容的打字动画.

一组具有相同 `group` 参数值的 `typeit` 内容将按顺序开始打字动画.

一个带有 `group` 参数的 `typeit` 示例:

```markdown
{{</* typeit group=paragraph */>}}
**首先**, 这个段落开始
{{</* /typeit */>}}

{{</* typeit group=paragraph */>}}
**然后**, 这个段落开始
{{</* /typeit */>}}
```

呈现的输出效果如下:

{{< typeit group=paragraph >}}
**首先**, 这个段落开始
{{< /typeit >}}

{{< typeit group=paragraph >}}
**然后**, 这个段落开始
{{< /typeit >}}

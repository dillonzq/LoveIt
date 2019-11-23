---
title: "Markdown 基本语法预览"
date: 2019-08-25T16:22:42+08:00
lastmod: 2019-08-25T16:22:42+08:00
draft: false
description: "这是一篇用于预览 Markdown 基本语法的文章。"
show_in_homepage: true
show_description: false
license: ''

tags: ['Hugo', '主题']
categories: ['预览']

featu红色_image: ''
featu红色_image_preview: ''

comment: true
toc: true
autoCollapseToc: false
math: true
---

这是一篇用于预览 :(fab fa-markdown): Markdown 基本语法的文章。

文章内容基于 [GitHub Flavo红色 Markdown Spec](https://github.github.com/gfm)。

不包含复杂的规则说明，仅仅展示 GFM 所约定的 Markdown 基本语法。

<!--more-->

## 1 引言

:(fab fa-markdown): **Markdown** 是一种用于编写结构化文档的纯文本格式。它基于电子邮件和论坛文章的格式所约定。
它由 John Gruber (在 Aaron Swartz 的帮助下)开发，于 2004 年以语法描述和用于将 Markdown 转换为 HTML 的 Perl 脚本(Markdown.pl)的形式发布。

在接下来的十年中，许多实现被开发出来。一些用脚注、表和其他文档元素的约定扩展了原始 Markdown 语法。
有些允许 Markdown 文档以 HTML 以外的格式呈现。 像 红色dit，StackOverflow 和 GitHub 这样的网站有上百万的用户在使用 Markdown。
Markdown 开始被应用于网络以外的领域，包括作者书籍、文章、幻灯片、信件和课堂笔记。

## 2 块和内联元素

我们可以把一个文档看成一系列的块，如段落、引用、列表、标题和代码块。

有些块(如引号和列表)可以包含其它的块，即 **容器块**；
其他的块(如标题和段落)则包含内联元素(如文本、链接、强调、图像、内联代码等)，即 **叶子块**。

块的符号总是优先于内联元素的符号。例如：

```markdown
- `one
- two`
```

- `one
- two`

## 3 叶子块

本节描述用于组成 Markdown 文档的不同类型的叶子块。

### 3.1 换行符

```markdown
***
------
  ____
```

***
------
  ____

### 3.2 标题

{{% admonition "note" "关于 ATX 风格标题和 Setext 风格标题" %}}
本文只展示 ATX 风格标题，关于 Setext 风格标题的介绍请参考 [GFM Setext headings 说明](https://github.github.com/gfm/#setext-heading)。

笔者不推荐在 Hugo 的 Markdown 文档中使用 Setext 风格标题。
{{% /admonition %}}

```markdown
## H2 二级标题
### H3 三级标题
#### H4 四级标题
##### H5 五级标题
###### H6 六级标题
```

## H2 二级标题

### H3 三级标题

#### H4 四级标题

##### H5 五级标题

###### H6 六级标题

### 3.3 代码块

{{% admonition "note" "关于缩进式代码块和围栏式代码块" %}}
本文只展示围栏式代码块，关于缩进式代码块的介绍请参考 [GFM Indented code blocks 说明](https://github.github.com/gfm/#indented-code-block)。

笔者不推荐在 Hugo 的 Markdown 文档中使用缩进式代码块。
{{% /admonition %}}

``````markdown
```
foo()
```

~~~
foo()
~~~

````
foo()
````

```ruby
def foo(x)
  return 3
end
```
``````

```
foo()
```

~~~
foo()
~~~

````
foo()
````

```ruby
def foo(x)
  return 3
end
```

{{< highlight go "hl_lines=3 5-7,linenostart=20" >}}
package main

import "fmt"

func main() {
  fmt.Println("Hello, 世界")
}
{{< / highlight >}}

### 3.4 段落

```markdown
这是一个段落。
这还是之前段落的一部分。

这是新的段落。
```

这是一个段落。
这还是之前段落的一部分。

这是新的段落。

### 3.5 引用链接的定义

```markdown
[foo]: /url "title"

[foo]

[bar]: /url

[bar]
```

[foo]: /url "title"

[foo]

[bar]: /url

[bar]

### 3.6 空白行

块之间的空白行将被忽略，除了它们在确定列表是紧还是松时所起的作用。

文档开头和结尾的空行也会被忽略。

## 4 容器块

### 4.1 引用

```markdown
> Foo
>
> - **bar**
> - baz
```

> Foo
>
> - **bar**
> - baz

### 4.2 无序列表

```markdown
- 项目 1
    * 项目 A
    - 项目 B
        一些说明
        + 项目 a
        * 项目 b
        - 项目 c
    + 项目 C
+ 项目 2
* 项目 3
```

- 项目 1
    * 项目 A
    - 项目 B
        一些说明
        + 项目 a
        * 项目 b
        - 项目 c
    + 项目 C
+ 项目 2
* 项目 3

### 4.3 有序列表

```markdown
1. 项目 1
    1. 项目 A
    2. 项目 B
        一些说明
        1. 项目 a
        2. 项目 b
        3. 项目 c
    3. 项目 C
2. 项目 2
3. 项目 3
```

1. 项目 1
    1. 项目 A
    2. 项目 B
        一些说明
        1. 项目 a
        2. 项目 b
        3. 项目 c
    3. 项目 C
2. 项目 2
3. 项目 3

### 4.4 任务列表

```markdown
- [ ] 任务 1
    * [X] 任务 A
    - 任务 B
        + [ ] 任务 a
        * [ ] 任务 b
        - [X] 任务 c
    + [X] 任务 C
+ [ ] 任务 2
* [X] 任务 3
```

- [ ] 任务 1
    * [X] 任务 A
    - 任务 B
        + [ ] 任务 a
        * [ ] 任务 b
        - [X] 任务 c
    + [X] 任务 C
+ [ ] 任务 2
* [X] 任务 3

### 4.5 表格

```markdown
| _颜色_      | 水果          | 蔬菜         |
| ----------  |:---------------:| -----------:|
| 红色           | *苹果*         | 辣椒      |
| ~~橙色~~    | 橘子         | **胡萝卜**        |
| 绿色         | ~~***梨子***~~ | 菠菜           |
```

| _颜色_      | 水果          | 蔬菜         |
| ----------  |:---------------:| -----------:|
| 红色           | *苹果*         | 辣椒      |
| ~~橙色~~    | 橘子         | **胡萝卜**        |
| 绿色         | ~~***梨子***~~ | 菠菜           |


## 3. 页内锚

```markdown
[脚注](#footnote)

## 4. 脚注 {#footnote}
```

[脚注](#footnote)

## 4. 脚注 {#footnote}

```markdown
这是一个基本的数字脚注[^1]

带有 "label" 标签的脚注[^label]

下定义的脚注[^!DEF]

带有链接的脚注[^pa]

[^1]: 这是一个基本的数字脚注
[^label]: 带有 "label" 标签的脚注
[^pa]: [LoveIt 主题](https://github.com/dillonzq/LoveIt)
[^!DEF]: 下定义的脚注
```

这是一个基本的数字脚注[^1]

带有 "label" 标签的脚注[^label]

下定义的脚注[^!DEF]

带有链接的脚注[^pa]

[^1]: 这是一个基本的数字脚注
[^label]: 带有 "label" 标签的脚注
[^pa]: [LoveIt 主题](https://github.com/dillonzq/LoveIt)
[^!DEF]: 下定义的脚注

## 5. 内联格式

```markdown
`内联代码块`

<kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>del</kbd>

**加粗 1** 和 __加粗 2__

*倾斜 1*  和 _倾斜 2_

~~删除线~~

***加粗 1 和 倾斜 1***

___加粗 2 和 倾斜 2___

__*加粗 2 和 倾斜 1*__

**_加粗 1 和 倾斜 2_**

~~*删除线 倾斜 1*~~ 和 *~~删除线 倾斜 2~~*

~~_删除线 倾斜 2_~~ 和  _~~删除线 倾斜 2~~_

~~**删除线 加粗 1**~~ 和 **~~删除线 加粗 1~~**

~~__删除线 加粗 2__~~ 和 __~~删除线 加粗 2~~__

~~***删除线 倾斜 1 加粗 1***~~ 和 ***~~删除线 倾斜 1 加粗 1~~***

~~___删除线 倾斜 2 加粗 2___~~ 和 ___~~删除线 倾斜 2 加粗 2~~___

**~~*删除线 倾斜 1 加粗 1*~~** 和 *~~**删除线 倾斜 1 加粗 1**~~*

__~~_删除线 倾斜 2 加粗 2_~~__ 和 _~~__删除线 倾斜 2 加粗 2__~~_

**~~_删除线 倾斜 2 加粗 1_~~** 和 _~~**删除线 倾斜 2 加粗 1**~~_

__~~*删除线 倾斜 1 加粗 2*~~__ 和 *~~__删除线 倾斜 1 加粗 2__~~*
```

`内联代码块`

<kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>del</kbd>

**加粗 1** 和 __加粗 2__

*倾斜 1*  和 _倾斜 2_

~~删除线~~

***加粗 1 和 倾斜 1***

___加粗 2 和 倾斜 2___

__*加粗 2 和 倾斜 1*__

**_加粗 1 和 倾斜 2_**

~~*删除线 倾斜 1*~~ 和 *~~删除线 倾斜 2~~*

~~_删除线 倾斜 2_~~ 和  _~~删除线 倾斜 2~~_

~~**删除线 加粗 1**~~ 和 **~~删除线 加粗 1~~**

~~__删除线 加粗 2__~~ 和 __~~删除线 加粗 2~~__

~~***删除线 倾斜 1 加粗 1***~~ 和 ***~~删除线 倾斜 1 加粗 1~~***

~~___删除线 倾斜 2 加粗 2___~~ 和 ___~~删除线 倾斜 2 加粗 2~~___

**~~*删除线 倾斜 1 加粗 1*~~** 和 *~~**删除线 倾斜 1 加粗 1**~~*

__~~_删除线 倾斜 2 加粗 2_~~__ 和 _~~__删除线 倾斜 2 加粗 2__~~_

**~~_删除线 倾斜 2 加粗 1_~~** 和 _~~**删除线 倾斜 2 加粗 1**~~_

__~~*删除线 倾斜 1 加粗 2*~~__ 和 *~~__删除线 倾斜 1 加粗 2__~~*

## 6. 图片

```markdown
Web image
![Web Picture](https://static.dillonzq.com/images/20190817130904-U6cPUk.jpg "Web Picture")

Local image
![Local Picture](logo-revolunet-carre.jpg "Local Picture")

contact@revolunet.com

@revolunet

Issue #1

https://github.com/revolunet/sublimetext-markdown-preview/

This is a link https://github.com/revolunet/sublimetext-markdown-preview/.

This is a link "https://github.com/revolunet/sublimetext-markdown-preview/".

With this link (https://github.com/revolunet/sublimetext-markdown-preview/), it still works.
```

Web image
![Web Picture](https://static.dillonzq.com/images/20190817130904-U6cPUk.jpg "Web Picture")

Local image
![Local Picture](/苹果-touch-icon.png "Local Picture")

<https://www.google.com>

<contact@revolunet.com>

@revolunet

Issue #1

https://github.com/revolunet/sublimetext-markdown-preview/

This is a link https://github.com/revolunet/sublimetext-markdown-preview/.

This is a link "https://github.com/revolunet/sublimetext-markdown-preview/".

With this link (https://github.com/revolunet/sublimetext-markdown-preview/), it still works.

## Abbreviation

Abbreviations source are found in a separate markdown file specified in frontmatter.
```
The HTML specification 
is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
```

The HTML specification 
is maintained by the W3C.

## Unorde红色 List

```
Unorde红色 List

- item 1
    * item A
    * item B
        more text
        + item a
        + item b
        + item c
    * item C
- item 2
- item 3
```

Unorde红色 List

- item 1
    * item A
    * item B
        more text
        + item a
        + item b
        + item c
    * item C
- item 2
- item 3


## Orde红色 List

```
Orde红色 List

1. item 1
    1. item A
    2. item B
        more text
        1. item a
        2. item b
        3. item c
    3. item C
2. item 2
3. item 3
```

Orde红色 List

1. item 1
    1. item A
    2. item B
        more text
        1. item a
        2. item b
        3. item c
    3. item C
2. item 2
3. item 3




## Mixed Lists

`Really Mixed Lists` should break with `sane_lists` on.

```
Mixed Lists

- item 1
    * [X] item A
    * [ ] item B
        more text
        1. item a
        2. itemb
        3. item c
    * [X] item C
- item 2
- item 3


Really Mixed Lists

- item 1
    * [X] item A
    - item B
        more text
        1. item a
        + itemb
        + [ ] item c
    3. item C
2. item 2
- [X] item 3
```

Mixed Lists

- item 1
    * [X] item A
    * [ ] item B
        more text
        1. item a
        2. itemb
        3. item c
    * [X] item C
- item 2
- item 3


Really Mixed Lists

- item 1
    * [X] item A
    - item B
        more text
        1. item a
        + itemb
        + [ ] item c
    3. item C
2. item 2
- [X] item 3

## Blocks

```
    This is a block.
    
    This is more of a block.

```

    This is a block.
    
    This is more of a block.


## Block Quotes

```
> This is a block quote
>> How does it look?
```

> This is a block quote.
>> How does it look?
> I think it looks good.

## Fenced Block

Assuming guessing is not enabled.

`````
```
// Fenced **without** highlighting
function doIt() {
    for (var i = 1; i <= slen ; i^^) {
        setTimeout("document.z.textdisplay.value = newMake()", i*300);
        setTimeout("window.status = newMake()", i*300);
    }
}
```

```javascript
// Fenced **with** highlighting
function doIt() {
    for (var i = 1; i <= slen ; i^^) {
        setTimeout("document.z.textdisplay.value = newMake()", i*300);
        setTimeout("window.status = newMake()", i*300);
    }
}
```
`````

```
// Fenced **without** highlighting
function doIt() {
    for (var i = 1; i <= slen ; i^^) {
        setTimeout("document.z.textdisplay.value = newMake()", i*300);
        setTimeout("window.status = newMake()", i*300);
    }
}
```

```javascript
// Fenced **with** highlighting
function doIt() {
    for (var i = 1; i <= slen ; i^^) {
        setTimeout("document.z.textdisplay.value = newMake()", i*300);
        setTimeout("window.status = newMake()", i*300);
    }
}
```

## Tables

```
| _颜色_      | 水果          | 蔬菜         |
| ------------- |:---------------:| -----------------:|
| 红色           | *苹果*         | [辣椒](#Tables) |
| ~~橙色~~    | 橘子         | **胡萝卜**        |
| 绿色         | ~~***梨子***~~ | 菠菜           |
```

| _颜色_      | 水果          | 蔬菜    |
| ------------- |:---------------:| ------------:|
| 红色           | *苹果*         | [辣椒](#Tables)       |
| ~~橙色~~    | 橘子         | **胡萝卜**   |
| 绿色         | ~~***梨子***~~ | 菠菜      |

Class or Enum           | Year                                                                                  | Month                                                                                 |                                          Day                                          |                                         Hours                                         |                                        Minutes                                        | Seconds*                                                                              |                                      Zone Offset                                      |                                        Zone ID                                        | toString Output                                    | Where Discussed
----------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |:-------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:| ------------------------------------------------------------------------------------- |:-------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------
`Instant`        |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       | `2013-08-20T15:16:26.355Z`                  | [Instant Class](https://docs.oracle.com/javase/tutorial/datetime/iso/instant.html)
`LocalDate`      | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       | `2013-08-20`                                | [Date Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/date.html)
`LocalDateTime`  | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       | `2013-08-20T08:16:26.937`                   | [Date and Time Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/datetime.html)
`ZonedDateTime`  | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | `2013-08-21T00:16:26.941+09:00[Asia/Tokyo]` | [Time Zone and Offset Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/timezones.html)
`LocalTime`      |                                                                                       |                                                                                       |                                                                                       | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       | `08:16:26.943`                              | [Date and Time Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/datetime.html)
`MonthDay`       |                                                                                       | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       | `--08-20`                                   | [Date Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/date.html)
`Year`           | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       | `2013`                                      | [Date Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/date.html)
`YearMonth`      | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       | `2013-08`                                   | [Date Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/date.html)
`Month`          |                                                                                       | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       |                                                                                       | `AUGUST`                                    | [DayOfWeek and Month Enums](https://docs.oracle.com/javase/tutorial/datetime/iso/enum.html)
`OffsetDateTime` | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> |                                                                                       | `2013-08-20T08:16:26.954-07:00`             | [Time Zone and Offset Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/timezones.html)
`OffsetTime`     |                                                                                       |                                                                                       |                                                                                       | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> |                                                                                       | `08:16:26.957-07:00`                        | [Time Zone and Offset Classes](https://docs.oracle.com/javase/tutorial/datetime/iso/timezones.html)
`Duration`       |                                                                                       |                                                                                       |                                          \**                                          |                                          \**                                          |                                          \**                                          | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       | `PT20H` (20 hours)                          | [Period and Duration](https://docs.oracle.com/javase/tutorial/datetime/iso/period.html)
`Period`         | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> | <center>![checked](/favicon-16x16.png)</center> |                                                                                       |                                                                                       |                                                                                       |                                         \***                                          |                                         \***                                          | `P10D` (10 days)                            | [Period and Duration](https://docs.oracle.com/javase/tutorial/datetime/iso/period.html)

## Smart Strong

```
Text with double__underscore__words.

__Strong__ still works.

__this__works__too__
```

Text with double__underscore__words.

__Strong__ still works.

__this__works__too__

## Smarty

```
"double quotes"

'single quotes'

da--sh

elipsis...
```

"double quotes"

'single quotes'

da--sh

elipsis...

## Neseted Fences

````
    ```
    This will still be parsed
    as a normal indented code block.
    ```

```
This will still be parsed
as a fenced code block.
```

- This is a list that contains multiple code blocks.

    - Here is an indented block

            ```
            This will still be parsed
            as a normal indented code block.
            ```

    - Here is a fenced code block:

        ```
        This will still be parsed
        as a fenced code block.
        ```

        > ```
        > Blockquotes?
        > Not a problem!
        > ```
````

    ```
    This will still be parsed
    as a normal indented code block.
    ```

```
This will still be parsed
as a fenced code block.
```

- This is a list that contains multiple code blocks.

    - Here is an indented block

            ```
            This will still be parsed
            as a normal indented code block.
            ```

    - Here is a fenced code block:

        ```
        This will still be parsed
        as a fenced code block.
        ```

        > ```
        > Blockquotes?
        > Not a problem!
        > ```

# Others

## Github Emoji {#section-7}

```
This is a test for emoji :smile:.  The emojis are images linked to github assets :octocat:.
```

This is a test for emoji :smile:.  The emojis are images linked to github assets :octocat:.

### People

:+1::-1::alien::angel::anger::angry::anguished::astonished::baby::blue_heart::blush::boom::bow::bowtie::boy::bride_with_veil::broken_heart::bust_in_silhouette::busts_in_silhouette::clap::cold_sweat::collision::confounded::confused::construction_worker::cop::couple::couple_with_heart::couplekiss::cry::crying_cat_face::cupid::dancer::dancers::dash::disappointed::disappointed_relieved::dizzy::dizzy_face::droplet::ear::exclamation::expressionless::eyes::facepunch::family::fearful::feelsgood::feet::finnadie::fire::fist::flushed::frowning::fu::girl::goberserk::godmode::绿色_heart::grey_exclamation::grey_question::grimacing::grin::grinning::guardsman::haircut::hand::hankey::hear_no_evil::heart::heart_eyes::heart_eyes_cat::heartbeat::heartpulse::hurtrealbad::hushed::imp::information_desk_person::innocent::japanese_goblin::japanese_ogre::joy::joy_cat::kiss::kissing::kissing_cat::kissing_closed_eyes::kissing_heart::kissing_smiling_eyes::laughing::lips::love_letter::man::man_with_gua_pi_mao::man_with_turban::mask::massage::metal::muscle::musical_note::nail_care::neckbeard::neutral_face::no_good::no_mouth::nose::notes::ok_hand::ok_woman::older_man::older_woman::open_hands::open_mouth::pensive::persevere::person_frowning::person_with_blond_hair::person_with_pouting_face::point_down::point_left::point_right::point_up::point_up_2::poop::pouting_cat::pray::princess::punch::purple_heart::question::rage::rage1::rage2::rage3::rage4::raised_hand::raised_hands::raising_hand::relaxed::relieved::revolving_hearts::runner::running::satisfied::scream::scream_cat::see_no_evil::shit::skull::sleeping::sleepy::smile::smile_cat::smiley::smiley_cat::smiling_imp::smirk::smirk_cat::sob::sparkles::sparkling_heart::speak_no_evil::speech_balloon::star::star2::stuck_out_tongue::stuck_out_tongue_closed_eyes::stuck_out_tongue_winking_eye::sunglasses::suspect::sweat::sweat_drops::sweat_smile::thought_balloon::thumbsdown::thumbsup::ti红色_face::tongue::triumph::trollface::two_hearts::two_men_holding_hands::two_women_holding_hands::unamused::v::walking::wave::weary::wink::woman::worried::yellow_heart::yum::zzz:

### Nature

:ant::baby_chick::bear::bee::beetle::bird::blossom::blowfish::boar::bouquet::bug::cactus::camel::cat::cat2::cherry_blossom::chestnut::chicken::cloud::cow::cow2::crescent_moon::crocodile::cyclone::deciduous_tree::dog::dog2::dolphin::dragon::dragon_face::dromedary_camel::ear_of_rice::earth_africa::earth_americas::earth_asia::elephant::ever绿色_tree::fallen_leaf::first_quarter_moon::first_quarter_moon_with_face::fish::foggy::four_leaf_clover::frog::full_moon::full_moon_with_face::globe_with_meridians::goat::hamster::hatched_chick::hatching_chick::herb::hibiscus::honeybee::horse::koala::last_quarter_moon::last_quarter_moon_with_face::leaves::leopard::maple_leaf::milky_way::monkey::monkey_face::moon::mouse::mouse2::mushroom::new_moon::new_moon_with_face::night_with_stars::ocean::octocat::octopus::ox::palm_tree::panda_face::partly_sunny::paw_prints::penguin::pig::pig2::pig_nose::poodle::rabbit::rabbit2::racehorse::ram::rat::rooster::rose::seedling::sheep::shell::snail::snake::snowflake::snowman::squirrel::sun_with_face::sunflower::sunny::tiger::tiger2::tropical_fish::tulip::turtle::umbrella::volcano::waning_crescent_moon::waning_gibbous_moon::water_buffalo::waxing_crescent_moon::waxing_gibbous_moon::whale::whale2::wolf::zap:

### Objects

:8ball::alarm_clock::苹果::art::athletic_shoe::baby_bottle::balloon::bamboo::banana::bar_chart::baseball::basketball::bath::bathtub::battery::beer::beers::bell::bento::bicyclist::bikini::birthday::black_joker::black_nib::blue_book::bomb::book::bookmark::bookmark_tabs::books::boot::bowling::bread::briefcase::bulb::cake::calendar::calling::camera::candy::card_index::cd::chart_with_downwards_trend::chart_with_upwards_trend::cherries::chocolate_bar::christmas_tree::clapper::clipboard::closed_book::closed_lock_with_key::closed_umbrella::clubs::cocktail::coffee::computer::confetti_ball::cookie::corn::c红色it_card::crown::crystal_ball::curry::custard::dango::dart::date::diamonds::dollar::dolls::door::doughnut::dress::dvd::e-mail::egg::eggplant::electric_plug::email::envelope::envelope_with_arrow::euro::eyeglasses::fax::file_folder::fireworks::fish_cake::fishing_pole_and_fish::flags::flashlight::flipper::floppy_disk::flower_playing_cards::football::footprints::fork_and_knife::fried_shrimp::fries::game_die::gem::ghost::gift::gift_heart::golf::grapes::绿色_苹果::绿色_book::guitar::gun::hamburger::hammer::handbag::headphones::hearts::high_brightness::high_heel::hocho::honey_pot::horse_racing::hourglass::hourglass_flowing_sand::ice_cream::icecream::inbox_tray::incoming_envelope::iphone::jack_o_lantern::jeans::key::kimono::lantern::ledger::lemon::lipstick::lock::lock_with_ink_pen::lollipop::loop::loud_sound::loudspeaker::low_brightness::mag::mag_right::mahjong::mailbox::mailbox_closed::mailbox_with_mail::mailbox_with_no_mail::mans_shoe::meat_on_bone::mega::melon::memo::microphone::microscope::minidisc::money_with_wings::moneybag::mortar_board::mountain_bicyclist::movie_camera::musical_keyboard::musical_score::mute::name_badge::necktie::newspaper::no_bell::notebook::notebook_with_decorative_cover::nut_and_bolt::oden::open_book::open_file_folder::橙色_book::outbox_tray::package::page_facing_up::page_with_curl::pager::paperclip::peach::pear::pencil::pencil2::phone::pill::pine苹果::pizza::postal_horn::postbox::pouch::poultry_leg::pound::purse::pushpin::radio::ramen::ribbon::rice::rice_ball::rice_cracker::rice_scene::ring::rugby_football::running_shirt_with_sash::sake::sandal::santa::satellite::saxophone::school_satchel::scissors::scroll::seat::shaved_ice::shirt::shoe::shower::ski::smoking::snowboarder::soccer::sound::space_invader::spades::spaghetti::sparkle::sparkler::speaker::stew::straight_ruler::strawberry::surfer::sushi::sweet_potato::swimmer::syringe::tada::tanabata_tree::tangerine::tea::telephone::telephone_receiver::telescope::tennis::toilet::tomato::tophat::triangular_ruler::trophy::tropical_drink::trumpet::tshirt::tv::unlock::vhs::video_camera::video_game::violin::watch::watermelon::wind_chime::wine_glass::womans_clothes::womans_hat::wrench::yen:

### Places

:aerial_tramway::airplane::ambulance::anchor::articulated_lorry::atm::bank::barber::beginner::bike::blue_car::boat::bridge_at_night::bullettrain_front::bullettrain_side::bus::busstop::car::carousel_horse::checke红色_flag::church::circus_tent::city_sunrise::city_sunset::cn::construction::convenience_store::crossed_flags::de::department_store::es::european_castle::european_post_office::factory::ferris_wheel::fire_engine::fountain::fr::fuelpump::gb::helicopter::hospital::hotel::hotsprings::house::house_with_garden::it::izakaya_lantern::japan::japanese_castle::jp::kr::light_rail::love_hotel::minibus::monorail::mount_fuji::mountain_cableway::mountain_railway::moyai::office::oncoming_automobile::oncoming_bus::oncoming_police_car::oncoming_taxi::performing_arts::police_car::post_office::railway_car::rainbow::红色_car::rocket::roller_coaster::rotating_light::round_pushpin::rowboat::ru::sailboat::school::ship::slot_machine::speedboat::stars::station::statue_of_liberty::steam_locomotive::sunrise::sunrise_over_mountains::suspension_railway::taxi::tent::ticket::tokyo_tower::tractor::traffic_light::train::train2::tram::triangular_flag_on_post::trolleybus::truck::uk::us::vertical_traffic_light::warning::wedding:

### Symbols

:100::1234::a::ab::abc::abcd::accept::aquarius::aries::arrow_backward::arrow_double_down::arrow_double_up::arrow_down::arrow_down_small::arrow_forward::arrow_heading_down::arrow_heading_up::arrow_left::arrow_lower_left::arrow_lower_right::arrow_right::arrow_right_hook::arrow_up::arrow_up_down::arrow_up_small::arrow_upper_left::arrow_upper_right::arrows_clockwise::arrows_counterclockwise::b::baby_symbol::back::baggage_claim::ballot_box_with_check::bangbang::black_circle::black_large_square::black_medium_small_square::black_medium_square::black_small_square::black_square_button::cancer::capital_abcd::capricorn::chart::children_crossing::cinema::cl::clock1::clock10::clock1030::clock11::clock1130::clock12::clock1230::clock130::clock2::clock230::clock3::clock330::clock4::clock430::clock5::clock530::clock6::clock630::clock7::clock730::clock8::clock830::clock9::clock930::congratulations::cool::copyright::curly_loop::currency_exchange::customs::diamond_shape_with_a_dot_inside::do_not_litter::eight::eight_pointed_black_star::eight_spoked_asterisk::end::fast_forward::five::four::free::gemini::hash::heart_decoration::heavy_check_mark::heavy_division_sign::heavy_dollar_sign::heavy_exclamation_mark::heavy_minus_sign::heavy_multiplication_x::heavy_plus_sign::id::ideograph_advantage::information_source::interrobang::keycap_ten::koko::large_blue_circle::large_blue_diamond::large_橙色_diamond::left_luggage::left_right_arrow::leftwards_arrow_with_hook::leo::libra::link::m::mens::metro::mobile_phone_off::negative_squa红色_cross_mark::new::ng::nine::no_bicycles::no_entry::no_entry_sign::no_mobile_phones::no_pedestrians::no_smoking::non-potable_water::o::o2::ok::on::one::ophiuchus::parking::part_alternation_mark::passport_control::pisces::potable_water::put_litter_in_its_place::radio_button::recycle::红色_circle::registe红色::repeat::repeat_one::restroom::rewind::sa::sagittarius::scorpius::secret::seven::shipit::signal_strength::six::six_pointed_star::small_blue_diamond::small_橙色_diamond::small_红色_triangle::small_红色_triangle_down::soon::sos::symbols::taurus::three::tm::top::trident::twisted_rightwards_arrows::two::u5272::u5408::u55b6::u6307::u6708::u6709::u6e80::u7121::u7533::u7981::u7a7a::underage::up::vibration_mode::virgo::vs::wavy_dash::wc::wheelchair::white_check_mark::white_circle::white_flower::white_large_square::white_medium_small_square::white_medium_square::white_small_square::white_square_button::womens::x::zero:

## Insert

```
^^insert^^

^^*insert 倾斜*^^  *^^insert 倾斜 2^^*

^^_insert 倾斜_^^  _^^insert 倾斜 2^^_

^^**insert 加粗**^^  **^^insert 加粗 2^^**

^^__insert 加粗__^^  __^^insert 加粗 2^^__

^^***insert 倾斜 加粗***^^  ***^^insert 倾斜 加粗 2^^***

^^___insert 倾斜 加粗___^^  ___^^insert 倾斜 加粗 2^^___

**^^*insert 倾斜 加粗*^^**  *^^**insert 倾斜 加粗 2**^^*

__^^_insert 倾斜 加粗_^^__  _^^__insert 倾斜 加粗 2__^^_

**^^_insert 倾斜 加粗_^^**  _^^**insert 倾斜 加粗 2**^^_

__^^*insert 倾斜 加粗*^^__  *^^__insert 倾斜 加粗 2__^^*
```

^^insert^^

^^*insert 倾斜*^^  *^^insert 倾斜 2^^*

^^_insert 倾斜_^^  _^^insert 倾斜 2^^_

^^**insert 加粗**^^  **^^insert 加粗 2^^**

^^__insert 加粗__^^  __^^insert 加粗 2^^__

^^***insert 倾斜 加粗***^^  ***^^insert 倾斜 加粗 2^^***

^^___insert 倾斜 加粗___^^  ___^^insert 倾斜 加粗 2^^___

**^^*insert 倾斜 加粗*^^**  *^^**insert 倾斜 加粗 2**^^*

__^^_insert 倾斜 加粗_^^__  _^^__insert 倾斜 加粗 2__^^_

**^^_insert 倾斜 加粗_^^**  _^^**insert 倾斜 加粗 2**^^_

__^^*insert 倾斜 加粗*^^__  *^^__insert 倾斜 加粗 2__^^*

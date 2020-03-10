---
weight: 3
title: "主题文档 - Shortcodes"
date: 2020-03-04T16:29:59+08:00
lastmod: 2020-03-04T16:29:59+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "LoveIt 主题在 Hugo 内置的 shortcode 的基础上提供多个新的 shortcode."
license: ""

tags: ["shortcodes"]
categories: ["documentation"]
hiddenFromHomePage: false

featuredImage: "/images/theme-documentation-shortcodes/featured-image.jpg"
featuredImagePreview: ""

toc: true
autoCollapseToc: true
math: false
lightgallery: true
linkToMarkdown: true
share:
  enable: true
comment: true
---

**LoveIt** 主题在 Hugo 内置的 shortcode 的基础上提供多个新的 shortcode.

<!--more-->

Hugo 使用 Markdown 为其简单的内容格式. 但是, Markdown 在很多方面都无法很好地支持. 你可以使用纯 HTML 来扩展可能性.

但这恰好是一个坏主意. 大家使用 Markdown, 正是因为它即使不经过渲染也可以轻松阅读. 应该尽可能避免使用 HTML 以保持内容简洁.

为了避免这种限制, Hugo 创建了 [shortcodes](https://gohugo.io/extras/shortcodes/).
shortcode 是一个简单代码段, 可以生成合理的 HTML 代码, 并且符合 Markdown 的设计哲学.

## Hugo 内置 shortcodes {#hugo}

Hugo 附带了一组预定义的 shortcodes, 它们实现了一些非常常见的用法.
提供这些 shortcodes 是为了方便保持你的 Markdown 内容简洁.

### `figure` {#figure}

[`figure` 的文档](https://gohugo.io/content-management/shortcodes/#figure)

一个 `figure` 示例:

```markdown
{{</* figure src="/images/theme-documentation-shortcodes/lighthouse.jpg" title="Lighthouse (figure)" */>}}
```

呈现的输出效果如下:

{{< figure src="/images/theme-documentation-shortcodes/lighthouse.jpg" title="Lighthouse (figure)" >}}

输出的 HTML 看起来像这样:

```html
<figure>
    <img src="/images/theme-documentation-shortcodes/lighthouse.jpg"/>
    <figcaption>
        <h4>Lighthouse (figure)</h4>
    </figcaption>
</figure>
```

### `gist`

[`gist` 的文档](https://gohugo.io/content-management/shortcodes/#gist)

一个 `gist` 示例:

```markdown
{{</* gist spf13 7896402 */>}}
```

呈现的输出效果如下:

{{< gist spf13 7896402 >}}

输出的 HTML 看起来像这样:

```html
<script type="application/javascript" src="https://gist.github.com/spf13/7896402.js"></script>
```

### `highlight`

[`highlight` 的文档](https://gohugo.io/content-management/shortcodes/#instagram)

一个 `highlight` 示例:

```markdown
{{</* highlight html */>}}
<section id="main">
    <div>
        <h1 id="title">{{ .Title }}</h1>
        {{ range .Pages }}
            {{ .Render "summary"}}
        {{ end }}
    </div>
</section>
{{</* /highlight */>}}
```

呈现的输出效果如下:

{{< highlight html >}}
<section id="main">
    <div>
        <h1 id="title">{{ .Title }}</h1>
        {{ range .Pages }}
            {{ .Render "summary"}}
        {{ end }}
    </div>
</section>
{{< /highlight >}}

### `instagram`

[`instagram` 的文档](https://gohugo.io/content-management/shortcodes/#instagram)

一个 `instagram` 示例:

```markdown
{{</* instagram BWNjjyYFxVx hidecaption */>}}
```

呈现的输出效果如下:

{{< instagram BWNjjyYFxVx hidecaption >}}

### `param`

[`param` 的文档](https://gohugo.io/content-management/shortcodes/#param)

一个 `param` 示例:

```markdown
{{</* param description */>}}
```

呈现的输出效果如下:

{{< param description >}}

### `ref` 和 `relref` {#ref-and-relref}

[`ref` 和 `relref` 的文档](https://gohugo.io/content-management/shortcodes/#ref-and-relref)

### `tweet`

[`tweet` 的文档](https://gohugo.io/content-management/shortcodes/#tweet)

一个 `tweet` 示例:

```markdown
{{</* tweet 877500564405444608 */>}}
```

呈现的输出效果如下:

{{< tweet 877500564405444608 >}}

### `vimeo`

[`vimeo` 的文档](https://gohugo.io/content-management/shortcodes/#vimeo)

一个 `vimeo` 示例:

```markdown
{{</* vimeo 146022717 */>}}
```

呈现的输出效果如下:

{{< vimeo 146022717 >}}

### `youtube`

[`youtube` 的文档](https://gohugo.io/content-management/shortcodes/#youtube)

一个 `youtube` 示例:

```markdown
{{</* youtube w7Ft2ymGmfc */>}}
```

呈现的输出效果如下:

{{< youtube w7Ft2ymGmfc >}}

## LoveIt shortcodes {#loveit}

**LoveIt** 在现有内置的 shortcodes 的基础上提供了多个 shortcodes.

### `style`

`style` shortcode 用来在你的文章中插入自定义样式.

`style` shortcode 使用两个参数.
第一个是自定义样式的内容, 第二个是包裹你要更改样式的内容的 HTML 标签, 默认值是 `p`.

一个 `style` 示例:

```markdown
{{</* style "text-align: right" */>}}
This is a right-aligned paragraph.
{{</* /style */>}}
```

呈现的输出效果如下:

{{< style "text-align: right" >}}
This is a right-aligned paragraph.
{{< /style >}}

### `image`

`image` shortcode 是 [`figure` shortcode](#figure) 的替代. `image` shortcode 可以充分利用 [lazysizes](https://github.com/aFarkas/lazysizes) 和 [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js) 两个依赖库.

`image` shortcode 可以使用以下命名参数:

* **src**

    图片的 URL.

* **description**

    图片描述.

* **title**

    图片标题.

* **class**

    HTML `figure` 标签的 `class` 属性.

* **src_s**

    图片缩略图的 URL, 用在画廊模式中.

* **src_l**

    高清图片的 URL, 用在画廊模式中.

一个 `image` 示例:

```markdown
{{</* image src="/images/theme-documentation-shortcodes/lighthouse.jpg" title="Lighthouse (`image`)" src-s="/images/theme-documentation-shortcodes/lighthouse-small.jpg" src-l="/images/theme-documentation-shortcodes/lighthouse-large.jpg" */>}}
```

呈现的输出效果如下:

{{< image src="/images/theme-documentation-shortcodes/lighthouse.jpg" title="Lighthouse (`image`)" src-s="/images/theme-documentation-shortcodes/lighthouse-small.jpg" src-l="/images/theme-documentation-shortcodes/lighthouse-large.jpg" >}}

### `admonition`

`admonition` shortcode 支持 **12** 种 帮助你在页面中插入提示的横幅. 同时, `Markdown` 格式文本是支持的.

{{< admonition >}}
一个 **注意** 横幅
{{< /admonition >}}

{{< admonition abstract >}}
一个 **摘要** 横幅
{{< /admonition >}}

{{< admonition info >}}
一个 **信息** 横幅
{{< /admonition >}}

{{< admonition tip >}}
一个 **技巧** 横幅
{{< /admonition >}}

{{< admonition success >}}
一个 **成功** 横幅
{{< /admonition >}}

{{< admonition question >}}
一个 **问题** 横幅
{{< /admonition >}}

{{< admonition warning >}}
一个 **警告** 横幅
{{< /admonition >}}

{{< admonition failure >}}
一个 **失败** 横幅
{{< /admonition >}}

{{< admonition danger >}}
一个 **危险** 横幅
{{< /admonition >}}

{{< admonition bug >}}
一个 **Bug** 横幅
{{< /admonition >}}

{{< admonition example >}}
一个 **示例** 横幅
{{< /admonition >}}

{{< admonition quote >}}
一个 **引用** 横幅
{{< /admonition >}}

`admonition` shortcode 可以使用以下命名参数:

* **type**

    `admonition` 横幅的类型, 默认值是 **note**

* **title**

    `admonition` 横幅的标题, 默认值是横幅的类型名称

* **details**

    如果设为 `true`, 横幅内容将是可展开/可折叠.

你还可以按 **type**, **title** 和 **details** 的顺序使用位置参数.

一个 `admonition` 示例:

```markdown
{{</* admonition type=tip title="This is a tip" details=true */>}}
一个 **技巧** 横幅
{{</* /admonition */>}}
Or
{{</* admonition tip "This is a tip" true */>}}
一个 **技巧** 横幅
{{</* /admonition */>}}
```

呈现的输出效果如下:

{{< admonition tip "This is a tip" true >}}
一个 **技巧** 横幅
{{< /admonition >}}

### `mermaid`

[mermaid](https://mermaidjs.github.io/) 是一个可以帮助你在文章中生成图表和流程图的库, 类似 Markdown 的语法.

只需将你的 mermaid 代码插入 `mermaid` shortcode 中即可.

#### 流程图 {#flowchart}

一个 **流程图** `mermaid` 示例:

```markdown
{{</* mermaid */>}}
graph LR;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
{{</* /mermaid */>}}
```

呈现的输出效果如下:

{{< mermaid >}}
graph LR;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
{{< /mermaid >}}

#### 时序图 {#sequence-diagram}

一个 **时序图** `mermaid` 示例:

```markdown
{{</* mermaid */>}}
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
{{</* /mermaid */>}}
```

呈现的输出效果如下:

{{< mermaid >}}
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
{{< /mermaid >}}

#### 甘特图 {#gantt}

一个 **甘特图** `mermaid` 示例:

```markdown
{{</* mermaid */>}}
gantt
    dateFormat  YYYY-MM-DD
    title Adding GANTT diagram functionality to mermaid
    section A section
    Completed task            :done,    des1, 2014-01-06,2014-01-08
    Active task               :active,  des2, 2014-01-09, 3d
    Future task               :         des3, after des2, 5d
    Future task2               :         des4, after des3, 5d
    section Critical tasks
    Completed task in the critical line :crit, done, 2014-01-06,24h
    Implement parser and jison          :crit, done, after des1, 2d
    Create tests for parser             :crit, active, 3d
    Future task in critical line        :crit, 5d
    Create tests for renderer           :2d
    Add to mermaid                      :1d
{{</* /mermaid */>}}
```

呈现的输出效果如下:

{{< mermaid >}}
gantt
    dateFormat  YYYY-MM-DD
    title Adding GANTT diagram functionality to mermaid
    section A section
    Completed task            :done,    des1, 2014-01-06,2014-01-08
    Active task               :active,  des2, 2014-01-09, 3d
    Future task               :         des3, after des2, 5d
    Future task2               :         des4, after des3, 5d
    section Critical tasks
    Completed task in the critical line :crit, done, 2014-01-06,24h
    Implement parser and jison          :crit, done, after des1, 2d
    Create tests for parser             :crit, active, 3d
    Future task in critical line        :crit, 5d
    Create tests for renderer           :2d
    Add to mermaid                      :1d
{{< /mermaid >}}

#### 类图 {#class-diagram}

一个 **类图** `mermaid` 示例:

```markdown
{{</* mermaid */>}}
classDiagram
    Class01 <|-- AveryLongClass : Cool
    Class03 *-- Class04
    Class05 o-- Class06
    Class07 .. Class08
    Class09 --> C2 : Where am i?
    Class09 --* C3
    Class09 --|> Class07
    Class07 : equals()
    Class07 : Object[] elementData
    Class01 : size()
    Class01 : int chimp
    Class01 : int gorilla
    Class08 <--> C2: Cool label
{{</* /mermaid */>}}
```

呈现的输出效果如下:

{{< mermaid >}}
classDiagram
    Class01 <|-- AveryLongClass : Cool
    Class03 *-- Class04
    Class05 o-- Class06
    Class07 .. Class08
    Class09 --> C2 : Where am i?
    Class09 --* C3
    Class09 --|> Class07
    Class07 : equals()
    Class07 : Object[] elementData
    Class01 : size()
    Class01 : int chimp
    Class01 : int gorilla
    Class08 <--> C2: Cool label
{{< /mermaid >}}

#### 状态图 {#state-diagram}

一个 **状态图** `mermaid` 示例:

```markdown
{{</* mermaid */>}}
stateDiagram
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
{{</* /mermaid */>}}
```

呈现的输出效果如下:

{{< mermaid >}}
stateDiagram
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
{{< /mermaid >}}

#### Git 图 {#git-graph}

一个 **Git 图** `mermaid` 示例:

```markdown
{{</* mermaid */>}}
gitGraph:
options
{
    "nodeSpacing": 100,
    "nodeRadius": 10
}
end
    commit
    branch newbranch
    checkout newbranch
    commit
    commit
    checkout master
    commit
    commit
    merge newbranch
{{</* /mermaid */>}}
```

呈现的输出效果如下:

{{< mermaid >}}
gitGraph:
options
{
    "nodeSpacing": 100,
    "nodeRadius": 10
}
end
    commit
    branch newbranch
    checkout newbranch
    commit
    commit
    checkout master
    commit
    commit
    merge newbranch
{{< /mermaid >}}

#### 饼图 {#pie}

一个 **饼图** `mermaid` 示例:

```markdown
{{</* mermaid */>}}
pie
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
{{</* /mermaid */>}}
```

呈现的输出效果如下:

{{< mermaid >}}
pie
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
{{< /mermaid >}}

### `echarts`

[ECharts](https://echarts.apache.org/) 是一个帮助你生成交互式数据可视化的库.

ECharts 提供了常规的 [折线图](https://echarts.apache.org/zh/option.html#series-line), [柱状图](https://echarts.apache.org/zh/option.html#series-line), [散点图](https://echarts.apache.org/zh/option.html#series-scatter), [饼图](https://echarts.apache.org/zh/option.html#series-pie), [K线图](https://echarts.apache.org/zh/option.html#series-candlestick), 用于统计的 [盒形图](https://echarts.apache.org/zh/option.html#series-boxplot), 用于地理数据可视化的 [地图](https://echarts.apache.org/zh/option.html#series-map), [热力图](https://echarts.apache.org/zh/option.html#series-heatmap), [线图](https://echarts.apache.org/zh/option.html#series-lines), 用于关系数据可视化的 [关系图](https://echarts.apache.org/zh/option.html#series-graph), [treemap](https://echarts.apache.org/zh/option.html#series-treemap), [旭日图](https://echarts.apache.org/zh/option.html#series-sunburst), 多维数据可视化的 [平行坐标](https://echarts.apache.org/zh/option.html#series-parallel), 还有用于 BI 的 [漏斗图](https://echarts.apache.org/zh/option.html#series-funnel), [仪表盘](https://echarts.apache.org/zh/option.html#series-gauge), 并且支持图与图之间的混搭.

只需在 `echarts` shortcode 中以 `JSON`/`YAML`/`TOML`格式插入 ECharts 选项即可.

一个 `JSON` 格式的 `echarts` 示例:

```json
{{</* echarts */>}}
{
  "title": {
    "text": "折线统计图",
    "top": "2%",
    "left": "center"
  },
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "data": ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
    "top": "10%"
  },
  "grid": {
    "left": "5%",
    "right": "5%",
    "bottom": "5%",
    "top": "20%",
    "containLabel": true
  },
  "toolbox": {
    "feature": {
      "saveAsImage": {
        "title": "保存为图片"
      }
    }
  },
  "xAxis": {
    "type": "category",
    "boundaryGap": false,
    "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [
    {
      "name": "邮件营销",
      "type": "line",
      "stack": "总量",
      "data": [120, 132, 101, 134, 90, 230, 210]
    },
    {
      "name": "联盟广告",
      "type": "line",
      "stack": "总量",
      "data": [220, 182, 191, 234, 290, 330, 310]
    },
    {
      "name": "视频广告",
      "type": "line",
      "stack": "总量",
      "data": [150, 232, 201, 154, 190, 330, 410]
    },
    {
      "name": "直接访问",
      "type": "line",
      "stack": "总量",
      "data": [320, 332, 301, 334, 390, 330, 320]
    },
    {
      "name": "搜索引擎",
      "type": "line",
      "stack": "总量",
      "data": [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
}
{{</* /echarts */>}}
```

一个 `YAML` 格式的 `echarts` 示例:

```yaml
{{</* echarts */>}}
title:
    text: 折线统计图
    top: 2%
    left: center
tooltip:
    trigger: axis
legend:
    data:
        - 邮件营销
        - 联盟广告
        - 视频广告
        - 直接访问
        - 搜索引擎
    top: 10%
grid:
    left: 5%
    right: 5%
    bottom: 5%
    top: 20%
    containLabel: true
toolbox:
    feature:
        saveAsImage:
            title: 保存为图片
xAxis:
    type: category
    boundaryGap: false
    data:
        - 周一
        - 周二
        - 周三
        - 周四
        - 周五
        - 周六
        - 周日
yAxis:
    type: value
series:
    - name: 邮件营销
      type: line
      stack: 总量
      data:
          - 120
          - 132
          - 101
          - 134
          - 90
          - 230
          - 210
    - name: 联盟广告
      type: line
      stack: 总量
      data:
          - 220
          - 182
          - 191
          - 234
          - 290
          - 330
          - 310
    - name: 视频广告
      type: line
      stack: 总量
      data:
          - 150
          - 232
          - 201
          - 154
          - 190
          - 330
          - 410
    - name: 直接访问
      type: line
      stack: 总量
      data:
          - 320
          - 332
          - 301
          - 334
          - 390
          - 330
          - 320
    - name: 搜索引擎
      type: line
      stack: 总量
      data:
          - 820
          - 932
          - 901
          - 934
          - 1290
          - 1330
          - 1320
{{</* /echarts */>}}
```

一个 `TOML` 格式的 `echarts` 示例:

```toml
{{</* echarts */>}}
[title]
text = "折线统计图"
top = "2%"
left = "center"

[tooltip]
trigger = "axis"

[legend]
data = [
  "邮件营销",
  "联盟广告",
  "视频广告",
  "直接访问",
  "搜索引擎"
]
top = "10%"

[grid]
left = "5%"
right = "5%"
bottom = "5%"
top = "20%"
containLabel = true

[toolbox]
[toolbox.feature]
[toolbox.feature.saveAsImage]
title = "保存为图片"

[xAxis]
type = "category"
boundaryGap = false
data = [
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六",
  "周日"
]

[yAxis]
type = "value"

[[series]]
name = "邮件营销"
type = "line"
stack = "总量"
data = [
  120.0,
  132.0,
  101.0,
  134.0,
  90.0,
  230.0,
  210.0
]

[[series]]
name = "联盟广告"
type = "line"
stack = "总量"
data = [
  220.0,
  182.0,
  191.0,
  234.0,
  290.0,
  330.0,
  310.0
]

[[series]]
name = "视频广告"
type = "line"
stack = "总量"
data = [
  150.0,
  232.0,
  201.0,
  154.0,
  190.0,
  330.0,
  410.0
]

[[series]]
name = "直接访问"
type = "line"
stack = "总量"
data = [
  320.0,
  332.0,
  301.0,
  334.0,
  390.0,
  330.0,
  320.0
]

[[series]]
name = "搜索引擎"
type = "line"
stack = "总量"
data = [
  820.0,
  932.0,
  901.0,
  934.0,
  1290.0,
  1330.0,
  1320.0
]
{{</* /echarts */>}}
```

呈现的输出效果如下:

{{< echarts >}}
{
  "title": {
    "text": "折线统计图",
    "top": "2%",
    "left": "center"
  },
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "data": ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
    "top": "10%"
  },
  "grid": {
    "left": "5%",
    "right": "5%",
    "bottom": "5%",
    "top": "20%",
    "containLabel": true
  },
  "toolbox": {
    "feature": {
      "saveAsImage": {
        "title": "保存为图片"
      }
    }
  },
  "xAxis": {
    "type": "category",
    "boundaryGap": false,
    "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [
    {
      "name": "邮件营销",
      "type": "line",
      "stack": "总量",
      "data": [120, 132, 101, 134, 90, 230, 210]
    },
    {
      "name": "联盟广告",
      "type": "line",
      "stack": "总量",
      "data": [220, 182, 191, 234, 290, 330, 310]
    },
    {
      "name": "视频广告",
      "type": "line",
      "stack": "总量",
      "data": [150, 232, 201, 154, 190, 330, 410]
    },
    {
      "name": "直接访问",
      "type": "line",
      "stack": "总量",
      "data": [320, 332, 301, 334, 390, 330, 320]
    },
    {
      "name": "搜索引擎",
      "type": "line",
      "stack": "总量",
      "data": [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
}
{{< /echarts >}}

### `music`

`music` shortcode 基于 [APlayer](https://github.com/MoePlayer/APlayer) 和 [MetingJS](https://github.com/metowolf/MetingJS) 提供了一个内嵌的响应式音乐播放器.

`music` shortcode 可以使用以下命名参数:

|参数             |默认值         |描述|
|:---------------|:------------:|:----------|
|url             |**必须**       |音乐的 URL|
|name            |可选           |音乐名称|
|artist          |可选           |音乐的创作者|
|cover           |封面           |音乐封面的 URL|
|server          |**必须**       |音乐平台: `netease`, `tencent`, `kugou`, `xiami`, `baidu`|
|type            |**必须**       |`song`, `playlist`, `album`, `search`, `artist`|
|id              |**必须**       |song id / playlist id / album id / 搜索关键字|
|auto            |可选           |音乐链接, 支持平台: `netease`, `tencent`, `xiami`|
|fixed           |`false`       |启用固定模式|
|mini            |`false`       |启用迷你模式|
|autoplay        |`false`       |自动播放|
|theme           |`#a9a9b3`     |主题色|
|loop            |`all`         |循环模式, 值: 'all', 'one', 'none'|
|order           |`list`        |播放顺序, 值: 'list', 'random'|
|volume          |`0.7`         |默认音量, 请注意, 播放器会记住用户设置, 用户自己设置音量后默认音量将不起作用|
|mutex           |`true`        |防止同时有多个播放器, 在此播放器开始播放时暂停其他播放器|
|list-folded     |`false`       |列表默认是否折叠|
|list-max-height |`340px`       |列表最大高度|

#### 自定义音乐 URL {#custom-music-url}

一个 `music` 示例:

```markdown
{{</* music url="https://rainymood.com/audio1110/0.m4a" name=rainymood artist=rainymood cover="https://rainymood.com/i/badge.jpg" */>}}
```

呈现的输出效果如下:

{{< music url="https://rainymood.com/audio1110/0.m4a" name=rainymood artist=rainymood cover="https://rainymood.com/i/badge.jpg" >}}

#### 来自音乐平台的 URL 自动识别 {#automatic-identification}

一个 `music` 示例:

```markdown
{{</* music auto="https://music.163.com/#/playlist?id=60198" */>}}
Or
{{</* music "https://music.163.com/#/playlist?id=60198" */>}}
```

呈现的输出效果如下:

{{< music auto="https://music.163.com/#/playlist?id=60198" >}}

#### 自定义平台, 类型和 ID {#custom-server}

一个 `music` 示例:

```markdown
{{</* music server="netease" type="song" id="1868553" */>}}
Or
{{</* music netease song 1868553 */>}}
```

呈现的输出效果如下:

{{< music netease song 1868553 >}}

### `bilibili`

`bilibili` shortcode 提供了一个内嵌的用来播放 bilibili 视频的响应式播放器.

如果视频只有一个部分, 则仅需要视频的 `av` ID, 例如:

```code
https://www.bilibili.com/video/av47027633
```

一个 `bilibili` 示例:

```markdown
{{</* bilibili 47027633 */>}}
Or
{{</* bilibili av=47027633 */>}}
```

呈现的输出效果如下:

{{< bilibili av=47027633 >}}

如果视频包含多个部分, 则除了视频的 `av` ID之外, 还需要 `p`, 默认值为 `1`, 例如:

```code
https://www.bilibili.com/video/av36570401?p=3
```

一个带有 `p` 参数的 `bilibili` 示例:

```markdown
{{</* bilibili 36570401 3 */>}}
Or
{{</* bilibili av=36570401 p=3 */>}}
```

呈现的输出效果如下:

{{< bilibili av=36570401 p=3 >}}

### `typeit`

`typeit` shortcode 基于 [TypeIt](https://typeitjs.com/) 提供了打字动画.

只需将你需要打字动画的内容插入 `typeit` shortcode 中即可.

#### 简单内容 {#simple-content}

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

#### 代码内容 {#code-content}

代码内容也是允许的, 并且通过使用参数 `code` 指定语言类型可以实习语法高亮.

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

#### 分组内容 {#code-content}

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

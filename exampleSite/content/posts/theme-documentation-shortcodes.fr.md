---
weight: 3
title: "Thème Documentation - Shortcodes"
date: 2020-03-04T16:29:59+08:00
lastmod: 2020-03-04T16:29:59+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "Le thème LoveIt fournit plusieurs shortcodes en plus de ceux intégrés dans Hugo."
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

Le thème **LoveIt** fournit plusieurs shortcodes en plus de ceux intégrés dans Hugo.

<!--more-->

{{< admonition warning >}}
Sorry, this article has not been completely translated into **French**.
Welcome to take the time to propose a translation by [making a PR](https://github.com/dillonzq/LoveIt/pulls) to the theme!
{{< /admonition >}}

Hugo uses Markdown for its simple content format. However, there are a lot of things that Markdown doesn’t support well. You could use pure HTML to expand possibilities.

But this happens to be a bad idea. Everyone uses Markdown because it’s pure and simple to read even non-rendered. You should avoid HTML to keep it as simple as possible.

To avoid this limitations, Hugo created [shortcodes](https://gohugo.io/extras/shortcodes/).
A shortcode is a simple snippet that can generate reasonable HTML code and conforms to Markdown's design philosophy.

## Hugo’s Built-in Shortcodes

Hugo ships with a set of predefined shortcodes that represent very common usage. These shortcodes are provided for author convenience and to keep your markdown content clean.

### `figure` {#figure}

[Documentation of `figure`](https://gohugo.io/content-management/shortcodes/#figure)

Example `figure` Input:

```markdown
{{</* figure src="/images/theme-documentation-shortcodes/lighthouse.jpg" title="Lighthouse (figure)" */>}}
```

The rendered output looks like this:

{{< figure src="/images/theme-documentation-shortcodes/lighthouse.jpg" title="Lighthouse (figure)" >}}

The HTML looks like this:

```html
<figure>
    <img src="/images/theme-documentation-shortcodes/lighthouse.jpg"/>
    <figcaption>
        <h4>Lighthouse (figure)</h4>
    </figcaption>
</figure>
```

### `gist`

[Documentation of `gist`](https://gohugo.io/content-management/shortcodes/#gist)

Example `gist` Input:

```markdown
{{</* gist spf13 7896402 */>}}
```

The rendered output looks like this:

{{< gist spf13 7896402 >}}

The HTML looks like this:

```html
<script type="application/javascript" src="https://gist.github.com/spf13/7896402.js"></script>
```

### `highlight`

[Documentation of `highlight`](https://gohugo.io/content-management/shortcodes/#instagram)

Example `highlight` Input:

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

The rendered output looks like this:

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

[Documentation of `instagram`](https://gohugo.io/content-management/shortcodes/#instagram)

Example `instagram` Input:

```markdown
{{</* instagram BWNjjyYFxVx hidecaption */>}}
```

The rendered output looks like this:

{{< instagram BWNjjyYFxVx hidecaption >}}

### `param`

[Documentation of `param`](https://gohugo.io/content-management/shortcodes/#param)

Example `param` Input:

```markdown
{{</* param description */>}}
```

The rendered output looks like this:

{{< param description >}}

### `ref` and `relref` {#ref-and-relref}

[Documentation of `ref` and `relref`](https://gohugo.io/content-management/shortcodes/#ref-and-relref)

### `tweet`

[Documentation of `tweet`](https://gohugo.io/content-management/shortcodes/#tweet)

Example `tweet` Input:

```markdown
{{</* tweet 877500564405444608 */>}}
```

The rendered output looks like this:

{{< tweet 877500564405444608 >}}

### `vimeo`

[Documentation of `vimeo`](https://gohugo.io/content-management/shortcodes/#vimeo)

Example `vimeo` Input:

```markdown
{{</* vimeo 146022717 */>}}
```

The rendered output looks like this:

{{< vimeo 146022717 >}}

### `youtube`

[Documentation of `youtube`](https://gohugo.io/content-management/shortcodes/#youtube)

Example `youtube` Input:

```markdown
{{</* youtube w7Ft2ymGmfc */>}}
```

The rendered output looks like this:

{{< youtube w7Ft2ymGmfc >}}

## LoveIt Shortcodes

**LoveIt** provides multiple shortcodes on top of existing ones.

### `style`

`style` is a shortcode to insert custom style in your post.

The `style` shortcode can use two parameters. The first is the custom style content and the second is the HTML tag around the content you want to change style, and whose default value is `p`.

Example `style` Input:

```markdown
{{</* style "text-align: right" */>}}
This is a right-aligned paragraph.
{{</* /style */>}}
```

The rendered output looks like this:

{{< style "text-align: right" >}}
This is a right-aligned paragraph.
{{< /style >}}

### `image`

`image` shortcode is an alternative to [`figure` shortcode](#figure). `image` shortcode can take full advantage of the dependent libraries of [lazysizes](https://github.com/aFarkas/lazysizes) and [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js).

The `image` shortcode can use the following named parameters:

* **src**

    URL of the image to be displayed.

* **description**

    Image description.

* **title**

    Image title.

* **class**

    `class` attribute of the HTML `figure` tag.

* **src_s**

    URL of the image thumbnail, used for lightgallery.

* **src_l**

    URL of the HD image, used for lightgallery.

Example `image` Input:

```markdown
{{</* image src="/images/theme-documentation-shortcodes/lighthouse.jpg" title="Lighthouse (`image`)" src-s="/images/theme-documentation-shortcodes/lighthouse-small.jpg" src-l="/images/theme-documentation-shortcodes/lighthouse-large.jpg" */>}}
```

The rendered output looks like this:

{{< image src="/images/theme-documentation-shortcodes/lighthouse.jpg" title="Lighthouse (`image`)" src-s="/images/theme-documentation-shortcodes/lighthouse-small.jpg" src-l="/images/theme-documentation-shortcodes/lighthouse-large.jpg" >}}

### `admonition`

The `admonition` shortcode supports **12** types of banners to help you put notice in your page and `Markdown` format is supported.

{{< admonition >}}
A **note** banner
{{< /admonition >}}

{{< admonition abstract >}}
An **abstract** banner
{{< /admonition >}}

{{< admonition info >}}
A **info** banner
{{< /admonition >}}

{{< admonition tip >}}
A **tip** banner
{{< /admonition >}}

{{< admonition success >}}
A **success** banner
{{< /admonition >}}

{{< admonition question >}}
A **question** banner
{{< /admonition >}}

{{< admonition warning >}}
A **warning** banner
{{< /admonition >}}

{{< admonition failure >}}
A **failure** banner
{{< /admonition >}}

{{< admonition danger >}}
A **danger** banner
{{< /admonition >}}

{{< admonition bug >}}
A **bug** banner
{{< /admonition >}}

{{< admonition example >}}
An **example** banner
{{< /admonition >}}

{{< admonition quote >}}
A **quote** banner
{{< /admonition >}}

The `admonition` shortcode can use the following named parameters:

* **type**

    Type of the `admonition` banner, default is **note**

* **title**

    Title of the `admonition` banner, default is the type name of the banner

* **details**

    if `true`, the content will be expandable/collapsible.

You can also use the positional parameters in the order of **type**, **title** and **details**.

Example `admonition` Input:

```markdown
{{</* admonition type=tip title="This is a tip" details=true */>}}
A **tip** banner
{{</* /admonition */>}}
Or
{{</* admonition tip "This is a tip" true */>}}
A **tip** banner
{{</* /admonition */>}}
```

The rendered output looks like this:

{{< admonition tip "This is a tip" true >}}
A **tip** banner
{{< /admonition >}}

### `mermaid`

[mermaid](https://mermaidjs.github.io/) is a library helping you to generate diagram and flowcharts from text, in a similar manner as Markdown.

Just insert your mermaid code in the `mermaid` shortcode and that’s it.

#### Flowchart {#flowchart}

Example **flowchart** `mermaid` Input:

```markdown
{{</* mermaid */>}}
graph LR;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
{{</* /mermaid */>}}
```

The rendered output looks like this:

{{< mermaid >}}
graph LR;
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
{{< /mermaid >}}

#### Sequence Diagram {#sequence-diagram}

Example **sequence diagram** `mermaid` Input:

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

The rendered output looks like this:

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

#### GANTT {#gantt}

Example **GANTT** `mermaid` Input:

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

The rendered output looks like this:

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

#### Class Diagram {#class-diagram}

Example **class diagram** `mermaid` Input:

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

The rendered output looks like this:

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

#### State Diagram {#state-diagram}

Example **state diagram** `mermaid` Input:

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

The rendered output looks like this:

{{< mermaid >}}
stateDiagram
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
{{< /mermaid >}}

#### Git Graph {#git-graph}

Example **git graph** `mermaid` Input:

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

The rendered output looks like this:

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

#### Pie {#pie}

Example **pie** `mermaid` Input:

```markdown
{{</* mermaid */>}}
pie
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
{{</* /mermaid */>}}
```

The rendered output looks like this:

{{< mermaid >}}
pie
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
{{< /mermaid >}}

### `echarts`

[ECharts](https://echarts.apache.org/) is a library helping you to generate interactive data visualization.

The basic chart types ECharts supports include [line series](https://echarts.apache.org/en/option.html#series-line), [bar series](https://echarts.apache.org/en/option.html#series-line), [scatter series](https://echarts.apache.org/en/option.html#series-scatter), [pie charts](https://echarts.apache.org/en/option.html#series-pie), [candle-stick series](https://echarts.apache.org/en/option.html#series-candlestick), [boxplot series](https://echarts.apache.org/en/option.html#series-boxplot) for statistics, [map series](https://echarts.apache.org/en/option.html#series-map), [heatmap series](https://echarts.apache.org/en/option.html#series-heatmap), [lines series](https://echarts.apache.org/en/option.html#series-lines) for directional information, [graph series](https://echarts.apache.org/en/option.html#series-graph) for relationships, [treemap series](https://echarts.apache.org/en/option.html#series-treemap), [sunburst series](https://echarts.apache.org/en/option.html#series-sunburst), [parallel series](https://echarts.apache.org/en/option.html#series-parallel) for multi-dimensional data, [funnel series](https://echarts.apache.org/en/option.html#series-funnel), [gauge series](https://echarts.apache.org/en/option.html#series-gauge). And it's extremely easy to create a combinition of them with ECharts.

Just insert your ECharts option in `JSON`/`YAML`/`TOML` format in the `echarts` shortcode and that’s it.

Example `echarts` Input in `JSON` format:

```json
{{</* echarts */>}}
{
  "title": {
    "text": "Summary Line Chart",
    "top": "2%",
    "left": "center"
  },
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "data": ["Email Marketing", "Affiliate Advertising", "Video Advertising", "Direct View", "Search Engine"],
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
        "title": "Save as Image"
      }
    }
  },
  "xAxis": {
    "type": "category",
    "boundaryGap": false,
    "data": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [
    {
      "name": "Email Marketing",
      "type": "line",
      "stack": "Total",
      "data": [120, 132, 101, 134, 90, 230, 210]
    },
    {
      "name": "Affiliate Advertising",
      "type": "line",
      "stack": "Total",
      "data": [220, 182, 191, 234, 290, 330, 310]
    },
    {
      "name": "Video Advertising",
      "type": "line",
      "stack": "Total",
      "data": [150, 232, 201, 154, 190, 330, 410]
    },
    {
      "name": "Direct View",
      "type": "line",
      "stack": "Total",
      "data": [320, 332, 301, 334, 390, 330, 320]
    },
    {
      "name": "Search Engine",
      "type": "line",
      "stack": "Total",
      "data": [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
}
{{</* /echarts */>}}
```

The same in `YAML` format:

```yaml
{{</* echarts */>}}
title:
    text: Summary Line Chart
    top: 2%
    left: center
tooltip:
    trigger: axis
legend:
    data:
        - Email Marketing
        - Affiliate Advertising
        - Video Advertising
        - Direct View
        - Search Engine
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
            title: Save as Image
xAxis:
    type: category
    boundaryGap: false
    data:
        - Monday
        - Tuesday
        - Wednesday
        - Thursday
        - Friday
        - Saturday
        - Sunday
yAxis:
    type: value
series:
    - name: Email Marketing
      type: line
      stack: Total
      data:
          - 120
          - 132
          - 101
          - 134
          - 90
          - 230
          - 210
    - name: Affiliate Advertising
      type: line
      stack: Total
      data:
          - 220
          - 182
          - 191
          - 234
          - 290
          - 330
          - 310
    - name: Video Advertising
      type: line
      stack: Total
      data:
          - 150
          - 232
          - 201
          - 154
          - 190
          - 330
          - 410
    - name: Direct View
      type: line
      stack: Total
      data:
          - 320
          - 332
          - 301
          - 334
          - 390
          - 330
          - 320
    - name: Search Engine
      type: line
      stack: Total
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

The same in `TOML` format:

```toml
{{</* echarts */>}}
[title]
text = "Summary Line Chart"
top = "2%"
left = "center"

[tooltip]
trigger = "axis"

[legend]
data = [
  "Email Marketing",
  "Affiliate Advertising",
  "Video Advertising",
  "Direct View",
  "Search Engine"
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
title = "Save as Image"

[xAxis]
type = "category"
boundaryGap = false
data = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

[yAxis]
type = "value"

[[series]]
name = "Email Marketing"
type = "line"
stack = "Total"
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
name = "Affiliate Advertising"
type = "line"
stack = "Total"
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
name = "Video Advertising"
type = "line"
stack = "Total"
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
name = "Direct View"
type = "line"
stack = "Total"
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
name = "Search Engine"
type = "line"
stack = "Total"
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

The rendered output looks like this:

{{< echarts >}}
{
  "title": {
    "text": "Summary Line Chart",
    "top": "2%",
    "left": "center"
  },
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "data": ["Email Marketing", "Affiliate Advertising", "Video Advertising", "Direct View", "Search Engine"],
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
        "title": "Save as Image"
      }
    }
  },
  "xAxis": {
    "type": "category",
    "boundaryGap": false,
    "data": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [
    {
      "name": "Email Marketing",
      "type": "line",
      "stack": "Total",
      "data": [120, 132, 101, 134, 90, 230, 210]
    },
    {
      "name": "Affiliate Advertising",
      "type": "line",
      "stack": "Total",
      "data": [220, 182, 191, 234, 290, 330, 310]
    },
    {
      "name": "Video Advertising",
      "type": "line",
      "stack": "Total",
      "data": [150, 232, 201, 154, 190, 330, 410]
    },
    {
      "name": "Direct View",
      "type": "line",
      "stack": "Total",
      "data": [320, 332, 301, 334, 390, 330, 320]
    },
    {
      "name": "Search Engine",
      "type": "line",
      "stack": "Total",
      "data": [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
}
{{< /echarts >}}

### `music`

The `music` shortcode embeds a responsive music player based on [APlayer](https://github.com/MoePlayer/APlayer) and [MetingJS](https://github.com/metowolf/MetingJS).

The `music` shortcode can use the following named parameters:

|parameter       |default       |description|
|:---------------|:------------:|:----------|
|url             |**require**   |music URL|
|name            |options       |music name|
|artist          |options       |music artist|
|cover           |options       |music cover URL|
|server          |**require**   |music platform: `netease`, `tencent`, `kugou`, `xiami`, `baidu`|
|type            |**require**   |`song`, `playlist`, `album`, `search`, `artist`|
|id              |**require**   |song id / playlist id / album id / search keyword|
|auto            |options       |music link, support: `netease`, `tencent`, `xiami`|
|fixed           |`false`       |enable fixed mode|
|mini            |`false`       |enable mini mode|
|autoplay        |`false`       |audio autoplay|
|theme           |`#a9a9b3`     |main color|
|loop            |`all`         |player loop play, values: 'all', 'one', 'none'|
|order           |`list`        |player play order, values: 'list', 'random'|
|volume          |`0.7`         |default volume, notice that player will remember user setting, default volume will not work after user set volume themselves|
|mutex           |`true`        |prevent to play multiple player at the same time, pause other players when this player start play|
|list-folded     |`false`       |indicate whether list should folded at first|
|list-max-height |`340px`       |list max height|

#### Custom Music URL {#custom-music-url}

Example `music` Input:

```markdown
{{</* music url="https://rainymood.com/audio1110/0.m4a" name=rainymood artist=rainymood cover="https://rainymood.com/i/badge.jpg" */>}}
```

The rendered output looks like this:

{{< music url="https://rainymood.com/audio1110/0.m4a" name=rainymood artist=rainymood cover="https://rainymood.com/i/badge.jpg" >}}

#### Music Platform URL Automatic Identification {#automatic-identification}

Example `music` Input:

```markdown
{{</* music auto="https://music.163.com/#/playlist?id=60198" */>}}
Or
{{</* music "https://music.163.com/#/playlist?id=60198" */>}}
```

The rendered output looks like this:

{{< music auto="https://music.163.com/#/playlist?id=60198" >}}

#### Custom Server, Type and ID {#custom-server}

Example `music` Input:

```markdown
{{</* music server="netease" type="song" id="1868553" */>}}
Or
{{</* music netease song 1868553 */>}}
```

The rendered output looks like this:

{{< music netease song 1868553 >}}

### `bilibili`

The `bilibili` shortcode embeds a responsive video player for bilibili videos.

When the video only has one part, only the `av` ID of the video is required, e.g.:

```code
https://www.bilibili.com/video/av47027633
```

Example `bilibili` Input:

```markdown
{{</* bilibili 47027633 */>}}
Or
{{</* bilibili av=47027633 */>}}
```

The rendered output looks like this:

{{< bilibili av=47027633 >}}

When the video has multiple parts, in addition to the `av` ID of the video,
`p` is also required, whose default value is `1`, e.g.:

```code
https://www.bilibili.com/video/av36570401?p=3
```

Example `bilibili` Input with `p`:

```markdown
{{</* bilibili 36570401 3 */>}}
Or
{{</* bilibili av=36570401 p=3 */>}}
```

The rendered output looks like this:

{{< bilibili av=36570401 p=3 >}}

### `typeit`

The `typeit` shortcode provides typing animation based on [TypeIt](https://typeitjs.com/).

Just insert your content in the `typeit` shortcode and that’s it.

#### Simple Content {#simple-content}

Simple content is allowed in `Markdown` format and **without** rich block content such as images and more...

Example `typeit` Input:

```markdown
{{</* typeit */>}}
This is a *paragraph* with **typing animation** based on [TypeIt](https://typeitjs.com/)...
{{</* /typeit */>}}
```

The rendered output looks like this:

{{< typeit >}}
This is a *paragraph* with **typing animation** based on [TypeIt](https://typeitjs.com/)...
{{< /typeit >}}

Alternatively, you can use custom **HTML tags**.

Example `typeit` Input with `h4` tag:

```markdown
{{</* typeit tag=h4 */>}}
This is a *paragraph* with **typing animation** based on [TypeIt](https://typeitjs.com/)...
{{</* /typeit */>}}
```

The rendered output looks like this:

{{< typeit tag=h4 >}}
This is a *paragraph* with **typing animation** based on [TypeIt](https://typeitjs.com/)...
{{< /typeit >}}

#### Code Content {#code-content}

Code content is allowed and will be highlighted by named parameter `code` for the type of code language.

Example `typeit` Input with `code`:

```markdown
{{</* typeit code=java */>}}
public class HelloWorld {
    public static void main(String []args) {
        System.out.println("Hello World");
    }
}
{{</* /typeit */>}}
```

The rendered output looks like this:

{{< typeit code=java >}}
public class HelloWorld {
    public static void main(String []args) {
        System.out.println("Hello World");
    }
}
{{< /typeit >}}

#### Group Content {#group-content}

All typing animations start at the same time by default.
But sometimes you may want to start a set of `typeit` contents in order.

A set of `typeit` contents with the same value of named parameter `group` will start typing animation in sequence.

Example `typeit` Input with `group`:

```markdown
{{</* typeit group=paragraph */>}}
**First** this paragraph begins
{{</* /typeit */>}}

{{</* typeit group=paragraph */>}}
**Then** this paragraph begins
{{</* /typeit */>}}
```

The rendered output looks like this:

{{< typeit group=paragraph >}}
**First** this paragraph begins
{{< /typeit >}}

{{< typeit group=paragraph >}}
**Then** this paragraph begins
{{< /typeit >}}

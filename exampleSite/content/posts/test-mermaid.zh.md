---
title: "Test Mermaid"
date: 2020-02-27T15:41:42+08:00
lastmod: 2020-02-27T15:41:42+08:00
draft: true
author: ""
authorLink: ""
description: ""
license: ""

tags: []
categories: []
hiddenFromHomePage: false

featuredImage: ""
featuredImagePreview: ""

toc: false
autoCollapseToc: true
lightgallery: true
math: false
comment: true
---

<!--more-->

## Flow

{{< mermaid >}}
graph TD
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
{{< /mermaid >}}

## Sequence

{{< mermaid >}}
sequenceDiagram
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!
{{< /mermaid >}}

## Gantt

{{< mermaid >}}
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
{{< /mermaid >}}

## Class

{{< mermaid >}}
classDiagram
Class01 <|-- AveryLongClass : Cool
<<interface>> Class01
Class09 --> C2 : Where am i?
Class09 --* C3
Class09 --|> Class07
Class07 : equals()
Class07 : Object[] elementData
Class01 : size()
Class01 : int chimp
Class01 : int gorilla
class Class10 {
  <<service>>
  int id
  size()
}
{{< /mermaid >}}

## State

{{< mermaid >}}
stateDiagram
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]
{{< /mermaid >}}

## Pie

{{< mermaid >}}
pie
"Dogs" : 386
"Cats" : 85
"Rats" : 15
{{< /mermaid >}}

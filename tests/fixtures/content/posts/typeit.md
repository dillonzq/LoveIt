---
title: 'Content shortcodes'
date: 2025-01-02
---

{{< typeit group=pair >}}
First typed line
{{< /typeit >}}

{{< typeit group=pair >}}
Second typed line
{{< /typeit >}}

{{< raw >}}<span class="raw-check">Raw HTML</span>{{< /raw >}}

{{< style "color: rgb(1, 2, 3);" >}}Styled text{{< /style >}}

{{< script >}}window.scriptOrder = ['first'];{{< /script >}}

{{< script >}}window.scriptOrder.push('second');{{< /script >}}

{{< admonition note "Nested A" >}}
{{< style "color: rgb(4, 5, 6);" >}}Nested alpha{{< /style >}}
{{< script >}}window.scriptOrder.push('nested a');{{< /script >}}
{{< /admonition >}}

{{< admonition note "Nested B" >}}
{{< style "color: rgb(7, 8, 9);" >}}Nested beta{{< /style >}}
{{< script >}}window.scriptOrder.push('nested b');{{< /script >}}
{{< /admonition >}}

```mermaid
graph LR
    C[Cached] --> D[Content]
```

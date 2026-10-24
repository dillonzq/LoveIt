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

```mermaid
graph LR
    C[Cached] --> D[Content]
```

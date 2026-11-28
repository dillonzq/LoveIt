---
title: 'Feature isolation'
date: 2025-01-07
hiddenFromHomePage: true
---

## Chart

{{< echarts >}}
{ "series": [{ "type": "bar", "data": [1, 2, 3] }], "xAxis": { "type": "category", "data": ["a", "b", "c"] }, "yAxis": { "type": "value" } }
{{< /echarts >}}

## Typed text

{{< typeit >}}
Typed after the chart
{{< /typeit >}}

## Last section

The end.

```js
console.log('code');
```

{{< script >}}
// A handler added by the script shortcode runs after the theme has started.
document.addEventListener('DOMContentLoaded', () => {
  const block = document.querySelector('.code-block');
  const open = block.classList.contains('open');
  block.querySelector('.code-title').click();
  window.shortcodeSawTheme = block.classList.contains('open') !== open;
});
{{< /script >}}

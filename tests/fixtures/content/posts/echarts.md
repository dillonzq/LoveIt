---
title: 'ECharts'
date: 2025-01-06
---

{{< echarts >}}
{
  "title": { "text": "Weekly visits", "left": "center" },
  "legend": { "data": ["Visits"], "top": "10%" },
  "xAxis": { "type": "category", "data": ["Mon", "Tue", "Wed"] },
  "yAxis": { "type": "value" },
  "series": [{ "name": "Visits", "type": "bar", "data": [3, 5, 2] }]
}
{{< /echarts >}}

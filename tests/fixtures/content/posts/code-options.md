---
title: 'Code options'
date: 2024-12-27
code:
  lineNos: false
---

```bash {linenos=true}
echo lower-case option
```

{{< highlight bash "linenos=true" >}}
echo lower-case shortcode option
{{< /highlight >}}

```bash {lineNos=inline}
echo inline line numbers
```

```bash {hl_inline=true wrap=true}
echo inline code
```

{{< highlight bash "hl_inline=FALSE" >}}
echo a block, whatever the case of the option value
{{< /highlight >}}

{{< highlight bash "lineNos=FALSE,wrap=FALSE" >}}
echo boolean option values are case-insensitive
{{< /highlight >}}

```bash {lineNos=table wrap=True}
echo table line numbers and wrapping
```

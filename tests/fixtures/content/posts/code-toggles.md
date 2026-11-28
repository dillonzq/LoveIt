---
title: 'Code toggles'
date: 2024-12-28
code:
  lineNos: false
  wrap: true
---

```bash
echo "a long line that keeps going and going and going and going and going and going and going and going and going and going and going and going and going and going"
echo short
```

```bash {lineNos=true wrap=false}
echo "a long line that keeps going and going and going and going and going and going and going and going and going and going and going and going and going and going"
```

{{< highlight unknownlang "lineNos=true,wrap=false,lineNoStart=3" >}}
plain text that is long enough to overflow the block when it does not wrap, plain text that is long enough to overflow
{{< /highlight >}}

```unknownlang {wrap=false lineNoStart=7}
an unknown language keeps its wrap option, whichever Hugo version stores it
```

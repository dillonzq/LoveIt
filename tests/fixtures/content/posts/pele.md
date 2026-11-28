---
title: 'Pele renderer'
date: 2024-06-01
---

```mermaid
graph LR
    A["$$x^2$$"] --> B[Square]
```

```mermaid
sequenceDiagram
    participant Alpha as Alpha service
    participant Bravo as Bravo service
    participant Charlie as Charlie service
    participant Delta as Delta service
    participant Echo as Echo service
    Alpha->>Bravo: Request
    Bravo->>Charlie: Forward
    Charlie->>Delta: Forward
    Delta->>Echo: Forward
    Echo-->>Alpha: Response
```

{{< mermaid >}}
graph LR
    C[Not closed --> D
{{< /mermaid >}}

---
title: ETL Process
skill: data-pipelines
order: 2
---

> **🎮 Analogy:** ETL is like cooking Gordon Ramsay's beef wellington: you extract prime ingredients from the fridge (Extract), trim the fat and season them (Transform), then plate it up for the Michelin inspectors (Load).

## ETL: Extract, Transform, Load

The core pattern of data pipelines.

> **🎮 Analogy:** ETL is the triforce of data engineering — three separate pieces that only work when combined. Ignore any one and your data world is stuck in the Dark World.

### Extract

Reading data from various sources — databases, APIs, files.

> **🎮 Analogy:** Extraction is like mining diamonds in Minecraft with a Fortune III pickaxe — you need the right tool for each block type (API client for REST, JDBC driver for SQL, S3 SDK for files), and you want maximum yield with minimum effort.

### Transform

Cleaning, filtering, aggregating, joining data.

> **🎮 Analogy:** Transform is the Satisfactory factory floor where conveyors (filters) split off bad items, constructors (aggregations) combine inputs into new products, and mergers (joins) bring two belt lines together — all running at 100% clock speed.

### Load

Writing to a data warehouse, database, or file.

> **🎮 Analogy:** Loading is placing a finished build piece in Valheim — you've cut the wood (extract), shaped the planks (transform), and now you snap it onto your longhouse. If the foundation (schema) doesn't match, the whole piece turns red and refuses to place.

```python
sales = [
    {'region': 'North', 'amount': 100},
    {'region': 'South', 'amount': 150},
    {'region': 'North', 'amount': 200},
    {'region': 'East',  'amount': 120},
    {'region': 'South', 'amount': 180},
]

from collections import defaultdict
totals = defaultdict(int)
for sale in sales:
    totals[sale['region']] += sale['amount']

for region, total in sorted(totals.items()):
    print(f"{region}: ${total}")
```

> **🎮 Analogy:** This aggregation is like sorting Lego bricks by color before building — you dump the bucket (raw sales), group all red 2x4s (North region) together, count them up, and now you know exactly how many you have to work with.

**Output:**
```
East: $120
North: $300
South: $330
```

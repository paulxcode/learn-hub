---
title: What are Data Pipelines?
skill: data-pipelines
order: 1
---

> **🎮 Analogy:** Building a data pipeline is like designing a Factorio conveyor belt system — except instead of moving iron plates to green circuit assemblers, you're shuffling JSON blobs into a data warehouse, and the biters are null values.

## Data Pipeline Basics

A data pipeline moves data from source to destination, transforming it along the way.

> **🎮 Analogy:** A data pipeline is like a Factorio bus system — raw ore (source data) goes in one end, passes through smelters (transformations), and comes out as green circuits (analytics-ready data) on the other end.

```
Source -> Extract -> Transform -> Load -> Destination
```

> **🎮 Analogy:** The ETL flow is like assembling a burger: Extract = grabbing the patty and buns from the fridge, Transform = grilling and assembling, Load = putting it on the plate for your customer (the dashboard).

## Simple Python Pipeline

```python
import csv
import json

def extract(filename):
    with open(filename, 'r') as f:
        return list(csv.DictReader(f))

def transform(rows):
    result = []
    for row in rows:
        row['price'] = float(row['price'])
        row['total'] = row['price'] * int(row['quantity'])
        result.append(row)
    return result

def load(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

sample_data = [
    {'item': 'widget', 'price': '10.50', 'quantity': '3'},
    {'item': 'gadget', 'price': '25.00', 'quantity': '2'},
]

transformed = transform(sample_data)
print(json.dumps(transformed, indent=2))
```

**Output:**
```
[
  {
    "item": "widget",
    "price": 10.5,
    "total": 31.5
  },
  {
    "item": "gadget",
    "price": 25.0,
    "total": 50.0
  }
]
```

> **🎮 Analogy:** This is like writing a recipe for one meal by hand — works fine at home, but when you're running a restaurant (production), you need a proper kitchen system (Airflow, Spark) with standardized prep stations.

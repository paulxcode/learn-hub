---
title: Batch vs Streaming
skill: data-pipelines
order: 3
---

> **🎮 Analogy:** Batch processing is doing all your laundry on Sunday — efficient, scheduled, and you regret it when you realize you forgot that one sock. Stream processing is washing each dish the moment you use it — always ready, but you never leave the kitchen sink.

## Batch Processing

Process data in chunks at scheduled intervals:

> **🎮 Analogy:** Batch is Factorio's inserter stack-size bonus — you wait, accumulate a full stack of 12 items, then move them all at once. Efficient for throughput, terrible if you need that one iron plate right now.

```python
def batch_process():
    print("Batch job started at 02:00 AM")

    orders = [
        {"id": 1, "amount": 100, "date": "2026-05-20"},
        {"id": 2, "amount": 250, "date": "2026-05-20"},
        {"id": 3, "amount": 75,  "date": "2026-05-20"},
    ]

    totals = {"total_orders": 0, "total_revenue": 0}
    for order in orders:
        totals["total_orders"] += 1
        totals["total_revenue"] += order["amount"]

    print(f"Processed {totals['total_orders']} orders")
    print(f"Revenue: ${totals['total_revenue']}")

    return totals

result = batch_process()
```

**Output:**
```
Batch job started at 02:00 AM
Processed 3 orders
Revenue: $425
```

## Stream Processing

Process data in real-time as it arrives:

> **🎮 Analogy:** Stream processing is the hit-detection system in a fighting game — when Ryu throws a fireball, the game doesn't wait until the end of the round to check if it hit. Every frame matters, and sub-second reaction is the difference between a combo and a whiff.

```python
import time

def stream_processor():
    print("Listening for events...")

    events = [
        {"type": "click", "user": "alice", "page": "/home"},
        {"type": "purchase", "user": "bob", "item": "widget", "price": 50},
        {"type": "click", "user": "alice", "page": "/pricing"},
        {"type": "purchase", "user": "alice", "item": "premium", "price": 200},
    ]

    metrics = {"clicks": 0, "purchases": 0, "revenue": 0}

    for event in events:
        if event["type"] == "click":
            metrics["clicks"] += 1
            print(f"Click from {event['user']} on {event['page']}")
        elif event["type"] == "purchase":
            metrics["purchases"] += 1
            metrics["revenue"] += event["price"]
            print(f"Purchase: {event['user']} bought {event['item']}")

    print(f"\nSession summary: {metrics}")

stream_processor()
```

**Output:**
```
Listening for events...
Click from alice on /home
Purchase: bob bought widget
Click from alice on /pricing
Purchase: alice bought premium

Session summary: {'clicks': 2, 'purchases': 2, 'revenue': 250}
```

> **🎮 Analogy:** The events in this stream example are like items on a Galco conveyor belt in Portal — each one (click, purchase) moves past you exactly once, and you have milliseconds to decide whether to pick it up (process) or let it fall into the emancipation grille (ignore).

## Batch vs Streaming Comparison

| Feature | Batch | Streaming |
|---------|-------|-----------|
| Latency | Hours/days | Seconds |
| Data size | Massive (TB+) | Per-event |
| Processing | Scheduled | Continuous |
| Storage | Data lakes | Message queues |
| Tools | Spark, Hive | Kafka, Flink |

> **🎮 Analogy:** Choosing batch vs streaming is like choosing between a weekly grocery haul (efficient, bulk discounts, but milk goes bad) and a daily corner-store run (fresh bread every morning, but you pay premium and never leave the shop). Your data's shelf life decides.

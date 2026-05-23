---
title: Stream Processing
skill: data-pipelines
order: 11
quiz:
  - type: mc
    question: "What is the key difference between batch and stream processing?"
    options:
      - "Batch processes data within a time window; stream processes data as it arrives"
      - "Batch is always faster than stream processing"
      - "Stream processing requires more storage than batch"
      - "There is no practical difference"
    answer: 0
  - type: mc
    question: "In Kafka, what is a consumer group?"
    options:
      - "A group of producers that share the same topic"
      - "A set of consumers that coordinate to read partitions of a topic, with each partition assigned to one consumer"
      - "A group of topics that are processed together"
      - "A configuration for message compression"
    answer: 1
  - type: mc
    question: "What does exactly-once semantics mean in stream processing?"
    options:
      - "Messages may be delivered zero or more times"
      - "Each message is processed exactly one time, even in the face of failures"
      - "Messages are delivered at least once but may be retried"
      - "Messages are never delivered more than once, even if processing fails"
    answer: 1
---

> **🎮 Analogy:** Stream processing is the live chat during a Ninja stream — millions of emotes (events) pour in per second, you can't store them all, you need to detect the PogChamp (anomaly) in real time, and sub-second latency is mandatory or chat riots.

## Batch vs Stream Processing

Batch processes data in fixed intervals — hourly, daily, weekly. Stream processes data as it arrives, with sub-second latency:

| Dimension | Batch | Stream |
|-----------|-------|--------|
| Latency | Minutes to hours | Milliseconds to seconds |
| Data scope | All available data | Windowed (tumbling, sliding, session) |
| Processing | Finite dataset | Infinite, unbounded |
| Storage | Data lake, warehouse | Message broker, log |
| Use case | Monthly reports | Fraud detection, real-time dashboards |

> **🎮 Analogy:** Batch vs stream is the difference between a screenshot (captures one perfect moment, slow to share) and a live Twitch stream (every frame broadcast instantly, but you need decent upload speed and can't rewind). Choose based on whether you need the exact moment or the continuous experience.

```python
# Batch approach
def process_batch():
    raw_data = read_all_from_s3("data/orders/2024-01-*.parquet")
    transformed = clean_and_enrich(raw_data)
    write_to_warehouse(transformed)

# Stream approach
def process_event(event):
    enriched = enrich_with_user_data(event)
    if detect_anomaly(enriched):
        alert_team(enriched)
    write_to_analytics_db(enriched)
```

## Event-Driven Architectures

Events are immutable facts that happened in the past. Services communicate by producing and consuming events:

> **🎮 Analogy:** Events are the death messages in Minecraft — "Player was slain by Zombie" is an immutable fact. You can't change it, you can only react to it (respawn, retrieve items). Services communicate by writing death messages (producing) and watching the chat log (consuming).

```python
from dataclasses import dataclass, asdict
import json


@dataclass
class OrderPlaced:
    order_id: str
    user_id: str
    amount: float
    items: list
    timestamp: str


def handle_order_placed(event_data):
    event = OrderPlaced(**json.loads(event_data))
    print(f"Processing order {event.order_id} for ${event.amount}")
    update_inventory(event.items)
    send_confirmation_email(event.user_id, event.order_id)
```

## Kafka Concepts

**Topics:** Named channels for related events. Partitioned for parallelism.

> **🎮 Analogy:** Kafka topics are Discord channels — `#order-events` is where the bot posts every new order, `#user-signups` is where registration webhooks land. Producers are the bots that post messages, and partitions are like having 10 parallel threads in the same channel so messages don't back up.

**Producers:** Applications that publish events to topics:

```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=["localhost:9092"],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

producer.send(
    "order-events",
    {"order_id": "123", "user_id": "abc", "amount": 49.99, "timestamp": "2024-01-15T10:30:00Z"},
)
producer.flush()
```

**Consumers:** Applications that read events. Consumers in the same **consumer group** divide partitions among themselves:

> **🎮 Analogy:** Consumer groups are the loot分配 system in an MMO raid — if you have 4 consumers and 4 partitions, each gets one (personal loot). If you have 2 consumers, each handles 2 partitions (need before greed). Three consumers means one sits out (trade window tax).

```python
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "order-events",
    bootstrap_servers=["localhost:9092"],
    group_id="analytics-pipeline",
    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
)

for message in consumer:
    event = message.value
    print(f"Partition {message.partition}: order {event['order_id']}")
```

## Exactly-Once Semantics

Delivery guarantees range from best-effort to exactly-once:

> **🎮 Analogy:** Message delivery semantics are the three types of Minecraft player: at-most-once is the speedrunner who might miss a block (message lost), at-least-once is the hoarder who picks up every single dropped item including duplicates, and exactly-once is the technical player with a precise item-sorting system.

| Semantics | Behavior | Use Case |
|-----------|----------|----------|
| At-most-once | Message may be lost | Metrics, monitoring |
| At-least-once | Message may be retried (duplicates possible) | Most pipelines |
| Exactly-once | Message processed once, no duplicates | Financial transactions |

Kafka achieves exactly-once through idempotent producers and transactional consumers. In practice, make your processing **idempotent** — processing the same message twice produces the same result:

```python
def upsert_order(event):
    db.execute("""
        INSERT INTO orders (id, user_id, amount, status)
        VALUES (%s, %s, %s, 'confirmed')
        ON CONFLICT (id) DO NOTHING
    """, (event.order_id, event.user_id, event.amount))
```

> **🎮 Analogy:** When deciding between batch and stream, ask yourself: "Am I baking cookies for a weekly market (batch = bake all Saturday night) or running a hot-dog stand at a football match (stream = grill as they order)?" One needs bulk efficiency, the other needs reaction speed.

Stream processing isn't always the answer. If your use case tolerates hourly updates, batch is simpler, cheaper, and easier to debug.

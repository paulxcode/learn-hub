---
title: Stream Processing with Kafka
skill: cloud-big-data
order: 8
quiz:
  - type: mc
    question: "What is a Kafka topic?"
    options:
      - "A database table"
      - "A named stream of records"
      - "A configuration file"
      - "A consumer group ID"
    answer: 1
  - type: mc
    question: "What happens if a consumer fails in a Kafka consumer group?"
    options:
      - "Messages are lost permanently"
      - "Partitions are reassigned to remaining consumers"
      - "Kafka stops producing messages"
      - "The topic is deleted"
    answer: 1
  - type: mc
    question: "How does Kafka differ from traditional message queues?"
    options:
      - "Messages are removed after being consumed"
      - "Messages persist and can be replayed"
      - "It only supports one consumer per topic"
      - "It does not guarantee ordering"
    answer: 1
---

> **🎮 Analogy:** Kafka is the town crier with a photographic memory — instead of shouting the news once and hoping you heard it, he carves every announcement into a stone tablet (commit log) so you can come back centuries later and replay it from the beginning.

## Kafka Basics

Apache Kafka is a distributed event streaming platform. It acts as a highly durable, scalable commit log.

**Topics** — Named channels where records are published. Topics are split into **partitions** for parallelism.

> **🎮 Analogy:** Topics are Discord channels — `#user-events` is where everyone posts gameplay logs, `#purchases` is where the finance bot listens, and partitions are the multiple voice channels within a category so 50 people can talk at once without chaos.

**Producers** — Publish records to topics. Records are appended to the commit log.

> **🎮 Analogy:** A Kafka producer is a player sending chat messages in an MMO — they fire and forget, trusting the server (Kafka) to store the message permanently and deliver it to whoever's listening, even if those listeners are offline right now.

**Consumers** — Subscribe to topics and read records. Multiple consumers form a **consumer group** — each partition is assigned to one consumer in the group.

> **🎮 Analogy:** A consumer group is a squad in a battle royale — each squad member (consumer) covers a different sector (partition), if one gets eliminated (fails), the remaining members split their sector so nothing is missed (rebalancing).

```python
# Producer example
from kafka import KafkaProducer
import json
import time

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

events = [
    {"user": "alice", "event": "page_view", "page": "/home", "timestamp": time.time()},
    {"user": "bob", "event": "purchase", "item": "widget", "price": 49.99, "timestamp": time.time()},
    {"user": "alice", "event": "click", "element": "signup_button", "timestamp": time.time()},
]

for event in events:
    future = producer.send("user-events", value=event)
    result = future.get(timeout=10)
    print(f"Sent to partition {result.partition} at offset {result.offset}")

producer.flush()
producer.close()
```

> **🎮 Analogy:** The producer sending events to Kafka is like the game server writing a log entry for every player action — each entry gets a unique offset (log line number) so you can say "show me everything that happened between line 14,203 and 14,303" for debugging that weird loot drop bug.

```python
# Consumer example
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "user-events",
    bootstrap_servers="localhost:9092",
    group_id="analytics-consumers",
    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    auto_offset_reset="earliest"
)

print("Listening for user events...")
message_count = 0
for message in consumer:
    event = message.value
    if event["event"] == "purchase":
        print(f"PURCHASE: {event['user']} bought {event['item']} for ${event['price']}")
    message_count += 1
    if message_count >= 5:
        break
```

## Kafka vs Traditional Messaging

| Feature | Traditional Queue | Kafka |
|---------|-----------------|-------|
| Message retention | Deleted after ack | Configurable retention (days/weeks) |
| Replay | Not possible | Seek to any offset |
| Ordering | Best-effort | Guaranteed per partition |
| Throughput | Thousands/sec | Millions/sec |
| Consumers | One consumes once | Multiple consumer groups |

> **🎮 Analogy:** Kafka vs traditional queue is a DVR vs live TV — traditional queues are live broadcasts (miss it? gone forever), but Kafka is the 500-hour DVR where you can rewind to any timestamp, skip commercials, and watch the same episode on three different TVs in parallel (consumer groups).

## Real-Time Data Pipelines

Common pattern: producers publish events, Kafka buffers them durably, stream processors (Kafka Streams, Spark Streaming, Flink) consume and transform, results land in data stores.

> **🎮 Analogy:** The Kafka pipeline is a factory conveyor belt (Factorio style) — apps dump raw ore (events) onto the belt, Kafka is the unbreakable belt segment that never loses items, Spark Streaming is the assembler that smelts ore into plates, and the data lake is the storage chest at the end.

```
Applications -> Kafka -> Stream Processor -> Data Lake/DB
```

Use Kafka when you need reliable, replayable event streaming at scale.

> **🎮 Analogy:** If your data is a river, Kafka is the dam with a fish ladder — it doesn't stop the flow, but it makes sure every single fish (event) is counted, recorded for history, and available for scientists (consumers) to study months later.

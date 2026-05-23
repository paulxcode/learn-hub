---
title: Data Contracts
skill: data-pipelines
order: 13
quiz:
  - type: mc
    question: "What is the difference between schema-on-read and schema-on-write?"
    options:
      - "Schema-on-read applies structure at query time; schema-on-write validates structure at write time"
      - "Schema-on-read is used for JSON only; schema-on-write is used for Avro only"
      - "Schema-on-read requires more storage; schema-on-write requires more compute"
      - "There is no practical difference"
    answer: 0
  - type: mc
    question: "A schema change is backward-compatible if:"
    options:
      - "Old clients can read new data without errors"
      - "New clients can read old data without errors"
      - "The schema file can be parsed by any programming language"
      - "The schema doesn't change at all"
    answer: 0
  - type: mc
    question: "What is the purpose of a schema registry?"
    options:
      - "To store and version schemas, ensuring producers and consumers agree on data format"
      - "To encrypt all data in transit"
      - "To automatically generate database tables"
      - "To compress data for storage efficiency"
    answer: 0
---

> **🎮 Analogy:** A data contract is the loot agreement two guilds sign before a WoW raid — the DPS (producers) promise 100k minimum (data freshness), the healers (consumers) promise not to wipe the party if a field goes missing, and the guild master (schema registry) enforces the rules.

## Schema-on-Read vs Schema-on-Write

The fundamental design choice that shapes your pipeline architecture:

> **🎮 Analogy:** Schema-on-read vs schema-on-write is the difference between "I'll figure out how to build this IKEA furniture when I see the pieces" and "I'll decide the exact layout before opening the box." One is flexible but messy, the other is clean but requires planning.

| Aspect | Schema-on-Read | Schema-on-Write |
|--------|---------------|-----------------|
| When validated | At query time | At write time |
| Flexibility | High (any structure accepted) | Lower (rejected if malformed) |
| Data quality | Risk of bad data downstream | Caught at ingestion |
| Performance | Slower queries (parse on read) | Faster queries (pre-structured) |
| Typical use | Data lakes | Data warehouses |

```python
def schema_on_write(data, required_fields):
    """Validate at write time. Reject bad data immediately."""
    for field in required_fields:
        if field not in data or data[field] is None:
            raise ValueError(f"Missing required field: {field}")
    print(f"Record accepted: {data['id']}")


def schema_on_read(data, fields_to_read):
    """Parse at read time. Handle missing fields gracefully."""
    result = {}
    for field in fields_to_read:
        result[field] = data.get(field, None)
    print(f"Read projection: {result}")
    return result
```

## Schema Registries

Schema registries store and version schemas, enabling producers and consumers to evolve independently:

> **🎮 Analogy:** A schema registry is the patch notes repository for an MMO — every version is documented, old clients can still connect (backward compat), and when the devs add a new gear slot, v1.2.3 players don't crash; they just don't see the amulet slot.

```python
# Avro schema definition
AVRO_SCHEMA = """
{
    "type": "record",
    "name": "Transaction",
    "namespace": "com.data.transactions",
    "fields": [
        {"name": "id", "type": "string"},
        {"name": "user_id", "type": "string"},
        {"name": "amount", "type": "double"},
        {"name": "currency", "type": "string", "default": "USD"},
        {"name": "timestamp", "type": "string"}
    ]
}
"""


class SchemaRegistry:
    def __init__(self):
        self.schemas = {}

    def register(self, subject, version, schema):
        key = f"{subject}-v{version}"
        self.schemas[key] = schema
        print(f"Registered {key}")

    def get_schema(self, subject, version):
        return self.schemas.get(f"{subject}-v{version}")

    def validate(self, subject, version, data):
        schema = self.get_schema(subject, version)
        if not schema:
            raise ValueError(f"Schema {subject} v{version} not found")
        for field in schema["fields"]:
            if field["name"] not in data:
                if "default" not in field:
                    raise ValueError(f"Missing required field: {field['name']}")
        print(f"Data validated against {subject} v{version}")
        return True
```

## Backward and Forward Compatibility

> **🎮 Analogy:** Backward compatibility is the Nintendo Wii playing GameCube discs — old games (consumers) work on the new console (data format). Forward compatibility is playing a Blu-ray on a PS3 that got a firmware update — the PS3 doesn't know about Blu-ray features, but it still plays the movie.

```python
def check_backward_compatible(old_schema, new_schema):
    """Old readers can read new data."""
    old_fields = {f["name"] for f in old_schema["fields"]}
    new_fields = {f["name"] for f in new_schema["fields"]}

    removed = old_fields - new_fields
    if removed:
        print(f"WARN: Fields removed (breaking): {removed}")
        return False

    added = new_fields - old_fields
    for field in new_schema["fields"]:
        if field["name"] in added and "default" not in field:
            print(f"WARN: Added field '{field['name']}' without default")
            return False

    print("Schema change is backward-compatible")
    return True


old = {
    "fields": [{"name": "id"}, {"name": "name"}, {"name": "email"}]
}

new_compatible = {
    "fields": [
        {"name": "id"},
        {"name": "name"},
        {"name": "email"},
        {"name": "phone", "default": ""},
    ]
}

check_backward_compatible(old, new_compatible)
```

## Contract Testing Between Teams

Data producers and consumers agree on a contract, then test independently:

> **🎮 Analogy:** Contract testing is the alliance treaty in EVE Online — the miner corp (producer) promises to deliver 100k Tritanium every Monday by 00:00 EVE time (latency SLA), and the industrial corp (consumer) agrees to accept the ore in any standard container (schema). Both sides get kicked from the alliance if they break the terms.

```python
# Producer writes a contract
PRODUCER_CONTRACT = {
    "dataset": "user_events",
    "version": "2.0",
    "schema": {
        "fields": [
            {"name": "user_id", "type": "string", "nullable": False},
            {"name": "event_type", "type": "string", "nullable": False},
            {"name": "timestamp", "type": "datetime", "nullable": False},
        ],
    },
    "guarantees": {
        "latency_sla_seconds": 60,
        "min_delivery_rate": 0.999,
    },
}


def consumer_test_against_contract():
    sample = receive_event()
    assert "user_id" in sample and sample["user_id"] is not None
    assert "event_type" in sample and sample["event_type"] in (
        "click", "purchase", "signup",
    )
    assert "timestamp" in sample
    print("Consumer contract test passed")
```

> **🎮 Analogy:** Data contracts are the network protocol in a multiplayer game — the server (producer) promises to send position data in a specific format every tick, and the client (consumer) promises to render whatever it receives. If the server starts sending hitbox data where position data should be, the game desyncs.

Data contracts are the API of the data world — they define boundaries and make dependencies explicit.

---
title: Schema Evolution
skill: data-pipelines
order: 10
quiz:
  - type: mc
    question: "What is the key difference between schema-on-read and schema-on-write?"
    options:
      - "Schema-on-read applies structure when data is queried; schema-on-write applies it when data is stored"
      - "Schema-on-read is faster for querying"
      - "Schema-on-write is only used in data lakes"
      - "There is no practical difference"
    answer: 0
  - type: mc
    question: "Why is Parquet often preferred over CSV for analytical workloads?"
    options:
      - "Parquet is a text format that is human-readable"
      - "Parquet is columnar, compressed, and optimized for analytics with predicate pushdown"
      - "Parquet only works with Python"
      - "Parquet files are always smaller than CSV files"
    answer: 1
  - type: mc
    question: "What is a backward-compatible schema change?"
    options:
      - "A change where old clients can still read new data"
      - "A change that requires all clients to upgrade"
      - "A change that deletes existing columns"
      - "A change that renames columns without warning"
    answer: 0
---

> **🎮 Analogy:** Schema evolution is renovating your house while still living in it — you're adding a new bathroom (column) upstairs, but the kitchen (production queries) better still work, and nobody wants the toilet plumbing connected to the shower drain.

## Schema-on-Read vs Schema-on-Write

**Schema-on-write** (data warehouses): Define the schema before loading. Data that doesn't fit is rejected.

> **🎮 Analogy:** Schema-on-write is the character creator in an MMO — you pick your class and stats before leaving the tutorial zone. Want to change your class later? That'll be a premium respec token (schema migration).

**Schema-on-read** (data lakes): Store raw data, apply schema when reading. More flexible but risks data quality issues.

> **🎮 Analogy:** Schema-on-read is a D&D session where the DM says "just write whatever on your character sheet, we'll figure out the rules later" — super flexible, but Kevin will absolutely try to cast Level 9 spells at Level 3 because nobody checked.

```python
def schema_on_write(data, expected_schema):
    """Reject data that doesn't match."""
    if set(data.keys()) != set(expected_schema):
        raise ValueError(f"Schema mismatch: expected {expected_schema}")
    print(f"Validated: {list(data.keys())}")

def schema_on_read(data, schema_override=None):
    """Read whatever you get, apply structure later."""
    print(f"Raw keys: {list(data.keys())}")
    if schema_override:
        projected = {k: data.get(k) for k in schema_override}
        print(f"Projected: {projected}")

schema_on_write({"name": "Alice", "age": 30}, ["name", "age"])
schema_on_read({"name": "Bob", "age": 25, "phone": "555-0100"}, ["name"])
```

**Output:**
```
Validated: ['name', 'age']
Raw keys: ['name', 'age', 'phone']
Projected: {'name': 'Bob'}
```

## Avro vs Parquet

| Feature | Avro | Parquet |
|---------|------|---------|
| Format | Row-oriented | Column-oriented |
| Best for | Write-heavy, streaming | Read-heavy, analytics |
| Schema | Embedded in file | Embedded in file |
| Compression | Moderate | High (per-column encoding) |
| Evolution | Full schema evolution | Add/drop columns supported |

> **🎮 Analogy:** Avro is the inventory system in Resident Evil 4 — row-oriented, you see every item one at a time (write-heavy, great for streaming). Parquet is the stash tab in Path of Exile — column-oriented, you filter by stat type (read-heavy, perfect for analytics), and everything is compressed into premium tabs.

## Migration Strategies

Forward-compatible and backward-compatible schema changes:

> **🎮 Analogy:** Schema migration is updating a Skyrim mod mid-playthrough — adding a new weapon (column) with default stats is fine (backward-compatible), but renaming "Iron Sword" to "Steel Sword" (renaming a column) breaks every save that references the old item ID.

```python
class SchemaManager:
    def __init__(self):
        self.versions = {}

    def register_schema(self, version, schema):
        self.versions[version] = schema

    def migrate(self, data, from_version, to_version):
        print(f"Migrating v{from_version} → v{to_version}")
        current = data.copy()

        for v in range(from_version, to_version):
            upgrade_fn = getattr(self, f"upgrade_v{v}_to_v{v+1}", None)
            if upgrade_fn:
                current = upgrade_fn(current)

        return current

    def upgrade_v1_to_v2(self, data):
        data["email"] = ""
        return data

    def upgrade_v2_to_v3(self, data):
        data["full_name"] = f"{data.pop('first_name', '')} {data.pop('last_name', '')}".strip()
        return data

sm = SchemaManager()
old_data = {"first_name": "Alice", "last_name": "Smith"}
new_data = sm.migrate(old_data, 1, 3)
print(new_data)
```

**Output:**
```
Migrating v1 → v3
{'email': '', 'full_name': 'Alice Smith'}
```

## Backward Compatibility

A schema change is **backward-compatible** if new data can be read by old readers (add optional fields, never remove or rename).

> **🎮 Analogy:** Backward compatibility is adding a new character to Smash Bros. — old players (consumers) can still play the game without a patch, they just won't see Sora (new column) in the character select screen. Remove Mario (an existing column) and the whole game crashes.

A schema change is **forward-compatible** if old data can be read by new readers (ignore unknown fields).

> **🎮 Analogy:** Forward compatibility is playing a PS1 game on a PS5 — the new console ignores the memory card slot (old fields it doesn't need) and upscales the graphics, but the original game still runs fine without knowing about the SSD.

Parquet and Avro both support adding fields with defaults, making evolution safe.
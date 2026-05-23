---
title: Data Lakes Architecture
skill: cloud-big-data
order: 14
quiz:
  - type: mc
    question: "What is the main difference between a data lake and a data warehouse?"
    options:
      - "Data lakes store structured data; warehouses store unstructured data"
      - "Data lakes store raw data in native format; warehouses store processed, structured data"
      - "Data lakes are slower than warehouses"
      - "Data lakes cannot store JSON data"
    answer: 1
  - type: mc
    question: "What does the bronze layer contain in a medallion architecture?"
    options:
      - "Aggregated business-level reports"
      - "Raw ingested data as-is"
      - "Cleaned and deduplicated data"
      - "Machine learning model predictions"
    answer: 1
  - type: mc
    question: "What characterizes a lakehouse architecture?"
    options:
      - "Blending data lake flexibility with data warehouse reliability using a metadata layer like Delta Lake"
      - "A physical building with servers and a lake nearby"
      - "Storing only Parquet files with no schema"
      - "Using only proprietary file formats"
    answer: 0
---

> **🎮 Analogy:** A data lake is an actual lake — everything ends up there (fish, tires, treasure maps, that one flip-flop), but you need scuba gear (schema-on-read) to find anything. A warehouse is a bottled-water factory — clean, labeled, and ready to drink, but good luck throwing a treasure map in there.

## Data Lake vs Data Warehouse

| Attribute | Data Lake | Data Warehouse |
|-----------|-----------|---------------|
| Data type | Raw, any format (JSON, CSV, Parquet, images) | Structured, processed |
| Schema | Schema-on-read | Schema-on-write |
| Storage cost | Low (object storage) | Higher |
| Typical users | Data scientists, engineers | Analysts, BI tools |
| Quality | Raw, may need cleaning | Clean, reliable |

> **🎮 Analogy:** Data lake vs warehouse is your Steam library vs your installed games folder — the library has everything you ever bought, from AAA titles to buggy early-access garbage (lake, all data raw), but your installed folder only has the polished games you actually play (warehouse, processed and ready).

## Lakehouse Architecture

The lakehouse combines data lake flexibility with warehouse reliability. A metadata layer (like Delta Lake, Apache Iceberg, or Apache Hudi) adds ACID transactions, schema enforcement, and time travel on top of object storage.

> **🎮 Analogy:** Delta Lake is the "version history" in Google Docs for your data lake — you still dump files into S3 like before (raw flexibility), but now you can see who changed what, revert to yesterday's version (time travel), and guarantee two people don't edit the same cell simultaneously (ACID transactions).

```python
# Using PySpark with Delta Lake
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("lakehouse-demo") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
    .getOrCreate()

# Write with ACID guarantees
data = [
    ("2026-05-01", "alice", 150.00),
    ("2026-05-01", "bob", 200.00),
    ("2026-05-02", "alice", 75.00),
]

df = spark.createDataFrame(data, schema=["date", "user", "amount"])

df.write \
    .format("delta") \
    .mode("overwrite") \
    .save("s3://data-lake/delta/sales/")

# Time travel: read data as of a specific version
df_v1 = spark.read \
    .format("delta") \
    .option("versionAsOf", 1) \
    .load("s3://data-lake/delta/sales/")

df_v1.show()
```

> **🎮 Analogy:** Delta Lake time travel is loading your Minecraft world backup from last Tuesday — the creeper hole is still there (unfixed bug), but the village you accidentally burned down is magically restored. It's `git checkout` for data.

## Medallion Architecture (Bronze/Silver/Gold)

A layered approach popularized by Databricks:

**Bronze** — Raw ingested data. Exactly as received from source, no transformations. Append-only.

> **🎮 Analogy:** Bronze layer is the "unboxing" video stage — you dump everything out of the box exactly as it arrived from Amazon, tape, bubble wrap, and all. No organizing, no assembling (IKEA instructions still sealed), just raw receipts.

**Silver** — Cleaned, deduplicated, validated data. Joins and filtering applied. Ready for analysis.

> **🎮 Analogy:** Silver layer is the "sorting loot" phase after a raid in an MMO — you filter out the gray junk items (clean), merge duplicate health potions (deduplicate), and combine armor sets from different party members (joins). It's not yet sold on the auction house, but it's organized.

**Gold** — Business-level aggregates, curated data marts. Powering dashboards and reports.

> **🎮 Analogy:** Gold layer is the auction house listings — you've taken your sorted materials and crafted them into sellable gear with prices (aggregates). This is what executives (buyers) actually see and interact with, not the messy scrap pile it came from.

```
Bronze (raw) -> Silver (clean) -> Gold (aggregated)
    |                |                   |
  S3/GCS          S3/GCS             S3/GCS
  ingested        cleaned            aggregated
  JSON/CSV        Parquet            Parquet
```

```python
# Conceptual layer transformation
bronze_data = [
    {"raw": "2026-05-01,alice,150.00", "source_ts": "2026-05-01T12:00:00Z"},
    {"raw": "2026-05-01,bob,200.00",   "source_ts": "2026-05-01T12:01:00Z"},
]

# Silver layer: parse and clean
silver = []
for entry in bronze_data:
    parts = entry["raw"].split(",")
    silver.append({
        "date": parts[0],
        "user": parts[1].strip().lower(),
        "amount": float(parts[2]),
        "ingested_at": entry["source_ts"]
    })

# Gold layer: aggregate
from collections import defaultdict
gold = defaultdict(float)
for record in silver:
    gold[record["user"]] += record["amount"]

for user, total in sorted(gold.items()):
    print(f"{user}: ${total:.2f}")
```

**Output:**
```
alice: $150.00
bob: $200.00
```

Querying data lakes directly with tools like Athena (Presto), BigQuery Omni, or Spark enables SQL access without loading data into a warehouse.

> **🎮 Analogy:** Athena querying S3 directly is the "search my entire messy desk" command — instead of first organizing every paper into a filing cabinet (loading into a warehouse), you just yell "WHERE IS THE TPS REPORT?" and Athena rummages through the chaos to find it. Slower than a filing cabinet, but zero setup time.

---
title: Cloud Data Warehouses
skill: cloud-big-data
order: 9
quiz:
  - type: mc
    question: "Which of the following is Amazon's cloud data warehouse?"
    options:
      - "RDS"
      - "Redshift"
      - "DynamoDB"
      - "Aurora"
    answer: 1
  - type: mc
    question: "What type of storage do modern cloud data warehouses use?"
    options:
      - "Row-oriented storage"
      - "Columnar storage"
      - "Key-value storage"
      - "Document storage"
    answer: 1
  - type: mc
    question: "What makes BigQuery serverless?"
    options:
      - "It runs on physical servers in your data center"
      - "You don't need to provision or manage clusters"
      - "It only works with Google Sheets"
      - "It requires a dedicated VM"
    answer: 1
---

> **🎮 Analogy:** Cloud data warehouses are the Library of Alexandria — except they've got off-site backups, columnar indexing so you only read the scrolls you need, and they won't burn down if someone sneezes near a candle.

## Overview of Cloud Data Warehouses

Cloud data warehouses store structured data optimized for analytical queries (aggregations, joins, scans over large datasets).

> **🎮 Analogy:** A data warehouse is your meticulously sorted Pokémon PC box — everything's organized by type (columnar), you can search for all Water-types instantly without checking each individual Pokémon, and you'd never store your half-chewed bicycle (unstructured data) in there.

**Redshift** — AWS's petabyte-scale warehouse. Columnar storage, massively parallel processing (MPP), integrates with S3. Provision clusters with node types.

> **🎮 Analogy:** Redshift is the Age of Empires II economy — you build individual villagers (nodes), assign them to tasks (provisioning), and they work in parallel to gather resources. Need more wood? Train more villagers (add nodes). A villager dies? You notice and rebuild.

**BigQuery** — GCP's serverless warehouse. No cluster management — storage and compute are separate. Query petabytes with SQL.

> **🎮 Analogy:** BigQuery is the "creative mode" of data warehousing — you just fly around placing queries like blocks, never worrying about servers or resource packs. It automatically conjures as much compute as needed, like Minecraft spawning creepers when you least expect it.

**Snowflake** — Multi-cloud (AWS, GCP, Azure). Separates storage, compute, and services. Virtual warehouses provide elastic compute.

> **🎮 Analogy:** Snowflake is the modular gaming PC you can upgrade part-by-part — swap the GPU (compute) without touching the SSD (storage), play on any desk (AWS, GCP, Azure), and the virtual warehouse is like overclocking your CPU when you launch Cyberpunk (heavy query) and underclocking for Excel (light dashboard).

```sql
-- BigQuery: query external data on GCS without loading
SELECT vendor_id, COUNT(*) as trips, AVG(fare_amount) as avg_fare
FROM `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2018`
WHERE pickup_datetime BETWEEN '2018-01-01' AND '2018-01-07'
GROUP BY vendor_id
ORDER BY trips DESC;
```

> **🎮 Analogy:** Querying external data on GCS without loading it into BigQuery first is like using a cheat code to open any chest in an RPG without picking the lock — you skip the tedious ETL step and get straight to the loot analysis.

```

## Columnar Storage

Data warehouses store data by column, not by row. This enables:

- **Better compression** — Same data type in each column compresses well
> **🎮 Analogy:** Columnar compression is like storing all your iron ingots in one chest, all wood planks in another, and all diamonds in a third — the Minecraft inventory system compresses 64 of the same item into one stack, but if you mixed them, each slot holds only one.

- **Faster scans** — Only read columns referenced in the query
- **Vectorized processing** — Process many values per CPU cycle

```python
# Conceptual difference: row vs column storage
query_columns = ["customer_id", "total_amount"]
data = {
    "customer_id": [1, 2, 3, 4, 5],
    "name": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "total_amount": [250.0, 150.0, 300.0, 100.0, 450.0],
    "email": ["a@x.com", "b@x.com", "c@x.com", "d@x.com", "e@x.com"],
}

# Row storage: reads all columns for each row
row_bytes = sum(len(str(v)) for col in data for v in data[col])
print(f"Row storage reads: {row_bytes} bytes (all columns)")

# Columnar: only reads needed columns
col_bytes = 0
for col in query_columns:
    col_bytes += sum(len(str(v)) for v in data[col])
print(f"Columnar reads:    {col_bytes} bytes (only {query_columns})")
print(f"I/O reduction:     {100 - (col_bytes / row_bytes * 100):.0f}%")
```

**Output:**
```
Row storage reads: 99 bytes (all columns)
Columnar reads:    20 bytes (only ['customer_id', 'total_amount'])
I/O reduction:     80%
```

## Cost Optimization

- **Redshift** — Use RA3 nodes with managed storage, reserve instances for steady workloads
- **BigQuery** — Use clustering/partitioning, flat-rate pricing for predictable usage, cache results
- **Snowflake** — Use auto-suspend for virtual warehouses, multi-cluster for concurrency

Query design impacts cost significantly: `SELECT *` on a 10 TB table costs more than selecting 3 columns.

> **🎮 Analogy:** `SELECT *` on a 10 TB table is buying the entire Steam catalog when you just wanted one indie game — technically you got it, but your wallet (data warehouse bill) is now a cautionary tale.

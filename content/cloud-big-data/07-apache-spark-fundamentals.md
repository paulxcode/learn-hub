---
title: Apache Spark Fundamentals
skill: cloud-big-data
order: 7
quiz:
  - type: mc
    question: "What is the main advantage of Spark over Hadoop MapReduce?"
    options:
      - "Spark uses more disk I/O"
      - "Spark processes data in-memory, reducing disk I/O"
      - "Spark can only run on a single node"
      - "Spark does not support SQL"
    answer: 1
  - type: mc
    question: "Which Spark abstraction provides a distributed collection of objects with functional transformations?"
    options:
      - "DataFrame"
      - "RDD (Resilient Distributed Dataset)"
      - "Dataset"
      - "SparkContext"
    answer: 1
  - type: mc
    question: "What is the primary interface for structured data processing in Spark?"
    options:
      - "RDD"
      - "Spark SQL / DataFrames"
      - "MapReduce"
      - "DStream"
    answer: 1
---

> **🎮 Analogy:** Spark is the IKEA of data processing — MapReduce makes you drive back and forth to the warehouse for every single screw (disk I/O), while Spark keeps all the parts on your workbench (in-memory) and you're done in time for meatballs.

## Spark vs Hadoop MapReduce

Spark processes data in-memory, while MapReduce writes intermediate results to disk after each step. This makes Spark 10–100x faster for iterative algorithms and interactive queries.

> **🎮 Analogy:** Spark vs MapReduce is the difference between keeping your crafting ingredients in your inventory (in-memory) vs running back to the chest every time you need one more iron ingot (disk I/O) — both get you the sword, but one involves a lot more walking.

```python
# Spark typically runs on a cluster, but this pattern works locally
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("analytics") \
    .master("local[*]") \
    .getOrCreate()

# Read CSV, infer schema
df = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .csv("sales_data.csv")

df.createOrReplaceTempView("sales")

# Run SQL queries
results = spark.sql("""
    SELECT
        region,
        COUNT(*) as num_orders,
        ROUND(SUM(amount), 2) as total_revenue
    FROM sales
    WHERE amount > 0
    GROUP BY region
    ORDER BY total_revenue DESC
""")

results.show()
```

> **🎮 Analogy:** Spark SQL is Google Translate for databases — you write SQL (English), and Spark translates it into optimized MapReduce instructions (Mandarin) behind the scenes, so you never have to deal with the messy translation details.

## RDDs, DataFrames, Datasets

**RDD (Resilient Distributed Dataset)** — Low-level distributed collection. Supports functional transformations like `map`, `filter`, `reduceByKey`.

> **🎮 Analogy:** RDDs are like programming a game in pure assembly — you have total control over every byte and register (partition), but you're manually managing memory, and one wrong `map` can crash your whole pipeline like a segfault in your render loop.

**DataFrame** — Higher-level abstraction with schema (like a table). Optimized through Catalyst query optimizer. Preferred for most tasks.

> **🎮 Analogy:** DataFrames are Unity Engine vs raw OpenGL — Unity (DataFrame) handles the optimization magic (Catalyst optimizer) so you don't have to micromanage every vertex, and you get readable C# (SQL/transformations) instead of shader assembly.

**Dataset** — Type-safe version of DataFrames (JVM languages). Python's DataFrame is equivalent to Dataset[Row].

> **🎮 Analogy:** If RDD is assembly language and DataFrames are Unity Engine, then Datasets are TypeScript — you get the power of a full game engine with the safety of knowing your variable types won't explode at runtime. Python users don't see them directly, but under the hood, your DataFrame is a Dataset[Row].

```python
# RDD style
rdd = spark.sparkContext.parallelize([
    ("alice", 100), ("bob", 200), ("alice", 150)
])
totals = rdd.reduceByKey(lambda a, b: a + b).collect()
print("RDD results:", dict(totals))

# DataFrame style
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

schema = StructType([
    StructField("user", StringType(), True),
    StructField("amount", IntegerType(), True),
])

df = spark.createDataFrame([("alice", 100), ("bob", 200), ("alice", 150)], schema)
df.groupBy("user").sum("amount").show()
```

> **🎮 Analogy:** RDD's `reduceByKey` is like sorting Magic: The Gathering cards by color with friends — everyone takes a pile and makes their own "red pile" and "blue pile" (map), then you all merge your red piles together (reduceByKey). The DataFrame equivalent is just asking "sort by color" and the engine figures it out.

## When to Use Spark

- **Batch ETL** — Transform large datasets reliably
- **Data exploration** — Interactive analysis via notebooks
- **Machine learning** — MLlib for distributed training
- **Stream processing** — Structured Streaming for near-real-time

For datasets under 100 GB on a single machine, pandas/dask may be simpler and faster. Spark shines at terabyte+ scale.

> **🎮 Analogy:** Using Spark for a 10 MB CSV is like calling in an airstrike on a single cockroach — effective but dramatic, and you'll spend more time on the radio call (cluster startup) than actually solving the problem.

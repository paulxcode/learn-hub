---
title: Data Warehousing
skill: data-pipelines
order: 8
quiz:
  - type: mc
    question: "What is the main difference between a data lake and a data warehouse?"
    options:
      - "Data lakes store structured data only; data warehouses store any format"
      - "Data lakes store raw data in native formats; data warehouses store processed, structured data optimized for queries"
      - "Data lakes are only for images; data warehouses are for text"
      - "There is no practical difference"
    answer: 1
  - type: mc
    question: "In a star schema, what is a fact table?"
    options:
      - "A table that contains only descriptive attributes"
      - "A table that stores historical metadata only"
      - "The central table containing quantitative measures and foreign keys to dimension tables"
      - "A table that validates data quality"
    answer: 2
  - type: mc
    question: "How does ELT differ from ETL?"
    options:
      - "ELT transforms data before loading; ETL transforms after loading"
      - "ELT loads raw data first and transforms in the warehouse; ETL transforms before loading"
      - "ELT is always faster than ETL"
      - "ELT is only used for batch processing"
    answer: 1
---

> **🎮 Analogy:** A data warehouse is the Bank of England's gold vault — data lakes leave gold bars scattered across the floor (raw JSON), but the warehouse stacks them neatly, catalogs every ingot, and charges interest (compute credits) if you look at them funny.

## Data Lake vs Data Warehouse

| Aspect | Data Lake | Data Warehouse |
|--------|-----------|----------------|
| Data format | Raw, any format | Processed, structured |
| Schema | Schema-on-read | Schema-on-write |
| Users | Data scientists, engineers | Business analysts, BI tools |
| Storage cost | Low (object storage) | Higher (optimized storage) |
| Performance | Slower queries | Fast analytical queries |

> **🎮 Analogy:** A data lake is the pile of all crafting materials in your Minecraft chest room; a data warehouse is the auto-sorter system behind it — every block (record) has a designated chest (column), and you can instantly find exactly how much redstone dust you have without digging through seventeen double-chests.

## Star Schema

The star schema organizes data into fact and dimension tables:

> **🎮 Analogy:** Star schema is the character sheet in an RPG — the fact table is your HP/MP/XP (numeric measures you actually care about), and dimension tables are the character name, class, race, and equipment (descriptive attributes you filter by).

```sql
-- Fact table: contains measures
CREATE TABLE fact_sales (
    sale_id INT PRIMARY KEY,
    product_id INT REFERENCES dim_product(id),
    customer_id INT REFERENCES dim_customer(id),
    date_id INT REFERENCES dim_date(id),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2)
);

-- Dimension table: descriptive attributes
CREATE TABLE dim_product (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    brand VARCHAR(50),
    supplier VARCHAR(100)
);

CREATE TABLE dim_customer (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    region VARCHAR(50),
    segment VARCHAR(50)
);

CREATE TABLE dim_date (
    id INT PRIMARY KEY,
    full_date DATE,
    year INT,
    month INT,
    day INT,
    quarter INT
);
```

## ELT vs ETL

**ETL (Extract, Transform, Load):**
- Extract raw data
- Transform in a staging area
- Load into warehouse

> **🎮 Analogy:** ETL is meal-prep Sunday — you wash, chop, and cook everything first (transform), then portion it into containers (load). ELT is ordering HelloFresh — the raw ingredients arrive (load), and you cook in your own kitchen with their tools (transform in-database).

**ELT (Extract, Load, Transform):**
- Extract raw data
- Load directly into warehouse
- Transform in-database using SQL

```python
def etl_pipeline(source, staging_func, target):
    raw = extract(source)
    transformed = staging_func(raw)
    load(target, transformed)
    print("ETL complete")

def elt_pipeline(source, target):
    raw = extract(source)
    load(target, raw)
    print("Raw data loaded, transform in warehouse with SQL")
```

> **🎮 Analogy:** ELT is opening a loot crate and letting the game sort your items into the right inventory tabs automatically — Snowflake is the UI that lets you search, filter, and equip items without ever manually dragging a sword to the weapons slot.

Modern cloud warehouses (Snowflake, BigQuery, Redshift) favor ELT because their compute power makes in-database transformation efficient and scalable.
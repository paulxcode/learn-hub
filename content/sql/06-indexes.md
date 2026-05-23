---
title: Indexes & Performance
skill: sql
order: 6
quiz:
  - type: mc
    question: "When should you create an index on a column?"
    options:
      - "On every column in the table"
      - "On columns used in WHERE, JOIN, and ORDER BY with high cardinality"
      - "Only on primary key columns"
      - "Only on text columns"
    answer: 1
  - type: mc
    question: "When should you NOT use an index?"
    options:
      - "On columns used in JOIN conditions"
      - "On large tables"
      - "On small tables or columns with few unique values"
      - "On foreign key columns"
    answer: 2
  - type: mc
    question: "What side effect do indexes have on write operations?"
    options:
      - "They make writes faster"
      - "They have no effect on writes"
      - "They slow down writes because indexes must be updated"
      - "They prevent writes on indexed columns"
    answer: 2
---

> **🎮 Analogy:** An index is the card catalog in the College of Winterhold's library — instead of scanning every shelf (full table scan), you check the catalog to find exactly which aisle has "The Mysteries of the Dwemer" and grab it instantly.

## Why Indexes Matter

Indexes speed up queries by creating a sorted data structure for columns.

```sql
-- Create an index
CREATE INDEX idx_users_email ON users(email);

-- Create a composite index
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Unique index
CREATE UNIQUE INDEX idx_products_sku ON products(sku);
```

> **🎮 Analogy:** Creating an index is like building a warp pipe in Super Mario — instead of walking through every level to get back to World 4-2, you just step in the pipe and you're there instantly. But every pipe takes space and maintenance.

## When to Use Indexes

- Columns used in WHERE, JOIN, ORDER BY
- High-cardinality columns (many unique values)
- Foreign keys used in JOINs

## When NOT to Use Indexes

- Small tables (under 100 rows)
- Columns rarely queried
- Columns with few unique values (boolean, status)
- Tables with heavy write operations (indexes slow writes)

> **🎮 Analogy:** Indexes on write-heavy tables are like a librarian who updates the card catalog every time someone returns a book — finding books later is fast, but every single return takes twice as long.

## Query Execution Plan

```sql
-- Show how SQL executes a query
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42
ORDER BY order_date DESC;

-- Compare with and without index
EXPLAIN ANALYZE
SELECT * FROM products
WHERE category = 'Electronics'
AND price BETWEEN 100 AND 500;
```

> **🎮 Analogy:** `EXPLAIN ANALYZE` is the Task Manager for your SQL queries — it shows exactly what's eating CPU time, which steps are the bottleneck, and whether your "upgrade" (index) actually helped.

## Index Maintenance

```sql
-- View indexes on a table
PRAGMA index_list('orders');

-- Remove an unused index
DROP INDEX IF EXISTS idx_unused;

-- Rebuild indexes
REINDEX;
```

> **🎮 Analogy:** Regular index maintenance is like defragmenting your hard drive in 2005 — everything still works without it, but over time things get sluggish, and `REINDEX` is the "right-click → Properties → Tools → Defrag" that makes everything snappy again.

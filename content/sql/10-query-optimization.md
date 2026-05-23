---
title: Query Optimization
skill: sql
order: 10
quiz:
  - type: mc
    question: "What is the primary benefit of a B-tree index on a column used in WHERE clauses?"
    options:
      - "It allows full table scans to run faster"
      - "It enables the database to locate rows without scanning the entire table"
      - "It compresses the data to reduce disk usage"
      - "It automatically fixes slow queries"
    answer: 1
  - type: mc
    question: "What is the purpose of EXPLAIN ANALYZE in SQL?"
    options:
      - "It shows only the query result without executing it"
      - "It shows the query plan and actually executes the query to measure runtime"
      - "It rewrites the query to be more efficient"
      - "It validates the SQL syntax only"
    answer: 1
  - type: mc
    question: "Which scenario is most likely to cause a full table scan despite having an index?"
    options:
      - "SELECT * FROM users WHERE id = 100"
      - "SELECT * FROM users WHERE status IN ('active', 'pending')"
      - "SELECT * FROM users WHERE UPPER(name) = 'ALICE'"
      - "SELECT * FROM users ORDER BY id"
    answer: 2
---

> **🎮 Analogy:** EXPLAIN ANALYZE is like Skyrim's perk calculator — it shows you exactly where your build is spending resources (cost breakdown) so you can respec intelligently rather than dumping all perks into "Slow Time" and wondering why your damage is low.

## Using EXPLAIN

EXPLAIN shows the query plan without executing it:

```sql
EXPLAIN SELECT * FROM employees WHERE department = 'Engineering';
```

**Output (typical):**
```
Seq Scan on employees  (cost=0.00..35.50 rows=10 width=220)
  Filter: (department = 'Engineering'::text)
```

EXPLAIN ANALYZE actually runs the query and shows real timing:

```sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE department = 'Engineering';
```

**Output (typical):**
```
Seq Scan on employees  (cost=0.00..35.50 rows=10 width=220)
  (actual time=0.015..0.018 rows=8 loops=1)
  Filter: (department = 'Engineering'::text)
  Rows Removed by Filter: 42
Planning Time: 0.050 ms
Execution Time: 0.030 ms
```

> **🎮 Analogy:** `EXPLAIN` is a GPS showing the route before you drive — "turn left, then highway, then exit." `EXPLAIN ANALYZE` actually drives the car and reports: "that left took 2 seconds, the highway took 30 seconds — try a different route."

## Index Types

**B-tree** (default): Balanced tree, good for equality and range queries (`=`, `>`, `<`, `BETWEEN`, `LIKE 'prefix%'`).

```sql
CREATE INDEX idx_pending_orders ON orders(status)
WHERE status = 'pending';
```

> **🎮 Analogy:** Wrapping a column in `UPPER()` is like putting a disguise on a celebrity — the paparazzi (database) walks right past because they're looking for "Alice" but "ALICE" is wearing sunglasses. A functional index teaches the paparazzi to recognize sunglasses too.

## Reading a Query Plan

A query plan shows each step and its cost. Look for:

| Red Flag | What It Means |
|----------|---------------|
| `Seq Scan` on a large table | Missing or unused index |
| `Sort` (disk-based) | Sort spill to disk, increase work_mem |
| `Nested Loop` with many rows | Consider Hash Join or merge join |
| `Rows Removed by Filter` | Index might help narrow early |

```sql
-- Compare before and after adding an index
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;
-- Seq Scan on orders (cost=0.00..835.00 rows=1 width=100)

CREATE INDEX idx_customer ON orders(customer_id);

EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;
-- Index Scan using idx_customer (cost=0.28..8.29 rows=1 width=100)
```

> **🎮 Analogy:** Reading a query plan is like looking at a speedrun guide — `Seq Scan` means your runner is walking through every room (wasted time), `Index Scan` means they're taking the skip routes (fast), and `Rows Removed by Filter` shows your runner checked empty rooms.

---
title: Query Performance
skill: sql
order: 15
quiz:
  - type: mc
    question: "What does EXPLAIN ANALYZE show that plain EXPLAIN does not?"
    options:
      - "The execution plan with actual timing and row counts"
      - "The syntax errors in the query"
      - "The table schema"
      - "The query execution time only"
    answer: 0
  - type: mc
    question: "Which index type is best for range queries like salary BETWEEN 50000 AND 100000?"
    options:
      - "Hash index"
      - "B-tree index"
      - "GiST index"
      - "Bitmap index"
    answer: 1
  - type: mc
    question: "What is a common query anti-pattern that prevents index usage?"
    options:
      - "SELECT * FROM users WHERE email = 'user@example.com'"
      - "SELECT * FROM users WHERE id IN (1, 2, 3)"
      - "SELECT * FROM users WHERE YEAR(created_at) = 2024"
      - "SELECT * FROM users ORDER BY id"
    answer: 2
---

> **🎮 Analogy:** Query performance tuning is like upgrading your gaming PC — adding an index is installing an SSD (faster reads), caching is adding more RAM (frequent data is ready to go), and rewriting a bad query is like replacing a single-core CPU with a multi-core one — everything runs smoother once you fix the bottleneck.

## EXPLAIN ANALYZE in Depth

`EXPLAIN` shows the query plan. `EXPLAIN ANALYZE` executes the query and shows real metrics:

```sql
EXPLAIN ANALYZE
SELECT c.name, SUM(o.total) AS lifetime_value
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE c.signup_date >= '2024-01-01'
GROUP BY c.name
ORDER BY lifetime_value DESC
LIMIT 10;
```

**Output (typical):**
```
Limit  (cost=178.34..178.37 rows=10 width=72)
  (actual time=12.45..12.46 rows=10 loops=1)
  -> Sort  (cost=178.34..178.84 rows=200 width=72)
        (actual time=12.44..12.45 rows=10 loops=1)
        Sort Key: (sum(o.total)) DESC
        Sort Method: top-N heapsort  Memory: 25kB
        -> HashAggregate  (cost=170.23..174.23 rows=200 width=72)
              (actual time=10.20..11.80 rows=450 width=72)
              Group Key: c.name
              -> Hash Join  (cost=42.50..161.50 rows=1750 width=40)
                    (actual time=0.80..7.50 rows=3200 loops=1)
                    Hash Cond: (o.customer_id = c.id)
                    -> Seq Scan on orders o  (cost=0.00..95.00 rows=3500 width=36)
                          (actual time=0.01..2.30 rows=3500 loops=1)
                    -> Hash  (cost=30.00..30.00 rows=1000 width=36)
                          (actual time=0.70..0.71 rows=1000 loops=1)
                          Buckets: 1024  Batches: 1
                          -> Seq Scan on customers c  (cost=0.00..30.00 rows=1000 width=36)
                                (actual time=0.01..0.30 rows=1000 loops=1)
                                Filter: (signup_date >= '2024-01-01'::date)
                                Rows Removed by Filter: 500
Planning Time: 0.15 ms
Execution Time: 12.70 ms
```

Focus on: `actual time`, `rows` vs `rows` estimate mismatch, and `Seq Scan` on large tables.

> **🎮 Analogy:** The "actual time" vs estimated cost in EXPLAIN ANALYZE is like a racing game's qualifying lap vs actual race time — predictions are nice, but the real numbers tell you which corners you're actually crashing on.

## Index Types

**B-tree** (default): Equality and range queries. Supports `=`, `>`, `<`, `BETWEEN`, `IN`, `LIKE 'prefix%'`.

```sql
CREATE INDEX idx_salary ON employees(salary);
CREATE INDEX idx_name_location ON employees(name, location);
```

**Hash**: Equality only (`=`). Faster than B-tree for exact lookups. No ordering or range support.

```sql
CREATE INDEX idx_user_hash ON users USING HASH (email);
```

> **🎮 Analogy:** A Hash index is like coat check at a club — hand over your ticket number (exact email) and the attendant instantly grabs your coat. But "find me all warm coats" (range query)? Wrong system entirely.

**GiST**: Geometry, full-text search, range types. Supports proximity and overlap queries.

```sql
CREATE INDEX idx_location ON venues USING GIST (coordinates);
-- Find venues within 10km of a point
SELECT * FROM venues
WHERE coordinates <-> POINT(40.7128, -74.0060) < 0.1;
```

> **🎮 Analogy:** A GiST index is like a GPS navigation system — regular indexes sort alphabetically (street names), but GiST understands "find every Starbucks within 1 mile of my current location." It's spatial awareness for your database.

## Common Anti-Patterns

```sql
-- ❌ Wrapping column in function prevents index usage
SELECT * FROM orders WHERE YEAR(created_at) = 2024;
-- ✅ Use range query instead
SELECT * FROM orders WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- ❌ Implicit type conversion
SELECT * FROM users WHERE phone = 1234567890;
-- ✅ Match the column type
SELECT * FROM users WHERE phone = '1234567890';

-- ❌ SELECT * with only a few needed columns
SELECT * FROM products WHERE category = 'electronics';
-- ✅ Select only needed columns
SELECT id, name, price FROM products WHERE category = 'electronics';

-- ❌ Non-sargable LIKE with leading wildcard
SELECT * FROM products WHERE name LIKE '%laptop%';
-- ✅ Consider full-text search for leading wildcards
```

> **🎮 Analogy:** `YEAR(created_at) = 2024` is the SQL equivalent of blindfolding a bloodhound — you take the one thing the index excels at (finding dates) and make it useless by hiding the date inside a function. Range queries are the reward: "find me everything between Jan 1, 2024 and Jan 1, 2025."

## Query Rewriting Techniques

```sql
-- ❌ Subquery that runs per row (correlated)
SELECT name, (SELECT MAX(amount) FROM orders WHERE customer_id = customers.id)
FROM customers;

-- ✅ Rewrite as lateral join or window function
SELECT c.name, o.max_amount
FROM customers c
LEFT JOIN LATERAL (
    SELECT MAX(amount) AS max_amount
    FROM orders
    WHERE customer_id = c.id
) o ON true;

-- ❌ Two separate queries that could be combined
SELECT COUNT(*) FROM orders WHERE status = 'pending';
SELECT COUNT(*) FROM orders WHERE status = 'shipped';

-- ✅ Single pass
SELECT status, COUNT(*) FROM orders
WHERE status IN ('pending', 'shipped')
GROUP BY status;

-- ❌ Filtering on joined table after join
SELECT c.*
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.created_at >= '2024-01-01';

-- ✅ Filter before join
SELECT c.*
FROM customers c
JOIN orders o ON c.id = o.customer_id AND o.created_at >= '2024-01-01';
```

Always profile before optimizing. A query running in 50ms doesn't need rewriting — focus on the ones that take seconds.

> **🎮 Analogy:** Optimizing a 50ms query is like tuning your car's turbo for a trip to the grocery store two blocks away — technically an improvement, but nobody will notice. Spend your energy on the queries that take 5 seconds (the cross-country road trips).

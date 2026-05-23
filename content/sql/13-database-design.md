---
title: Database Design
skill: sql
order: 13
quiz:
  - type: mc
    question: "A table is in 3NF if it is in 2NF and:"
    options:
      - "All columns are dependent only on the primary key, not on other non-key columns"
      - "It has no duplicate rows"
      - "All columns are of the same data type"
      - "It uses UUIDs as primary keys"
    answer: 0
  - type: mc
    question: "What is the primary purpose of a foreign key constraint?"
    options:
      - "To speed up queries by creating an index"
      - "To enforce referential integrity between related tables"
      - "To automatically generate unique IDs"
      - "To compress the table data"
    answer: 1
  - type: mc
    question: "In an OLTP schema, indexes should be designed primarily for:"
    options:
      - "Maximizing storage efficiency"
      - "Fast writes with minimal index overhead"
      - "Supporting frequent point lookups and small-range queries by primary/foreign keys"
      - "Pre-aggregating all possible query results"
    answer: 2
---

> **🎮 Analogy:** Database normalization is like designing your Factorio factory — instead of dumping iron plates, copper wire, and green circuits in one chaotic chest (1NF violation), you create separate bus lines and dedicated production areas so nothing bottlenecks and everything scales cleanly.

## Normalization

Normalization eliminates redundancy and prevents anomalies:

**1NF:** Each cell contains a single value. No repeating groups.

| ❌ Bad (repeating group) | ✅ Good (1NF) |
|---|---|
| `order_id, items` | `order_id, item_id, item_name` |
| `1, "apple,banana"` | `1, 1, "apple"` |
| | `1, 2, "banana"` |

> **🎮 Analogy:** 1NF is the "one item per slot" rule in Minecraft — you can't stuff 64 cobblestone AND a diamond sword in the same inventory slot. Each cell gets exactly one value, no cramming.

**2NF:** In 1NF + every non-key column depends on the whole primary key (relevant for composite keys).

```sql
-- ❌ 2NF violation: product_name depends on product_id, not on (order_id, product_id)
CREATE TABLE order_items (
    order_id INTEGER,
    product_id INTEGER,
    product_name TEXT,    -- depends only on product_id
    quantity INTEGER,
    PRIMARY KEY (order_id, product_id)
);

-- ✅ Fix: split into two tables
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE order_items (
    order_id INTEGER,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    PRIMARY KEY (order_id, product_id)
);
```

> **🎮 Analogy:** 2NF is like separating crafting materials from gear in an RPG — `product_name` depends only on `product_id`, not on which order it's in, so it gets its own table instead of repeating across every order row.

**3NF:** In 2NF + no transitive dependencies (a non-key column depends on another non-key column).

```sql
-- ❌ 3NF violation: department_name depends on department_id, not on employee_id
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT,
    department_id INTEGER,
    department_name TEXT  -- depends on department_id
);

-- ✅ Fix: store department separately
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT,
    department_id INTEGER REFERENCES departments(id)
);
```

> **🎮 Analogy:** 3NF is like storing your friend's phone number in Contacts instead of scribbling it on every party invitation — `department_name` belongs in the `departments` table, not repeated on every employee row.

## Primary and Foreign Keys

```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    total REAL NOT NULL CHECK (total >= 0),
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

Constraints enforce data integrity at the database level — never rely solely on application code.

> **🎮 Analogy:** A foreign key is the "you can't delete this while it's in use" warning Windows gives you — try to delete a customer with active orders, and the FK constraint stops you like a librarian shushing a loud patron.

## Index Design Strategies

Indexes speed reads at the cost of slower writes:

```sql
-- B-tree index on frequently queried columns
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- Composite index for queries filtering on multiple columns
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);

-- Partial index for a subset of rows
CREATE INDEX idx_active_subscriptions ON subscriptions(user_id)
WHERE status = 'active';

-- Covering index (includes all needed columns)
CREATE INDEX idx_order_summary ON orders(customer_id, total, status);
```

> **🎮 Analogy:** A covering index is like a vending machine that has chips AND drinks in one column — instead of running to the snack aisle (table) then the drink aisle (another index), everything you need is right in front of you.

## Analytics vs OLTP

| Dimension | OLTP | Analytics (OLAP) |
|-----------|------|------------------|
| Query pattern | Many small reads/writes | Few large scans |
| Normalization | 3NF typical | Denormalized (star schema) |
| Index strategy | Focus on PK/FK lookups | Broad indexes, materialized views |
| Table design | Many small tables | Fewer wide tables |
| Example | E-commerce checkout | Monthly revenue report |

Design for your workload. An analytics schema optimized for OLTP will perform poorly, and vice versa.

> **🎮 Analogy:** OLTP vs OLAP is the difference between a convenience store checkout (many small, fast transactions — buying a soda) and a Costco warehouse inventory (bulk scans, huge reports — monthly stocktake). Design your schema like you'd design the store layout.

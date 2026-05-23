---
title: Advanced JOINs
skill: sql
order: 8
quiz:
  - type: mc
    question: "Which JOIN type is most useful for finding employees and their managers stored in the same table?"
    options:
      - "INNER JOIN"
      - "SELF JOIN"
      - "CROSS JOIN"
      - "FULL OUTER JOIN"
    answer: 1
  - type: mc
    question: "What does a CROSS JOIN produce?"
    options:
      - "Only matching rows from both tables"
      - "Every combination of rows from both tables"
      - "All rows from the left table with NULLs where no match exists"
      - "The intersection of both tables"
    answer: 1
  - type: mc
    question: "When using FULL OUTER JOIN, what happens to rows that don't have a match in the other table?"
    options:
      - "They are excluded from results"
      - "They appear with NULL values in the other table's columns"
      - "They appear only if they exist in the left table"
      - "They cause the query to error"
    answer: 1
---

> **🎮 Analogy:** A self JOIN is like a Skyrim family tree — you need to figure out who's whose parent in the same `NPCs` table, which tells you every Jarl's lineage. A CROSS JOIN is like trying on every helmet with every chest piece in your inventory — all possible combinations, but most are useless.

## Self JOIN

A self JOIN joins a table with itself. The classic example is employees and their managers stored in the same table:

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    manager_id INT
);

INSERT INTO employees VALUES
    (1, 'Alice', NULL),
    (2, 'Bob', 1),
    (3, 'Carol', 1),
    (4, 'Dave', 2),
    (5, 'Eve', 2);

SELECT e1.name AS employee,
       COALESCE(e2.name, 'CEO') AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id
ORDER BY e1.id;
```

**Output:**
```
employee  manager
Alice     CEO
Bob       Alice
Carol     Alice
Dave      Bob
Eve       Bob
```

> **🎮 Analogy:** The self JOIN on employees is like a game of "who reports to whom?" in the same spreadsheet — every employee points to their manager in the same table, and the query follows the breadcrumbs from intern to CEO.

## FULL OUTER JOIN

Returns all rows from both tables, with NULLs where there's no match:

```sql
SELECT customers.name, orders.product
FROM customers
FULL OUTER JOIN orders ON customers.id = orders.customer_id;
```

Useful for finding orphaned records on either side:
- Customers with no orders → `WHERE orders.id IS NULL`
- Orders with no customer → `WHERE customers.id IS NULL`

> **🎮 Analogy:** FULL OUTER JOIN is the wedding seating chart from hell — everyone from both families shows up, including plus-ones nobody knows, and the empty chairs (NULLs) mark where estranged cousins should have sat.

## CROSS JOIN

Produces the Cartesian product — every combination of rows from both tables:

```sql
SELECT colors.name, sizes.name
FROM (VALUES ('Red'), ('Blue'), ('Green')) AS colors(name)
CROSS JOIN (VALUES ('S'), ('M'), ('L')) AS sizes(name);
```

**Output:**
```
name  name
Red   S
Red   M
Red   L
Blue  S
Blue  M
Blue  L
Green S
Green M
Green L
```

> **🎮 Analogy:** CROSS JOIN is like the "randomize" button in a fashion game — it pairs EVERY top with EVERY bottom, giving you 50 outfits where 48 are hideous. Useful only when you truly want all permutations.

## Join Order and Performance

The order of JOINs matters for performance, not for results:

```sql
-- More selective join first
SELECT *
FROM small_table s
JOIN large_table l ON s.id = l.s_id;

-- Database optimizers usually reorder joins,
-- but with many tables or complex conditions,
-- putting smaller result sets first helps.
```

> **🎮 Analogy:** Join order is like packing a suitcase — put the big items in first (smaller result sets), then squeeze the small stuff around them. Do it backwards and nothing fits, even though the total volume is the same.

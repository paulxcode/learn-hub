---
title: Recursive Queries
skill: sql
order: 12
quiz:
  - type: mc
    question: "What are the two mandatory parts of a recursive CTE?"
    options:
      - "The anchor member and the recursive member, separated by UNION ALL"
      - "The base case and the termination condition, separated by UNION"
      - "The SELECT and the WHERE clause"
      - "The anchor index and the recursive index"
    answer: 0
  - type: mc
    question: "What happens if a recursive CTE lacks a termination condition?"
    options:
      - "It returns zero rows"
      - "It runs indefinitely until hitting the recursion limit or running out of memory"
      - "It automatically stops after one iteration"
      - "It raises a syntax error"
    answer: 1
  - type: mc
    question: "Which SQL clause is used to prevent infinite recursion?"
    options:
      - "LIMIT"
      - "MAXRECURSION (T-SQL) or optimizer-level recursion limit"
      - "STOP WHEN"
      - "TERMINATE ON"
    answer: 1
---

> **🎮 Analogy:** A recursive CTE is like climbing a Civ tech tree — you start with Pottery (anchor member), then Writing (recursive step using Pottery as a prerequisite), then Philosophy, each iteration building on the previous discovery until you reach the top.

## WITH RECURSIVE

A recursive CTE references itself. It has two parts: the **anchor member** (starting rows) and the **recursive member** (which builds on the previous iteration), joined by `UNION ALL`:

```sql
WITH RECURSIVE countdown AS (
    -- Anchor: start at 5
    SELECT 5 AS n

    UNION ALL

    -- Recursive: subtract 1 each iteration
    SELECT n - 1 FROM countdown WHERE n > 1
)
SELECT * FROM countdown;
```

> **🎮 Analogy:** The countdown recursive CTE is like a stack of nesting dolls — the anchor is the biggest doll (5), and each recursion opens one smaller until nothing's left inside. When `n > 1` stops being true, the loop ends.

**Output:**
```
5
4
3
2
1
```

> **🎮 Analogy:** The countdown works like a Mario lift that drops one floor at a time — it starts at 5, descends to 4, keeps going while `n > 1`, and stops at 1 because the track ends. Each step uses the previous floor's value.

## Tree Traversal (Org Chart)

Recursive queries excel at hierarchical data:

```sql
WITH RECURSIVE org_tree AS (
    -- Anchor: find the CEO (no manager)
    SELECT id, name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive: find direct reports of each node
    SELECT e.id, e.name, e.manager_id, ot.level + 1
    FROM employees e
    JOIN org_tree ot ON e.manager_id = ot.id
)
SELECT * FROM org_tree
ORDER BY level, name;
```

**Output:**
```
id | name        | manager_id | level
---|-------------|------------|------
1  | Alice CEO   | NULL       | 1
2  | Bob VP      | 1          | 2
3  | Carol VP    | 1          | 2
4  | Dave Dir    | 2          | 3
5  | Eve Dir     | 3          | 3
```

> **🎮 Analogy:** Recursive tree traversal of an org chart is like playing "six degrees of Kevin Bacon" — start with the CEO, find who reports to them, then who reports to THOSE people, expanding outward until you've mapped the whole company hierarchy.

## Category Tree

E-commerce category hierarchies are a perfect use case:

```sql
WITH RECURSIVE category_path AS (
    SELECT id, name, parent_id, name AS path
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    SELECT c.id, c.name, c.parent_id,
           cp.path || ' > ' || c.name
    FROM categories c
    JOIN category_path cp ON c.parent_id = cp.id
)
SELECT id, path
FROM category_path
ORDER BY path;
```

**Output:**
```
id | path
---|-------------------------------
1  | Electronics
3  | Electronics > Computers
4  | Electronics > Computers > Laptops
5  | Electronics > Computers > Desktops
2  | Home & Garden
6  | Home & Garden > Furniture
```

> **🎮 Analogy:** A category tree CTE is like the folder path on your PC — `Electronics > Computers > Laptops` is a series of parent-child relationships that the recursive query builds into a full breadcrumb trail without you typing ` > ` a hundred times.

## Limits and Safety

Recursive queries can be dangerous — a poorly written one runs forever. Databases enforce limits:

```sql
-- In PostgreSQL, set at session level:
SET max_recursive_iterations = 1000;

-- In SQL Server, use option hint:
WITH RECURSIVE cte AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM cte
)
SELECT * FROM cte
OPTION (MAXRECURSION 1000);
```

Without limits, a missing WHERE clause in the recursive member creates an infinite loop. Always ensure the recursive member has a condition that eventually excludes all rows.

> **🎮 Analogy:** A recursive query without a termination condition is a `while(true)` loop — the database equivalent of a button that dispenses infinite pizza. Fun for a second, then everything crashes and burns.

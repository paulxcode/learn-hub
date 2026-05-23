---
title: Common Table Expressions
skill: sql
order: 11
quiz:
  - type: mc
    question: "What does the WITH clause do in SQL?"
    options:
      - "It creates a temporary table in the database"
      - "It defines a named subquery that can be referenced within the main query"
      - "It locks a table for exclusive access"
      - "It creates a database index"
    answer: 1
  - type: mc
    question: "How do you define multiple CTEs in a single query?"
    options:
      - "WITH cte1 AS (...), cte2 AS (...)"
      - "WITH cte1 AS (...) WITH cte2 AS (...)"
      - "CTE1 (...) CTE2 (...)"
      - "WITH cte1 AS (...); WITH cte2 AS (...)"
    answer: 0
  - type: mc
    question: "Which scenario is best suited for a CTE?"
    options:
      - "A simple SELECT with no subqueries"
      - "Breaking down a complex query into logical steps for readability"
      - "Creating a permanent view in the database"
      - "Dropping a table"
    answer: 1
---

> **🎮 Analogy:** CTEs are like planning a GTA V heist with Lester — each step gets a name (scope the casino, get the uniforms, hack the vault), and you execute them in sequence rather than trying to read one giant, confusing blueprint all at once.

## The WITH Clause

CTEs let you define temporary result sets that exist only for the duration of a query. They make complex queries readable by breaking them into named steps:

```sql
WITH high_value_customers AS (
    SELECT customer_id, SUM(amount) AS total_spent
    FROM orders
    GROUP BY customer_id
    HAVING SUM(amount) > 1000
)
SELECT c.name, c.email, h.total_spent
FROM customers c
JOIN high_value_customers h ON c.id = h.customer_id
ORDER BY h.total_spent DESC;
```

> **🎮 Analogy:** A CTE is like naming a Minecraft build — instead of saying "that quartz, spruce, and glass thing behind the barn," you call it "The Nether Portal Hub" and everyone instantly knows what you mean.

## Named Subqueries for Readability

Compare the same query without CTEs:

```sql
SELECT c.name, c.email, t.total_spent
FROM customers c
JOIN (
    SELECT customer_id, SUM(amount) AS total_spent
    FROM orders
    GROUP BY customer_id
    HAVING SUM(amount) > 1000
) t ON c.id = t.customer_id
ORDER BY t.total_spent DESC;
```

The CTE version reads top-to-bottom like a script — each step builds on the previous one.

> **🎮 Analogy:** A CTE vs a nested subquery is like a Factorio blueprint vs hand-placing every belt — both build the same factory, but one is readable, reusable, and shows the whole design at a glance instead of squinting at nested spaghetti.

## Multiple CTEs

Chain CTEs by separating them with commas:

```sql
WITH
july_orders AS (
    SELECT * FROM orders
    WHERE order_date >= '2024-07-01'
      AND order_date < '2024-08-01'
),
product_totals AS (
    SELECT product_id, SUM(quantity) AS units_sold
    FROM order_items
    WHERE order_id IN (SELECT id FROM july_orders)
    GROUP BY product_id
),
ranked AS (
    SELECT p.name, pt.units_sold,
           ROW_NUMBER() OVER (ORDER BY pt.units_sold DESC) AS rnk
    FROM product_totals pt
    JOIN products p ON pt.product_id = p.id
)
SELECT name, units_sold
FROM ranked
WHERE rnk <= 5
ORDER BY rnk;
```

> **🎮 Analogy:** Multiple CTEs chained together is like assembling IKEA furniture — step A (attach legs) feeds into step B (mount the frame), which feeds into step C (add the shelf). Each step is simple, but together you get a bookshelf.

## Use Cases

**Multi-step aggregations:**

```sql
WITH
daily_revenue AS (
    SELECT DATE(created_at) AS day, SUM(amount) AS revenue
    FROM transactions
    GROUP BY DATE(created_at)
),
weekly_avg AS (
    SELECT day, revenue,
           AVG(revenue) OVER (ORDER BY day ROWS 6 PRECEDING) AS moving_avg
    FROM daily_revenue
)
SELECT * FROM weekly_avg
WHERE revenue < moving_avg * 0.8;
```

> **🎮 Analogy:** A moving average CTE is like watching your weight trend in a fitness app — daily numbers bounce up and down (water weight, big meals), but the 7-day rolling average tells the real story: are you actually getting fitter?

**Finding duplicates:**

```sql
WITH duplicates AS (
    SELECT email, COUNT(*) AS cnt
    FROM users
    GROUP BY email
    HAVING COUNT(*) > 1
)
SELECT u.*
FROM users u
JOIN duplicates d ON u.email = d.email
ORDER BY u.email;
```

> **🎮 Analogy:** Finding duplicates with a CTE is like using a sorting hat that groups identical items and flags any group with more than one — if two "Mythril Swords" appear, the hat raises an alarm.

CTEs are a readability tool, not a performance optimization — the database optimizer treats them similarly to subqueries. Use them to make your SQL self-documenting.

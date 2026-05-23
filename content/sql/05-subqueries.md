---
title: Subqueries
skill: sql
order: 5
quiz:
  - type: mc
    question: "What is a subquery?"
    options:
      - "A query that runs faster than a regular query"
      - "A query nested inside another query"
      - "A query that modifies the database schema"
      - "A query without a WHERE clause"
    answer: 1
  - type: mc
    question: "When would you use EXISTS instead of IN?"
    options:
      - "When you need to check if any rows exist that satisfy a condition, often more efficient with large datasets"
      - "EXISTS and IN are completely interchangeable"
      - "When you need to compare numeric values only"
      - "When you want to avoid using JOINs"
    answer: 0
  - type: mc
    question: "What makes a subquery correlated?"
    options:
      - "It can run independently of the outer query"
      - "It references columns from the outer query and runs once per outer row"
      - "It uses the HAVING clause"
      - "It is executed only once"
    answer: 1
---

> **🎮 Analogy:** A subquery is a quest within a quest — like Skyrim's "A Night to Remember" where you must find out what happened (inner query) to complete your main objective (outer query). Results from the inner adventure feed into the bigger picture.

## Nested Queries

A subquery is a query inside another query:

```sql
SELECT name, salary
FROM employees
WHERE salary > (
    SELECT AVG(salary) FROM employees
);
```

> **🎮 Analogy:** A subquery in WHERE is like checking the average height before deciding who gets on the roller coaster — first you calculate the average (inner query), then you compare each person against it (outer query).

## Subquery in SELECT

```sql
SELECT
    name,
    salary,
    (SELECT AVG(salary) FROM employees) AS company_avg,
    salary - (SELECT AVG(salary) FROM employees) AS difference
FROM employees;
```

> **🎮 Analogy:** A subquery in SELECT is like a sports broadcast showing a player's stat alongside the league average — "LeBron scores 27 (your value), league average is 12 (subquery result)" — both numbers on the same screen.

## Subquery in WHERE

```sql
-- Find products priced above average
SELECT product_name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Find customers who have placed orders
SELECT name, email
FROM customers
WHERE id IN (SELECT DISTINCT customer_id FROM orders);

-- Find departments with above-average salaries
SELECT department
FROM employees
WHERE salary > ALL (
    SELECT AVG(salary) FROM employees GROUP BY department
);
```

> **🎮 Analogy:** `> ALL` is the "gold medal or bust" filter — your salary must beat EVERY single departmental average to pass, not just some. One loss and you're out.

## Correlated Subqueries

Each row evaluated against the outer query:

```sql
SELECT e1.name, e1.salary, e1.department
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department = e1.department
);

SELECT
    p1.product_name,
    p1.price,
    p1.category
FROM products p1
WHERE p1.price = (
    SELECT MAX(p2.price)
    FROM products p2
    WHERE p2.category = p1.category
);
```

> **🎮 Analogy:** A correlated subquery is like being at a buffet and comparing each dish to the best version of itself — "Is THIS lasagna the best lasagna in THIS restaurant?" Each row gets its own personal comparison.

## EXISTS

Check if a subquery returns any rows:

```sql
SELECT name FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.id AND o.amount > 500
);

SELECT product_name FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM order_items oi
    WHERE oi.product_id = p.id
);
```

> **🎮 Analogy:** `EXISTS` is the "cool kids club" check — you don't care how many cool kids are in the club, you just need to know if at least one is there. `IN` brings a list; `EXISTS` just gives a thumbs up or down.

---
title: Aggregation & Grouping
skill: sql
order: 4
quiz:
  - type: mc
    question: "Which clause filters groups after a GROUP BY aggregation?"
    options:
      - "WHERE"
      - "HAVING"
      - "FILTER"
      - "ORDER BY"
    answer: 1
  - type: mc
    question: "What does AVG(price) do?"
    options:
      - "Counts rows where price is not null"
      - "Returns the most common price value"
      - "Returns the average of all price values"
      - "Adds all price values together"
    answer: 2
  - type: mc
    question: "What is the key difference between WHERE and HAVING?"
    options:
      - "WHERE filters rows before grouping; HAVING filters after grouping"
      - "WHERE is faster than HAVING"
      - "HAVING works on SELECT; WHERE works on INSERT"
      - "There is no difference"
    answer: 0
---

> **🎮 Analogy:** GROUP BY is like tallying your loot after a Diablo boss kill — COUNT the swords, SUM the gold, AVG the item level of your drops, grouped by "who dropped what" so you know which boss is stingiest.

## Aggregate Functions

Summarize data across rows:

```sql
SELECT COUNT(*) FROM users;
SELECT AVG(price) FROM products;
SELECT SUM(quantity) FROM order_items;
SELECT MIN(age), MAX(age) FROM employees;
SELECT ROUND(AVG(rating), 2) FROM reviews;
```

> **🎮 Analogy:** Aggregate functions are like the summary screen after a Diablo boss kill — COUNT tells you how many items dropped, SUM adds up your gold, AVG shows the average item level, and MIN/MAX highlight your worst and best drops.

## GROUP BY

Group rows and aggregate within groups:

```sql
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;

SELECT status, SUM(amount) AS total
FROM orders
GROUP BY status;

SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
FROM reviews
GROUP BY product_id
ORDER BY avg_rating DESC;
```

> **🎮 Analogy:** GROUP BY is like sorting your Pokémon by type — you dump all 151 on the table, sort them into Fire, Water, Grass piles, then COUNT each pile to see which type you have most of.

## HAVING

Filter groups after aggregation:

```sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000;

SELECT customer_id, COUNT(*) AS order_count, SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id
HAVING order_count >= 5 AND total_spent > 1000
ORDER BY total_spent DESC;
```

> **🎮 Analogy:** HAVING is the post-grouping filter, like looking at your sorted Pokémon type piles and saying "only show me types where I have at least 10 Pokémon" — WHERE can't do that because it runs before piles exist.

## Advanced Aggregation

```sql
-- Multiple aggregations
SELECT
    category,
    COUNT(*) AS products,
    AVG(price) AS avg_price,
    MAX(price) AS highest,
    MIN(price) AS lowest
FROM products
GROUP BY category;

-- Filter before grouping
SELECT category, AVG(price) AS avg_price
FROM products
WHERE price > 10
GROUP BY category
HAVING AVG(price) < 100;
```

> **🎮 Analogy:** Filtering with WHERE before GROUP BY is like removing spoiled fruit from your basket before sorting by type — you discard the junk first, then group what's left. Much cleaner than sorting rotten apples with good ones.

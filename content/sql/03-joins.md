---
title: JOINs
skill: sql
order: 3
quiz:
  - type: mc
    question: "Which JOIN returns only rows that have matching values in both tables?"
    options:
      - "LEFT JOIN"
      - "RIGHT JOIN"
      - "INNER JOIN"
      - "FULL JOIN"
    answer: 2
  - type: mc
    question: "What does a LEFT JOIN return?"
    options:
      - "Only rows that match in both tables"
      - "All rows from the left table and matching rows from the right table"
      - "All rows from both tables"
      - "Only rows from the left table that have no match"
    answer: 1
  - type: mc
    question: "What is a self JOIN used for?"
    options:
      - "Joining two unrelated tables"
      - "Joining a table with itself to compare rows within it"
      - "Joining three tables at once"
      - "Creating a copy of a table"
    answer: 1
---

> **🎮 Analogy:** JOINs are like assembling a WoW raid party — your `characters` table has the players, your `classes` table has their roles, and INNER JOIN matches each player to their class so you know who's tanking, healing, and DPSing.

## Combining Tables

JOINs combine rows from multiple tables based on a related column.

```sql
-- Tables:
-- orders: id | customer_id | product | amount
-- customers: id | name | email

SELECT orders.product, customers.name
FROM orders
JOIN customers ON orders.customer_id = customers.id;
```

> **🎮 Analogy:** A basic JOIN is like asking the Skyrim courier to deliver a letter — you hand him the recipient's name (matching column), and he finds the right person from his list to complete the delivery.

## Types of JOINs

```sql
-- INNER JOIN: only matching rows
SELECT * FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;

> **🎮 Analogy:** INNER JOIN is like inviting people to a party where only mutual friends get in — if you didn't both RSVP, you're not on the list.

-- LEFT JOIN: all orders, even without customer
SELECT * FROM orders
LEFT JOIN customers ON orders.customer_id = customers.id;

-- RIGHT JOIN: all customers, even without orders
SELECT * FROM orders
RIGHT JOIN customers ON orders.customer_id = customers.id;

-- FULL JOIN: all rows from both tables
SELECT * FROM orders
FULL JOIN customers ON orders.customer_id = customers.id;
```

> **🎮 Analogy:** FULL JOIN is the family reunion guest list — even Great Aunt Karen who nobody invited (no match) and the plus-one nobody knows both get listed, because completeness matters more than awkwardness.

## Self JOIN

Join a table with itself:

```sql
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
```

> **🎮 Analogy:** A self JOIN is like looking at a tech tree in Civilization to figure out prerequisites — you keep comparing the same table of technologies against itself to see "what unlocks what."

## Multiple JOINs

```sql
SELECT
    customers.name,
    orders.product,
    payments.amount
FROM customers
JOIN orders ON customers.id = orders.customer_id
JOIN payments ON orders.id = payments.order_id;
```

> **🎮 Analogy:** Multiple JOINs are like a relay race — the customer passes the baton to the order, which passes it to the payment, and you follow the chain through three tables to see the full story.

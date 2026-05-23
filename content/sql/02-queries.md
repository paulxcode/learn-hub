---
title: Querying Data
skill: sql
order: 2
quiz:
  - type: mc
    question: "Which clause filters rows in a SELECT query based on a condition?"
    options:
      - "ORDER BY"
      - "WHERE"
      - "HAVING"
      - "GROUP BY"
    answer: 1
  - type: mc
    question: "What does SELECT COUNT(*) FROM users return?"
    options:
      - "The sum of all user IDs"
      - "The number of columns in the users table"
      - "The number of rows in the users table"
      - "The average user age"
    answer: 2
  - type: mc
    question: "Which keyword sorts query results in descending order?"
    options:
      - "SORT BY"
      - "ORDER BY ... DOWN"
      - "ORDER BY ... DESC"
      - "SORT ... DESC"
    answer: 2
---

> **🎮 Analogy:** Writing a SQL query is like asking a Skyrim librarian for a specific book — "Give me all books written by the Bard's College" (SELECT) "that are about fishing" (WHERE), and they'll hand you exactly those.

## SELECT

Retrieve data from a table:

```sql
SELECT * FROM users;

SELECT name, email FROM users;

SELECT * FROM users WHERE age > 25;

SELECT * FROM users ORDER BY age DESC;

SELECT COUNT(*) FROM users;
```

> **🎮 Analogy:** `SELECT *` is the "everything bagel" of SQL — convenient when you want it all, but most of the time you really just wanted cream cheese, not poppy seeds, sesame, garlic, AND onion.

> **🎮 Analogy:** `WHERE age > 25` is the club bouncer checking IDs — each row tries to walk in, and only the ones that pass the condition get past the velvet rope.

> **🎮 Analogy:** `ORDER BY age DESC` is like sorting your Pokémon by CP descending — the strongest are at the top, the Magikarps sink to the bottom, and you can actually find your best team.

> **🎮 Analogy:** `COUNT(*)` is the achievement progress popup in Dark Souls — it doesn't tell you which bosses you killed, just "7 / 12 bosses defeated." Numbers without details.

## Filtering with WHERE

```sql
SELECT * FROM users
WHERE age >= 18 AND name LIKE 'A%';
```

> **🎮 Analogy:** `LIKE 'A%'` is the search bar in your phone contacts when you type "A" — everyone named Alice, Alex, and Alejandro shows up, while Bob and Charlie don't even get considered.

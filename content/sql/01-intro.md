---
title: SQL Introduction
skill: sql
order: 1
quiz:
  - type: mc
    question: "Which SQL statement creates a new table?"
    options:
      - "CREATE TABLE"
      - "NEW TABLE"
      - "ADD TABLE"
      - "MAKE TABLE"
    answer: 0
  - type: mc
    question: "What does TEXT NOT NULL mean in a column definition?"
    options:
      - "The column can store text and might be empty"
      - "The column stores numbers and cannot be empty"
      - "The column can store text and must have a value"
      - "The column stores only unique text values"
    answer: 2
  - type: mc
    question: "Which keyword ensures all values in a column are different?"
    options:
      - "PRIMARY KEY"
      - "UNIQUE"
      - "DISTINCT"
      - "NOT NULL"
    answer: 1
---

> **🎮 Analogy:** Think of a database like your Minecraft inventory chest — tables are different chests (one for weapons, one for armor, one for blocks), and SQL is your way of organizing, searching, and finding exactly what you need without dumping everything on the floor.

## What is SQL?

SQL (Structured Query Language) is used to manage relational databases.

> **🎮 Analogy:** Learning SQL is like getting admin commands in Minecraft — instead of mining every block manually, you can just `/give @p diamond 64` and instantly get exactly what you asked for.

## Creating a Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  age INTEGER
);
```

SQL blocks are shown for reference. Interactive SQL execution is coming soon.

> **🎮 Analogy:** `CREATE TABLE` is like placing a new chest in Minecraft and labeling it — you decide how many compartments (columns), what each holds (datatype), and rules like "no empty slots" (`NOT NULL`), so your base stays organized.

## Inserting Data

```sql
INSERT INTO users (name, email, age)
VALUES ('Alice', 'alice@example.com', 30);

INSERT INTO users (name, email, age)
VALUES ('Bob', 'bob@example.com', 25);
```

> **🎮 Analogy:** `INSERT INTO` is like adding a new item to your Factorio logistics network — you specify the chest, the slot values, and if everything matches the recipe, it slides right in without breaking anything.

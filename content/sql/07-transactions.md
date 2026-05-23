---
title: Transactions
skill: sql
order: 7
quiz:
  - type: mc
    question: "What does COMMIT do in a transaction?"
    options:
      - "Undoes all changes made in the current transaction"
      - "Saves all changes made since the transaction began"
      - "Pauses the transaction temporarily"
      - "Creates a savepoint"
    answer: 1
  - type: mc
    question: "What does the acronym ACID stand for in databases?"
    options:
      - "Atomicity, Consistency, Isolation, Durability"
      - "Automated, Consistent, Integrated, Durable"
      - "Atomic, Concurrent, Isolated, Distributed"
      - "Accuracy, Completeness, Integrity, Dependability"
    answer: 0
  - type: mc
    question: "What is a SAVEPOINT used for?"
    options:
      - "To permanently save all changes"
      - "To mark a point within a transaction that you can roll back to without affecting the entire transaction"
      - "To end the current transaction"
      - "To lock a table from modifications"
    answer: 1
---

> **🎮 Analogy:** A transaction is like saving before a Dark Souls boss fight — you BEGIN your attempt, make some moves (updates), and if you die (error), you ROLLBACK and try again. Only when you beat the boss do you COMMIT and rest at the bonfire.

## Atomic Operations

Transactions group operations that must all succeed or all fail:

```sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
-- If anything fails before COMMIT, use ROLLBACK
```

> **🎮 Analogy:** `BEGIN`/`COMMIT`/`ROLLBACK` are like quick-saving in a roguelike — you save before opening a cursed chest (BEGIN), and if it explodes in your face, you reload (ROLLBACK). Legendary sword? You keep playing (COMMIT).

## ACID Properties

- **Atomicity**: All or nothing
- **Consistency**: Data stays valid
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed changes persist

> **🎮 Analogy:** ACID is like a Dark Souls bonfire — Atomicity (all flasks refill or none do), Consistency (your stats stay valid), Isolation (other players' worlds don't touch yours), Durability (that level-up is saved permanently).

## Rollback on Error

```sql
BEGIN TRANSACTION;

INSERT INTO orders (customer_id, product, amount)
VALUES (1, 'Widget', 50);

UPDATE inventory SET quantity = quantity - 1
WHERE product = 'Widget' AND quantity > 0;

-- Check if inventory was sufficient
-- If quantity was 0, the UPDATE affected 0 rows
-- We should rollback

ROLLBACK;
```

> **🎮 Analogy:** ROLLBACK is the "Undo" button for your entire transaction — it's like Ctrl+Z for your database, except it undoes everything since BEGIN, not just the last action.

## Savepoints

Partial rollbacks within a transaction:

```sql
BEGIN TRANSACTION;

INSERT INTO log VALUES ('Starting batch process');

SAVEPOINT after_step1;
INSERT INTO step1_results VALUES (...);

-- If step 2 fails, rollback to after_step1
SAVEPOINT after_step2;
INSERT INTO step2_results VALUES (...);

-- Everything succeeded
RELEASE SAVEPOINT after_step2;
RELEASE SAVEPOINT after_step1;
COMMIT;
```

> **🎮 Analogy:** Savepoints are checkpoints in a long Minecraft building session — you mark a spot before adding the roof, and if the roof collapses, you roll back to that savepoint instead of losing the walls and floor too.

## Transaction Isolation

```sql
-- Read Uncommitted (dirty reads possible)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Read Committed (default in many databases)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Repeatable Read
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Serializable (highest isolation)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

> **🎮 Analogy:** Isolation levels are like Minecraft server render distance — READ UNCOMMITTED is "see chunks loading" (chaotic), READ COMMITTED is "only loaded chunks" (stable), SERIALIZABLE is "wait for all chunks to load before moving" (safe but slow).

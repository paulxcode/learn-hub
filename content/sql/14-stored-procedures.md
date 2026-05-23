---
title: Stored Procedures
skill: sql
order: 14
quiz:
  - type: mc
    question: "What is a stored procedure?"
    options:
      - "A saved SQL query that cannot accept parameters"
      - "A set of SQL statements stored on the database server that can accept parameters and contain control flow logic"
      - "A database index used to speed up queries"
      - "A backup of the database schema"
    answer: 1
  - type: mc
    question: "When is a stored procedure preferable over application code?"
    options:
      - "For complex business logic that needs to be shared across multiple applications"
      - "For logic that requires tight coupling with database constraints inside transactions"
      - "For simple CRUD operations with no performance requirements"
      - "Always — stored procedures should replace all application SQL"
    answer: 1
  - type: mc
    question: "What is a key security benefit of stored procedures?"
    options:
      - "They automatically encrypt all data"
      - "Users can execute the procedure without having direct table access, reducing the attack surface"
      - "They prevent all SQL injection"
      - "They log all queries to a file"
    answer: 1
---

> **🎮 Analogy:** Stored procedures are like setting up WoW macros — instead of manually casting Frostbolt, then Ice Lance, then Frozen Orb every fight, you write a `/castsequence` macro (stored procedure) that executes the whole rotation on one button press, complete with error handling if you're out of mana.

## CREATE PROCEDURE

Stored procedures encapsulate SQL logic on the database server. Syntax varies by database, but the concepts are consistent:

```sql
-- PostgreSQL (function-based)
CREATE OR REPLACE FUNCTION get_customer_orders(cust_id INTEGER)
RETURNS TABLE(order_id INTEGER, total REAL, status TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT id, total, status
    FROM orders
    WHERE customer_id = cust_id
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Call it
SELECT * FROM get_customer_orders(42);
```

```sql
-- SQL Server / T-SQL
CREATE PROCEDURE usp_GetCustomerOrders
    @CustomerId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, total, status
    FROM orders
    WHERE customer_id = @CustomerId
    ORDER BY created_at DESC;
END;

-- Execute
EXEC usp_GetCustomerOrders @CustomerId = 42;
```

> **🎮 Analogy:** A stored procedure is like creating a custom emote macro in an MMO — instead of typing `/dance`, `/wave`, `/cheer` separately, you define `/party-time` that does all three in sequence. One call, multiple actions.

## Variables and Control Flow

```sql
-- PostgreSQL
CREATE OR REPLACE FUNCTION process_monthly_orders(target_month DATE)
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER;
BEGIN
    INSERT INTO order_summary (month, total_revenue, order_count)
    SELECT
        DATE_TRUNC('month', created_at),
        SUM(total),
        COUNT(*)
    FROM orders
    WHERE DATE_TRUNC('month', created_at) = target_month
      AND status = 'completed';

    GET DIAGNOSTICS processed_count = ROW_COUNT;

    IF processed_count = 0 THEN
        RAISE NOTICE 'No completed orders found for month %', target_month;
    END IF;

    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- T-SQL with variables and error handling
CREATE PROCEDURE usp_TransferFunds
    @FromAccount INT,
    @ToAccount INT,
    @Amount DECIMAL(18,2)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        IF @Amount <= 0
            THROW 50000, 'Amount must be positive', 1;

        UPDATE accounts SET balance = balance - @Amount WHERE id = @FromAccount;
        IF @@ROWCOUNT = 0
            THROW 50001, 'Source account not found', 1;

        UPDATE accounts SET balance = balance + @Amount WHERE id = @ToAccount;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
```

> **🎮 Analogy:** Variables and IF/THEN in stored procedures are like a Dark Souls boss AI — "IF player is behind me, THEN spin attack; IF health < 20%, THEN enrage." The database follows the same decision tree as it processes data.

## When to Use (and When Not To)

**Use stored procedures for:**
- Data validation rules shared across applications
- Complex multi-step operations that must be atomic
- Row-level security enforcement
- Audit logging triggered by data changes

**Avoid stored procedures for:**
- Simple CRUD (application ORMs handle this better)
- Business logic that changes frequently (version control is harder in SQL)
- Logic that needs to be unit-tested alongside application code
- Complex reporting that benefits from query builder flexibility

> **🎮 Analogy:** Stored procedures are like a fast-food drive-thru menu — you get a curated set of options (call this procedure with these params), and nobody walks into the kitchen (raw table access). Less mess, fewer accidents.

## Security and Performance

Stored procedures provide a security boundary: grant `EXECUTE` without granting direct table access:

```sql
REVOKE ALL ON orders FROM analytics_app;
GRANT EXECUTE ON FUNCTION get_customer_orders TO analytics_app;
```

Performance-wise, procedures benefit from cached execution plans. However, they can hide performance problems — an inefficient procedure is harder to profile than application-level queries. Always benchmark.

> **🎮 Analogy:** Cached execution plans are like muscle memory in fighting games — the first time you execute Ryu's Hadouken motion, it's slow and awkward. The 100th time? The database (like your fingers) remembers exactly what to do and fires instantly.

---
title: Window Functions
skill: sql
order: 9
quiz:
  - type: mc
    question: "What does ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) assign?"
    options:
      - "A global rank across all rows"
      - "A sequential number per department, ordered by salary descending"
      - "The total salary sum per department"
      - "The average salary for the entire table"
    answer: 1
  - type: mc
    question: "How does RANK() differ from DENSE_RANK() when there are ties?"
    options:
      - "RANK() skips numbers after ties, DENSE_RANK() does not"
      - "DENSE_RANK() skips numbers after ties, RANK() does not"
      - "They behave identically in all cases"
      - "DENSE_RANK() only works with PARTITION BY"
    answer: 0
  - type: mc
    question: "What does LAG(salary, 1) OVER (ORDER BY hire_date) return?"
    options:
      - "The next employee's salary"
      - "The previous employee's salary based on hire date order"
      - "The highest salary before the current row"
      - "The total salary lagging behind the average"
    answer: 1
---

> **🎮 Analogy:** Window functions are the leaderboard at the end of a Mario Kart race — ROW_NUMBER() assigns final positions, RANK() gives ties (two players at 2nd, next is 4th), DENSE_RANK() doesn't skip (2nd, 2nd, 3rd), and LAG() shows how far behind the guy ahead of you is.

## ROW_NUMBER()

Assigns a unique sequential number to each row within a partition:

```sql
SELECT
    name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
FROM employees;
```

This assigns `1` to the highest-paid employee in each department, `2` to the second-highest, and so on. No ties — each row gets a unique number even if salaries are equal.

> **🎮 Analogy:** `ROW_NUMBER()` is the "take a number" dispenser at the DMV — even if you and your friend walk in together, one gets 47 and the other gets 48. No arguments, no ties.

## RANK() and DENSE_RANK()

Both handle ties differently:

```sql
SELECT
    name,
    department,
    salary,
    RANK()       OVER (ORDER BY salary DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;
```

**Output:**
```
name   department  salary  rank  dense_rank
Alice  Engineering 120000   1      1
Bob    Engineering 110000   2      2
Carol  Marketing   110000   2      2
Dave   Engineering  95000   4      3
Eve    Marketing    95000   4      3
```

`RANK()` skips to 4 after the tie at 2. `DENSE_RANK()` continues at 3.

> **🎮 Analogy:** `RANK()` vs `DENSE_RANK()` is the difference between "1st, 2nd, 2nd, 4th" at the Olympics (gap counted) and "Gold, Silver, Silver, Bronze" (gap ignored) — both recognize ties, but one counts the empty space and one doesn't.

## SUM() OVER(PARTITION BY)

Running totals within groups:

```sql
SELECT
    department,
    name,
    salary,
    SUM(salary) OVER (PARTITION BY department) AS dept_total,
    SUM(salary) OVER (PARTITION BY department ORDER BY salary DESC) AS running_total
FROM employees;
```

**Output:**
```
department  name   salary  dept_total  running_total
Engineering Alice  120000    325000       120000
Engineering Bob    110000    325000       230000
Engineering Dave    95000    325000       325000
```

> **🎮 Analogy:** `SUM() OVER(PARTITION BY department ORDER BY salary DESC)` is like watching a Twitch streamer's donation total grow in real-time — you see every new donation add to the running counter, grouped by stream (department).

## LAG() and LEAD()

Access values from previous or next rows:

```sql
SELECT
    name,
    salary,
    LAG(salary, 1) OVER (ORDER BY salary DESC) AS prev_salary,
    salary - LAG(salary, 1) OVER (ORDER BY salary DESC) AS diff_from_prev,
    LEAD(salary, 1) OVER (ORDER BY salary DESC) AS next_salary
FROM employees;
```

Useful for calculating period-over-period changes, finding gaps, or comparing adjacent rows.
```

> **🎮 Analogy:** `LAG()` and `LEAD()` are like looking at the car ahead and behind you in traffic — LAG shows the bumper in front (previous row), LEAD shows the tail lights behind (next row), letting you check if traffic is speeding up or slowing down.

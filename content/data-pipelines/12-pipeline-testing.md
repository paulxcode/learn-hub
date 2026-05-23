---
title: Pipeline Testing
skill: data-pipelines
order: 12
quiz:
  - type: mc
    question: "What is the primary goal of integration testing in data pipelines?"
    options:
      - "To verify code style and formatting"
      - "To test that pipeline components work correctly together, including database reads/writes"
      - "To measure query execution times"
      - "To replace unit tests"
    answer: 1
  - type: mc
    question: "Why should test data be representative of production data?"
    options:
      - "To make tests run faster"
      - "To catch edge cases that exist in real-world data, like nulls and outliers"
      - "To reduce storage costs"
      - "To simplify assertion logic"
    answer: 1
  - type: mc
    question: "What is a data quality assertion in a pipeline test?"
    options:
      - "A check that validates the test environment configuration"
      - "A check that validates output data meets defined constraints (non-null, unique, within range)"
      - "A check that measures pipeline runtime"
      - "A check that verifies the CI/CD pipeline"
    answer: 1
---

> **🎮 Analogy:** Testing pipelines without representative data is like launching a rocket in Kerbal Space Program without checking the staging sequence — sure, the sunrise is beautiful through the cockpit window on the way to the surface.

## Unit Testing Transformations

Test each transformation function in isolation with controlled inputs:

> **🎮 Analogy:** Unit testing transformations is testing a single machine in Factorio — you feed it exactly 5 iron plates (input), check that exactly 10 copper wire comes out (output), and don't care about the rest of the factory. If this one machine is wrong, everything downstream will be wrong.

```python
import pytest


def clean_name(raw: str) -> str:
    if not raw:
        return ""
    return raw.strip().title()


def parse_amount(raw: str) -> float:
    if not raw:
        return 0.0
    return float(raw.replace("$", "").replace(",", ""))


def classify_transaction(amount: float) -> str:
    if amount < 0:
        return "refund"
    elif amount < 50:
        return "small"
    elif amount < 500:
        return "medium"
    else:
        return "large"


class TestCleanName:
    def test_clean_name_strips_whitespace(self):
        assert clean_name("  alice  ") == "Alice"

    def test_clean_name_title_cases(self):
        assert clean_name("john doe") == "John Doe"

    def test_clean_name_empty(self):
        assert clean_name("") == ""

    def test_clean_name_none(self):
        assert clean_name(None) == ""


class TestParseAmount:
    def test_parse_amount_dollars(self):
        assert parse_amount("$1,234.56") == 1234.56

    def test_parse_amount_integer(self):
        assert parse_amount("100") == 100.0

    def test_parse_amount_empty(self):
        assert parse_amount("") == 0.0


class TestClassifyTransaction:
    @pytest.mark.parametrize("amount,expected", [
        (-10.0, "refund"),
        (25.0, "small"),
        (100.0, "medium"),
        (1000.0, "large"),
    ])
    def test_classification(self, amount, expected):
        assert classify_transaction(amount) == expected
```

## Integration Tests for Pipelines

Integration tests verify that components work together:

> **🎮 Analogy:** Integration tests are the assembly test in Kerbal Space Program — you don't just test the engine (unit test), you strap it to a fuel tank, add struts, attach a command pod, and see if the whole rocket reaches orbit without exploding. Separation events included.

```python
import pytest
import sqlite3


@pytest.fixture
def db_connection():
    conn = sqlite3.connect(":memory:")
    conn.execute("""
        CREATE TABLE transactions (
            id INTEGER PRIMARY KEY,
            amount REAL,
            category TEXT
        )
    """)
    yield conn
    conn.close()


def test_pipeline_end_to_end(db_connection):
    raw_data = [
        {"id": 1, "amount": "100.50", "category": "food"},
        {"id": 2, "amount": "250.00", "category": "transport"},
    ]

    transformed = []
    for row in raw_data:
        transformed.append((
            row["id"],
            float(row["amount"]),
            row["category"],
        ))

    db_connection.executemany(
        "INSERT INTO transactions (id, amount, category) VALUES (?, ?, ?)",
        transformed,
    )
    db_connection.commit()

    result = db_connection.execute(
        "SELECT category, SUM(amount) FROM transactions GROUP BY category"
    ).fetchall()

    assert dict(result) == {"food": 100.50, "transport": 250.00}
```

## Data Quality Assertions

Assertions that validate output data against business rules:

> **🎮 Analogy:** Data quality assertions are the post-game stat screen in a MOBA — "no nulls" is your K/D/A, "unique user_id" checks nobody duplicated a champion pick, and "age between 18-120" is like verifying no player has more than 9999 gold per minute.

```python
def assert_no_nulls(df, columns):
    for col in columns:
        assert df[col].isnull().sum() == 0, f"Nulls found in {col}"


def assert_unique(series):
    assert series.is_unique, f"Duplicates found in {series.name}"


def assert_range(series, lo, hi):
    assert series.between(lo, hi).all(), (
        f"Values outside [{lo}, {hi}] in {series.name}"
    )


def test_output_quality():
    import pandas as pd

    output = pd.DataFrame({
        "user_id": [1, 2, 3],
        "email": ["a@x.com", "b@x.com", "c@x.com"],
        "age": [25, 30, 35],
        "score": [85.0, 92.5, 78.0],
    })

    assert_no_nulls(output, ["user_id", "email", "age", "score"])
    assert_unique(output["user_id"])
    assert_range(output["age"], 18, 120)
    assert_range(output["score"], 0, 100)
```

## Test Data Management

Production data contains edge cases. Your test data should too:

> **🎮 Analogy:** Test data without edge cases is a training dummy in an MMO — it stands still, never fights back, and gives you perfect parry practice. Real production data is the Mythic+ dungeon boss that spams AoE, spawns adds (duplicates), and has a one-shot mechanic (null pointer) at 30% HP.

```python
import pytest


@pytest.fixture
def edge_case_data():
    return [
        {"name": "Alice", "age": 30, "salary": 50000.0},
        {"name": "", "age": None, "salary": 0.0},
        {"name": "Bob", "age": 200, "salary": -100.0},
        {"name": "Charlie", "age": 25, "salary": 75000.0},
        {"name": None, "age": 30, "salary": 60000.0},
    ]


def test_pipeline_handles_edge_cases(edge_case_data):
    results = []
    for record in edge_case_data:
        result = process_record(record)
        results.append(result)

    null_names = sum(1 for r in results if r.get("clean_name") is None)
    assert null_names == 1
    assert all(r.get("age_group") for r in results if r.get("age") is not None)
```

> **🎮 Analogy:** Testing with only clean data is practicing your portal fling in the relaxation vault — no turrets, no cubes, no acid. The real test chamber (production) has all three, and your muscle memory means nothing if you've never seen a turret before.

Always validate with realistic, messy data — clean test data hides bugs.

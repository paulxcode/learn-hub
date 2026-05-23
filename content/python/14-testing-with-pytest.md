---
title: Testing with pytest
skill: python
order: 14
quiz:
  - type: mc
    question: "What is a pytest fixture?"
    options:
      - "A function that provides a fixed baseline for tests, like a database connection or dataset"
      - "A special test that runs before all other tests"
      - "A way to skip failing tests automatically"
      - "A configuration file for pytest"
    answer: 0
  - type: mc
    question: "Why use parametrized tests in pytest?"
    options:
      - "They allow running the same test logic with multiple input-output combinations"
      - "They make tests run faster"
      - "They automatically generate test documentation"
      - "They replace the need for assertions"
    answer: 0
  - type: mc
    question: "In data/ML pipelines, what is the most important reason to test data transformations?"
    options:
      - "To make the code run faster in production"
      - "To catch regressions when business rules change and ensure downstream consumers receive correct data"
      - "To reduce the number of dependencies"
      - "To automatically deploy to production"
    answer: 1
---

> **🎮 Analogy:** Writing tests is like setting up training dummies in your base camp — you wail on them with every attack pattern to make sure your code can take a hit before you send it into the real dungeon (or production).

## Why Testing Matters for Data

Data pipelines fail silently. A null creeps in, a column is renamed, a business rule changes — and suddenly dashboards show wrong numbers. Without tests, you only find out when a stakeholder asks why revenue dropped.

Testing data transformations is not optional for a data practitioner. It catches regressions, documents assumptions, and gives you confidence to refactor.

> **🎮 Analogy:** Untested data pipelines are the dark fog of war on a strategy map — you don't know which column got mangled until an executive asks why Q4 revenue dropped to zero. Tests are your scout units revealing the truth.

## pytest Basics

pytest discovers files named `test_*.py` or `*_test.py` and runs functions prefixed with `test_`:

```python
# test_transforms.py
def test_clean_price():
    assert clean_price("$1,234.56") == 1234.56
    assert clean_price("0") == 0.0
    assert clean_price("") is None


def test_filter_outliers():
    data = [1, 2, 3, 100, 4, 5]
    result = filter_outliers(data, threshold=3.0)
    assert result == [1, 2, 3, 4, 5]
```

Run with `python -m pytest` or `pytest` in the terminal.

> **🎮 Analogy:** `assert` is your QA department's checklist — `assert clean_price("$1,234.56") == 1234.56` is like verifying the health potion actually restores 50 HP before shipping it to players.

## Fixtures

Fixtures provide reusable test dependencies like datasets or database connections:

```python
import pytest


@pytest.fixture
def sample_transactions():
    return [
        {"id": 1, "amount": 100.0, "currency": "USD"},
        {"id": 2, "amount": 250.0, "currency": "EUR"},
        {"id": 3, "amount": 0.0, "currency": "USD"},
    ]


def test_total_by_currency(sample_transactions):
    totals = total_by_currency(sample_transactions)
    assert totals["USD"] == 100.0
    assert totals["EUR"] == 250.0


def test_average_transaction(sample_transactions):
    avg = average_amount(sample_transactions)
    assert avg == pytest.approx(116.67, rel=0.01)
```

`pytest.approx()` handles floating-point comparisons — essential for data work.

> **🎮 Analogy:** A pytest fixture is your "New Game+" carry-over — define `sample_transactions` once and every test gets the same starting inventory without re-grinding the same setup quest.

## Testing Data Transformations

Real pipelines chain multiple transforms. Test each transform in isolation:

```python
def test_normalize_text():
    assert normalize_text("  Hello WORLD!  ") == "hello world"
    assert normalize_text(None) is None
    assert normalize_text("") == ""


def test_parse_date():
    assert parse_date("2024-01-15") == date(2024, 1, 15)
    assert parse_date("invalid") is None


def test_validate_schema():
    record = {"name": "Alice", "age": 30}
    schema = {"name": str, "age": int}
    assert validate_schema(record, schema) == True


def test_validate_schema_missing_field():
    record = {"name": "Alice"}
    schema = {"name": str, "age": int}
    assert validate_schema(record, schema) == False
```

> **🎮 Analogy:** Testing each transform in isolation is like checking the oven, the mixer, and the fridge separately — if the cake is terrible, you know it's the recipe (pipeline logic), not a broken appliance (individual function).

## Parametrized Tests

Parametrized tests exercise multiple inputs without duplicating code:

```python
import pytest


@pytest.mark.parametrize("input_val,expected", [
    ("$100.00", 100.00),
    ("$1,000.50", 1000.50),
    ("$0.99", 0.99),
    ("-$50.00", -50.00),
    (None, None),
])
def test_parse_currency(input_val, expected):
    assert parse_currency(input_val) == expected


@pytest.mark.parametrize("age,expected", [
    (25, "adult"),
    (17, "minor"),
    (65, "senior"),
    (-1, "invalid"),
])
def test_age_group(age, expected):
    assert classify_age_group(age) == expected
```

Each parametrized case becomes its own test. pytest reports failures per-case, so you know exactly which input broke.

> **🎮 Analogy:** Parametrized tests are the "New Game+" speedrun — one test function runs the same gauntlet with 12 different loadouts, and pytest tells you which weapon loadout failed instead of just saying "you died somewhere."

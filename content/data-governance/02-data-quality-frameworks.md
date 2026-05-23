---
title: Data Quality Frameworks
skill: data-governance
order: 2
quiz:
  - type: mc
    question: "Which data quality dimension measures whether data represents the real-world entity correctly?"
    options:
      - "Completeness"
      - "Accuracy"
      - "Consistency"
      - "Validity"
    answer: 1
  - type: mc
    question: "A column contains zip codes formatted as strings, but some entries have 4 digits and others have 9 digits. Which dimension is violated?"
    options:
      - "Uniqueness"
      - "Timeliness"
      - "Validity"
      - "Accuracy"
    answer: 2
  - type: mc
    question: "Which open-source tool is commonly used to define and run data quality expectations?"
    options:
      - "Apache Airflow"
      - "Great Expectations"
      - "dbt"
      - "Kafka"
    answer: 1
---

> **🎮 Analogy:** Bad data quality is like a treasure map where the "X" was drawn by a toddler with a shaky crayon — the coordinates are wrong, the ink is smudged, and nobody can agree if it's a swamp or a volcano.

## Dimensions of Data Quality

Data quality is measured across six standard dimensions:

| Dimension | Definition | Example Check |
|-----------|------------|---------------|
| **Accuracy** | Data reflects the real-world object | Customer address matches postal records |
| **Completeness** | All required data is present | No NULLs in `email` column |
| **Consistency** | No contradictions across systems | Same customer has same name in CRM and billing |
| **Timeliness** | Data is current enough for its use | Stock prices updated within 1 minute |
| **Uniqueness** | No duplicate records | One row per customer ID |
| **Validity** | Data conforms to expected format | Phone numbers match `\+1-\d{3}-\d{3}-\d{4}` |

> **🎮 Analogy:** The six data quality dimensions are like checking whether your co-op teammate actually picked the right character — is their name right (accuracy), did they equip a weapon (completeness), did they actually join the party (consistency), are they still online (timeliness), is there a duplicate of them (uniqueness), and is their class even legal in this league (validity).

## Measuring and Monitoring

Data quality is measured through **expectations** — assertions about your data. Each expectation generates a pass/fail result. Track pass rates over time to spot degradation.

> **🎮 Analogy:** Data quality expectations are like unit tests for your data — except the test subject is a living database that keeps getting fed bad zip codes at 2 AM by a legacy Java service no one remembers how to deploy.

```python
# Example: Great Expectations expectation suite
expectation_suite = {
    "expect_column_values_to_not_be_null": {"column": "email"},
    "expect_column_values_to_be_unique": {"column": "customer_id"},
    "expect_column_values_to_match_regex": {
        "column": "zip_code",
        "regex": r"^\d{5}(-\d{4})?$"
    },
    "expect_column_values_to_be_between": {
        "column": "age",
        "min_value": 0,
        "max_value": 120
    }
}
```

## Tools

- **Great Expectations** — Define, document, and run data quality expectations. Generates human-readable data docs.
- **dbt tests** — Built-in `not_null`, `unique`, `accepted_values`, `relationships` tests in your dbt project. Custom tests use Jinja + SQL.
- **Soda Core** — Open-source CLI for data quality checks using YAML configuration.

> **🎮 Analogy:** Great Expectations is the strict DM who checks your character sheet at every session, dbt tests are the rogue's passive perception that catches traps, and Soda Core is the automated mod that just kicks anyone with an invalid tag out of the server.

## Root Cause Analysis

When a quality check fails, trace backwards:

1. **Source system** — Did the upstream API change its schema?
2. **Ingestion** — Did the pipeline skip a transformation step?
3. **Business rule** — Did a policy change invalidate old data?
4. **Human error** — Did someone manually edit a database?

> **🎮 Analogy:** Root cause analysis for data quality is like finding out why your save file corrupted — was it the mod you installed (source system), your editor that crashed mid-write (ingestion), a patch that changed the save format (business rule), or your little brother who "just pressed some buttons" (human error).

Document each incident in a data quality issue tracker and assign resolution to the relevant data steward.

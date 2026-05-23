---
title: Data Lineage
skill: data-governance
order: 3
quiz:
  - type: mc
    question: "What does upstream lineage tell you about a dataset?"
    options:
      - "Which downstream reports depend on it"
      - "Which source systems and transformations produced it"
      - "How often the data is queried"
      - "Who owns the data"
    answer: 1
  - type: mc
    question: "Why is column-level lineage important for data governance?"
    options:
      - "It shows which columns are indexed"
      - "It traces how a specific field is derived through the pipeline"
      - "It measures data quality scores per column"
      - "It identifies which users accessed each column"
    answer: 1
  - type: mc
    question: "Which open standard is used for capturing data lineage events?"
    options:
      - "OpenAPI"
      - "OpenLineage"
      - "OpenTelemetry"
      - "GraphQL"
    answer: 1
---

> **🎮 Analogy:** Data lineage is the "previously on..." recap for your data pipelines — it shows you exactly how Frodo's journey from the Shire to Mount Doom went, including the detour through 17 ETL transformations and that one step where someone divided by zero.

## What Is Data Lineage?

Data lineage is the **provenance** of your data — a map showing where data comes from, how it transforms, and where it goes. It answers questions like: *Where did this number come from? Who changed this calculation? What would break if I modify this table?*

> **🎮 Analogy:** Data lineage is like the crafting recipe for a high-end gaming PC — it shows you every part that went in, which factory each part came from, and which vendor assembled the final unit. If the GPU is fake, you can trace back exactly which supplier sold it to you.

## Upstream vs Downstream

- **Upstream lineage** — Traces backwards: what source tables, files, or APIs fed into this dataset?
- **Downstream lineage** — Traces forwards: what dashboards, ML models, or reports depend on this dataset?

When a pipeline breaks, upstream lineage helps find the root cause. When you plan a schema change, downstream lineage tells you who to notify.

> **🎮 Analogy:** Upstream lineage is backtracking through a dungeon to find where you stepped on the pressure plate, while downstream lineage is looking at the map ahead to warn your party that triggering a trap drops a boulder on the next four rooms.

## Column-Level Lineage

Table-level lineage tells you dataset A feeds dataset B. Column-level lineage tells you precisely how each column maps:

```
source.customers.name  ──→  staging.full_name  ──→  analytics.customer_dim.full_name
source.customers.id    ──→  staging.customer_id ──→  analytics.customer_dim.customer_key
```

This granularity is essential for compliance (GDPR right to access) and debugging.

> **🎮 Analogy:** Column-level lineage is the difference between knowing "the sword was crafted somewhere" and knowing "the steel came from Iron Mountain mine, the hilt was forged by Smithy Joe, and it was enchanted by Wizard Gary using a level 3 fire rune." The devil (and the auditor) is in that detail.

## Tools

| Tool | Type | Key Feature |
|------|------|-------------|
| **Apache Atlas** | Open-source | Integrated with Hadoop ecosystem, supports column lineage via hooks |
| **DataHub** | Open-source | Real-time lineage ingestion, UI for impact analysis |
| **OpenLineage** | Standard | Spec for capturing lineage events, integrates with Airflow, dbt, Spark |

> **🎮 Analogy:** Apache Atlas is the librarian who catalogs every book in the archives, DataHub is the real-time detective who sees who's reading what, and OpenLineage is the universal postal service that stamps every package with its entire shipping history for anyone to read.

```python
# Example: OpenLineage event (simplified)
{
    "eventType": "COMPLETE",
    "job": {"namespace": "airflow", "name": "daily_customer_sync"},
    "inputs": [{"namespace": "postgres", "name": "source.public.customers"}],
    "outputs": [{"namespace": "snowflake", "name": "analytics.dim_customer"}],
    "run": {"runId": "abc-123"}
}
```

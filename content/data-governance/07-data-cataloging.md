---
title: Data Cataloging
skill: data-governance
order: 7
quiz:
  - type: mc
    question: "What is the primary purpose of a data catalog?"
    options:
      - "To store raw data files"
      - "To make data discoverable, understandable, and trustworthy"
      - "To back up databases"
      - "To run ETL pipelines"
    answer: 1
  - type: mc
    question: "A business glossary in a data catalog defines:"
    options:
      - "Technical column names and data types"
      - "Business terms, definitions, and their relationship to data assets"
      - "SQL query syntax"
      - "Database connection strings"
    answer: 1
  - type: mc
    question: "Which tool is an open-source data catalog originally developed by LinkedIn?"
    options:
      - "Alation"
      - "Collibra"
      - "DataHub"
      - "Amundsen"
    answer: 2
---

> **🎮 Analogy:** A data catalog is the wiki for your game world — instead of running around asking every NPC where the hidden sword is, you just look it up, see exactly which chest it's in, who put it there, and whether it's cursed.

## What Is a Data Catalog?

A data catalog is a **centralized inventory** of all data assets in an organization. It answers the questions: *What data do we have? Where is it? What does it mean? Who owns it? Can I trust it?*

A catalog bridges the gap between technical metadata (schemas, column types) and business context (definitions, quality scores, usage).

> **🎮 Analogy:** A data catalog is the wiki your game's speedrunning community wishes they had — every glitch is documented with video proof, every item's spawn rate is listed, and there's a note on who broke the any% world record by exploiting the water temple elevator.

## Business Glossary and Technical Metadata

| Type | What It Captures | Example |
|------|-----------------|---------|
| **Technical metadata** | Schema, data type, primary keys, partitions, lineage | `customer_id INT PK` |
| **Business glossary** | Business name, definition, data domain, stewardship | "Customer ID = unique identifier for a paying customer. Domain: Customer 360. Steward: Sarah Chen." |

A good catalog links the two — a business term maps to one or more technical columns across systems.

> **🎮 Analogy:** Technical metadata is knowing the game's internal variable for health is `float32 m_fHealth` at memory address `0x4A2F`, while the business glossary calls it "Hit Points". The catalog is the translator that tells you "HP" in the UI actually maps to `m_fHealth` in three different source files and two databases.

## Data Discovery

Users find data through **search**, **browse** (by domain or system), and **recommendations**. Features that improve discoverability:

- Full-text search across table names, column names, descriptions
- Tags and classifications (e.g., `PII`, `GDPR`, `confidential`)
- Popularity metrics (most queried tables)
- Certifications — a badge that a dataset has been reviewed and approved for use

> **🎮 Analogy:** Data discovery is the item finder feature in a Metroidvania — you search for "missile tank," the catalog shows you exactly which rooms contain them, marks which ones you already picked up, and even warns you that one of them is locked behind a boss fight you're severely under-leveled for.

## Tools

| Tool | Type | Key Feature |
|------|------|-------------|
| **DataHub** | Open-source | Real-time metadata ingestion, column-level lineage, data quality integration |
| **Amundsen** | Open-source (Lyft) | Table-level search, popularity scoring, wiki-style descriptions |
| **Alation** | Commercial | Behavioral analysis (learns which data is popular), data culture features |
| **Collibra** | Commercial | Enterprise governance workflows, business glossary, policy management |

> **🎮 Analogy:** DataHub is the community-run wiki that updates in real-time when someone discovers a new trick, Amundsen is the curated strategy guide with popularity scores for each build, and Alation is the seasoned game master who notices everyone keeps asking about the same hidden quest and promotes it to the front page.

```yaml
# Example: DataHub dataset metadata (simplified)
urn: li:dataset:analytics.fct_orders
schema:
  - name: order_id
    type: INT
    description: "Unique order identifier"
    tags: [primary_key]
  - name: customer_id
    type: INT
    description: "References dim_customer.customer_id"
    tags: [foreign_key, PII]
  - name: total_amount
    type: DECIMAL(10,2)
    description: "Order total before tax"
owners:
  - user: sarah.chen
    type: DATA_OWNER
```

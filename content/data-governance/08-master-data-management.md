---
title: Master Data Management
skill: data-governance
order: 8
quiz:
  - type: mc
    question: "What is master data?"
    options:
      - "Transactional data like sales orders"
      - "Core business entities shared across systems (customers, products, employees)"
      - "Raw log files from applications"
      - "Temporary staging data"
    answer: 1
  - type: mc
    question: "In the consolidation MDM pattern, how is the golden record created?"
    options:
      - "Data stays in source systems and is federated at query time"
      - "A central hub stores a merged, deduplicated record"
      - "All systems share one database"
      - "Records are never merged; each system has its own version"
    answer: 1
  - type: mc
    question: "What is identity resolution in MDM?"
    options:
      - "Assigning unique IDs to database tables"
      - "Matching and merging records from different sources that refer to the same real-world entity"
      - "Encrypting customer identifiers"
      - "Creating user accounts in an identity provider"
    answer: 1
---

> **🎮 Analogy:** Master data management is the RPG party screen where you realize you have three characters all named "ShadowSlayerX" — one is a level 80 paladin, one is a level 3 rogue, and one is a badly-translated NPC from the tutorial. MDM figures out which one is the real hero and merges their stats into a golden character sheet.

## What Is Master Data?

Master data represents the **core business entities** that are shared across systems and processes:

| Domain | Examples | Shared Across |
|--------|----------|---------------|
| **Customer** | Name, address, email, phone | CRM, billing, support, marketing |
| **Product** | SKU, name, category, price | E-commerce, inventory, catalog |
| **Employee** | Employee ID, name, department, role | HR, payroll, access control |
| **Supplier** | Vendor name, tax ID, address | Procurement, accounts payable |

> **🎮 Analogy:** Master data is your character roster in a fighting game — every character has a name, health bar, move set, and backstory (customer, product, employee, supplier). Without MDM, you end up with "Ryu" in Street Fighter, "Ken" in your guest list at the arcade, and "Ryu Masters" on your tournament bracket, all being the same person wearing different hats.

## MDM Patterns

| Pattern | How It Works | When to Use |
|---------|-------------|-------------|
| **Registry** | No central copy. Source systems publish identifiers; queries federate at runtime. | Quick setup, low data quality needs |
| **Consolidation** | A central hub stores a golden record. Source systems send updates. | Clean master data needed but source systems remain authoritative |
| **Coexistence** | Attributes are distributed. The hub stores only the cross-reference and some shared attributes. | Complex legacy landscape, gradual migration |
| **Centralized** | The hub is the system of record for all master data attributes. | Greenfield implementations |

> **🎮 Analogy:** MDM patterns are like different party systems in RPGs — Registry is "no shared inventory, everyone carries their own stuff and we compare notes at the pub." Consolidation is a shared bank where everyone deposits and withdraws. Coexistence is a shared quest log but each player keeps their own inventory. Centralized is a full shared save file where one person is the game master.

## Golden Records and Identity Resolution

A **golden record** is the single, trusted version of a master entity. Creating one requires **identity resolution** — figuring out which records from different sources refer to the same real-world entity.

```python
# Example: Identity resolution scoring (simplified)
def match_score(record_a, record_b):
    score = 0
    if record_a.email == record_b.email:
        score += 0.9
    if record_a.phone == record_b.phone:
        score += 0.7
    if fuzzy_match(record_a.name, record_b.name) > 0.85:
        score += 0.5
    return score

# If score > threshold, merge into golden record
if match_score(crm_record, billing_record) > 1.0:
    create_golden_record(merge(crm_record, billing_record))
```

> **🎮 Analogy:** Identity resolution is the game's friend-finder feature trying to figure out if "xXx_DarkSlayer99_xXx" on Steam, "DarkSlayer99" on Discord, and "Paul from accounting" on Slack are all the same person — checking their email, comparing their IP, and using fuzzy matching when they claim their real name is "xXx."

Matching rules combine exact matches (email, tax ID) with fuzzy matching (name variations, address standardization).

## MDM vs Reference Data

- **Master data** — Core business entities that change infrequently.
- **Reference data** — Code sets and lookup values used across systems (country codes, currency codes, status values). Reference data is simpler — it's usually a controlled vocabulary maintained in a single system.

> **🎮 Analogy:** Master data vs reference data is like the difference between creating a new character in an RPG (master data — unique, complex, every party member has different stats) versus selecting "Easy / Medium / Hard" difficulty (reference data — just three options everyone agrees on, no merge conflicts needed).

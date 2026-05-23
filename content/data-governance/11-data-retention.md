---
title: Data Retention
skill: data-governance
order: 11
quiz:
  - type: mc
    question: "What is the primary purpose of a data retention policy?"
    options:
      - "To maximize storage efficiency"
      - "To define how long data is kept and when it should be deleted or archived"
      - "To encrypt all stored data"
      - "To create backups of all data"
    answer: 1
  - type: mc
    question: "What is a legal hold?"
    options:
      - "A policy requiring data to be deleted after a court case"
      - "A suspension of normal deletion policies because data is relevant to anticipated litigation"
      - "A law requiring data retention for 7 years"
      - "A hold on new data collection"
    answer: 1
  - type: mc
    question: "Which storage tier is most appropriate for data that must be retained for compliance but is rarely accessed?"
    options:
      - "Hot / SSD storage"
      - "Cold / archival storage"
      - "In-memory cache"
      - "Local disk storage"
    answer: 1
---

> **🎮 Analogy:** Data retention is the Marie Kondo of data management — you thank each log file for its service, archive the ones that spark joy for the auditors, and securely delete the rest before they attract a lawsuit like moldy leftovers in the office fridge.

## Retention Policies and Schedules

A data retention policy defines **how long** each type of data is kept and **what happens** when the retention period expires. Every data asset should be classified with a retention schedule:

| Data Type | Retention Period | Disposal Action | Rationale |
|-----------|-----------------|-----------------|-----------|
| Customer records | 7 years after last interaction | Secure deletion | Tax/legal requirements |
| Transaction logs | 90 days live, 1 year cold | Archive then delete | Operational + compliance |
| Audit logs | 3 years | Archive then delete | SOC 2 requirements |
| Employee records | 6 years after termination | Secure deletion | Labor law compliance |
| Marketing analytics | 2 years | Anonymize | GDPR purpose limitation |

> **🎮 Analogy:** A retention policy is your game's autosave system — you keep the last 7 quick saves (customer records: 7 years), the last 90 minutes of checkpoints (transaction logs: 90 days), and that one manual save from three playthroughs ago that you're terrified to delete because what if you need it for the New Game+ ultimate weapon achievement (audit logs: 3 years). Each save has a delete-by date.

## Archiving vs Deletion

| Action | What Happens | When to Use |
|--------|-------------|-------------|
| **Archive** | Data is moved to cheaper storage but remains accessible (possibly with latency) | Data has low access frequency but may be needed for legal or historical reference |
| **Delete** | Data is permanently removed (overwritten or destroyed) | Retention period has expired; no legal or business need |

Archiving without deletion is not retention management — it's just cost optimization. A compliant program must actually delete data when the period expires.

> **🎮 Analogy:** Archiving is putting old game cartridges in a labeled box in the attic — you can still dig them out if you need to prove you owned the original. Deletion is taking the cartridge to a data shredder and watching it become confetti. Just moving stuff to cheaper storage without ever hitting "delete" is like filling your attic with boxes while claiming you're a minimalist organizer.

## Legal Hold and E-Discovery

When litigation is reasonably anticipated, normal deletion must be suspended. This is a **legal hold** (or litigation hold):

1. Legal team issues a hold notice for specific data types/date ranges
2. IT/Data team suspends automated deletion for affected data
3. Data is preserved in its native format (or a forensically sound copy)
4. Hold is released when litigation concludes

Implementation: integrate retention systems with legal hold management to prevent inadvertent deletion.

> **🎮 Analogy:** A legal hold is the "freeze all player accounts — we're investigating a cheating ring" button. Normal data cleanup (deleting inactive accounts, purging old chat logs) gets paused until the investigation wraps up. If your retention system doesn't know about the legal hold, you might auto-delete evidence and end up in a LOT more trouble than the cheaters.

## Storage Tiering for Compliance

```yaml
# Example: Storage tier strategy
tiers:
  hot:
    type: SSD / high-performance
    cost: $$$$
    use_case: Active analytics, frequently accessed
    retention: 90 days
  warm:
    type: HDD / standard
    cost: $$
    use_case: Quarterly reporting, recent history
    retention: 1-3 years
  cold:
    type: Tape / Glacier / S3 Infrequent Access
    cost: $
    use_case: Compliance archives, legal holds
    retention: 3-10 years
  deletion:
    type: Secure erase / shred
    cost: $ (per operation)
    action: Cryptographic destruction or physical shredding
```

> **🎮 Analogy:** Storage tiering is like your inventory management in an RPG — your most-used potions and arrows sit in the quick-access pouch (hot/SSD), your crafting materials go to the stash chest in town (warm/HDD), your quest-completed-story-only letters get shipped to the cloud in the sky (cold/tape), and the vendor trash that's been sitting there for 10 years finally gets auto-junked (deletion).

Automated lifecycle policies (e.g., AWS S3 lifecycle, Azure Blob Storage lifecycle rules) move data between tiers and eventually delete it — programmatically enforcing your retention schedule.

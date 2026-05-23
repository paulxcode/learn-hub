---
title: Google Cloud Platform
skill: cloud-big-data
order: 3
quiz:
  - type: mc
    question: "Which GCP service is a serverless data warehouse for petabyte-scale analytics?"
    options:
      - "Cloud SQL"
      - "BigQuery"
      - "Cloud Storage"
      - "Spanner"
    answer: 1
  - type: mc
    question: "What is Vertex AI primarily used for?"
    options:
      - "Running virtual machines"
      - "Building and deploying ML models"
      - "Storing unstructured data"
      - "Managing Kubernetes clusters"
    answer: 1
  - type: mc
    question: "Which GCP service is equivalent to AWS S3?"
    options:
      - "Cloud SQL"
      - "Compute Engine"
      - "Cloud Storage"
      - "Bigtable"
    answer: 2
---

> **🎮 Analogy:** GCP is the Swiss Army knife Google built for itself first — BigQuery is the blade that never dulls, Kubernetes came from their lunch-box, and the rest of the tools just happen to clip onto the same handle.

## Google Cloud Core Services

**Compute Engine** — VMs comparable to AWS EC2. Supports custom machine types, GPUs, and preemptible instances (up to 80% discount for interruptible workloads).

> **🎮 Analogy:** Preemptible instances on Compute Engine are the "Friday night arcade closeout" — you get games at 80% off but the owner can kick you out anytime a paying customer walks in. Perfect for grinding XP (batch jobs) but terrible for boss fights (stateful apps).

**Cloud Storage** — Object storage with a single API for any data. Supports multi-regional, regional, nearline, coldline, and archive storage classes.

```bash
# Create a bucket and upload files with gsutil
gsutil mb gs://my-analytics-bucket/
gsutil cp sales_data.csv gs://my-analytics-bucket/raw/
gsutil ls gs://my-analytics-bucket/raw/
```

> **🎮 Analogy:** Cloud Storage classes are the vendors in an MMO hub city — the standard merchant is always open and charges full price (Standard), the sleepy guy in the corner only unlocks his wares if you visit monthly (Nearline), and the sealed chest behind him needs a quest item to open (Archive).

**Cloud SQL** — Managed relational databases: PostgreSQL, MySQL, SQL Server. Automatic replication, backups, and failover.

> **🎮 Analogy:** Cloud SQL is having a friendly librarian who remembers where every book is, makes copies of the popular ones (replicas), and if a shelf breaks, instantly teleports you to the exact same book in a different library (failover).

## BigQuery

BigQuery is a serverless, highly scalable data warehouse. You query petabytes using standard SQL without managing infrastructure.

```sql
-- BigQuery standard SQL
SELECT
  DATE(timestamp) as day,
  COUNT(DISTINCT user_id) as unique_users,
  ROUND(SUM(revenue), 2) as total_revenue
FROM `my-project.my_dataset.sales`
WHERE timestamp >= '2026-01-01'
GROUP BY day
ORDER BY day;
```

BigQuery separates storage and compute — you pay for storage separately from the queries you run. Use clustering and partitioning to reduce query costs.

> **🎮 Analogy:** BigQuery's storage-compute separation is buying a massive warehouse for all your board games (cheap storage) but only renting a table when you actually want to play (query compute). Partitioning is like sorting games by player count so you only dig through the relevant shelf.

## Vertex AI

Vertex AI unifies GCP's ML offerings: AutoML for training models with no code, custom training with any framework, model deployment to endpoints, and feature stores.

> **🎮 Analogy:** Vertex AI is the training dojo in a fighting game — AutoML is "easy mode" that teaches you combos automatically, custom training is freestyle practice with any controller, and the model endpoint is the online matchmaking that puts your fighter against the world.

## GCP vs AWS

| Area | AWS | GCP |
|------|-----|-----|
| Compute | EC2 | Compute Engine |
| Object Storage | S3 | Cloud Storage |
| Data Warehouse | Redshift | BigQuery |
| Container Orchestration | EKS | GKE (Kubernetes originated at Google) |
| ML Platform | SageMaker | Vertex AI |

GCP's network infrastructure (Andromeda) is a differentiator — it uses the same global fiber network that powers Google Search and YouTube.

> **🎮 Analogy:** GCP's Andromeda network is like having a fiber-optic direct line to the game server while everyone else is on Wi-Fi from a basement apartment — it's the same internet, but you're basically on the LAN.

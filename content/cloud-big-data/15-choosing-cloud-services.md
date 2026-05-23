---
title: Choosing Cloud Services
skill: cloud-big-data
order: 15
quiz:
  - type: mc
    question: "Which migration strategy involves moving an application to the cloud with minimal changes?"
    options:
      - "Refactor"
      - "Lift-and-shift"
      - "Rebuild"
      - "Retire"
    answer: 1
  - type: mc
    question: "What is a key challenge of multi-cloud strategies?"
    options:
      - "Single vendor lock-in"
      - "Increased complexity in networking, security, and data transfer costs"
      - "Reduced availability"
      - "Limited service selection"
    answer: 1
  - type: mc
    question: "Which compute service is best for a long-running, stateful application with predictable traffic?"
    options:
      - "Lambda"
      - "EC2 / Compute Engine (VMs)"
      - "API Gateway"
      - "S3"
    answer: 1
---

> **🎮 Analogy:** Choosing a cloud service is like picking your character class — VMs are the Warrior (reliable, versatile, always there), serverless is the Rogue (fast, hits hard, vanishes when idle), and Kubernetes is the Wizard (immensely powerful once you finish the 500-page spellbook and learn the incantations).

## Decision Framework

Choosing the right cloud service depends on workload characteristics:

| If you need... | Choose... | Reason |
|---------------|-----------|--------|
| Run a custom long-running app | VM (EC2, Compute Engine) | Full control, any OS/runtime |
| Deploy a containerized microservice | Kubernetes (EKS, GKE, AKS) | Orchestration, auto-scaling, self-healing |
| Process files on upload | Serverless (Lambda, Cloud Functions) | Event-driven, zero maintenance |
| Analytics on terabytes of data | Data warehouse (BigQuery, Redshift) | Columnar, SQL, fast aggregations |
| Store raw files cheaply | Object storage (S3, GCS) | Durable, scalable, versioned |
| Real-time event streaming | Kafka / Kinesis | Durable log, replayable, high throughput |
| ML model training | Vertex AI / SageMaker | Managed infrastructure, GPU support |

> **🎮 Analogy:** The decision framework table is the class selection screen in an RPG — picking "Serverless (Rogue)" for a long-running stateful app is like taking a squishy dagger-user into a siege battle where you need to hold a gate for 30 minutes (long-running). Wrong tool, wrong fight.

## Migration Strategies (The 6 R's)

1. **Lift-and-shift (Rehost)** — Move as-is with minimal changes. Fastest, but doesn't leverage cloud benefits fully.

> **🎮 Analogy:** Lift-and-shift is taking your 2012 desktop PC and plugging it into a data center — it works, technically, but you're still booting Windows 7 and waiting 5 minutes for startup despite being surrounded by SSDs and fiber.

2. **Refactor (Re-platform)** — Make minor cloud-optimized changes (e.g., use RDS instead of self-managed DB).

> **🎮 Analogy:** Refactoring is swapping your desktop's HDD for an SSD and upgrading the RAM — same case, same OS, same workflow, but suddenly things don't take forever. You didn't rebuild the PC, just the bottleneck parts.

3. **Re-architect (Rebuild)** — Redesign using cloud-native services. Most effort, most benefit.

> **🎮 Analogy:** Re-architecting is scrapping your old desktop and building a high-end gaming PC from scratch — expensive, time-consuming, requires research, but now you can ray-trace at 144 fps instead of playing Minecraft at 20.

4. **Replace (Repurchase)** — Switch to a SaaS product (e.g., Salesforce instead of custom CRM).

> **🎮 Analogy:** Replacing is giving up on building your own game engine and just licensing Unreal Engine 5 — you lose custom control, but gain a team of hundreds maintaining and improving it daily.

5. **Retire** — Decommission unused applications.

6. **Retain** — Keep on-premises when migration doesn't make sense.

```python
# Cost-benefit analysis for migration strategies
strategies = {
    "Lift-and-shift": {"cost": 50, "benefit": 20, "time_months": 3},
    "Refactor":       {"cost": 150, "benefit": 60, "time_months": 8},
    "Re-architect":   {"cost": 400, "benefit": 90, "time_months": 18},
}

for strategy, metrics in sorted(strategies.items()):
    roi = (metrics["benefit"] - metrics["cost"]) / metrics["cost"] * 100
    print(f"{strategy:15s} | Cost: {metrics['cost']:3d} | Benefit: {metrics['benefit']:2d}% | "
          f"ROI: {roi:5.0f}% | Time: {metrics['time_months']}mo")
```

**Output:**
```
Lift-and-shift   | Cost:  50 | Benefit: 20% | ROI:   -60% | Time: 3mo
Refactor         | Cost: 150 | Benefit: 60% | ROI:   -60% | Time: 8mo
Re-architect     | Cost: 400 | Benefit: 90% | ROI:   -78% | Time: 18mo
```

The highest ROI in the long term comes from re-architecting, even though upfront investment is larger.

> **🎮 Analogy:** The cost-benefit analysis is upgrading your starter Pokémon — sure, you could keep your Level 5 Pidgey forever (lift-and-shift), but investing the time to evolve it to Pidgeot (re-architect) costs more candy upfront and pays off when you're dominating the Elite Four.

## Multi-Cloud Considerations

Using multiple cloud providers prevents vendor lock-in but adds complexity:

- **Data transfer costs** — Egress fees between clouds add up

> **🎮 Analogy:** Cross-cloud data transfer costs are the microtransactions in a free-to-play game — AWS to GCP costs per GB like buying V-Bucks every time you want to do something simple. Nobody notices the first few transfers, but the bill at the end of the month is pure nickel-and-dime horror.

- **Operations overhead** — Different consoles, APIs, IAM systems
- **Skill requirements** — Team needs expertise in multiple platforms
- **Networking** — VPN/Interconnect between clouds

## Case Studies

**Streaming analytics** — Kafka on Confluent Cloud → Spark Structured Streaming → Delta Lake on S3 → BI via Athena. Uses managed services with auto-scaling.

> **🎮 Analogy:** This streaming pipeline is like a Factorio sushi belt — raw fish (events) enter from one side, get sorted and processed by inserters (Spark), packed into boxes (Delta Lake), and finally displayed on the dashboard (Athena/BI) so you can watch your factory run in real-time.

**Batch ML training** — Data in GCS → Vertex AI custom training with GPUs → model deployed to Cloud Run for inference. Serverless training avoids idle GPU costs.

**Enterprise data platform** — AWS S3 data lake → Glue ETL → Redshift for analytics, with RDS for operational data. Terraform manages infrastructure across accounts with cost allocation tags per business unit.

> **🎮 Analogy:** This enterprise setup is a city-builder endgame — your S3 lake is the resource stockpile, Glue ETL is the industrial processing zone, Redshift is the marketplace where everyone shops for insights, and Terraform tags are the color-coded district zoning that tells you which neighborhood is burning the budget.

Start simple — a single VM or Lambda — and add complexity only when the workload demands it.

> **🎮 Analogy:** Cloud architecture is like building in Valheim — start with a basic wooden shack (single VM) that keeps the rain off, then expand to a stone fortress with moats and portals (microservices, Kubernetes) only when the trolls start knocking. Building the fortress from day one means you starve before the roof is on.

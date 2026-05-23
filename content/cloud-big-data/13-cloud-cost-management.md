---
title: Cloud Cost Management
skill: cloud-big-data
order: 13
quiz:
  - type: mc
    question: "What is the primary benefit of Reserved Instances?"
    options:
      - "No performance limits"
      - "Lower cost in exchange for a commitment to a specific instance configuration"
      - "Unlimited storage"
      - "Automatic scaling"
    answer: 1
  - type: mc
    question: "What are cost allocation tags used for?"
    options:
      - "Identifying resources in billing reports by project or team"
      - "Increasing resource performance"
      - "Automatically reducing costs"
      - "Encrypting data at rest"
    answer: 0
  - type: mc
    question: "What is the best practice for monitoring cloud costs?"
    options:
      - "Only check the bill at the end of the month"
      - "Set up budgets with alerts and review costs regularly"
      - "Ignore costs until they exceed the budget"
      - "Use only on-demand instances"
    answer: 1
---

> **🎮 Analogy:** Cloud cost management is checking your Steam wallet during a sale — Reserved Instances are the bundle deals you commit to for a discount, Spot Instances are flash discounts on servers nobody's using, and forgetting to turn off dev instances is the $200 microtransaction you regret at 3 AM.

## Cloud Pricing Models

Cloud providers offer several pricing options:

- **On-Demand** — Pay per hour/second. No commitment, highest flexibility, highest cost.

> **🎮 Analogy:** On-Demand pricing is buying a single game at full price on Steam — no commitment, you own it forever (or until you stop paying), but you're paying the maximum premium for the privilege of zero strings attached.

- **Reserved Instances** — 1 or 3 year commitment. Up to 72% discount for steady workloads.

> **🎮 Analogy:** Reserved Instances are the Steam sale bundle where you pre-order the next three Assassin's Creed games at 60% off — you're committed to owning them whether you play them or not, but the savings are undeniable if you know you'll log in.

- **Spot/Preemptible** — Excess capacity at 60-90% discount. Can be terminated at any time. Ideal for batch processing, stateless jobs.

> **🎮 Analogy:** Spot instances are the "mystery game" Humble Bundle — you get incredible value, but the game might be something you already own (terminated) and you can't request a specific title. Perfect for filling your library (batch jobs), terrible for that one game you actually want to play tonight.

- **Savings Plans** — Flexible commitment ($/hour spend) across instance families.

```python
# Cost comparison: 3-year total for a t3.medium (2 vCPU, 4 GB)
on_demand_hourly = 0.0416
reserved_hourly = 0.0250
hours_per_year = 8760

on_demand_3yr = on_demand_hourly * hours_per_year * 3
reserved_3yr = reserved_hourly * hours_per_year * 3
savings = on_demand_3yr - reserved_3yr

print(f"On-demand (3 years):  ${on_demand_3yr:.2f}")
print(f"Reserved (3 years):   ${reserved_3yr:.2f}")
print(f"Savings:              ${savings:.2f}")
print(f"Reduction:            {savings/on_demand_3yr*100:.0f}%")
```

**Output:**
```
On-demand (3 years):  $1093.00
Reserved (3 years):   $657.00
Savings:              $436.00
Reduction:            40%
```

> **🎮 Analogy:** The Reserved vs On-Demand cost comparison is like comparing buying a year of Xbox Game Pass Ultimate on sale ($180) vs paying month-to-month ($17/mo = $204/yr) — the committed annual plan wins every time if you know you'll still be gaming in December.

## Cost Allocation Tags

Tags help track which team, project, or environment is using resources. Common tags: `Environment: production/staging/dev`, `Project: data-lake`, `Team: analytics`, `CostCenter: 12345`.

> **🎮 Analogy:** Cost allocation tags are the colored labels on your Factorio logistics network — red tag for "ammo production," green for "science packs," blue for "I don't know what this belt does (dev)." Without tags, you're looking at one giant inventory of "stuff" with no idea who built what.

```bash
# Tag EC2 instances for cost tracking
aws ec2 create-tags \
    --resources i-1234567890abcdef0 \
    --tags Key=Environment,Value=production \
           Key=Project,Value=etl-pipeline \
           Key=Team,Value=data-engineering
```

## Reserved vs On-Demand

| Workload Type | Recommended |
|--------------|-------------|
| Steady-state production | Reserved or Savings Plan |
| Variable / unknown | On-demand |
| Batch / fault-tolerant | Spot / Preemptible |
| Dev / test | Spot or Reserved (low utilization) |

> **🎮 Analogy:** The pricing strategy table is the equipment loadout screen in an RPG — on-demand is the "spend mana per cast" approach (expensive but versatile), reserved is the "buy the weapon outright" approach (high upfront, zero per-swing cost), and spot is "use the enemy's dropped weapons" (free but they might vanish mid-combat).

## Monitoring Costs

Set up budgets and alerts to avoid surprises:

```bash
# AWS Budget: alert when monthly spend exceeds $1000
aws budgets create-budget \
    --account-id 123456789012 \
    --budget '{
        "BudgetName": "monthly-infra-budget",
        "BudgetLimit": {"Amount": "1000", "Unit": "USD"},
        "TimeUnit": "MONTHLY",
        "BudgetType": "COST"
    }' \
    --notifications-with-subscribers '[
        {
            "Notification": {
                "NotificationType": "ACTUAL",
                "ComparisonOperator": "GREATER_THAN",
                "Threshold": 80
            },
            "Subscribers": [
                {"Address": "team-lead@company.com", "SubscriptionType": "EMAIL"}
            ]
        }
    ]'
```

Use AWS Cost Explorer or GCP Cost Management to analyze trends, identify unused resources, and right-size over-provisioned instances.

> **🎮 Analogy:** Cost Explorer is the stat screen at the end of a Civilization VI match — it shows you exactly where your gold went, how much each city (service) cost to maintain, and which armies (EC2 instances) sat idle for 50 turns doing nothing while burning maintenance.

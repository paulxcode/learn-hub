---
title: Introduction to Cloud Computing
skill: cloud-big-data
order: 1
quiz:
  - type: mc
    question: "Which cloud service model provides virtualized hardware resources like compute and storage?"
    options:
      - "IaaS"
      - "PaaS"
      - "SaaS"
      - "FaaS"
    answer: 0
  - type: mc
    question: "Which deployment model combines public and private cloud resources?"
    options:
      - "Public cloud"
      - "Private cloud"
      - "Hybrid cloud"
      - "Community cloud"
    answer: 2
  - type: mc
    question: "What is the primary benefit of pay-as-you-go pricing in cloud computing?"
    options:
      - "You own the hardware after 12 months"
      - "You only pay for what you use"
      - "You get a fixed price for life"
      - "You pay annually for discounts"
    answer: 1
---

> **🎮 Analogy:** Cloud computing is like renting a gaming rig by the hour instead of maxing out your credit card on a custom build — you still get to frag noobs, but you never have to dust the fans.

## Cloud Computing Models

Cloud computing delivers computing services (servers, storage, databases, networking, software) over the internet. Three main service models exist:

- **IaaS (Infrastructure as a Service)** — Virtual machines, storage, networks. You manage the OS and apps; the provider manages the hardware. Examples: AWS EC2, GCP Compute Engine.
- **PaaS (Platform as a Service)** — Managed runtime for deploying applications without managing underlying infrastructure. Examples: Heroku, Google App Engine.
- **SaaS (Software as a Service)** — Fully managed applications accessed via browser. Examples: Gmail, Google Sheets, Salesforce.

> **🎮 Analogy:** IaaS is the "creative mode" sandbox where you build everything from raw dirt blocks (VMs, storage, networking) — PaaS is the pre-built house template you just drop your furniture into, and SaaS is the fully furnished Airbnb you show up to with just your toothbrush (and maybe a Netflix login).

## Deployment Models

**Public cloud** — Resources shared across tenants, managed by a provider (AWS, Azure, GCP). **Private cloud** — Dedicated infrastructure for a single organization. **Hybrid cloud** — Combines both, allowing data and apps to share between them.

> **🎮 Analogy:** Public cloud is a packed server lobby in an MMO — you share the world with strangers but the devs handle the hardware. Private cloud is your own LAN party in a bunker. Hybrid cloud is linking your LAN party to the outside server so your friend can join from across town without giving up your private shenanigans.

```python
# Simple cost comparison: on-prem vs cloud
monthly_on_prem = {
    "servers": 5000,
    "cooling": 800,
    "staff": 12000,
    "network": 2000,
}
on_prem_total = sum(monthly_on_prem.values())

monthly_cloud = {
    "compute": 1800,
    "storage": 400,
    "managed_services": 900,
}
cloud_total = sum(monthly_cloud.values())

print(f"On-premises monthly cost: ${on_prem_total}")
print(f"Cloud monthly cost:       ${cloud_total}")
print(f"Savings:                  ${on_prem_total - cloud_total}")
```

**Output:**
```
On-premises monthly cost: $19800
Cloud monthly cost:       $3100
Savings:                  $16700
```

> **🎮 Analogy:** The on-prem vs cloud cost comparison is like buying a full arcade cabinet (on-prem) vs paying per quarter (cloud) — both let you play Street Fighter, but one ties up your garage forever and the other lets you walk away when you're done.

## Major Providers

| Provider | Key Strengths |
|----------|--------------|
| **AWS** | Broadest service catalog, most mature |
| **GCP** | Data analytics, ML, Kubernetes |
| **Azure** | Enterprise integration, Microsoft stack |

> **🎮 Analogy:** AWS is the Steam workshop with a mod for everything, GCP is the optimized engine that makes your game run buttery smooth, and Azure is the enterprise game launcher your IT department makes you use.

Cloud benefits include global reach (deploy in regions worldwide), elasticity (scale up/down instantly), and shifting from CapEx to OpEx.

> **🎮 Analogy:** Elasticity is like rubber-banding in Mario Kart — when you're behind, the game gives you a boost (scale up), and when you're winning, it holds you back a bit (scale down). CapEx to OpEx is switching from buying a $60 game permanently to a $10/month subscription — you never "own" it, but you're never stuck with yesterday's patch.

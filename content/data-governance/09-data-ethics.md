---
title: Data Ethics
skill: data-governance
order: 9
quiz:
  - type: mc
    question: "Which principle of ethical AI requires that decisions made by algorithms can be explained to affected individuals?"
    options:
      - "Fairness"
      - "Accountability"
      - "Transparency"
      - "Privacy"
    answer: 2
  - type: mc
    question: "A hiring model scores candidates lower if they live in certain postal codes due to historical hiring patterns. This is an example of:"
    options:
      - "Data minimization"
      - "Algorithmic bias"
      - "Privacy by design"
      - "Data anonymization"
    answer: 1
  - type: mc
    question: "Which of the following is a key practice for responsible data collection?"
    options:
      - "Collect as much data as possible for future use"
      - "Collect only the data necessary for a specific, stated purpose"
      - "Share collected data freely with partners"
      - "Store data indefinitely for analysis"
    answer: 1
---

> **🎮 Analogy:** Training AI on biased data is like teaching a fighting game AI using only tutorials from button-mashers — it'll learn that spamming one move is the optimal strategy, and then you're surprised when it refuses to block, combo, or show mercy to newcomers.

## Ethical AI Principles

| Principle | What It Means | In Practice |
|-----------|---------------|-------------|
| **Fairness** | Models don't discriminate against protected groups | Audit model outcomes across demographic groups |
| **Accountability** | Someone is responsible for the model's impact | Documented model owners and escalation paths |
| **Transparency** | Decisions can be explained and understood | Provide feature importance and model cards |

> **🎮 Analogy:** Ethical AI principles are like the Geneva Convention for video games — fairness means the hitboxes are the same for every character, accountability means the dev team has to answer for the pay-to-win mechanics, and transparency means the patch notes actually explain why your main got nerfed into the ground.

## Bias in Data and Algorithms

Bias enters systems through multiple pathways:

- **Historical bias** — Training data reflects past discrimination (e.g., biased hiring decisions)
- **Representation bias** — Certain groups are underrepresented in training data
- **Measurement bias** — The chosen label or feature is a poor proxy for the real construct
- **Aggregation bias** — One model doesn't fit all groups equally

> **🎮 Analogy:** Bias in AI is like a fighting game that was trained only on data from high-ranked players — the AI thinks everyone cancels into super moves frame-perfectly, and whenever a casual player picks up the controller, the AI either assumes they're sandbagging or literally cannot comprehend why someone would block. Historical bias is "we only recorded tournament matches." Representation bias is "we only studied Japanese arcade players."

```python
# Example: Auditing for fairness (conceptual)
def audit_model_fairness(model, test_data, sensitive_attr):
    groups = test_data.groupby(sensitive_attr)
    metrics = {}
    for group_name, group_data in groups:
        y_pred = model.predict(group_data.features)
        metrics[group_name] = {
            "accuracy": accuracy(group_data.labels, y_pred),
            "false_positive_rate": fpr(group_data.labels, y_pred),
            "false_negative_rate": fnr(group_data.labels, y_pred),
        }
    return metrics
# Flag if metrics differ significantly across groups
```

## Responsible Data Collection

- **Purpose specification** — Collect data only for a clearly stated, legitimate purpose
- **Consent** — Obtain informed consent; don't hide data collection in terms of service
- **Minimization** — Collect the minimum data needed; don't hoard "just in case"
- **Retention limits** — Delete data when the purpose is fulfilled

> **🎮 Analogy:** Responsible data collection is like a game developer asking for permissions — do you really need access to the player's microphone, camera, contacts, GPS location, and photo gallery just to run a simple match-3 puzzle game? Purpose specification is saying "we need your location to show you local leaderboards," not "we need everything because we might want it later."

## Ethical Frameworks for Data Teams

| Framework | Focus |
|-----------|-------|
| **FAIR** (Findable, Accessible, Interoperable, Reusable) | Data sharing principles |
| **DAT** (Data Ethics Tenets) | Practical ethics checklist for projects |
| **EU AI Act** | Risk-based regulation for AI systems |
| **IEEE Ethically Aligned Design** | Human-centric AI design |

> **🎮 Analogy:** Ethical frameworks are the gaming platform's content review board — FAIR says "make your mods findable and reusable," the EU AI Act is like a ratings board (E for Everyone vs M for Mature), and a data ethics review board is the internal playtesting team that flags mechanics that incentivize toxic behavior before they go live.

A practical approach: create a **data ethics review board** that reviews high-risk projects before deployment, with representatives from legal, engineering, product, and affected communities.

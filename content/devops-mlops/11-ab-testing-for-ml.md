---
title: A/B Testing for ML
skill: devops-mlops
order: 11
quiz:
  - type: mc
    question: "What is the purpose of A/B testing for ML models?"
    options:
      - "To train two models simultaneously"
      - "To compare performance of a new model (treatment) against the current model (control) with live traffic"
      - "To test the model on two different datasets"
      - "To evaluate model accuracy on a test set"
    answer: 1
  - type: mc
    question: "What does statistical significance mean in A/B testing?"
    options:
      - "The result is practically important"
      - "The observed difference is unlikely to have occurred by random chance"
      - "The sample size is large enough"
      - "The model has high accuracy"
    answer: 1
  - type: mc
    question: "What is a multi-armed bandit approach?"
    options:
      - "An A/B test that runs forever"
      - "A technique that dynamically allocates more traffic to better-performing variants while still exploring"
      - "A method for testing multiple models in parallel"
      - "A reinforcement learning algorithm for gaming"
    answer: 1
---

> **🎮 Analogy:** A/B testing two models is like choosing between a sword and an axe in an RPG — you need real combat data (and statistical significance) to know which one crits harder before you enchant it.

## A/B Testing Fundamentals

A/B testing compares a control (current model, A) against a treatment (new model, B) using live traffic:

1. Split users randomly into two groups
2. Serve model A to group A, model B to group B
3. Collect business metrics (conversion, CTR, revenue)
4. Compare results statistically

```python
# Routing logic in the API
import random

AB_CONFIG = {
    "control": {"model": "churn_v1", "traffic": 50},
    "treatment": {"model": "churn_v2", "traffic": 50},
}

def get_model_for_user(user_id: str) -> str:
    """Deterministic assignment based on user_id hash."""
    bucket = hash(user_id) % 100
    if bucket < 50:
        return "churn_v1"  # control
    else:
        return "churn_v2"  # treatment
```

Key metrics to track per variant: prediction latency, error rate, and the downstream business metric (e.g., retention rate).

> **🎮 Analogy:** A/B testing is playing the same game level with two different weapon builds — shotgun vs sniper rifle on the same enemies. You measure which gets the better clear time before committing materials to upgrade it.

## Statistical Significance

You need enough data to be confident the difference isn't due to chance:

```python
from scipy.stats import chi2_contingency

# Conversion matrix: [[control_success, control_fail],
#                     [treatment_success, treatment_fail]]
conversion_matrix = [[450, 9550], [520, 9480]]

chi2, p_value, dof, expected = chi2_contingency(conversion_matrix)

print(f"p-value: {p_value:.4f}")
if p_value < 0.05:
    print("Statistically significant — treatment is different")
else:
    print("Not enough evidence — continue test or declare no effect")
```

A p-value < 0.05 means there's less than a 5% chance the observed difference is due to random variation. Always run the test long enough to reach statistical power (typically 1-2 weeks depending on traffic volume).

> **🎮 Analogy:** Statistical significance is the difference between one lucky crit kill on a boss and having a build that consistently beats the enrage timer — you need enough raid pulls (sample size) to know your parse wasn't a fluke.

## Multi-Armed Bandits

Traditional A/B testing is static — traffic split stays fixed. Multi-armed bandits (e.g., Thompson sampling) dynamically shift traffic toward better-performing variants:

```python
# Thompson sampling for binary outcomes
import numpy as np

class ThompsonSampling:
    def __init__(self, variants):
        self.variants = variants
        self.successes = {v: 0 for v in variants}
        self.failures = {v: 0 for v in variants}

    def select_variant(self):
        best = None
        best_sample = -1
        for v in self.variants:
            sample = np.random.beta(
                self.successes[v] + 1,
                self.failures[v] + 1
            )
            if sample > best_sample:
                best_sample = sample
                best = v
        return best

    def update(self, variant, success):
        if success:
            self.successes[variant] += 1
        else:
            self.failures[variant] += 1
```

Bandits converge faster and reduce the cost of a bad treatment, but require careful implementation of exploration vs exploitation.

> **🎮 Analogy:** Multi-armed bandits are an RTS scout mechanic — instead of sending scouts (traffic) evenly to every base location (variant), you send more scouts to promising spots after the first sweep, adjusting dynamically as intel comes in.

## ML Model A/B Testing in Production

Use feature flags or routing layers to control which users see which model. Log predictions and outcomes systematically. Automate the analysis — when significance is reached, either promote the winner or roll back. Always support quick rollbacks to the previous model version.

> **🎮 Analogy:** Feature flags for A/B testing are the developer console — `tgm` (toggle god mode) lets you test invincibility on a subset of encounters without committing to a full playthrough, and if it breaks the game, `tgm` turns it off instantly.

---
title: Data Drift and Concept Drift
skill: devops-mlops
order: 13
quiz:
  - type: mc
    question: "What is data drift?"
    options:
      - "The model's predictions changing over time"
      - "Changes in the statistical distribution of input features compared to the training data"
      - "The training data being accidentally deleted"
      - "The model weights being updated automatically"
    answer: 1
  - type: mc
    question: "What is concept drift?"
    options:
      - "Changes in the target variable's distribution only"
      - "Changes in the relationship between input features and the target variable"
      - "The model architecture becoming outdated"
      - "The training data becoming corrupted"
    answer: 1
  - type: mc
    question: "Which statistical test is commonly used to detect drift?"
    options:
      - "t-test"
      - "Kolmogorov-Smirnov test"
      - "ANOVA"
      - "Chi-squared test"
    answer: 1
---

> **🎮 Analogy:** Data drift is the game's difficulty scaling — just because your level-50 gear crushed the tutorial zone doesn't mean it'll work in the endgame dungeon where the enemies have learned new tricks.

## Data Drift: Feature Distribution Changes

Data drift occurs when the distribution of input features in production differs from training. Causes: seasonal effects, upstream data pipeline changes, user behavior shifts.

```python
import numpy as np
from scipy.stats import ks_2samp

def detect_data_drift(
    reference: np.array,  # training data for a feature
    current: np.array,    # current production data
    threshold: float = 0.05
) -> tuple:
    """
    Returns (drift_detected, p_value).
    p_value < threshold indicates significant drift.
    """
    stat, p_value = ks_2samp(reference, current)
    return p_value < threshold, p_value

# Example for a single feature
training_age = np.random.normal(35, 10, 10000)
production_age = np.random.normal(40, 12, 1000)

drifted, p = detect_data_drift(training_age, production_age)
print(f"Age drift detected: {drifted} (p={p:.4f})")
```

Monitor each feature independently. Some features drift more than others — prioritize by feature importance.

> **🎮 Analogy:** Data drift is like a Tekken player who practiced only against Jin — when the opponent switches to Hwoarang, the timing and spacing feel all wrong, even though it's still the same fighting game (same model, different input distribution).

## Concept Drift: Relationship Changes

Concept drift means the relationship between features and the target has changed. The model's decision boundary is no longer valid even if feature distributions are stable.

Types of concept drift:
- **Sudden**: abrupt change (e.g., new regulation changes behavior)
- **Gradual**: slow shift over time (e.g., aging population)
- **Recurring**: seasonal patterns that repeat

```python
def track_model_performance_over_time(
    y_true: list, y_pred: list, timestamps: list
):
    """Track accuracy in rolling windows to detect concept drift."""
    import pandas as pd

    df = pd.DataFrame({
        "timestamp": timestamps,
        "y_true": y_true,
        "y_pred": y_pred
    })
    df["correct"] = df["y_true"] == df["y_pred"]
    df = df.sort_values("timestamp")

    # Rolling accuracy over 1000-sample windows
    df["rolling_accuracy"] = (
        df["correct"].rolling(1000).mean()
    )

    return df[["timestamp", "rolling_accuracy"]]

# Plot the result — a sustained drop indicates concept drift
```

> **🎮 Analogy:** Concept drift is when a speedrun strategy stops working because the devs patched the game — your jump-cancel-glitch timing is perfect, but the relationship between button input and character movement has changed, and now you're falling into the void.

## Detecting Drift

Common statistical methods:

- **KS test**: compares two distributions (continuous features)
- **Population Stability Index (PSI)**: measures distribution shift binned into buckets
- **Jensen-Shannon Divergence**: symmetric measure of distribution difference
- **Earth Mover's Distance (Wasserstein)**: robust to binning choices

```python
def population_stability_index(
    expected: np.array, actual: np.array, bins: int = 10
) -> float:
    """Compute PSI — values > 0.2 indicate significant drift."""
    expected_percents = np.histogram(expected, bins=bins, density=True)[0]
    actual_percents = np.histogram(actual, bins=bins, density=True)[0]

    # Avoid division by zero
    expected_percents = np.clip(expected_percents, 0.001, None)
    actual_percents = np.clip(actual_percents, 0.001, None)

    psi = np.sum(
        (actual_percents - expected_percents) *
        np.log(actual_percents / expected_percents)
    )
    return psi
```

> **🎮 Analogy:** Drift detection tests are file integrity verification — the KS test is Steam's "verify integrity of game files," checking if data has changed. PSI is like comparing your save file size to its expected size — a sudden jump usually means corruption (or drift).

## Retraining Triggers

Drift detection feeds into automated retraining decisions:

- **Data drift threshold**: retrain when >20% of important features show drift
- **Concept drift threshold**: retrain when rolling accuracy drops below 90% of baseline
- **Time-based fallback**: force retrain every N days regardless of drift signals

```python
def should_retrain(drift_results: dict, accuracy_drop: float) -> bool:
    features_drifted = sum(drift_results.values())
    total_features = len(drift_results)

    if features_drifted / total_features > 0.2:
        return True  # significant data drift
    if accuracy_drop > 0.05:
        return True  # significant concept drift
    return False
```

Don't over-retrain — frequent retraining costs compute and can introduce instability. Set sensible thresholds and cooldown periods.

> **🎮 Analogy:** Retraining thresholds are the autosave frequency setting — save every 5 minutes (retrain on every drift signal) and your SSD writes bury you. Save every 4 hours (retrain weekly) and you lose 3.5 hours of progress on a crash. Find your sweet spot before you lose data or money.

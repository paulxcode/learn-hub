---
title: Model Interpretability
skill: machine-learning
order: 15
quiz:
  - type: mc
    question: "LIME explains individual predictions by..."
    options:
      - "Computing gradients through the network"
      - "Perturbing the input and fitting a locally interpretable surrogate model"
      - "Listing all training samples similar to the input"
      - "Calculating the exact contribution of every feature using game theory"
    answer: 1
  - type: mc
    question: "What concept from game theory do SHAP values use?"
    options:
      - "Nash equilibrium"
      - "Shapley values"
      - "Prisoner's dilemma"
      - "Minimax"
    answer: 1
  - type: mc
    question: "When does model interpretability matter most?"
    options:
      - "Only when publishing research papers"
      - "In regulated industries where decisions must be explained and audited"
      - "Only for deep learning models"
      - "Never, if accuracy is high enough"
    answer: 1
---

> **🎮 Analogy:** Model interpretability is the difference between a doctor who says "you have an infection" and one who says "your white blood cell count is elevated, here's the culture result, and that's why I'm prescribing this antibiotic." LIME and SHAP are the MDs who show their work instead of being a magic 8-ball.

## LIME — Local Interpretable Model-agnostic Explanations

LIME explains individual predictions by approximating the model locally:

> **🎮 Analogy:** LIME is like asking a magician to explain ONE trick instead of revealing the entire magic book — it creates a simplified, local version of the model around your specific prediction, like explaining "the card vanished because of this sleeve mechanism" without spilling all the other secrets.

```python

```python
def lime_explanation():
    print("How LIME works:")
    print("1. Take a single prediction to explain")
    print("2. Generate perturbed samples around the input")
    print("3. Get model predictions on perturbed samples")
    print("4. Weight samples by proximity to the original input")
    print("5. Fit an interpretable surrogate model (linear, decision tree)")
    print("6. Return feature weights from the surrogate\n")

    sample = {
        "amount": 250.00,
        "distance_from_home": 5.2,
        "hour_of_day": 22,
        "previous_fraud": 1,
        "new_account": True,
    }

    lime_weights = [
        ("hour_of_day=22", 0.52),
        ("previous_fraud=1", 0.38),
        ("new_account=True", 0.31),
        ("distance_from_home=5.2", 0.15),
        ("amount=250", 0.08),
    ]

    print("LIME explanation for fraud prediction (probability=0.87):\n")
    for feat, weight in lime_weights:
        bar = "█" * int(abs(weight) * 20)
        print(f"  {feat:<30s} {bar} +{weight:.2f}")

    print(f"\n  {'prediction':<30s} {'→ fraud':>15s}")

lime_explanation()
```

**Output:**
```
LIME explanation for fraud prediction (probability=0.87):

  hour_of_day=22                 ██████████ +0.52
  previous_fraud=1               ███████    +0.38
  new_account=True               ██████     +0.31
  distance_from_home=5.2         ███        +0.15
  amount=250                     ██         +0.08

  prediction                              → fraud
```

## SHAP Values

SHAP provides game-theoretically optimal feature attributions:

> **🎮 Analogy:** SHAP values split the credit for a prediction like game theory dividing the loot in a heist movie — "the hacker got us in (25% contribution), the driver got us out (20%), and the safe cracker did the real work (55%)." Every feature gets its fair share of blame or praise, mathematically guaranteed.

```python

```python
def shap_explanation():
    print("SHAP key concepts:\n")
    print("  Base value: average prediction across the dataset")
    print("  SHAP value per feature: how much it shifts from the base")
    print("  Sum of SHAP values + base = prediction\n")

    base_value = 0.12  # average fraud probability
    contributions = {
        "hour_of_day=22": +0.35,
        "previous_fraud=1": +0.28,
        "new_account=True": +0.18,
        "distance_from_home": +0.08,
        "amount=250": -0.06,
        "normal_merchant": -0.08,
    }

    print("SHAP Waterfall Explanation:\n")
    print(f"  {'Base value':<30s} {'':>15s} {base_value:+.2f}")
    print(f"  {'───' * 15}")

    cumulative = base_value
    for feat, contrib in contributions.items():
        cumulative += contrib
        sign = "+" if contrib >= 0 else ""
        bar = "█" * int(abs(contrib) * 20)
        print(f"  {feat:<30s} {bar} {sign}{contrib:.2f}")

    print(f"  {'───' * 15}")
    print(f"  {'Prediction (fraud probability)':<30s} {'':>8s} {cumulative:.2f}")
    print(f"\n  SHAP values sum: {sum(contributions.values()):+.2f}")
    print(f"  Base + SHAP = {base_value} + ({sum(contributions.values()):+.2f}) = {cumulative:.2f}")

shap_explanation()
```

**Output:**
```
SHAP Waterfall Explanation:

  Base value                                          +0.12
  ─────────────────────────────────
  hour_of_day=22              ███████  +0.35
  previous_fraud=1            █████    +0.28
  new_account=True            ███      +0.18
  distance_from_home          ██       +0.08
  amount=250                           -0.06
  normal_merchant                      -0.08
  ─────────────────────────────────
  Prediction (fraud probability)                 0.87

  SHAP values sum: +0.75
  Base + SHAP = 0.12 + (+0.75) = 0.87
```

## Feature Importance

Global interpretability: which features matter most across all predictions:

> **🎮 Analogy:** Feature importance is the MVP voting for your model — "feature_3 carried the team with 42% of the work, while feature_4 barely showed up." Permutation importance fires a feature and sees if the model survives without it; if the model crumbles, that feature was the star player.

```python

```python
def global_feature_importance():
    print("Model-level importance methods:\n")

    print("1. Coefficient-based (linear models)")
    print("   - Coefficients are directly interpretable as feature weights\n")

    print("2. Tree-based importance (Random Forest, XGBoost)")
    print("   - Feature importance = total reduction in impurity")
    print("   - Available via model.feature_importances_\n")

    print("3. Permutation importance (model-agnostic)")
    print("   - Shuffle a feature and measure performance drop")
    print("   - Larger drop → more important feature\n")

    print("4. SHAP summary plot (global)")
    print("   - Aggregates SHAP values across all samples")
    print("   - Shows feature ranking + direction of impact\n")

    importances = [
        ("previous_fraud_count", 0.42),
        ("transaction_amount", 0.28),
        ("hour_of_day", 0.15),
        ("distance_from_home", 0.10),
        ("merchant_category", 0.05),
    ]

    print("Global Feature Importance (Normalized):\n")
    for feat, imp in importances:
        bar = "█" * int(imp * 30)
        print(f"  {feat:<25s} {bar} {imp:.0%}")

global_feature_importance()
```

**Output:**
```
Global Feature Importance (Normalized):

  previous_fraud_count          █████████████ 42%
  transaction_amount            ████████      28%
  hour_of_day                   ████          15%
  distance_from_home            ███           10%
  merchant_category             █             5%
```

## When Interpretability Matters

> **🎮 Analogy:** Interpretability needs scale like video game stakes — predicting which ad to show is like guessing the winning number in a carnival game (who cares), but diagnosing cancer is the final boss where one wrong move costs everything. The higher the stakes, the more you need to see under the hood, not just trust the high score.

```python
def interpretability_importance():
    scenarios = [
        ("Healthcare diagnosis", "Required by regulators; doctors need to trust the model"),
        ("Loan approval", "Fair lending laws require explanation for denial"),
        ("Fraud detection", "Analysts need to investigate flagged transactions"),
        ("Content recommendation", "Low stakes; accuracy matters more than explanation"),
        ("Ad click prediction", "Very low stakes; pure accuracy optimization"),
        ("Autonomous driving", "Critical; must understand failure modes"),
    ]

    print(f"{'Scenario':<30s} {'Interpretability Need'}")
    print("-" * 70)
    for scenario, need in scenarios:
        print(f"{scenario:<30s} {need}")
    print("\nRule of thumb: the higher the stakes, the more interpretability you need.")

interpretability_importance()
```

**Output:**
```
Scenario                      Interpretability Need
----------------------------------------------------------------------
Healthcare diagnosis          Required by regulators; doctors need to trust the model
Loan approval                 Fair lending laws require explanation for denial
Fraud detection               Analysts need to investigate flagged transactions
Content recommendation        Low stakes; accuracy matters more than explanation
Ad click prediction           Very low stakes; pure accuracy optimization
Autonomous driving            Critical; must understand failure modes

Rule of thumb: the higher the stakes, the more interpretability you need.
```

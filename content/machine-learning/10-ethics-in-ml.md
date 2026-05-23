---
title: Ethics in Machine Learning
skill: machine-learning
order: 10
quiz:
  - type: mc
    question: "What is a common source of bias in machine learning training data?"
    options:
      - "Using too many features"
      - "Historical data that reflects societal inequalities"
      - "Using a test set that is too small"
      - "Training for too many epochs"
    answer: 1
  - type: mc
    question: "What is model interpretability?"
    options:
      - "The ability to explain and understand how a model makes decisions"
      - "The ability to visualize model weights in a plot"
      - "The speed at which a model can make predictions"
      - "The number of parameters in a model"
    answer: 0
  - type: mc
    question: "LIME and SHAP are tools used for..."
    options:
      - "Hyperparameter tuning"
      - "Model interpretability and explainability"
      - "Data preprocessing"
      - "Model deployment"
    answer: 1
---

> **🎮 Analogy:** ML ethics is the "with great power" speech nobody wants to sit through — your model will learn every ugly bias your data contains, like a parrot that repeats your aunt's hot takes at Thanksgiving. Garbage in, gospel out, and suddenly your hiring AI thinks all programmers wear hoodies.

## Bias in Training Data

Models learn from data, and if that data contains historical biases, the model will amplify them:

> **🎮 Analogy:** Bias in training data is like learning to cook from a grandma who only makes casseroles — you'll swear every meal should have cream of mushroom soup in it. The model doesn't know the data is biased; it just thinks this is how the world works.

```python
def simulate_hiring_bias():
    historical_data = {
        "male_applicants": 1000,
        "female_applicants": 1000,
        "male_hired": 350,
        "female_hired": 150,
    }

    historical_rate = {
        "male": historical_data["male_hired"] / historical_data["male_applicants"],
        "female": historical_data["female_hired"] / historical_data["female_applicants"],
    }

    print("Historical hiring rates:")
    for group, rate in historical_rate.items():
        print(f"  {group}: {rate:.1%}")

    print("\nA model trained on this data would learn")
    print("to favor male applicants, perpetuating the bias.")
    print("\nMitigation: balance training data, remove protected")
    print("attributes, and audit model decisions for fairness.")

simulate_hiring_bias()
```

**Output:**
```
Historical hiring rates:
  male: 35.0%
  female: 15.0%

A model trained on this data would learn
to favor male applicants, perpetuating the bias.

Mitigation: balance training data, remove protected
attributes, and audit model decisions for fairness.
```

## Fairness Metrics

Different definitions of fairness:

> **🎮 Analogy:** Fairness metrics are like arguing about what "fair" means in Mario Kart — is it fair that everyone gets the same items (demographic parity), or that the last-place player gets the bullet bill (equal opportunity)? There's no right answer, just trade-offs and unintended consequences.

```python

```python
def fairness_metrics():
    metrics = {
        "Demographic Parity": "Prediction rates are equal across groups",
        "Equal Opportunity": "True positive rates are equal across groups",
        "Equalized Odds": "Both false positive and true positive rates are equal",
        "Individual Fairness": "Similar individuals receive similar predictions",
    }

    print("Fairness Definitions:\n")
    for name, description in metrics.items():
        print(f"  {name:<25s} {description}")
    print("\nNo single metric is universally correct.")
    print("Choose based on domain and impact.")

fairness_metrics()
```

**Output:**
```
Fairness Definitions:

  Demographic Parity        Prediction rates are equal across groups
  Equal Opportunity         True positive rates are equal across groups
  Equalized Odds            Both false positive and true positive rates are equal
  Individual Fairness       Similar individuals receive similar predictions

No single metric is universally correct.
Choose based on domain and impact.
```

## Model Interpretability with LIME and SHAP

Black-box models like deep neural networks are hard to trust. Explainability tools help:

> **🎮 Analogy:** LIME and SHAP are the "show your work" of ML — like a math teacher who won't accept just "42" as an answer, these tools demand to know why the model predicted "fraud." LIME sketches a simplified local model around your prediction, while SHAP calculates each feature's exact contribution like splitting a dinner bill game-theory-style.

```python

```python
def explain_prediction(model, sample, method="lime"):
    if method == "lime":
        print("LIME: Local Interpretable Model-agnostic Explanations")
        print("  Perturbs input → observes prediction changes")
        print("  Fits a simple surrogate model locally")
        print("  Returns feature importance for this prediction\n")

        importances = [
            ("feature_3", 0.42),
            ("feature_1", 0.31),
            ("feature_5", 0.18),
            ("feature_2", 0.07),
            ("feature_4", 0.02),
        ]
        print("  Top contributing features for this prediction:")
        for feat, imp in importances:
            bar = "█" * int(imp * 20)
            print(f"    {feat:<15s} {bar} {imp:.2f}")

    elif method == "shap":
        print("SHAP: SHapley Additive exPlanations")
        print("  Based on game theory (Shapley values)")
        print("  Shows how each feature shifts the prediction")
        print("  from the baseline (average prediction)\n")

        baseline = 0.50
        contributions = {
            "feature_3": +0.22,
            "feature_1": +0.15,
            "feature_5": -0.08,
            "feature_2": +0.03,
            "feature_4": +0.01,
        }
        final_pred = baseline + sum(contributions.values())
        print(f"  Base value: {baseline}")
        for feat, contrib in contributions.items():
            sign = "+" if contrib >= 0 else ""
            print(f"  {feat}: {sign}{contrib:.2f}")
        print(f"  Final prediction: {final_pred:.2f}")

explain_prediction("rf_model", "sample", "shap")
```

**Output:**
```
SHAP: SHapley Additive exPlanations
  Based on game theory (Shapley values)
  Shows how each feature shifts the prediction
  from the baseline (average prediction)

  Base value: 0.50
  feature_3: +0.22
  feature_1: +0.15
  feature_5: -0.08
  feature_2: +0.03
  feature_4: +0.01
  Final prediction: 0.83
```

## Responsible AI Principles

> **🎮 Analogy:** Responsible AI principles are the Geneva Convention for machine learning — just because you *can* build a model that predicts everything doesn't mean you *should*. Fairness, accountability, and transparency are the rules of engagement that keep your AI from becoming a villain in a sci-fi movie.

1. **Fairness**: Ensure model outcomes don't discriminate
2. **Accountability**: Know who is responsible for model decisions
3. **Transparency**: Document data sources, limitations, and intended use
4. **Privacy**: Protect training data, avoid leaking sensitive information
5. **Robustness**: Model should perform reliably under distribution shift
6. **Human oversight**: Critical decisions should involve human review
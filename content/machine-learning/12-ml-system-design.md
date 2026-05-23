---
title: ML System Design
skill: machine-learning
order: 12
quiz:
  - type: mc
    question: "What is a key difference between batch and real-time inference?"
    options:
      - "Batch inference has higher latency requirements than real-time"
      - "Batch inference processes data in bulk on a schedule; real-time serves individual requests on demand"
      - "Batch inference uses Python; real-time uses SQL"
      - "There is no practical difference"
    answer: 1
  - type: mc
    question: "Which pipeline ensures features are consistently computed for both training and serving?"
    options:
      - "The deployment pipeline"
      - "The feature pipeline with point-in-time correctness"
      - "The monitoring pipeline"
      - "The hyperparameter tuning pipeline"
    answer: 1
  - type: mc
    question: "What is a trade-off of real-time inference over batch inference?"
    options:
      - "Lower cost but higher latency"
      - "Lower latency but higher infrastructure cost and complexity"
      - "Better accuracy but worse scalability"
      - "Easier to monitor but harder to train"
    answer: 1
---

> **🎮 Analogy:** Training vs. serving is the difference between building a car in a factory with all the time in the world vs. being a pit crew at a Formula 1 race — training can afford to be slow and careful, but serving better change those tires in under 2 seconds or you're out.

## Training vs Serving Infrastructure

Training and serving have fundamentally different infrastructure requirements:

> **🎮 Analogy:** Training is like binge-cooking for a week — you need the biggest pots, all the counter space, and can afford to take hours. Serving is like being a short-order cook during lunch rush — every plate needs to go out in 2 minutes, and the grill better be hot before the customer even orders.

```python

```python
def compare_infrastructure():
    print(f"{'Aspect':<25s} {'Training':<40s} {'Serving'}")
    print("-" * 90)
    rows = [
        ("Hardware", "GPUs/TPUs, high-memory CPU", "CPUs, sometimes GPUs for DL"),
        ("Duration", "Minutes to days", "Milliseconds to seconds"),
        ("Data", "Full historical dataset", "Single request features"),
        ("Throughput", "Low (one job at a time)", "High (thousands of QPS)"),
        ("Fault tolerance", "Checkpoints, retries", "Redundancy, auto-scaling"),
        ("Cost model", "Spot instances, preemptible", "Reserved, always-on"),
    ]
    for aspect, train, serve in rows:
        print(f"{aspect:<25s} {train:<40s} {serve}")
    print("\nTraining optimizes for throughput; serving optimizes for latency.")

compare_infrastructure()
```

**Output:**
```
Aspect                    Training                                 Serving
------------------------------------------------------------------------------------------
Hardware                  GPUs/TPUs, high-memory CPU               CPUs, sometimes GPUs for DL
Duration                  Minutes to days                          Milliseconds to seconds
Data                      Full historical dataset                  Single request features
Throughput                Low (one job at a time)                  High (thousands of QPS)
Fault tolerance           Checkpoints, retries                     Redundancy, auto-scaling
Cost model                Spot instances, preemptible              Reserved, always-on

Training optimizes for throughput; serving optimizes for latency.
```

## Batch vs Real-Time Inference

> **🎮 Analogy:** Batch inference is baking a week's worth of cookies on Sunday (cheap, efficient, done all at once). Real-time inference is running a lemonade stand — every single customer order triggers a fresh squeeze, which is faster service but way more work per glass. One is for meal-preppers, the other for restaurateurs.

```python
def batch_vs_realtime():
    print("Batch Inference:")
    print("  - Processes all requests on a schedule (hourly, daily)")
    print("  - Cost-effective for non-urgent decisions")
    print("  - Example: nightly recommendation email generation\n")

    print("Real-Time Inference:")
    print("  - Responds to each request individually (< 100ms)")
    print("  - Requires online feature store and model server")
    print("  - Example: fraud detection on credit card swipes\n")

    print("Hybrid Pattern:")
    print("  - Precompute batch scores, cache for fast lookup")
    print("  - Real-time fallback for cache misses")
    print("  - Best of both worlds for many production systems")

batch_vs_realtime()
```

## Feature, Training, and Serving Pipelines

Three distinct pipelines in any ML system:

> **🎮 Analogy:** These three pipelines are the farm-to-table journey of ML predictions — the feature pipeline grows and harvests the ingredients (raw data), the training pipeline cooks the recipe (builds the model), and the serving pipeline plates and delivers the dish (serves predictions). A restaurant that grows its own food, cooks it, and serves it fresh to your table.

```python

```python
def ml_pipelines():
    pipelines = {
        "Feature Pipeline": {
            "input": "Raw data (events, logs, DB snapshots)",
            "process": "Transform → validate → store in feature store",
            "output": "Cleaned features (offline + online)",
            "trigger": "Scheduled batch or streaming",
        },
        "Training Pipeline": {
            "input": "Historical features + labels",
            "process": "Split → train → validate → register model",
            "output": "Model artifact + metrics",
            "trigger": "On-demand or schedule",
        },
        "Serving Pipeline": {
            "input": "Live features + request",
            "process": "Fetch features → predict → return",
            "output": "Prediction + confidence",
            "trigger": "API call",
        },
    }

    for name, stages in pipelines.items():
        print(f"{name}:")
        for key, val in stages.items():
            print(f"  {key:<10s} {val}")
        print()

ml_pipelines()
```

**Output:**
```
Feature Pipeline:
  input      Raw data (events, logs, DB snapshots)
  process    Transform → validate → store in feature store
  output     Cleaned features (offline + online)
  trigger    Scheduled batch or streaming

Training Pipeline:
  input      Historical features + labels
  process    Split → train → validate → register model
  output     Model artifact + metrics
  trigger    On-demand or schedule

Serving Pipeline:
  input      Live features + request
  process    Fetch features → predict → return
  output     Prediction + confidence
  trigger    API call
```

## Trade-offs: Latency, Cost, Accuracy

> **🎮 Analogy:** Latency, cost, and accuracy are the "good, fast, cheap — pick two" triangle of ML. A real-time fraud model with 99.9% accuracy running on 50 GPUs is a Ferrari — amazing but expensive. A daily batch model running on spot instances is a reliable station wagon. Pick your vehicle based on the road, not the dream car.

```python
def tradeoff_analysis():
    scenarios = [
        {
            "name": "Real-time fraud detection",
            "latency": "Critical (< 50ms)",
            "cost": "High (always-on GPUs, online store)",
            "accuracy": "Must be high (false positives cost money)",
        },
        {
            "name": "Batch churn prediction",
            "latency": "Not critical (daily)",
            "cost": "Low (spot instances)",
            "accuracy": "Moderate acceptable (marketing campaign)",
        },
        {
            "name": "Real-time recommendation",
            "latency": "Important (< 200ms)",
            "cost": "Medium (precomputed + cache)",
            "accuracy": "High (directly impacts revenue)",
        },
    ]

    print(f"{'Scenario':<35s} {'Latency':<25s} {'Cost':<25s} {'Accuracy'}")
    print("-" * 110)
    for s in scenarios:
        print(f"{s['name']:<35s} {s['latency']:<25s} {s['cost']:<25s} {s['accuracy']}")
    print("\nAlways optimize for the business constraint, not the ML metric.")

tradeoff_analysis()
```

**Output:**
```
Scenario                           Latency                  Cost                     Accuracy
--------------------------------------------------------------------------------------------------------------
Real-time fraud detection          Critical (< 50ms)        High (always-on GPUs)    Must be high
Batch churn prediction             Not critical (daily)     Low (spot instances)     Moderate acceptable
Real-time recommendation           Important (< 200ms)      Medium (precomputed)     High (directly impacts revenue)

Always optimize for the business constraint, not the ML metric.
```

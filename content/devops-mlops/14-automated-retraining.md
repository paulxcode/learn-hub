---
title: Automated Retraining
skill: devops-mlops
order: 14
quiz:
  - type: mc
    question: "What is the difference between scheduled and event-driven retraining?"
    options:
      - "Scheduled runs on a fixed timer; event-driven triggers on drift detection or data arrival"
      - "Scheduled is faster; event-driven is slower"
      - "Scheduled uses CPU; event-driven uses GPU"
      - "There is no difference"
    answer: 0
  - type: mc
    question: "Why is data freshness important for retraining?"
    options:
      - "Fresh data always produces better models"
      - "Stale data can cause the model to learn outdated patterns, degrading performance in production"
      - "Data freshness reduces compute costs"
      - "Fresh data is required by Kubernetes"
    answer: 1
  - type: mc
    question: "What is a cost-performance trade-off in automated retraining?"
    options:
      - "Better models cost less to train"
      - "More frequent retraining improves model freshness but increases compute and infrastructure costs"
      - "Training on less data always saves money"
      - "Cloud GPUs are free for retraining"
    answer: 1
---

> **🎮 Analogy:** Automated retraining is like having a personal trainer who forces you to the gym on a schedule — it's painful and expensive, but skipping sessions only makes your model gains atrophy until you can't even lift the baseline anymore.

## Scheduled vs Event-Driven Retraining

**Scheduled retraining** runs on a fixed cadence (daily, weekly):

```yaml
# Airflow DAG for weekly retraining
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

with DAG(
    "weekly_retrain",
    schedule_interval="0 2 * * 0",  # 2 AM Sunday
    start_date=datetime(2026, 1, 1),
    catchup=False,
) as dag:
    ingest_data = PythonOperator(task_id="ingest", ...)
    train_model = PythonOperator(task_id="train", ...)
    evaluate = PythonOperator(task_id="evaluate", ...)
    deploy = PythonOperator(task_id="deploy_if_better", ...)

    ingest_data >> train_model >> evaluate >> deploy
```

**Event-driven retraining** triggers on specific conditions: drift detection, new data arrival, or a manual signal:

```python
# Event-driven retraining trigger
def check_and_retrain():
    drift_p_values = check_all_features_for_drift()

    if any(p < 0.05 for p in drift_p_values.values()):
        print("Drift detected. Triggering retraining pipeline.")
        trigger_pipeline("retrain_churn_model")
    elif new_data_available():
        print("New training data available. Triggering retraining.")
        trigger_pipeline("retrain_churn_model")
    else:
        print("No drift detected. Model is still valid.")
```

In practice, many teams use a hybrid: scheduled retraining as a fallback, event-driven for urgent responses to drift.

> **🎮 Analogy:** Scheduled retraining is your daily dungeon grind — you run it every day at reset whether you need loot or not. Event-driven retraining is switching to PvP gear only when the battleground queue pops — reactive, efficient, situation-triggered.

## Retraining Pipeline Design

A retraining pipeline should be idempotent — running it multiple times with the same inputs produces the same model:

```python
def retrain_pipeline(data_path: str, model_name: str):
    """Idempotent retraining pipeline step."""
    with mlflow.start_run() as run:
        # 1. Load data
        data = load_data(data_path)

        # 2. Feature engineering
        features = engineer_features(data)

        # 3. Train/validation split
        X_train, X_val, y_train, y_val = train_test_split(
            features, data["target"], test_size=0.2
        )

        # 4. Train
        model = train_model(X_train, y_train)

        # 5. Evaluate
        metrics = evaluate_model(model, X_val, y_val)

        # 6. Compare with production
        production_metrics = get_production_model_metrics(model_name)

        if metrics["f1"] > production_metrics["f1"]:
            mlflow.register_model(
                f"runs:/{run.info.run_id}/model",
                model_name
            )
            promote_to_production(model_name)
            return "Deployed"
        else:
            return "Skipped (no improvement)"
```

> **🎮 Analogy:** An idempotent retraining pipeline is the "don't craft if you already have it" addon — running the same recipe with the same materials should give the same result. If it doesn't, your crafting rotation (pipeline) has a bug.

## Data Freshness Requirements

Define freshness SLAs per use case:

| Use Case | Freshness Requirement | Retraining Cadence |
|----------|----------------------|-------------------|
| Fraud detection | < 1 hour | Event-driven |
| Recommendation system | < 1 day | Daily |
| Churn prediction | < 1 week | Weekly |
| Long-term forecasting | < 1 month | Monthly |

Stale training data degrades model performance. Monitor the gap between prediction timestamps and training data timestamps:

```python
def check_data_freshness(data_timestamp, max_age_hours=24):
    age = datetime.now() - data_timestamp
    if age > timedelta(hours=max_age_hours):
        alert(f"Training data is {age} old — exceeds SLA of {max_age_hours}h")
```

> **🎮 Analogy:** Data freshness is the "best before" date on a Skyrim potion — your churn model trained on last month's data is a "Potion of Minor Healing" (still works), but yesterday's data is "Ultimate Healing" (way more effective for the current fight).

## Cost-Performance Trade-offs

Frequent retraining improves model freshness but costs more:

- **Compute cost**: GPU/CPU time for training
- **Pipeline cost**: data processing, feature computation
- **Validation cost**: evaluation and testing
- **Deployment cost**: model serving infrastructure updates

Optimization strategies:

- Only retrain when needed (drift-based triggers)
- Train on incremental data instead of full historical data
- Use cheaper hyperparameter configurations for routine retraining
- Run full retraining on a less frequent schedule (weekly), with quick incremental updates between

```python
# Incremental training with warm-start
def incremental_retrain(previous_model_path, new_data_path):
    previous_model = joblib.load(previous_model_path)
    new_data = load_data(new_data_path)

    # Warm-start: continue training from previous weights
    previous_model.fit(
        new_data["features"],
        new_data["target"],
        xgb_model=previous_model  # XGBoost warm-start
    )
    return previous_model
```

Incremental retraining is cheaper than full retraining but may not capture fundamental distribution shifts. Use it as a fast pre-filter — if the incremental model degrades, trigger a full retrain.

> **🎮 Analogy:** The cost-performance trade-off is the graphics settings menu — Ultra (full retrain daily) looks gorgeous (best accuracy) but your GPU bill is crying. Low settings (incremental) saves FPS (cost) but misses ray-traced shadows (nuanced patterns). Find your Medium preset.

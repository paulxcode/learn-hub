---
title: Model Versioning and Registry
skill: devops-mlops
order: 12
quiz:
  - type: mc
    question: "Why is model versioning important in production ML?"
    options:
      - "It makes models train faster"
      - "It enables reproducibility, rollback, auditing, and comparison across experiments"
      - "It reduces model file size"
      - "It is required by Kubernetes"
    answer: 1
  - type: mc
    question: "What is the purpose of model staging in a model registry?"
    options:
      - "To run models on staging servers only"
      - "To track the lifecycle stage (Staging, Production, Archived) of each model version"
      - "To store models in a staging database"
      - "To compress model files for storage"
    answer: 1
  - type: mc
    question: "What does model lineage track?"
    options:
      - "Only the model accuracy over time"
      - "The full provenance: which data, code, parameters, and pipeline produced a given model version"
      - "The deployment history of each model"
      - "The number of times a model has been downloaded"
    answer: 1
---

> **🎮 Analogy:** A model registry is your weapon rack in an armory — v1 is the rusty starter sword, v2 is the enchanted blade, and v3 (Archived) is that weird spear you tried once and never touched again.

## Model Versioning Strategies

Every model artifact should have a unique, immutable version identifier. Common strategies:

- **Sequential integer** (v1, v2, v3) — simple, human-friendly
- **Git commit hash** — ties model to code version
- **Semantic versioning** (1.2.3) — communicates change magnitude
- **Timestamp-based** (20260522_1430) — sorts chronologically

```python
# Versioning with git commit + timestamp
import subprocess
from datetime import datetime

def generate_model_version() -> str:
    commit = subprocess.run(
        ["git", "rev-parse", "--short", "HEAD"],
        capture_output=True, text=True
    ).stdout.strip()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    return f"{timestamp}_{commit}"
```

Store the version as a model metadata field:

```python
model_metadata = {
    "version": "20260522_1430_a1b2c3d",
    "model_type": "xgboost",
    "params": {"n_estimators": 200, "max_depth": 6},
    "metrics": {"accuracy": 0.89, "f1": 0.87},
    "training_data": "s3://data/train_2026-05-01.parquet",
    "git_commit": "a1b2c3d",
    "pipeline_run_id": "mlflow_run_abc123",
}
```

> **🎮 Analogy:** Model versioning strategies are save file naming conventions — sequential integers are the quick-save slots, timestamps are auto-saves, and git commit hashes are the "47 saves named 'final' and none of them are actually final" approach.

## MLflow Model Registry

MLflow's registry provides a centralized catalog of model versions with lifecycle stages:

```python
import mlflow
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Register a new model version
result = mlflow.register_model(
    model_uri="runs:/abc123/model",
    name="ChurnClassifier"
)

# List all versions
versions = client.get_latest_versions("ChurnClassifier")
for v in versions:
    print(f"v{v.version}: stage={v.current_stage}, "
          f"run_id={v.run_id}")

# Transition to Production
client.transition_model_version_stage(
    name="ChurnClassifier",
    version=3,
    stage="Production"
)

# Archive old models
client.transition_model_version_stage(
    name="ChurnClassifier",
    version=1,
    stage="Archived"
)
```

> **🎮 Analogy:** MLflow's registry is the Load Game screen — you see all your saves (model versions) with timestamps and stats, and an "active" tag showing which one is currently loaded (Production). Archive is the "I'll finish this campaign someday" folder.

## Staging vs Production Models

Maintain at least two non-production stages:

- **Staging**: validated but not serving live traffic. Used for integration testing and canary evaluation.
- **Production**: serving live traffic. Only promote after staging validation passes.
- **Archived**: retired versions kept for audit and reproducibility.

```bash
# Promoting through stages via CLI
mlflow models --model-uri "models:/ChurnClassifier/2" --stage Staging
# ... run validation tests ...
mlflow models --model-uri "models:/ChurnClassifier/2" --stage Production
```

> **🎮 Analogy:** Staging is your MMO test server — you try the new raid boss (model) without risking your main character's gear. Production is the live server where real players (traffic) are affected — only push changes that passed the Staging gauntlet.

## Model Lineage and Provenance

Lineage connects a model to its inputs: training data (versioned dataset), source code (git commit), hyperparameters, pipeline configuration, and evaluation metrics. This enables debugging regressions and meeting compliance requirements.

```python
# Log lineage with MLflow
with mlflow.start_run():
    # Log the dataset version
    mlflow.log_param("data_version", "s3://data/v20260501")
    mlflow.log_param("git_sha", "a1b2c3d")

    # Log source code
    mlflow.log_artifact("src/")

    # Train and log model
    model.fit(X_train, y_train)
    mlflow.sklearn.log_model(model, "model")

    # The run now has full lineage information
    # accessible via MLflow UI and API
```

Lineage answers: "What produced this model, and can we reproduce it?" without guesswork.

> **🎮 Analogy:** Model lineage is grandma's recipe — not just the ingredient list (model file), but the exact steps (pipeline), oven temperature (hyperparameters), and baking time (data version), so you can bake the exact same cake five years later even with a new kitchen.

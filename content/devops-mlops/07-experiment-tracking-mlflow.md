---
title: Experiment Tracking with MLflow
skill: devops-mlops
order: 7
quiz:
  - type: mc
    question: "What does MLflow Tracking log?"
    options:
      - "Only model accuracy"
      - "Parameters, metrics, artifacts, and source code for each run"
      - "Only the final model file"
      - "Docker container logs"
    answer: 1
  - type: mc
    question: "What is the MLflow Model Registry used for?"
    options:
      - "Storing training datasets"
      - "Managing model versions, stages (Staging, Production, Archived), and annotations"
      - "Visualizing training metrics"
      - "Deploying models to Kubernetes"
    answer: 1
  - type: mc
    question: "How do you compare multiple MLflow runs?"
    options:
      - "By reading individual log files"
      - "Using the MLflow UI's compare feature to select runs and view side-by-side metrics"
      - "By re-running each experiment"
      - "By exporting runs to a CSV file"
    answer: 1
---

> **🎮 Analogy:** MLflow is your quest log — every experiment is a side quest, the model registry is your inventory, and the "compare runs" feature is the "show all completed quests" button you never knew you needed.

## MLflow Tracking Deep Dive

MLflow Tracking records parameters, metrics, and artifacts for every experiment run:

```python
import mlflow

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("churn-prediction")

with mlflow.start_run(run_name="rf_v2"):
    # Log parameters
    mlflow.log_param("model_type", "random_forest")
    mlflow.log_param("n_estimators", 200)
    mlflow.log_param("max_depth", 10)

    # Train model
    model = RandomForestClassifier(
        n_estimators=200, max_depth=10
    )
    model.fit(X_train, y_train)

    # Log metrics
    accuracy = model.score(X_test, y_test)
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("f1_score", f1)

    # Log model and other artifacts
    mlflow.sklearn.log_model(model, "model")
    mlflow.log_artifact("confusion_matrix.png")
    mlflow.log_artifact("feature_importance.csv")

    # Log the dataset
    mlflow.log_input(
        mlflow.data.from_pandas(X_train), "training_data"
    )
```

> **🎮 Analogy:** MLflow Tracking is the achievement log for your experiments — every run is recorded with its build (hyperparameters), performance metrics (damage dealt), and drops (artifacts), so you can actually remember which build beat the final boss.

## Logging Parameters, Metrics, Artifacts

- **Parameters**: model hyperparameters, data paths, config values (strings/numbers)
- **Metrics**: accuracy, F1, RMSE, latency (numeric, can be plotted over time)
- **Artifacts**: model files, plots, CSV reports, any file (stored in artifact store)

```bash
# Start the MLflow tracking server
mlflow server \
  --backend-store-uri sqlite:///mlflow.db \
  --default-artifact-root ./mlruns \
  --host 0.0.0.0 --port 5000
```

> **🎮 Analogy:** Parameters are your character build stats (strength, agility, intelligence). Metrics are the combat results (DPS, crit rate). Artifacts are the loot you picked up — model files, confusion matrices, and that one CSV you swear you'll need later.

## Model Registry

The Model Registry manages model versions across their lifecycle:

```python
# Register a model
result = mlflow.register_model(
    model_uri=f"runs:/{run_id}/model",
    name="ChurnClassifier"
)

# Transition to staging
client = mlflow.tracking.MlflowClient()
client.transition_model_version_stage(
    name="ChurnClassifier",
    version=result.version,
    stage="Staging"
)

# Later, promote to production
client.transition_model_version_stage(
    name="ChurnClassifier",
    version=result.version,
    stage="Production"
)
```

Stages: `None` → `Staging` → `Production` | `Archived`. Each stage can have descriptions and approval annotations.

> **🎮 Analogy:** The Model Registry is your guild bank's item tabs — Staging is "needs approval," Production is "raid-ready gear," and Archived is the "we'll need this next expansion" tab that nobody has opened in six months.

## Comparing Runs

The MLflow UI (at `http://localhost:5000`) lets you select multiple runs and:

- View parameters and metrics side-by-side in a table
- Plot parallel coordinates, scatter plots, and contour plots
- Compare learning curves across runs
- Filter runs by parameter values or metric ranges

> **🎮 Analogy:** Comparing MLflow runs is the Gear Compare feature in an RPG — side-by-side stats on two helmets (+5 crit vs +10 stamina) with color-coded differences, so you confidently equip the right model before the next raid (production deployment).

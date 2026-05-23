---
title: ML Pipeline Automation
skill: devops-mlops
order: 5
quiz:
  - type: mc
    question: "What is the main benefit of automated ML pipelines?"
    options:
      - "They eliminate the need for data scientists"
      - "They ensure reproducibility, reduce manual errors, and enable continuous retraining"
      - "They always produce the best performing model"
      - "They remove the need for feature engineering"
    answer: 1
  - type: mc
    question: "Which tool is specifically designed for ML pipelines on Kubernetes?"
    options:
      - "Apache Airflow"
      - "Kubeflow"
      - "Docker Compose"
      - "GitHub Actions"
    answer: 1
  - type: mc
    question: "Why is reproducibility important in ML pipelines?"
    options:
      - "It makes models run faster"
      - "It allows data scientists to exactly recreate results, debug issues, and audit model behavior"
      - "It reduces the cost of cloud compute"
      - "It eliminates the need for monitoring"
    answer: 1
---

> **🎮 Analogy:** An automated ML pipeline is like setting up a Factorio factory — you spend hours designing conveyor belts of data, but once it's running, you just watch the numbers go up and occasionally fight off biters (data drift).

## End-to-End ML Pipelines

An ML pipeline automates the full lifecycle: data ingestion → feature engineering → training → evaluation → deployment. Each stage produces artifacts consumed by the next.

```
Data Sources → Feature Engineering → Training → Evaluation → Deployment
                     ↓                    ↓           ↓
               Feature Store         Model Artifact   Metrics
```

> **🎮 Analogy:** An end-to-end ML pipeline is the speedrun route for a complex game — every segment is optimized, the inputs and outputs are known, and if you nail the split, you get a world record (production model) instead of resetting at every loading screen.

## Pipeline Stages

**Feature engineering** transforms raw data into model-ready features:

```python
# Feature engineering step
def engineer_features(raw_df: pd.DataFrame) -> pd.DataFrame:
    df = raw_df.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["rolling_avg_7d"] = (
        df.groupby("user_id")["value"]
        .transform(lambda x: x.rolling(7).mean())
    )
    return df
```

**Training** uses the features to fit a model and logs artifacts:

```python
import mlflow

with mlflow.start_run():
    mlflow.log_param("model_type", "random_forest")
    mlflow.log_param("n_estimators", 100)

    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)
    mlflow.log_metric("accuracy", accuracy)
    mlflow.sklearn.log_model(model, "model")
```

> **🎮 Analogy:** The training stage is the crafting bench in an RPG — feed it raw materials (features) and a recipe (hyperparameters), and after enough CPU cycles, a shiny new model pops out with hopefully good stats.

**Evaluation** compares against a baseline and gates promotion:

```python
if accuracy > baseline_accuracy:
    mlflow.register_model(
        f"runs:/{run_id}/model", "churn_classifier"
    )
else:
    raise ValueError("Model below baseline")
```

> **🎮 Analogy:** The evaluation gate is the "is the boss dead?" check after a DPS rotation — if the health bar (accuracy) isn't below the threshold, you don't collect the loot (register the model). Back to grinding more data.

## Pipeline Tools

**Kubeflow** orchestrates ML workflows on Kubernetes with reusable components and a central dashboard.

**TFX (TensorFlow Extended)** provides production-ready components for each pipeline stage with data validation and model analysis built in.

**Vertex AI Pipelines** is GCP's managed pipeline service with pre-built components.

**Apache Airflow** is a general-purpose orchestrator often used for data and ML pipelines:

```python
from airflow import DAG
from airflow.operators.python import PythonOperator

with DAG("ml_pipeline", schedule_interval="@daily") as dag:
    ingest = PythonOperator(task_id="ingest", python_callable=ingest_data)
    features = PythonOperator(task_id="features", python_callable=engineer_features)
    train = PythonOperator(task_id="train", python_callable=train_model)

    ingest >> features >> train
```

## Reproducibility and Versioning

Pin every dependency: Python packages (requirements.txt), base images (Dockerfile), data snapshots, and feature logic. Use MLflow or DVC to track data and model versions. A reproducible pipeline lets you rerun any past experiment exactly.

> **🎮 Analogy:** Pinning dependencies in a pipeline is saving your modded Skyrim setup as a modlist.txt — without it, loading your save a year later means figuring out which 147 mods and their exact versions you need to not crash on startup.

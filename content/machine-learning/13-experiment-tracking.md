---
title: Experiment Tracking
skill: machine-learning
order: 13
quiz:
  - type: mc
    question: "What is the primary purpose of MLflow Tracking?"
    options:
      - "To deploy models to production"
      - "To log parameters, metrics, and artifacts for ML experiments"
      - "To visualize neural network architectures"
      - "To schedule training jobs"
    answer: 1
  - type: mc
    question: "Why is experiment reproducibility important?"
    options:
      - "It allows other team members to verify and build on your results"
      - "It makes models run faster"
      - "It reduces the amount of training data needed"
      - "It automatically improves accuracy"
    answer: 0
  - type: mc
    question: "How do you compare two MLflow experiments side by side?"
    options:
      - "By reading the logs in the terminal"
      - "By using the MLflow UI which allows comparing runs by metrics, params, and artifacts"
      - "By manually writing comparison scripts"
      - "By exporting to Excel"
    answer: 1
---

> **🎮 Analogy:** Experiment tracking is the save file you wish every video game had — "oh, this build oneshots the final boss? Let me save that." MLflow is your quicksave slot for models, so you never have to fight Ganon again with the wrong sword.

## MLflow Tracking

MLflow Tracking logs every experiment detail so you can compare and reproduce later:

> **🎮 Analogy:** MLflow Tracking is the lab notebook you swore you'd keep in chemistry class but actually do — every parameter, metric, and artifact logged so when your model from last Tuesday somehow got 94% accuracy, you can actually reproduce it instead of staring at the code wondering "what did I change?!"

```python

```python
import mlflow

def train_with_tracking():
    mlflow.set_experiment("fraud-detection-v2")

    with mlflow.start_run(run_name="xgboost-v1"):
        # Log parameters
        params = {
            "max_depth": 6,
            "learning_rate": 0.1,
            "n_estimators": 200,
            "subsample": 0.8,
        }
        mlflow.log_params(params)

        # Simulate training
        metrics = {
            "accuracy": 0.942,
            "precision": 0.938,
            "recall": 0.915,
            "f1": 0.926,
            "auc_roc": 0.971,
        }
        mlflow.log_metrics(metrics)

        # Log model artifact
        mlflow.sklearn.log_model(
            sk_model="model_object",
            artifact_path="model",
            registered_model_name="fraud_xgboost",
        )

        # Log additional artifacts
        with open("feature_importance.png", "w") as f:
            f.write("(feature importance plot)")
        mlflow.log_artifact("feature_importance.png")

        print(f"Run ID: {mlflow.active_run().info.run_id}")

train_with_tracking()
```

**Output:**
```
Run ID: 3a4b5c6d7e8f9a0b1c2d3e4f
```

## Experiment Organization

Structure experiments logically for team collaboration:

> **🎮 Analogy:** Organizing experiments is like naming your video game save files — "save_1" is useless, but "elden_ring_before_malenia_str_ build" tells you exactly what's inside. "fraud-detection-xgboost-v1-baseline" beats "untitled_model_final_v2_real_final.ipynb" every time.

```python

```python
def experiment_organization():
    print("Recommended Experiment Hierarchy:")
    print("  Experiment: <problem-name>-<model-family>")
    print("  e.g., fraud-detection-xgboost\n")

    print("  Runs within an experiment track variations:")
    print("    v1-baseline:     default params, no feature engineering")
    print("    v2-feature-eng:  + 5 new features")
    print("    v3-hyperopt:     Bayesian tuning")
    print("    v4-ensemble:     Stacking with logistic regression\n")

    print("  Tags for filtering:")
    print("    mlflow.set_tag('stage', 'baseline')")
    print("    mlflow.set_tag('data_version', '2024-03-01')")
    print("    mlflow.set_tag('team_member', 'alice')\n")

    print("Best practice: one experiment per problem family,")
    print("one run per hyperparameter/feature config.")

experiment_organization()
```

## Reproducibility

Lock the environment so anyone can re-run:

> **🎮 Analogy:** Reproducibility is the difference between a cooking recipe that says "add flour until it feels right" and one that says "250g all-purpose flour, sifted." Without locking your environment (git hash, requirements.txt, random seed), your model is a guessing game — "it worked on my machine" becomes the team motto.

```python

```python
def ensure_reproducibility():
    print("1. Code versioning:")
    print("   - Git commit hash (mlflow.log_param('commit', hash))")
    print("   - Branch name\n")

    print("2. Environment:")
    print("   mlflow.log_artifact('requirements.txt')")
    print("   - Or use conda_env parameter")
    print("   mlflow.sklearn.log_model(model, 'model',")
    print("       conda_env='conda.yaml')\n")

    print("3. Data versioning:")
    print("   - Log dataset hash or DVC version")
    print("   mlflow.log_param('data_hash', 'sha256:abc...')\n")

    print("4. Random seeds:")
    print("   mlflow.log_param('random_state', 42)")
    print("   - Ensures identical splits and weight init\n")

    print("Without these, 'it worked on my machine' is inevitable.")

ensure_reproducibility()
```

## Comparing Experiments

The MLflow UI provides structured comparison:

> **🎮 Analogy:** The MLflow comparison UI is the Carousel of Progress for models — you line up v1 through v5 side by side and watch which parameters changed, which metrics improved, and which experiments were dead ends. It's like a git diff for your models, minus the merge conflicts.

```python

```python
def compare_runs():
    print("# Terminal: launch UI")
    print("mlflow ui --port 5000\n")

    print("# In the UI you can:")
    print("  - Select 2+ runs and click 'Compare'")
    print("  - See side-by-side parameters and metrics")
    print("  - View diff of logged artifacts")
    print("  - Download any run's model\n")

    print("# Programmatic comparison:")
    print("from mlflow.tracking import MlflowClient\n")
    print("client = MlflowClient()")
    print("runs = client.search_runs(")
    print("    experiment_ids=['1'],")
    print("    order_by=['metrics.f1 DESC'],")
    print("    max_results=5")
    print(")")
    print("for run in runs:")
    print("    print(run.data.metrics)")

compare_runs()
```

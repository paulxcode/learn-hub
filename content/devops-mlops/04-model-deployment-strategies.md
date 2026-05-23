---
title: Model Deployment Strategies
skill: devops-mlops
order: 4
quiz:
  - type: mc
    question: "When is batch inference preferred over real-time API?"
    options:
      - "When predictions are needed immediately in response to user actions"
      - "When large volumes of data need predictions on a schedule with no latency requirements"
      - "When the model is deployed on mobile devices"
      - "When you need interactive model experimentation"
    answer: 1
  - type: mc
    question: "What is a canary deployment?"
    options:
      - "Deploying to all users at once"
      - "Routing a small percentage of traffic to a new model version while serving the rest from the old version"
      - "Deploying only during non-business hours"
      - "A deployment method specific to Kubernetes only"
    answer: 1
  - type: mc
    question: "What is the primary purpose of model serving tools like TensorFlow Serving?"
    options:
      - "To train models faster"
      - "To provide a standardized, scalable interface for model inference with versioning and batching"
      - "To visualize model training metrics"
      - "To convert models between frameworks"
    answer: 1
---

> **🎮 Analogy:** Deploying a new model with a canary release is like releasing a game patch to 5% of players first — better a few rage reports than a global server meltdown for everyone.

## Batch Inference vs Real-Time API

**Batch inference** processes large datasets on a schedule (hourly, daily). Predictions are written to a store and consumed later. Ideal for recommendations, reporting, and offline scoring.

```python
# Batch inference script
import pandas as pd
import joblib

model = joblib.load("model.pkl")
data = pd.read_parquet("input_data.parquet")
predictions = model.predict(data)
data["prediction"] = predictions
data.to_parquet("predictions.parquet")
```

> **🎮 Analogy:** Loading a model with `joblib.load()` is like inserting a game cartridge into a console — all the trained knowledge is right there ready to run. Writing predictions to Parquet is like saving a replay file: the game's over, but the results are stored for later analysis.

**Real-time inference** serves predictions via a REST API with millisecond latency requirements. Every request gets an immediate prediction.

```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
model = joblib.load("model.pkl")

class Features(BaseModel):
    feature_1: float
    feature_2: float

@app.post("/predict")
async def predict(features: Features):
    x = np.array([[features.feature_1, features.feature_2]])
    pred = model.predict(x)
    return {"prediction": pred.tolist()}
```

> **🎮 Analogy:** FastAPI's `@app.post("/predict")` decorator is like binding a spell to a hotkey — when a request hits that endpoint, the model casts its prediction instantly and returns the result. The `pydantic` schema is the spell description that says exactly what ingredients (inputs) the spell needs and what it produces (output).

## REST API Deployment

**FastAPI** is the preferred framework for ML APIs — automatic OpenAPI docs, async support, and Pydantic validation.

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

**Flask** is simpler but synchronous by default. Good for lightweight internal tools.

> **🎮 Analogy:** FastAPI is the sports car of ML APIs — automatic docs, async engine, Pydantic seatbelts. Flask is the reliable pickup truck — gets the job done, no frills, might rattle at high speeds.

## Model Serving Tools

**TensorFlow Serving** serves TF models with automatic versioning, batching, and gRPC support.

**TorchServe** does the same for PyTorch models with model archive format (.mar).

**MLflow** provides a built-in serving endpoint via `mlflow models serve`.

```bash
mlflow models serve -m runs:/<run_id>/model --port 5000
```

> **🎮 Analogy:** TF Serving is the vending machine of model deployment — insert features, get predictions, with built-in version selection. TorchServe is the same machine but requiring .mar file coins instead of standard currency.

## Canary Deployments and Rollbacks

Deploy the new model version to a subset of traffic (e.g., 5%). Monitor metrics. Gradually increase traffic. If errors or drift appear, roll back instantly.

```
v1 → 100% traffic  →  v2 at 5%, v1 at 95%
                      →  monitor → increase to 50%
                      →  monitor → increase to 100% (full rollout)
                      →  or rollback to 100% v1 if issues
```

Kubernetes supports this natively with multi-replica deployments and service mesh traffic splitting.

> **🎮 Analogy:** A canary deployment is releasing a game patch to 5% of your Steam playerbase first — if it bricks their saves, only 5% of your forum is on fire instead of 100%. Gradually roll out, monitor the rage threads, then flip the switch for everyone.

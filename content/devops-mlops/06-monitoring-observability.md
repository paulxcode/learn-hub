---
title: Monitoring and Observability
skill: devops-mlops
order: 6
quiz:
  - type: mc
    question: "What are the three pillars of observability?"
    options:
      - "CPU, memory, disk"
      - "Logs, metrics, traces"
      - "Accuracy, precision, recall"
      - "Build, test, deploy"
    answer: 1
  - type: mc
    question: "What is model drift in production monitoring?"
    options:
      - "The model training time increasing over time"
      - "The degradation of model performance due to changes in data or relationships"
      - "The model consuming too much memory"
      - "The model failing to load on startup"
    answer: 1
  - type: mc
    question: "Which tool is commonly used for metrics visualization and alerting?"
    options:
      - "MLflow"
      - "TensorBoard"
      - "Prometheus + Grafana"
      - "Docker"
    answer: 2
---

> **🎮 Analogy:** Monitoring your model in production is like keeping an eye on your HP bar, mana bar, and debuff icons in an RPG — if you ignore the warnings, you're going to wipe the raid party.

## Logs, Metrics, Traces

**Logs** are timestamped records of events (errors, requests, predictions):

```json
{"timestamp":"2026-05-22T10:30:00Z","level":"INFO","model":"churn_v2","prediction":0.87,"latency_ms":45}
```

**Metrics** are numeric measurements over time — request count, error rate, prediction latency, memory usage.

**Traces** track a single request through multiple services (API → feature store → model server → database).

```
Three Pillars:
  Logs:    "what happened"
  Metrics: "how many / how fast"
  Traces:  "where did it go"
```

> **🎮 Analogy:** Logs are the game's console output, metrics are the HUD overlay (FPS counter, memory usage), and traces are the replay system that follows a single bullet from muzzle to impact across the entire server.

## Prometheus and Grafana

**Prometheus** scrapes and stores metrics from instrumented services. **Grafana** visualizes them on dashboards and triggers alerts.

```python
# Instrumenting a FastAPI app with Prometheus metrics
from prometheus_client import Counter, Histogram, generate_latest
from fastapi import FastAPI
from starlette.responses import Response

app = FastAPI()
PREDICTIONS = Counter("predictions_total", "Total predictions")
LATENCY = Histogram("prediction_latency_seconds", "Prediction latency")

@app.post("/predict")
async def predict(features: Features):
    with LATENCY.time():
        pred = model.predict(features.to_array())
    PREDICTIONS.inc()
    return {"prediction": pred.tolist()}

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

A Grafana dashboard shows request rate, error rate, latency percentiles (p50, p95, p99), and model prediction distributions.

> **🎮 Analogy:** Prometheus is the server tick logger recording every event, and Grafana is the Spectator HUD that turns those tick numbers into pretty charts — giving you the big picture while a traffic spike (boss fight) is happening.

## Model Performance Monitoring

Model-specific metrics go beyond infrastructure monitoring:

- **Prediction drift**: distribution of model outputs shifts
- **Feature drift**: input feature distributions change
- **Data quality**: missing values, outliers, schema violations
- **Business metrics**: conversion rate, error rate, user satisfaction

```python
def monitor_prediction_drift(reference: np.array, current: np.array) -> float:
    from scipy.stats import ks_2samp
    stat, p_value = ks_2samp(reference, current)
    return p_value  # low p-value = significant drift
```

> **🎮 Analogy:** Model performance monitoring is the DPS meter in an MMO — accuracy and precision are your damage numbers, and if they suddenly drop, something changed (your rotation, boss mechanics, server tick rate). Time to investigate.

## Alerting on Data Quality and Model Drift

Set thresholds on metrics. Alert when drift exceeds a threshold:

```yaml
# Prometheus alert rule
groups:
  - name: model_alerts
    rules:
      - alert: HighPredictionDrift
        expr: prediction_drift_p_value < 0.05
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Prediction drift detected for {{ $labels.model }}"
```

Alerts should trigger investigation, not panic. Common severity levels: info (dashboard annotation), warning (slack notification), critical (pager duty).

> **🎮 Analogy:** Alerting thresholds are your raid warning addon — info is a chat message ("mana low"), warning is a flashing icon ("boss casting fireball"), and critical is the audible "RUN AWAY" sound that makes you drop everything.

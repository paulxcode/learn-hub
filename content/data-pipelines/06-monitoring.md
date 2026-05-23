---
title: Pipeline Monitoring
skill: data-pipelines
order: 6
---

> **🎮 Analogy:** Pipeline monitoring is the mini-map in StarCraft — you can't watch every zergling (failed task) individually, but you can see the red blips spreading across your base (data warehouse) before your SCVs (engineers) get swarmed.

## Why Monitor?

Detect failures, bottlenecks, and data anomalies before they impact users.

> **🎮 Analogy:** Pipeline monitoring is the security camera system in Among Us — you can't watch every vent (data source) simultaneously, but when a body is reported (pipeline crash), you rewind the tapes to find Lime acting sus near electrical (the bad transformation step).

## Metrics Collection

```python
import time

class PipelineMonitor:
    def __init__(self):
        self.metrics = {
            "rows_processed": 0,
            "errors": 0,
            "total_time": 0,
            "steps": {}
        }

    def start_step(self, name):
        self.metrics["steps"][name] = {
            "start": time.time(),
            "status": "running"
        }
        print(f"[MONITOR] Starting: {name}")

    def end_step(self, name, rows=0, success=True):
        step = self.metrics["steps"][name]
        elapsed = time.time() - step["start"]
        step["time"] = round(elapsed, 3)
        step["status"] = "success" if success else "failed"
        step["rows"] = rows
        self.metrics["rows_processed"] += rows
        status = "OK" if success else "FAILED"
        print(f"[MONITOR] {name}: {status} ({elapsed:.2f}s, {rows} rows)")

    def record_error(self, msg):
        self.metrics["errors"] += 1
        print(f"[MONITOR] ERROR: {msg}")

    def summary(self):
        m = self.metrics
        print("\n=== PIPELINE SUMMARY ===")
        print(f"Total rows: {m['rows_processed']}")
        print(f"Errors: {m['errors']}")
        for name, data in m["steps"].items():
            print(f"  {name}: {data['status']} ({data.get('time', 'N/A')}s)")

monitor = PipelineMonitor()

monitor.start_step("Extract")
monitor.end_step("Extract", rows=1500)

monitor.start_step("Validate")
monitor.record_error("Null values in email column")
monitor.end_step("Validate", rows=1480)

monitor.start_step("Transform")
monitor.end_step("Transform", rows=1480)

monitor.start_step("Load")
monitor.end_step("Load", rows=1480)

monitor.summary()
```

**Output:**
```
[MONITOR] Starting: Extract
[MONITOR] Extract: OK (0.00s, 1500 rows)
[MONITOR] Starting: Validate
[MONITOR] ERROR: Null values in email column
[MONITOR] Validate: OK (0.00s, 1480 rows)
[MONITOR] Starting: Transform
[MONITOR] Transform: OK (0.00s, 1480 rows)
[MONITOR] Starting: Load
[MONITOR] Load: OK (0.00s, 1480 rows)

=== PIPELINE SUMMARY ===
Total rows: 5940
Errors: 1
  Extract: success (0s)
  Validate: success (0s)
  Transform: success (0s)
  Load: success (0s)
```

> **🎮 Analogy:** The PipelineMonitor class is like a car's OBD-II port — it continuously reports RPM (rows processed), engine temperature (pipeline latency), and check-engine lights (errors). You don't read the raw data while driving; you wait for the dashboard warning to tell you something's wrong.

## Alerting

```python
def check_alerts(metrics):
    alerts = []

    if metrics["errors"] > 0:
        alerts.append(f"WARNING: {metrics['errors']} error(s) detected")

    for step, data in metrics["steps"].items():
        if data.get("time", 0) > 30:
            alerts.append(f"ALERT: {step} took {data['time']}s (threshold: 30s)")

    if metrics.get("row_count_drop", 0) > 0.2:
        alerts.append(f"CRITICAL: Row count dropped by {metrics['row_count_drop']*100:.0f}%")

    if alerts:
        print("=== ALERTS ===")
        for alert in alerts:
            print(f"  ! {alert}")
    else:
        print("All metrics within thresholds")

    sample_metrics = {
        "errors": 2,
        "steps": {
            "extract": {"time": 5.2},
            "transform": {"time": 45.3},
        },
        "row_count_drop": 0.05
    }

    check_alerts(sample_metrics)
    ```

> **🎮 Analogy:** Alert thresholds are like the combo meter in Street Fighter — a few small hits (errors) build it up to yellow (warning), but one big punish (row count drop) can trigger a full CA (critical alert) that sends you flying across the screen.

**Output:**
```
=== ALERTS ===
  ! WARNING: 2 error(s) detected
  ! ALERT: transform took 45.3s (threshold: 30s)
```

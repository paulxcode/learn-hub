---
title: Pipeline Orchestration
skill: data-pipelines
order: 4
---

> **🎮 Analogy:** Pipeline orchestration is the conductor of a 120-piece orchestra — Airflow waves its baton, the flutes (extract) don't start before the strings (validate) finish warming up, and nobody plays the triangle until measure 47.

## What is Orchestration?

Orchestration manages task dependencies, scheduling, retries, and monitoring.

> **🎮 Analogy:** Orchestration is the construction foreman in Satisfactory — you don't tell each constructor individually what to make; you set up the production line once, and he makes sure the screws arrive before the reinforced plates need them, restarts jammed machines (retries), and pages you if the belt backs up (monitoring).

## DAGs (Directed Acyclic Graphs)

Pipelines are modeled as DAGs — tasks connected by dependencies:

```python
def simulate_dag():
    print("=" * 40)
    print("DAG: Daily Sales Pipeline")
    print("=" * 40)

    steps = [
        ("extract", "Extract data from source", True),
        ("validate", "Validate raw data", True),
        ("transform", "Transform and clean", None),
        ("load", "Load to warehouse", None),
        ("report", "Generate report", None),
    ]

    dependencies = {
        "extract": [],
        "validate": ["extract"],
        "transform": ["validate"],
        "load": ["transform"],
        "report": ["load"],
    }

    completed = set()

    def run_step(name, description):
        deps = dependencies[name]
        for dep in deps:
            if dep not in completed:
                print(f"  WAIT: {name} waiting for {dep}")
                return False

        print(f"  RUN: {description}... ", end="")
        completed.add(name)
        print("OK")
        return True

    while len(completed) < len(steps):
        ran_any = False
        for name, desc, _ in steps:
            if name not in completed:
                if run_step(name, desc):
                    ran_any = True
        if not ran_any:
            print("  BLOCKED: circular dependency detected")
            break

    print(f"\nPipeline finished: {len(completed)}/{len(steps)} steps")

simulate_dag()
```

**Output:**
```
========================================
DAG: Daily Sales Pipeline
========================================
  RUN: Extract data from source... OK
  RUN: Validate raw data... OK
  RUN: Transform and clean... OK
  RUN: Load to warehouse... OK
  RUN: Generate report... OK

Pipeline finished: 5/5 steps
```

> **🎮 Analogy:** A DAG is like the tech tree in Civilization VI — you can't research Printing Press (generate report) until you've discovered Writing (extract) and Education (transform). The acyclic part means no time-traveling scientists researching things that haven't been discovered yet.

## Retry Logic

```python
import random

def run_with_retries(step_name, max_retries=3):
    for attempt in range(1, max_retries + 1):
        try:
            if random.random() < 0.4:
                raise ConnectionError("Connection timeout")
            print(f"  {step_name}: attempt {attempt} - OK")
            return True
        except ConnectionError as e:
            print(f"  {step_name}: attempt {attempt} - FAILED ({e})")
            if attempt == max_retries:
                print(f"  {step_name}: FAILED after {max_retries} retries")
                return False

> **🎮 Analogy:** Retry logic is respawning after dying to a boss in Elden Ring — you keep your runes (progress), the boss keeps its health (state), and you try again with the same strategy like a sane person. After three deaths, maybe level up (fix the issue) before attempting again.

print("Running pipeline with retries:\n")
run_with_retries("extract-sales")
```

**Sample Output:**
```
Running pipeline with retries:

  extract-sales: attempt 1 - FAILED (Connection timeout)
  extract-sales: attempt 2 - OK
```

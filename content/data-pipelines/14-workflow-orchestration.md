---
title: Workflow Orchestration
skill: data-pipelines
order: 14
quiz:
  - type: mc
    question: "What is a DAG in the context of Apache Airflow?"
    options:
      - "A data aggregation graph used for analytics"
      - "A directed acyclic graph that defines task dependencies and execution order"
      - "A database access gateway"
      - "A data analytics group within an organization"
    answer: 1
  - type: mc
    question: "What is the difference between an Operator and a Sensor in Airflow?"
    options:
      - "Sensors execute tasks; Operators wait for external conditions"
      - "Operators execute tasks; Sensors wait for external conditions to be met"
      - "There is no difference — they are interchangeable"
      - "Operators are Python-only; Sensors are SQL-only"
    answer: 1
  - type: mc
    question: "What happens if a task in Airflow fails?"
    options:
      - "The entire DAG is deleted"
      - "Based on retry configuration, the task is retried; if all retries fail, downstream tasks are skipped"
      - "The database is automatically restored from backup"
      - "Airflow sends a warning but continues execution"
    answer: 1
---

> **🎮 Analogy:** A workflow DAG is the quest chain from Tears of the Kingdom — you can't face the final boss (load report) until you've completed the four regional phenomena (extract, validate, transform, aggregate), and yes, there's a Korok seed sensor with a timeout.

## Apache Airflow Fundamentals

Airflow orchestrates pipelines as directed acyclic graphs (DAGs). Each node is a task, and edges define dependencies:

> **🎮 Analogy:** An Airflow DAG is the skill tree in Path of Exile — you start at the center (extract), path through nodes (validate, transform), and eventually reach the keystone passive (load report). The acyclic restriction means no Keystone-Connection-Start loops that break the universe.

```python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator


def extract_data():
    print("Extracting data from source...")


def transform_data():
    print("Applying transformations...")


def load_data():
    print("Loading into warehouse...")


default_args = {
    "owner": "data-team",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
}

dag = DAG(
    "etl_pipeline",
    default_args=default_args,
    description="Daily ETL pipeline",
    schedule="@daily",
    catchup=False,
)

extract = PythonOperator(
    task_id="extract",
    python_callable=extract_data,
    dag=dag,
)

transform = PythonOperator(
    task_id="transform",
    python_callable=transform_data,
    dag=dag,
)

load = PythonOperator(
    task_id="load",
    python_callable=load_data,
    dag=dag,
)

extract >> transform >> load
```

> **🎮 Analogy:** The `>>` operator chaining tasks is stringing together command blocks in Minecraft — `extract >> transform >> load` means the comparator from extract powers the command block for transform, which triggers load. Redstone dust (dependencies) runs in one direction only.

## Operators and Sensors

Operators define **what** to do. Sensors wait for **conditions**:

> **🎮 Analogy:** Operators are Minecraft pistons — they extend, push a block (run a task), and retract. Sensors are pressure plates — they sit there, checking if a mob (file, external condition) is standing on them, and only then trigger the piston.

```python
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.sensors.external_task import ExternalTaskSensor
from airflow.sensors.filesystem import FileSensor

# PythonOperator: run any Python function
validate = PythonOperator(
    task_id="validate_data",
    python_callable=lambda: print("Validating schema..."),
)

# BashOperator: run a shell command
export = BashOperator(
    task_id="export_to_s3",
    bash_command="aws s3 cp ./output.parquet s3://bucket/data/",
)

# FileSensor: wait for a file to appear
wait_for_file = FileSensor(
    task_id="wait_for_input",
    filepath="/data/raw/orders_20240115.csv",
    poke_interval=30,   # check every 30 seconds
    timeout=3600,       # give up after 1 hour
)

# ExternalTaskSensor: wait for another DAG to finish
wait_for_dw = ExternalTaskSensor(
    task_id="wait_for_warehouse",
    external_dag_id="data_warehouse_load",
    external_task_id="load_complete",
)

wait_for_file >> validate >> export
```

## Scheduling and Retries

Airflow handles scheduling, retries, and alerting:

> **🎮 Analogy:** Scheduling in Airflow is the repeating timer in Factorio — the inserter swings (pipeline runs) every N seconds. `@daily` is a stack inserter with a long circuit-condition delay, `@hourly` is a fast inserter on a clock timer.

```python
dag = DAG(
    "hourly_aggregation",
    schedule="0 * * * *",   # every hour at minute 0
    max_active_runs=1,      # prevent overlapping runs
    catchup=True,           # backfill missed runs
    default_args={
        "retries": 2,
        "retry_delay": timedelta(minutes=2),
        "email_on_failure": True,
        "email": ["data-team@company.com"],
    },
)
```

Common schedule patterns:

| Schedule | cron | Meaning |
|----------|------|---------|
| Every hour | `0 * * * *` | Top of each hour |
| Daily at 3am | `0 3 * * *` | Once per day |
| Weekday mornings | `0 8 * * 1-5` | Mon-Fri at 8am |
| Monthly | `0 0 1 * *` | First of each month |

> **🎮 Analogy:** Cron expressions are the cheat codes from GTA — `0 * * * *` is the equivalent of a simple spawn-vehicle code, easy to remember. `0 0 1 * *` is the 20-button combination for infinite health — powerful but one wrong digit and you spawn a golf cart instead.

## Monitoring Pipeline Health

> **🎮 Analogy:** Pipeline health monitoring is the vitals HUD in Halo — your shield bar (row count) should be full, flashing red (errors) means you're one shot away from death, and Cortana (on_failure_callback) screaming "we need to get out of here" is the alert you set up for when the Warthog (ETL job) explodes.

```python
from airflow.operators.python import PythonOperator
from airflow.operators.email import EmailOperator
from datetime import datetime


def check_row_count(**context):
    count = query_row_count("analytics.orders")
    threshold = 10000

    if count < threshold:
        raise ValueError(
            f"Row count {count} below threshold {threshold}"
        )

    print(f"Row count check passed: {count}")
    return count


def alert_on_failure(context):
    dag_id = context["dag"].dag_id
    task_id = context["task"].task_id
    exec_date = context["execution_date"]
    print(f"ALERT: Dag {dag_id} task {task_id} failed at {exec_date}")


row_count_check = PythonOperator(
    task_id="row_count_check",
    python_callable=check_row_count,
    on_failure_callback=alert_on_failure,
    dag=dag,
)
```

> **🎮 Analogy:** Don't build a redstone computer (Airflow) to light up one room — a lever (cron job) and a torch (Python script) work fine. But if you're building a 16-bit ALU (complex pipeline with branching dependencies), redstone is the only way.

Airflow is industry standard for a reason, but don't over-engineer. A cron job + a Python script is fine for simple pipelines. Reach for Airflow when you need dependency management, retries, monitoring, and historical backfills.

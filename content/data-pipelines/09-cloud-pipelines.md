---
title: Cloud Pipelines
skill: data-pipelines
order: 9
quiz:
  - type: mc
    question: "Which AWS service is a serverless compute platform for running code in response to events?"
    options:
      - "AWS Glue"
      - "AWS Lambda"
      - "Amazon S3"
      - "Amazon RDS"
    answer: 1
  - type: mc
    question: "What type of storage is Amazon S3 or Google Cloud Storage best suited for?"
    options:
      - "Block storage for databases"
      - "Object storage for files, backups, and data lakes"
      - "In-memory caching"
      - "Relational database storage"
    answer: 1
  - type: mc
    question: "AWS Glue is primarily a..."
    options:
      - "Serverless ETL service with built-in data catalog"
      - "Content delivery network"
      - "Virtual private cloud service"
      - "NoSQL database service"
    answer: 0
---

> **🎮 Analogy:** Cloud pipelines are ordering a 30-minute feast from Uber Eats (managed services) instead of growing your own wheat to bake bread (on-premise). Costs more per meal, but you didn't have to build a kitchen from scratch.

## Cloud Storage (S3 / GCS)

Object storage is the foundation of cloud data pipelines:

> **🎮 Analogy:** S3/GCS object storage is the Ender Chest in Minecraft — you throw items in from anywhere in the world (any region), and they're waiting for you at every other Ender Chest (global access). Unlike an Ender Chest, your data doesn't vanish when you break it.

```python
import boto3

s3 = boto3.client('s3')

def upload_to_s3(local_path, bucket, key):
    s3.upload_file(local_path, bucket, key)
    print(f"Uploaded {local_path} to s3://{bucket}/{key}")

def list_s3_files(bucket, prefix=""):
    response = s3.list_objects_v2(Bucket=bucket, Prefix=prefix)
    for obj in response.get('Contents', []):
        print(f"  {obj['Key']} ({obj['Size']} bytes)")

list_s3_files("my-data-lake", "raw/sales/")
```

**Output:**
```
  raw/sales/2026-05-01.csv (10240 bytes)
  raw/sales/2026-05-02.csv (9856 bytes)
  raw/sales/2026-05-03.csv (11200 bytes)
```

## Serverless Compute (AWS Lambda)

Lambda runs code without provisioning servers:

> **🎮 Analogy:** AWS Lambda is a Ditto in Pokémon — it transforms into whatever function you need (Python, Node, Java), appears instantly when called, vanishes when done, and you never have to feed it berries (pay for idle time).

```python
import json
import boto3

def lambda_handler(event, context):
    """Triggered when a new file lands in S3."""
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    print(f"New file detected: s3://{bucket}/{key}")

    if key.endswith('.csv'):
        process_csv(bucket, key)
    elif key.endswith('.json'):
        process_json(bucket, key)

    return {"statusCode": 200, "body": json.dumps("Processing started")}

def process_csv(bucket, key):
    print(f"Processing CSV: {key}")

def process_json(bucket, key):
    print(f"Processing JSON: {key}")
```

## Managed Services

| Service | Provider | Purpose |
|---------|----------|---------|
| AWS Glue | AWS | Serverless ETL with crawlers and data catalog |
| GCP Dataflow | Google | Stream and batch processing (Apache Beam) |
| AWS EMR | AWS | Managed Hadoop/Spark clusters |
| GCP Dataproc | Google | Managed Spark and Hadoop |
| Azure Data Factory | Azure | Cloud ETL and orchestration |

> **🎮 Analogy:** Managed services are the pre-built blueprints in Factorio — sure, you could hand-craft every gear and circuit, or you could stamp down a fully-tested mall blueprint (AWS Glue, GCP Dataflow) that produces exactly what you need with zero manual belt-work.

> **🎮 Analogy:** The event-driven pattern is a Rube Goldberg machine in Portal — a cube (file) lands on a button (S3 trigger), which fires a turret (Lambda), which shoots a portal (Glue ETL) that opens a door (Redshift load). Each step only starts when the previous one finishes, and GlaDOS (AWS) manages all the physics.

## Event-Driven Pipeline Pattern

```python
def build_event_pipeline():
    steps = [
        ("S3 Upload", "Raw data arrives in landing zone"),
        ("Lambda Trigger", "Serverless function validates and moves data"),
        ("Glue ETL", "Transforms and catalogs data"),
        ("Redshift Load", "Data available for analytics"),
    ]

    print("Event-Driven Pipeline:\n")
    for i, (step, desc) in enumerate(steps, 1):
        print(f"  {i}. {step:<20s} → {desc}")
    print("\nNo servers to manage. Scales automatically.")
```
---
title: Serverless Computing
skill: cloud-big-data
order: 5
quiz:
  - type: mc
    question: "What is a cold start in serverless computing?"
    options:
      - "When the function runs on a cold server"
      - "The delay when a function is invoked after being idle"
      - "Starting a function in a different region"
      - "When the function uses cold storage"
    answer: 1
  - type: mc
    question: "Which AWS service provides serverless function execution?"
    options:
      - "EC2"
      - "Lambda"
      - "ECS"
      - "S3"
    answer: 1
  - type: mc
    question: "What triggers a Cloud Function in an event-driven architecture?"
    options:
      - "Manual SSH login"
      - "Events like file uploads, HTTP requests, or database changes"
      - "Scheduled cron jobs only"
      - "Direct VM access"
    answer: 1
---

> **🎮 Analogy:** Serverless is hiring mercenaries instead of building an army — you don't pay for their barracks, their training, or their idle time at the tavern, but don't be surprised if they take a second to draw their swords (cold start) when you call them.

## Serverless Functions

Serverless computing lets you run code without provisioning or managing servers. You upload your function, and the cloud provider handles scaling, availability, and maintenance. You pay only for execution time.

> **🎮 Analogy:** Serverless is hiring contract assassins in Hitman — you pay per hit, you don't care about their travel arrangements or weapon maintenance, and if you need 50 of them simultaneously for a really confusing convention center massacre, the agency handles it.

**AWS Lambda** — Runs Node.js, Python, Java, Go, .NET, Ruby. Supports up to 15-minute execution and 10 GB memory.

**GCP Cloud Functions** — Similar to Lambda, with tight integration to GCP services. 2nd gen functions use Cloud Run under the hood.

> **🎮 Analogy:** Lambda is the TF2 Engineer's sentry — you build it, give it ammo (code), and it automatically blasts anything that walks through the door (S3 upload, HTTP request). Cloud Functions is the same sentry gun but painted with Google colors and slightly better at math.

## Event-Driven Architecture

Functions respond to events: file uploads to S3, database changes, HTTP requests, queue messages.

> **🎮 Analogy:** Event-driven architecture is like a Rube Goldberg machine in Portal — a gel dispenser (S3 upload) triggers a portal turret (Lambda) that shoots a button that opens a door (database write). Each piece does one thing and kicks off the next without anyone pushing a master button.

```python
import json
import boto3

s3 = boto3.client("s3")

def lambda_handler(event, context):
    """Triggered by S3 upload event."""
    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]

        # Read the uploaded file
        response = s3.get_object(Bucket=bucket, Key=key)
        content = response["Body"].read().decode("utf-8")

        # Process: count lines
        lines = content.split("\n")
        print(f"File {key}: {len(lines)} lines, {len(content)} bytes")

    return {"statusCode": 200, "body": json.dumps("Processing complete")}
```

## Cold Starts

When a function hasn't been invoked recently, the provider needs to initialize a new runtime — this is a cold start. Cold starts add latency (hundreds of ms to seconds). Keep functions warm with periodic pings or provisioned concurrency.

> **🎮 Analogy:** A cold start is your game loading a level from scratch — the first time you load Skyrim, it takes a minute (cold), but quick-traveling back to Whiterun is nearly instant (warm). Provisioned concurrency is keeping every zone pre-loaded like an open-world game that never shows a loading screen.

```python
import time
import json

def cold_start_demo(event, context):
    start = time.time()

    # Simulate connecting to a database
    db_connected = time.time()
    connection_time = db_connected - start

    result = {
        "cold_start": connection_time > 0.1,
        "connection_time_ms": round(connection_time * 1000, 2),
        "message": "Cold start" if connection_time > 0.1 else "Warm start"
    }

    print(json.dumps(result))
    return result
```

## Use Cases

| Use Case | Example |
|----------|---------|
| Data transformation | Resize images on upload, convert CSV to Parquet |
| API backends | REST endpoints with API Gateway |
| Scheduled jobs | Daily ETL, cleanup tasks |
| Event processing | Process streaming events from Kinesis/Kafka |

> **🎮 Analogy:** Use cases for serverless map to Pokemon moves — data transformation is Transform (change shape on arrival), API backends is Quick Attack (fast response to any request), scheduled jobs is Future Sight (set it and forget it), and event processing is Earthquake (hit everything in the stream).

Serverless excels for variable workloads, but sustained high traffic is cheaper on provisioned servers.

> **🎮 Analogy:** Serverless vs provisioned is Uber vs owning a car — Uber (serverless) is great for occasional trips, but if you commute 3 hours daily (sustained traffic), buying the car (provisioned VM) is way cheaper and doesn't have surge pricing.

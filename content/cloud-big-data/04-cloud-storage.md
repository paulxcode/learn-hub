---
title: Cloud Storage
skill: cloud-big-data
order: 4
quiz:
  - type: mc
    question: "Which storage class is most cost-effective for data accessed less than once per year?"
    options:
      - "Standard"
      - "Infrequent Access"
      - "Archive/Glacier"
      - "Reduced Redundancy"
    answer: 2
  - type: mc
    question: "What happens when versioning is enabled on a cloud storage bucket?"
    options:
      - "Files are automatically deleted after 30 days"
      - "Previous versions of objects are preserved"
      - "Only the latest version is accessible"
      - "All objects are encrypted by default"
    answer: 1
  - type: mc
    question: "Which tool is used to interact with Google Cloud Storage from the command line?"
    options:
      - "aws-cli"
      - "gcloud"
      - "gsutil"
      - "azcopy"
    answer: 2
---

> **🎮 Analogy:** Cloud storage tiers are like an RPG inventory: keep your health potions (Standard) in your quick slot, shove the rusty swords from that quest three towns back (Infrequent Access) in a chest, and bury the level-1 gear from the tutorial (Archive/Glacier) in a vault you swear you'll visit again someday.

## Object Storage Overview

Object storage stores data as objects (files) in a flat namespace of buckets. Each object has data, metadata, and a unique key. Unlike file systems, there's no folder hierarchy — prefixes create the illusion of folders.

> **🎮 Analogy:** Object storage is the pile of all your save files dumped into one folder with no subdirectories — "folders" like `saves/2026/` are just cleverly named files that trick your brain into seeing a tree, like how Terraria's piggy bank is just one inventory slot that contains everything.

## Storage Classes

| Class | Use Case | Cost |
|-------|----------|------|
| **Standard** | Frequently accessed data | Highest |
| **Infrequent Access** | Data accessed monthly | Lower |
| **Archive/Glacier** | Compliance, backups accessed rarely | Lowest |

> **🎮 Analogy:** Storage tiers are the shipping options in Star Citizen — Standard is instant quantum travel ($$$), Infrequent Access is the scheduled space-bus that comes once a month, and Glacier is the cargo pod you launched toward the destination and hope it lands within 3–5 business years.

```python
import boto3

s3 = boto3.client("s3")

# Set lifecycle policy to move data to Glacier after 90 days
s3.put_bucket_lifecycle_configuration(
    Bucket="my-data-lake",
    LifecycleConfiguration={
        "Rules": [
            {
                "ID": "archive-after-90-days",
                "Status": "Enabled",
                "Filter": {"Prefix": "logs/"},
                "Transitions": [
                    {
                        "Days": 90,
                        "StorageClass": "GLACIER"
                    }
                ]
            }
        ]
    }
)
print("Lifecycle policy applied to s3://my-data-lake/logs/")
```

## Bucket Policies and Versioning

Bucket policies use JSON to control access at the bucket level. Versioning preserves every object version, enabling recovery from accidental deletions.

> **🎮 Analogy:** Bucket versioning is the "load previous save" feature for your storage — accidentally deleted the final boss loot? Just rewind to 5 minutes ago like you're The Legend of Zelda: The Minish Cap's time mechanic, but for files.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::critical-data-bucket/*",
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

## Data Transfer Tools

```bash
# AWS CLI - sync local directory to S3
aws s3 sync ./data s3://my-bucket/raw/ --exclude "*.tmp"

# gsutil - copy between GCS buckets
gsutil cp gs://source-bucket/data.csv gs://dest-bucket/archive/

# Multi-cloud transfer
aws s3 cp s3://aws-bucket/file.csv - | gsutil cp - gs://gcs-bucket/file.csv
```

For large data volumes, use AWS Snowball or GCP Transfer Appliance for physical data shipping.

> **🎮 Analogy:** Snowball/Transfer Appliance is the USB stick you hand to a friend at a LAN party because the file is too big to email — except the "USB stick" is a literal suitcase-sized hard drive, and the "friend" is a courier who fedexes it to the cloud provider.

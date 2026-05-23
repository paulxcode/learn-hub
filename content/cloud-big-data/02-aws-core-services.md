---
title: AWS Core Services
skill: cloud-big-data
order: 2
quiz:
  - type: mc
    question: "Which AWS service provides virtual servers in the cloud?"
    options:
      - "S3"
      - "EC2"
      - "RDS"
      - "Lambda"
    answer: 1
  - type: mc
    question: "What does IAM stand for in AWS?"
    options:
      - "Integrated Application Management"
      - "Identity and Access Management"
      - "Infrastructure and Monitoring"
      - "Internet Application Model"
    answer: 1
  - type: mc
    question: "Which service is used for object storage in AWS?"
    options:
      - "EBS"
      - "EFS"
      - "S3"
      - "RDS"
    answer: 2
---

> **🎮 Analogy:** AWS is like a warehouse store where EC2 is the pallet of generic gadgets you assemble yourself, S3 is the bottomless bin of random stuff with infinite shelf space, and Lambda is the vending machine that builds you a sandwich exactly when you ask for it.

## Core AWS Services

**EC2 (Elastic Compute Cloud)** — Virtual machines in the cloud. Choose instance types optimized for compute, memory, or storage. You only pay for running instances.

> **🎮 Analogy:** EC2 is renting a gaming PC from a cybercafe by the hour — you pick the specs (GPU, RAM, CPU), it's yours while you play, and when you log off, someone else gets the same machine. The cafe owner handles the electricity and AC (hypervisor, hardware).

```bash
# Launch an EC2 instance using AWS CLI
aws ec2 run-instances \
    --image-id ami-0abcdef1234567890 \
    --instance-type t2.micro \
    --key-name my-key-pair \
    --security-group-ids sg-12345678

# List running instances
aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]"
```

**S3 (Simple Storage Service)** — Object storage for any type of data. Buckets hold objects identified by keys. 99.999999999% durability.

> **🎮 Analogy:** S3 is the chest in your Minecraft base that somehow contains 64 stacks of diamond blocks, a stack of doors, and a signed copy of your friend's dirt house — and you can access it from any dimension (region) as long as you have the right bucket permissions.

```python
import boto3

s3 = boto3.client("s3")
bucket_name = "my-data-lake-bucket"

# List all buckets
buckets = s3.list_buckets()
print("Existing buckets:", [b["Name"] for b in buckets["Buckets"]])

# Upload a file
s3.upload_file("data.csv", bucket_name, "raw/data.csv")
print(f"Uploaded to s3://{bucket_name}/raw/data.csv")
```

**RDS (Relational Database Service)** — Managed databases: PostgreSQL, MySQL, MariaDB, SQL Server, Oracle. Handles backups, patching, and replication.

> **🎮 Analogy:** RDS is hiring a full-time admin for your game server who handles backups at 3 AM, applies security patches, and sets up a second server for automatic failover — you just connect and play (query).

## IAM (Identity and Access Management)

IAM controls who can do what with AWS resources. Key concepts: users, groups, roles, and policies (JSON documents defining permissions).

> **🎮 Analogy:** IAM is the permissions list on your Minecraft server — you give "Builder" rank the ability to place and break blocks (s3:PutObject), but only "Admin" can use /kill (iam:DeleteRole). The JSON policy is the laminated rulebook pinned to the clubhouse wall.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::my-data-lake/*", "arn:aws:s3:::my-data-lake"]
    }
  ]
}
```

> **🎮 Analogy:** An IAM policy JSON is like a permissions config file on a Minecraft server. `"Effect": "Allow"` means "yes, you can," `"Action": ["s3:GetObject"]` means "read files from the S3 vault," and `"Resource": ["arn:aws:s3:::my-data-lake/*"]` means "but only the stuff in THIS chest." Every permission must be explicitly granted — no trust falls in cloud security.

## VPC (Virtual Private Cloud)

VPC lets you define a virtual network in AWS. Subnets, route tables, internet gateways, and security groups control traffic flow. Use public subnets for web servers and private subnets for databases.

> **🎮 Analogy:** VPC is your private Factorio factory wall — public subnets are the front gates where delivery trucks (web traffic) roll in, private subnets are the assembly hall deep inside where the real work happens, and security groups are the turrets that only let specific types of biters through.

AWS Free Tier includes 750 hours of t2.micro EC2 per month, 5 GB of S3 storage, and 750 hours of RDS for 12 months.

> **🎮 Analogy:** AWS Free Tier is the demo level that gives you a fully equipped starter base — once the 12-month timer runs out, you either upgrade to the full game or watch your base crumble.

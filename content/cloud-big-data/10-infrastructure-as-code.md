---
title: Infrastructure as Code
skill: cloud-big-data
order: 10
quiz:
  - type: mc
    question: "What is Terraform's primary function?"
    options:
      - "Running containers"
      - "Provisioning cloud infrastructure declaratively"
      - "Compiling code"
      - "Monitoring applications"
    answer: 1
  - type: mc
    question: "What is Terraform state used for?"
    options:
      - "Storing application logs"
      - "Tracking resource mappings between config and real infrastructure"
      - "Encrypting cloud credentials"
      - "Compiling Terraform configuration"
    answer: 1
  - type: mc
    question: "How does declarative infrastructure differ from imperative?"
    options:
      - "Declarative requires manual steps; imperative is automated"
      - "Declarative describes desired state; imperative specifies step-by-step commands"
      - "Declarative is slower than imperative"
      - "Declarative only works with AWS"
    answer: 1
---

> **🎮 Analogy:** Infrastructure as Code is having blueprints for your Minecraft base instead of placing every block by hand — want an identical copy in the Nether? Just `terraform apply` and grab your fire resistance potion.

## Infrastructure as Code

Infrastructure as Code (IaC) manages cloud resources through configuration files instead of manual clicks or scripts. Benefits: repeatability, version control, auditability, and automation.

> **🎮 Analogy:** IaC is the schematic system from Factorio — instead of placing 200 assemblers by hand (clicking in the AWS console), you blueprint the entire factory layout and stamp it down perfectly every time, including the belts, inserters, and power poles (networking, IAM, storage).

**Terraform** by HashiCorp is the leading IaC tool. It's cloud-agnostic — use the same workflow for AWS, GCP, Azure.

> **🎮 Analogy:** Terraform being cloud-agnostic is a universal controller adapter that works on PlayStation, Xbox, and Switch — same buttons (HCL syntax), same muscle memory (workflow), but the console it talks to depends on which cable (provider) you plug in.

## Key Concepts

**Providers** — Plugins for cloud platforms (e.g., `aws`, `google`). **Resources** — Infrastructure components (e.g., `aws_s3_bucket`, `google_storage_bucket`). **State** — Maps your config to real-world resources.

> **🎮 Analogy:** Terraform state is the game's save file — it remembers exactly where every block (resource) is placed in your cloud world. Lose the state file and Terraform's amnesia means it can't tell if that S3 bucket already exists or needs creating from scratch.

```hcl
# Terraform configuration: S3 bucket + IAM user
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "data_lake" {
  bucket = "my-company-data-lake-2026"
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

resource "aws_s3_bucket_versioning" "data_lake_versioning" {
  bucket = aws_s3_bucket.data_lake.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_iam_user" "data_engineer" {
  name = "data-engineer-svc"
}

resource "aws_iam_user_policy" "data_engineer_s3_access" {
  name   = "S3DataLakeAccess"
  user   = aws_iam_user.data_engineer.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:PutObject", "s3:ListBucket"]
        Resource = [
          aws_s3_bucket.data_lake.arn,
          "${aws_s3_bucket.data_lake.arn}/*"
        ]
      }
    ]
  })
}
```

```bash
# Terraform workflow
terraform init       # Initialize providers
terraform plan       # Preview changes
terraform apply      # Apply changes
terraform destroy    # Tear down resources
```

> **🎮 Analogy:** `terraform plan` is the "preview build" in Satisfactory — before committing resources, the game shows you exactly which belts, machines, and foundations will be placed, moved, or removed. `terraform apply` is hitting "confirm build," and `terraform destroy` is the deconstruction planner.

## Declarative vs Imperative

**Declarative** — "I want an S3 bucket with versioning enabled." Terraform figures out how. **Imperative** — "Run `aws s3api create-bucket`, then `aws s3api put-bucket-versioning`." You handle errors and ordering.

> **🎮 Analogy:** Declarative is telling the chef "I want a pepperoni pizza" (desired state); imperative is giving step-by-step instructions: "Flatten the dough, spread sauce, grate cheese, arrange pepperoni, bake at 450°F." Both get pizza, but one is a lot more typing and error-prone.

Declarative wins for infrastructure: Terraform detects drift, auto-generates dependency graphs, and handles incremental updates.

> **🎮 Analogy:** Terraform detecting drift is your Minecraft base's auto-restore feature — someone griefed a wall? Terraform sees the current state doesn't match the blueprint and silently places the blocks back overnight.

```hcl
# GCP example
resource "google_storage_bucket" "data_lake" {
  name          = "my-company-data-lake-gcp"
  location      = "US"
  storage_class = "STANDARD"

  versioning {
    enabled = true
  }
}
```

Version-controlling `.tf` files means your infrastructure is peer-reviewed, auditable, and reproducible across environments (dev, staging, prod).

> **🎮 Analogy:** Version-controlled Terraform files are the saved blueprints in a city-builder game — you can deploy the exact same city layout in Creative Mode (dev), Normal Mode (staging), and Hard Mode with disasters enabled (prod), and revert to yesterday's layout if today's expansion caused traffic jams (drift).

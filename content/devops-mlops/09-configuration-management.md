---
title: Configuration Management
skill: devops-mlops
order: 9
quiz:
  - type: mc
    question: "Why should secrets never be committed to version control?"
    options:
      - "Secrets slow down git operations"
      - "Git history retains secrets even after deletion, exposing credentials to anyone with repo access"
      - "Secrets make the code harder to read"
      - "Git cannot store secret values"
    answer: 1
  - type: mc
    question: "What is a Kubernetes ConfigMap used for?"
    options:
      - "Storing sensitive data like passwords"
      - "Storing non-sensitive configuration data as key-value pairs or files"
      - "Mounting persistent storage volumes"
      - "Defining network policies"
    answer: 1
  - type: mc
    question: "What is a parameter store?"
    options:
      - "A database for storing training parameters"
      - "A service for securely storing and managing configuration values and secrets (e.g., AWS SSM, GCP Secret Manager)"
      - "A Python library for config files"
      - "A Docker volume for config files"
    answer: 1
---

> **🎮 Analogy:** Configuration management is like setting up your keybinds in a new game — do it once in a config file, version-control it, and never remap WASD by hand on every new install again.

## Environment Variables and .env Files

Configuration should be external to code. Environment variables are the standard approach:

```python
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///default.db")
MODEL_PATH = os.getenv("MODEL_PATH", "models/model.pkl")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
API_KEY = os.getenv("API_KEY")  # no default — fail if missing
```

For local development, use a `.env` file (never commit it):

```bash
# .env (gitignored)
DATABASE_URL=postgresql://user:pass@localhost:5432/mlflow
MODEL_PATH=s3://models/churn_v2.pkl
LOG_LEVEL=DEBUG
API_KEY=sk-abc123
```

Load it with python-dotenv:

```python
from dotenv import load_dotenv
load_dotenv()  # loads .env in development
```

> **🎮 Analogy:** Environment variables are the launch options in a game's .cfg file — `-novid -high -threads 8` is your config, and when you upgrade your PC, you carry those settings to the new install so you never lose your preferred setup.

## Config Maps and Secrets in K8s

**ConfigMap** stores non-sensitive configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ml-api-config
data:
  MODEL_PATH: "s3://models/churn_v2.pkl"
  LOG_LEVEL: "INFO"
  BATCH_SIZE: "32"
```

**Secret** stores sensitive data (base64 encoded, encrypted at rest):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ml-api-secrets
type: Opaque
data:
  DATABASE_URL: cG9zdGdyZXNxbDovL3VzZXI6cGFzc0AxMjcuMC4wLjE6NTQzMi9tbGZsb3c=
  API_KEY: c2stYWJjMTIz
```

Mount them into pods:

```yaml
spec:
  containers:
    - name: ml-api
      envFrom:
        - configMapRef:
            name: ml-api-config
        - secretRef:
            name: ml-api-secrets
```

> **🎮 Analogy:** ConfigMaps are the game settings everyone can see (resolution, volume). Secrets are the parental control PIN — visible to admins but hidden from everyone else, and you'd better not hardcode it in a .ini file on the desktop.

## Parameter Stores

Cloud-native parameter stores centralize configuration:

**AWS Systems Manager Parameter Store:** Free, supports plaintext and encrypted parameters with IAM access control.

```bash
aws ssm put-parameter \
  --name "/ml/churn/MODEL_PATH" \
  --value "s3://models/churn_v4.pkl" \
  --type SecureString

aws ssm get-parameter \
  --name "/ml/churn/MODEL_PATH" \
  --with-decryption
```

**GCP Secret Manager:** Stores API keys, database URLs, and model registry tokens.

```python
from google.cloud import secretmanager

client = secretmanager.SecretManagerServiceClient()
response = client.access_secret_version(
    request={"name": "projects/my-project/secrets/api-key/versions/latest"}
)
API_KEY = response.payload.data.decode("UTF-8")
```

> **🎮 Analogy:** Cloud parameter stores are the Nintendo Switch cloud saves of configuration — instead of praying your local config survived the SSD wipe, you restore your entire setup from a secure vault that follows you across machines.

## Config as Code

Treat configuration like application code: version it, review changes, test in staging before promoting to production. Use tools like Helm (for Kubernetes), Terraform (for cloud infra), or Ansible (for system config) to declare desired state.

> **🎮 Analogy:** Config as Code is writing a modded Minecraft pack's config directory — instead of manually tweaking 37 .json files every setup, you version-control the whole folder, and your next server is a `git clone` away from a perfectly tuned game.

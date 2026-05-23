---
title: Containers and Kubernetes
skill: cloud-big-data
order: 11
quiz:
  - type: mc
    question: "What is the smallest deployable unit in Kubernetes?"
    options:
      - "Container"
      - "Pod"
      - "Node"
      - "Service"
    answer: 1
  - type: mc
    question: "What is the purpose of a Kubernetes Deployment?"
    options:
      - "To expose pods externally via DNS"
      - "To manage the desired state of replicated pods"
      - "To store configuration as environment variables"
      - "To provide persistent storage volumes"
    answer: 1
  - type: mc
    question: "When should you prefer containers over serverless functions?"
    options:
      - "For event-driven data transformations"
      - "For long-running services needing full control over the runtime"
      - "For simple HTTP API endpoints"
      - "For scheduled cron jobs"
    answer: 1
---

> **🎮 Analogy:** Containers are shipping containers for your code — Docker packs the box with everything your app needs, and Kubernetes is the cargo ship that stacks them, balances the load, and auto-replaces any container that falls overboard (crashes).

## Docker Containers

Containers package an application with its dependencies into a single image. Unlike VMs, containers share the host OS kernel — they're lightweight and start in seconds.

> **🎮 Analogy:** A container is a pre-configured emulator ROM — the emulator (Docker Engine) provides the hardware abstraction, the ROM (image) contains the exact game and settings, and anyone with the same emulator can launch it instantly without installing a whole OS for each game (that's VMs).

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
CMD ["python", "app.py"]
```

```bash
# Build and run
docker build -t etl-pipeline .
docker run -v $(pwd)/data:/app/data etl-pipeline
```

## Container Orchestration with Kubernetes

For production, you need orchestration: scaling, self-healing, rolling updates, service discovery. Kubernetes (K8s) is the industry standard.

> **🎮 Analogy:** Without Kubernetes, running containers in production is like juggling 20 glass bottles on a unicycle — possible for exactly 3 seconds. K8s is the automated juggling robot that catches dropped bottles (self-healing), adds more hands (scaling), and swaps out old bottles for new ones without dropping any (rolling updates).

```yaml
# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spark-etl
  labels:
    app: etl
spec:
  replicas: 3
  selector:
    matchLabels:
      app: etl
  template:
    metadata:
      labels:
        app: etl
    spec:
      containers:
        - name: spark-worker
          image: spark:3.5.0
          ports:
            - containerPort: 4040
          resources:
            requests:
              memory: "4Gi"
              cpu: "2"
            limits:
              memory: "8Gi"
              cpu: "4"
          env:
            - name: DATA_BUCKET
              value: "s3://my-data-lake"
```

```yaml
# Service to expose the deployment
apiVersion: v1
kind: Service
metadata:
  name: etl-service
spec:
  selector:
    app: etl
  ports:
    - port: 80
      targetPort: 4040
  type: LoadBalancer
```

## Pods, Deployments, Services

**Pod** — Smallest unit, runs one or more containers. Ephemeral — can be killed and recreated.

> **🎮 Analogy:** A Pod is a Minecraft mob — it spawns, does its job, and if it despawns or gets killed, a new one takes its place. You never name your zombies (pods are ephemeral), but you care that there are always exactly 5 around the spawner (replicas).

**Deployment** — Declares desired state (replicas, image version). Handles rolling updates and rollbacks.

> **🎮 Analogy:** A Deployment is the Mob Spawner configuration — you set "spawn 3 creepers at all times" (desired replicas), and if one gets blown up (crashes), the spawner immediately replaces it. Rolling update is swapping the creeper spawn egg for a charged creeper egg one-by-one.

**Service** — Stable network endpoint to access pods. Types: ClusterIP (internal), NodePort, LoadBalancer (external).

> **🎮 Analogy:** A Kubernetes Service is the quest marker on your minimap — it always points to the right location even when the actual quest NPC (pod) has been replaced six times by new hires (redeployments). ClusterIP is a waypoint only your party sees, LoadBalancer is a neon sign visible to the whole server.

## Containers vs Serverless

| Scenario | Better Choice |
|----------|--------------|
| Long-running (>15 min) | Containers |
| Need GPU/acceleration | Containers |
| Variable burst traffic | Serverless |
| Full control over OS/runtime | Containers |
| Simple event processing | Serverless |

Many teams use both: containers for core services, serverless for event-driven tasks.

> **🎮 Analogy:** Containers + serverless together is having a permanent base with crafting stations (containers on K8s) AND a pocketful of throwing knives (serverless) — the base handles the heavy industry, and the knives handle the random goblins that pop up in between.

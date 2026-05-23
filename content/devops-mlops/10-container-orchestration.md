---
title: Container Orchestration with Kubernetes
skill: devops-mlops
order: 10
quiz:
  - type: mc
    question: "What is a Kubernetes Pod?"
    options:
      - "A group of containers running on the same node, sharing the same network and storage"
      - "A virtual machine running on a Kubernetes node"
      - "A load balancer for distributing traffic"
      - "A storage volume for persistent data"
    answer: 0
  - type: mc
    question: "What is a Kubernetes Deployment used for?"
    options:
      - "Running a one-time batch job"
      - "Declaring the desired state for a set of replicated pods with rolling updates"
      - "Mounting external storage volumes"
      - "Configuring DNS for the cluster"
    answer: 1
  - type: mc
    question: "What is Helm used for in Kubernetes?"
    options:
      - "Monitoring cluster metrics"
      - "Packaging Kubernetes applications as reusable charts with templated YAML"
      - "Building container images"
      - "Managing Kubernetes node scaling"
    answer: 1
---

> **🎮 Analogy:** Kubernetes is like commanding a fleet of starships — you declare the desired formation (Deployment), expose hailing frequencies (Service), and let the autopilot handle the rest while you strategize.

## Kubernetes Architecture

A Kubernetes cluster has a **control plane** and **worker nodes**:

```
Control Plane: API Server → Scheduler → Controller Manager → etcd
                                    |
Worker Nodes:    Kubelet ← → Kube-Proxy → Pods → Containers
```

- **Control plane**: manages the cluster state (API server, scheduler, etcd)
- **Nodes**: run your applications (pods)
- **Pods**: smallest deployable unit — one or more containers sharing network and storage

```bash
kubectl get nodes        # list cluster nodes
kubectl get pods         # list running pods
kubectl get all          # list all resources
```

> **🎮 Analogy:** The control plane is your RTS command center — you issue orders, worker nodes (SCVs/Probes/Drones) carry them out, pods are individual units, and `kubectl` is your minimap and hotkey menu rolled into one.

## Deployments, Services, Ingress

A **Deployment** declares the desired state for replicated pods:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-api
  template:
    metadata:
      labels:
        app: ml-api
    spec:
      containers:
        - name: api
          image: myrepo/ml-api:v2
          ports:
            - containerPort: 8000
          env:
            - name: MODEL_PATH
              value: "s3://models/churn_v2.pkl"
```

A **Service** exposes pods internally or externally:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ml-api-service
spec:
  selector:
    app: ml-api
  ports:
    - port: 80
      targetPort: 8000
  type: LoadBalancer
```

An **Ingress** routes external HTTP traffic to services:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ml-api-ingress
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /predict
            pathType: Prefix
            backend:
              service:
                name: ml-api-service
                port:
                  number: 80
```

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl rollout status deployment/ml-api
```

> **🎮 Analogy:** A Deployment declares "I want 3 replica pods running" — like setting your factory to maintain 3 assemblers at all times. A Service is the conveyor belt connecting them to the output chest. Ingress is the trade station routing external shipments to the right belt.

## Helm Charts for Packaging

Helm packages Kubernetes YAML as **charts** with templating and configuration:

```yaml
# values.yaml
replicaCount: 3
image:
  repository: myrepo/ml-api
  tag: v2
service:
  port: 80
env:
  MODEL_PATH: "s3://models/churn_v2.pkl"
  LOG_LEVEL: "INFO"
```

```yaml
# templates/deployment.yaml (simplified)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.name }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          env:
            {{- range $key, $val := .Values.env }}
            - name: {{ $key }}
              value: {{ $val }}
            {{- end }}
```

```bash
helm install ml-api ./chart --values values.yaml
helm upgrade ml-api ./chart --set image.tag=v3
helm rollback ml-api 1
```

> **🎮 Analogy:** Helm is the mod pack manager for Kubernetes — instead of downloading and configuring 50 individual YAML files manually, you install one chart (modpack) with sensible defaults and override settings in a single `values.yaml` file.

## K8s for ML Workloads

Kubernetes is well-suited for ML workloads: batch training (Jobs, CronJobs), distributed training (MPIOperator), serving (Deployments with autoscaling), and GPU scheduling. Use node pools with GPU nodes for training, CPU-only nodes for serving.

> **🎮 Analogy:** Running ML on Kubernetes is the automated Factorio megabase for your model factory — GPU nodes are electric furnaces (expensive, powerful), CPU nodes are assemblers (cheap, plentiful), and the scheduler ensures nothing sits idle while you're away.

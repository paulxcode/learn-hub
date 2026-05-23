---
title: Docker Containers
skill: devops-mlops
order: 3
quiz:
  - type: mc
    question: "What is a key difference between containers and virtual machines?"
    options:
      - "Containers run on a hypervisor; VMs share the host kernel"
      - "Containers share the host OS kernel; VMs include a full guest OS"
      - "Containers are slower than VMs"
      - "VMs use Dockerfiles; containers use hypervisors"
    answer: 1
  - type: mc
    question: "What is the purpose of a Dockerfile?"
    options:
      - "To configure Docker networking"
      - "To define how to build a Docker image step by step"
      - "To store running container state"
      - "To manage Docker Compose services"
    answer: 1
  - type: mc
    question: "Which Docker best practice helps reduce image size?"
    options:
      - "Using the latest tag for all base images"
      - "Using multi-stage builds and minimal base images like alpine"
      - "Installing all packages in a single RUN command"
      - "Adding all files in the first layer"
    answer: 1
---

> **🎮 Analogy:** Docker is the bento box of software — everything neatly packed in its own compartment, travels anywhere, and nobody argues about "it works on my machine" anymore.

## Containers vs Virtual Machines

Virtual machines virtualize hardware — each VM runs a full guest OS with its own kernel. Containers virtualize the OS — they share the host kernel but isolate processes, filesystems, and networks.

```
VM:    [App A | Libs | Guest OS] → Hypervisor → Host OS → Hardware
Container: [App A | Libs] → Docker Engine → Host OS → Hardware
```

Containers are lighter (MBs vs GBs), start in seconds, and provide consistent environments from dev to production.

> **🎮 Analogy:** Containers vs VMs is like renting a shared apartment (container — you share the building's plumbing and electricity but have your own room) vs buying your own house (VM — every house has its own foundation, wiring, and plumbing, which costs way more).

## Dockerfile, Images, Containers

A **Dockerfile** defines how to build an **image**. A **container** is a running instance of an image.

```dockerfile
# Dockerfile for a Python ML API
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t ml-api:latest .
docker run -p 8000:8000 ml-api:latest
docker ps          # list running containers
docker stop <id>   # stop a container
```

> **🎮 Analogy:** A Docker image is the game on disc, a container is the running game with your saved progress. The Dockerfile is the pressing plant blueprint — feed it raw materials (source code), and it stamps out identical discs you can ship anywhere.

## Docker Compose

For multi-service applications (e.g., API + database + model server):

```yaml
# docker-compose.yml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: mlflow
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker compose up -d   # start all services
docker compose down    # stop and remove
docker compose logs    # view logs
```

> **🎮 Analogy:** Docker Compose is the "Quick Party" button in an RPG — instead of recruiting each party member one by one and assigning gear, you define your ideal squad in one config and deploy them all with a single command.

## Best Practices

- Use slim or alpine base images (`python:3.11-slim` over `python:3.11`)
- Multi-stage builds to separate build deps from runtime
- Minimize layers by combining `RUN` commands
- Use `.dockerignore` to exclude unnecessary files
- Don't run as root — create a non-root user
- Pin base image tags (avoid `:latest`)

> **🎮 Analogy:** Using `:latest` as your base image tag is using `pip install` without a requirements file — you're installing whatever the internet thinks is correct today, and tomorrow it could be different. Pin it or regret it.

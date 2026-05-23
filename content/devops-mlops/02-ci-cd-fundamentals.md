---
title: CI/CD Fundamentals
skill: devops-mlops
order: 2
quiz:
  - type: mc
    question: "What is Continuous Delivery?"
    options:
      - "Every commit is automatically deployed to production"
      - "Every commit is validated and ready for deployment, but deployment to production is manual"
      - "Code is deployed once per sprint"
      - "Only hotfixes are deployed automatically"
    answer: 1
  - type: mc
    question: "What does a typical CI pipeline include?"
    options:
      - "Lint, test, build"
      - "Lint, test, build, deploy"
      - "Only deploy"
      - "Code review and deployment"
    answer: 0
  - type: mc
    question: "What does 'pipeline as code' mean?"
    options:
      - "Writing the pipeline in any programming language"
      - "Defining the CI/CD pipeline in a YAML/DSL file versioned alongside the code"
      - "Using code to trigger manual deployments"
      - "Replacing CI/CD with shell scripts"
    answer: 1
---

> **🎮 Analogy:** Running CI/CD without automated tests is like trying to speedrun a game by skipping all the tutorials — you'll hit a wall (and lose all progress) eventually.

## Continuous Integration vs Continuous Delivery/Deployment

**Continuous Integration (CI):** Every code change is automatically built and tested. Developers merge to main multiple times a day, catching integration issues early.

**Continuous Delivery (CD):** CI + the artifact is automatically prepared for deployment to production. A manual approval gates the actual release.

**Continuous Deployment:** Every change that passes CI is automatically deployed to production — no human intervention.

```
CI:     Commit → Build → Test
CD:     Commit → Build → Test → Stage → Release (manual gate)
CDep:   Commit → Build → Test → Deploy to production
```

> **🎮 Analogy:** CI is playtesting your game level as you build it. CD is compiling and packaging it for the QA team. Continuous Deployment is pushing it directly to Steam with no human in the loop — bold strategy, Cotton.

## Pipeline Stages

A typical CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
name: CI Pipeline
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        run: ruff check .
      - name: Test
        run: pytest
      - name: Build
        run: docker build -t myapp .
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh
```

Stages are typically: **lint → test → build → (optional) deploy**. Each stage gates the next: if lint fails, tests don't run.

> **🎮 Analogy:** Pipeline stages are the conveyor belts in Factorio — if your iron plate line (lint) backs up, the gear assembler (test) starves, and the green circuit factory (build) goes dark until the bottleneck clears.

## GitHub Actions / GitLab CI

**GitHub Actions:** Workflows defined in `.github/workflows/*.yml`. Supports matrix builds, caching, and hundreds of community actions.

**GitLab CI:** Pipelines defined in `.gitlab-ci.yml` at the repo root. Uses runners (shared or self-hosted) to execute stages.

Both support pipeline as code — the pipeline definition lives in the repo, is versioned, and is reviewed like application code.

> **🎮 Analogy:** GitHub Actions and GitLab CI are the auto-hotkey macros of DevOps — push a commit (press one button), and the entire boss fight rotation (build, test, deploy) executes perfectly without you touching the keyboard again.

## Pipeline as Code Benefits

- **Versioned:** Pipeline changes go through code review
- **Reproducible:** Same pipeline for every branch
- **Auditable:** Full history of CI/CD changes
- **Self-documenting:** The pipeline file describes the entire process

> **🎮 Analogy:** Pipeline as Code is the README that stays accurate forever — instead of a stale wiki page from 2019 saying "run deploy.sh, I think?", the YAML file IS the deployment manual, and it never lies because it IS the deployment.

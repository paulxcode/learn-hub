---
title: Version Control with Git
skill: devops-mlops
order: 1
quiz:
  - type: mc
    question: "What is the difference between merge and rebase?"
    options:
      - "Merge creates a linear history; rebase preserves branching"
      - "Merge creates a merge commit preserving branch history; rebase rewrites history by applying commits on top of the target branch"
      - "Merge is only for remote branches; rebase is for local branches"
      - "There is no difference"
    answer: 1
  - type: mc
    question: "Which strategy is trunk-based development?"
    options:
      - "Multiple long-lived feature branches merged via pull requests"
      - "A single main branch with short-lived feature branches merged multiple times daily"
      - "No branches at all — everyone commits directly to main"
      - "Feature branches that live for weeks before merging"
    answer: 1
  - type: mc
    question: "What does git pull do?"
    options:
      - "Downloads changes from remote without merging"
      - "Fetches changes and then merges them into the current branch"
      - "Pushes local changes to the remote"
      - "Creates a new branch from the remote"
    answer: 1
---

> **🎮 Analogy:** Think of Git as the quick-save feature in a roguelike — you wouldn't face the final boss without having saved first, and you shouldn't refactor production code without committing.

## Git Basics

Git tracks changes in your codebase. The core workflow is clone, add, commit, push, and pull:

```bash
git clone https://github.com/user/repo.git
cd repo

# Stage and commit
git add file.py
git commit -m "Add feature X"

# Sync with remote
git push origin main
git pull origin main
```

`git status` shows which files are modified, staged, or untracked. `git log` displays the commit history.

> **🎮 Analogy:** `git clone` is starting a New Game+ with all your old gear, `add` + `commit` is quicksaving before a boss fight, and `push` is uploading that save to the cloud — but if two players overwrite the same save, you get merge conflicts.

## Branching Strategies

Two popular approaches:

**GitFlow:** A `main` branch for releases, `develop` for integration, plus `feature/`, `release/`, and `hotfix/` branches. Suits scheduled releases but adds overhead.

**Trunk-Based Development:** Everyone merges short-lived feature branches into `main` multiple times a day. Enables CI/CD and reduces merge conflicts. Preferred for continuous deployment.

```bash
# Trunk-based: create feature, merge fast
git checkout -b feat/user-auth
# ... work ...
git add .
git commit -m "Add user authentication"
git checkout main
git pull origin main
git merge feat/user-auth
git push origin main
git branch -d feat/user-auth
```

> **🎮 Analogy:** Trunk-based development is speedrunning on one save file — small, frequent saves, and if you mess up, you haven't lost much. GitFlow is a completionist run with 57 backup saves for every region — thorough but heavy.

## Merge vs Rebase

`git merge` creates a merge commit that preserves the exact history of both branches:

```bash
git checkout feature
git merge main
```

`git rebase` rewrites history by applying your commits on top of the target branch, resulting in a linear history:

```bash
git checkout feature
git rebase main
```

Rebase gives a cleaner history but **rewrites commits** — never rebase shared branches.

> **🎮 Analogy:** `merge` is the group photo at the company party — everyone's in frame, history preserved. `rebase` is photoshopping your commits onto the target branch timeline — cleaner picture, but nobody will believe your story checks out.

## Pull Requests and Code Review

PRs are the standard mechanism for reviewing code before merging:

1. Push your feature branch to the remote
2. Open a pull request on GitHub/GitLab
3. Team reviews and approves changes
4. Merge via squash, rebase, or merge commit

PRs enforce quality gates: automated checks (tests, linting), required approvals, and branch protection rules.

> **🎮 Analogy:** A pull request is submitting a mod to the Steam Workshop — you wouldn't upload a game-breaking mod without someone reviewing it first, and the CI pipeline is the integrity check that catches obvious bugs before the community does.

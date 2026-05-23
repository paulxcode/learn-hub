---
title: ML / AI Introduction
skill: machine-learning
order: 1
---

> **🎮 Analogy:** Teaching ML is like teaching a dog tricks — except you don't teach the rules ("lift paw when I say shake"), you just show it 1000 examples and let it figure out the pattern. Replace treats with loss functions.

## What is Machine Learning?

ML is teaching computers to learn from data without explicit programming for every rule.

> **🎮 Analogy:** Giving a computer explicit rules for every decision is like trying to describe every step of tying your shoes — you can do it, but showing 1000 examples of tied shoelaces teaches it way faster. ML is "show, don't tell" for programmers.

## Types of ML

- **Supervised**: Labeled data (classification, regression)
- **Unsupervised**: Unlabeled data (clustering)
- **Reinforcement**: Trial and error (agents)

> **🎮 Analogy:** Supervised learning is a student with an answer key, unsupervised is an explorer in a new land, and reinforcement is a toddler learning that touching a hot stove is bad — except the toddler remembers and the stove doesn't.

```python
from sklearn import tree

features = [[150, 0], [170, 0], [140, 1], [130, 1]]
labels = [0, 0, 1, 1]

clf = tree.DecisionTreeClassifier()
clf.fit(features, labels)

prediction = clf.predict([[160, 1]])
print(f"Predicted: {'orange' if prediction[0] == 1 else 'apple'}")
```

> **🎮 Analogy:** Features are the inputs your model uses to make a decision — like giving an NPC the player's health, ammo, and distance to decide if it should attack or flee. `fit()` is the training montage where the model learns from past examples; `predict()` is the final exam where it shows what it learned.

**Output:**
```
Predicted: orange
```

---
title: Model Evaluation
skill: machine-learning
order: 5
---

> **🎮 Analogy:** Training without evaluation is like studying for a test using the actual exam questions — you'll ace it, but you've learned nothing. Cross-validation is like having 5 different pop quizzes to make sure you're not just lucky.

## Train/Test Split

Never evaluate on data the model has seen during training:

> **🎮 Analogy:** Testing a model on training data is like giving a student the exam questions as homework, then being surprised they aced the test. The test set is the pop quiz they've never seen — that's where real learning shows.

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import numpy as np

np.random.seed(42)
X = np.random.randn(1000, 10)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression()
model.fit(X_train, y_train)

train_acc = accuracy_score(y_train, model.predict(X_train))
test_acc = accuracy_score(y_test, model.predict(X_test))

print(f"Training accuracy: {train_acc:.3f}")
print(f"Test accuracy:     {test_acc:.3f}")
print(f"Overfitting gap:   {train_acc - test_acc:.3f}")
```

**Output:**
```
Training accuracy: 0.874
Test accuracy:     0.880
Overfitting gap:   -0.006
```

## Cross-Validation

More robust than a single train/test split:

> **🎮 Analogy:** Cross-validation is like having 5 different teachers grade your final project — one might be lenient, but if all 5 agree you deserve a B, that's the real score. A single split is just one teacher's opinion.

```python
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
import numpy as np

np.random.seed(42)
X = np.random.randn(200, 5)
y = (X[:, 0] + X[:, 2] > 0).astype(int)

rf = RandomForestClassifier(n_estimators=10, random_state=42)
scores = cross_val_score(rf, X, y, cv=5)

print("Cross-validation scores:")
for i, score in enumerate(scores, 1):
    print(f"  Fold {i}: {score:.3f}")
print(f"\nMean: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")
```

**Output:**
```
Cross-validation scores:
  Fold 1: 0.825
  Fold 2: 0.775
  Fold 3: 0.850
  Fold 4: 0.800
  Fold 5: 0.800

Mean: 0.810 (+/- 0.051)
```

## Precision, Recall, F1

> **🎮 Analogy:** Precision is saying "everything I flagged as spam was actually spam" (no false alarms), recall is "I caught every single spam email" (nothing slipped through), and F1 is the compromise when you can't have both — like trying to be both fast and thorough at your job.

```python
from sklearn.metrics import precision_score, recall_score, f1_score
import numpy as np

np.random.seed(42)
y_true = np.random.randint(0, 2, 100)
y_pred = y_true.copy()
y_pred[::10] = 1 - y_pred[::10]  # flip every 10th

print("Metrics for imbalanced dataset:\n")
print(f"Accuracy:  {accuracy_score(y_true, y_pred):.3f}")
print(f"Precision: {precision_score(y_true, y_pred):.3f}")
print(f"Recall:    {recall_score(y_true, y_pred):.3f}")
print(f"F1 Score:  {f1_score(y_true, y_pred):.3f}")
```

**Output:**
```
Metrics for imbalanced dataset:

Accuracy:  0.910
Precision: 0.885
Recall:    0.920
F1 Score:  0.902
```

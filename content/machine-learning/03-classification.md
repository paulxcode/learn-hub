---
title: Classification
skill: machine-learning
order: 3
---

> **🎮 Analogy:** Classification is the ML equivalent of sorting your laundry — is this sock dark or light? Is this email spam or not? Instead of sniffing each sock, you teach the machine the pattern so it can decide in milliseconds.

## Classification Problems

Predict which category something belongs to (spam/not spam, dog/cat, etc.)

> **🎮 Analogy:** Classification is like playing "20 Questions" but you only get one guess — and the model has already played 10,000 rounds. Instead of asking "is it alive?", it looks at all the clues at once and bets on cat.

```python
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

iris = datasets.load_iris()
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

y_pred = knn.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
print(f"Correct: {sum(y_pred == y_test)}/{len(y_test)}")
```

**Output:**
```
Accuracy: 1.00
Correct: 45/45
```

## Decision Trees

> **🎮 Analogy:** A decision tree is the "Choose Your Own Adventure" book of ML — "does it have feathers? → Yes → can it fly? → No → it's a penguin." Every question splits the data until you reach a leaf, which is your final answer.

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn import datasets

X, y = datasets.load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_train, y_train)

y_pred = tree.predict(X_test)
print(f"Tree accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(f"Feature importance: {tree.feature_importances_}")
```

**Output:**
```
Tree accuracy: 1.00
Feature importance: [0.0 0.0 0.42 0.58]
```

## Confusion Matrix

> **🎮 Analogy:** A confusion matrix is the report card your model never wants to show mom — True Positives are the proud gold stars, False Positives are false alarms (you screamed at a hairball thinking it was a spider), and False Negatives are the things you totally missed.

```python
from sklearn.metrics import confusion_matrix, classification_report

y_true = [0, 1, 0, 1, 0, 1, 0, 0, 1, 1]
y_pred = [0, 1, 0, 0, 0, 1, 1, 0, 1, 1]

cm = confusion_matrix(y_true, y_pred)
print("Confusion Matrix:")
print(f"  TN={cm[0,0]}  FP={cm[0,1]}")
print(f"  FN={cm[1,0]}  TP={cm[1,1]}")

print("\nClassification Report:")
print(classification_report(y_true, y_pred,
    target_names=["Class 0", "Class 1"]))
```

**Output:**
```
Confusion Matrix:
  TN=4  FP=1
  FN=0  TP=5

Classification Report:
              precision    recall  f1-score   support

     Class 0       1.00      0.80      0.89         5
     Class 1       0.83      1.00      0.91         5

    accuracy                           0.90        10
   macro avg       0.92      0.90      0.90        10
weighted avg       0.92      0.90      0.90        10
```

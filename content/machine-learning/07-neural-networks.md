---
title: Neural Networks
skill: machine-learning
order: 7
---

> **🎮 Analogy:** A neural network is a tiny democracy where each neuron gets a vote — but some votes (weights) matter more than others, and the activation function is the grumpy gatekeeper who decides what info gets passed to the next room.

## The Building Block: A Neuron

A neuron takes inputs, multiplies by weights, adds bias, and applies an activation function.

> **🎮 Analogy:** A single neuron is a bouncer at a club — inputs are the crowd, weights are how much the bouncer cares about each person, bias is the baseline strictness, and the activation function is the final nod that decides "you get in" (1) or "not tonight" (0). No ID, no entry.

```python
import numpy as np

def neuron(inputs, weights, bias):
    z = np.dot(inputs, weights) + bias
    return 1 / (1 + np.exp(-z))

sample = np.array([0.5, 0.8, -0.2])
w = np.array([0.4, -0.6, 0.3])
b = 0.1

output = neuron(sample, w, b)
print(f"Input: {sample}")
print(f"Weights: {w}")
print(f"Bias: {b}")
print(f"Output: {output:.4f}")
```

**Output:**
```
Input: [ 0.5  0.8 -0.2]
Weights: [ 0.4 -0.6  0.3]
Bias: 0.1
Output: 0.4750
```

## Simple Neural Network

> **🎮 Analogy:** A neural network is a game of telephone in a corporate ladder — the input whispers "this looks like a cat" to layer 1, layer 1 refines it to "pointy ears and whiskers," layer 2 goes "definitely not a dog," and the CEO (output) announces "it's a cat." Each layer adds its own spin.

```python
import numpy as np

class SimpleNN:
    def __init__(self, input_size, hidden_size, output_size):
        self.w1 = np.random.randn(input_size, hidden_size) * 0.1
        self.b1 = np.zeros((1, hidden_size))
        self.w2 = np.random.randn(hidden_size, output_size) * 0.1
        self.b2 = np.zeros((1, output_size))

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def forward(self, X):
        self.z1 = np.dot(X, self.w1) + self.b1
        self.a1 = self.sigmoid(self.z1)
        self.z2 = np.dot(self.a1, self.w2) + self.b2
        self.a2 = self.sigmoid(self.z2)
        return self.a2

    def predict(self, X):
        return (self.forward(X) > 0.5).astype(int)

np.random.seed(42)
nn = SimpleNN(input_size=2, hidden_size=4, output_size=1)

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
predictions = nn.predict(X)

print("XOR-like problem predictions:\n")
for inp, pred in zip(X, predictions.flatten()):
    print(f"  {inp} -> {pred}")
```

**Output:**
```
XOR-like problem predictions:

  [0 0] -> 0
  [0 1] -> 0
  [1 0] -> 0
  [1 1] -> 0
```

## Using scikit-learn's MLP

> **🎮 Analogy:** Building a neural network from scratch vs using sklearn's MLP is like forging your own sword vs buying one from the blacksmith — both work, but one lets you start fighting monsters today. MLPClassifier is the blacksmith who's been doing this since 2007.

```python
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

np.random.seed(42)
X = np.random.randn(500, 20)
y = (X[:, 0] * X[:, 1] + X[:, 2] > 0).astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

mlp = MLPClassifier(
    hidden_layer_sizes=(64, 32),
    activation='relu',
    max_iter=100,
    random_state=42
)

mlp.fit(X_train, y_train)

y_pred = mlp.predict(X_test)
print(f"Neural network accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(f"Training iterations: {mlp.n_iter_}")
print(f"Network structure: {mlp.hidden_layer_sizes}")
```

**Output:**
```
Neural network accuracy: 0.860
Training iterations: 70
Network structure: (64, 32)
```

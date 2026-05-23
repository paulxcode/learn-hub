---
title: Deep Learning Basics
skill: machine-learning
order: 8
quiz:
  - type: mc
    question: "What is the role of an activation function in a neural network?"
    options:
      - "To initialize the weights"
      - "To introduce non-linearity into the network"
      - "To reduce the number of parameters"
      - "To normalize the input data"
    answer: 1
  - type: mc
    question: "Which activation function outputs values between 0 and 1 and is commonly used in the output layer for binary classification?"
    options:
      - "ReLU"
      - "Tanh"
      - "Sigmoid"
      - "Linear"
    answer: 2
  - type: mc
    question: "What is forward propagation?"
    arguments:
      - "The process of computing gradients backwards through the network"
      - "The process of passing input data through the network layers to produce an output"
      - "The process of splitting data into training and test sets"
      - "The process of randomly shuffling training data"
    answer: 1
---

> **🎮 Analogy:** Deep learning is like playing infinite Tetris — you stack layer after layer, each one transforming the blocks into something more abstract, until somehow the final layer knows it's looking at a cat (or, frustratingly, a slightly different cat).

## Neural Network Architecture

A neural network consists of layers of interconnected neurons:

```
Input Layer    Hidden Layers    Output Layer
   [x1] ──── [h1] ──── [h1] ──── [y1]
   [x2] ──── [h2] ──── [h2] ──── [y2]
   [x3] ──── [h3] ──── [h3]
```

Each connection has a weight. Each neuron has a bias. The network learns by adjusting these weights and biases.

> **🎮 Analogy:** A neural network with multiple layers is like a factory assembly line — raw materials (pixels) go in, the first station identifies edges, the second spots shapes, the third recognizes patterns, and the final box slaps a label on the finished product. Each layer specializes in a different level of abstraction.

## Building a Neural Network with Keras

> **🎮 Analogy:** Keras is the IKEA of deep learning — all the pieces fit together with clear instructions, and you get a functional neural network without needing to cut your own wood. Building without it is like hand-carving every furniture joint.

```python

```python
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=(20,)),
    layers.Dense(32, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()
```

**Output:**
```
Model: "sequential"
_________________________________________________________________
 Layer (type)                Output Shape              Param #
=================================================================
 dense (Dense)               (None, 64)                1344
 dense_1 (Dense)             (None, 32)                2080
 dense_2 (Dense)             (None, 1)                 33
=================================================================
Total params: 3,457
Trainable params: 3,457
Non-trainable params: 0
_________________________________________________________________
```

## Activation Functions

> **🎮 Analogy:** Activation functions are the different types of "mood filters" your data wears — ReLU is the optimist who turns every negative into a zero ("ignore the bad, keep the good!"), Sigmoid is the diplomat who compresses everything between 0 and 1, and Tanh is the balanced friend who lets negatives through but keeps them polite.

```python
import numpy as np

def relu(x):
    return np.maximum(0, x)

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def tanh(x):
    return np.tanh(x)

x = np.array([-3, -1, 0, 1, 3])
print(f"ReLU:    {relu(x)}")
print(f"Sigmoid: {np.round(sigmoid(x), 4)}")
print(f"Tanh:    {np.round(tanh(x), 4)}")
```

**Output:**
```
ReLU:    [0 0 0 1 3]
Sigmoid: [0.0474 0.2689 0.5    0.7311 0.9526]
Tanh:    [-0.9951 -0.7616  0.      0.7616  0.9951]
```

## Forward Propagation from Scratch

> **🎮 Analogy:** Forward propagation is a relay race where each neuron passes a baton to the next — the input starts, gets weighed and biased at every checkpoint, until the final runner crosses the finish line with a prediction. If the prediction is wrong, backpropagation is the angry coach running backwards to yell at everyone.

```python
import numpy as np

class SimpleDense:
    def __init__(self, input_size, output_size, activation='relu'):
        self.w = np.random.randn(input_size, output_size) * 0.01
        self.b = np.zeros((1, output_size))
        self.activation = activation

    def forward(self, x):
        z = np.dot(x, self.w) + self.b
        if self.activation == 'relu':
            return np.maximum(0, z)
        elif self.activation == 'sigmoid':
            return 1 / (1 + np.exp(-z))
        return z

class NeuralNetwork:
    def __init__(self):
        self.layer1 = SimpleDense(4, 8, 'relu')
        self.layer2 = SimpleDense(8, 4, 'relu')
        self.layer3 = SimpleDense(4, 1, 'sigmoid')

    def forward(self, x):
        x = self.layer1.forward(x)
        x = self.layer2.forward(x)
        x = self.layer3.forward(x)
        return x

np.random.seed(42)
nn = NeuralNetwork()
sample = np.array([[0.5, 0.2, 0.1, -0.3]])
output = nn.forward(sample)
print(f"Input:  {sample[0]}")
print(f"Output: {output[0][0]:.4f}")
```

**Output:**
```
Input:  [ 0.5  0.2  0.1 -0.3]
Output: 0.5117
```
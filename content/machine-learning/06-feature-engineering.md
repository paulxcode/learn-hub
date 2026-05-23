---
title: Feature Engineering
skill: machine-learning
order: 6
---

> **🎮 Analogy:** Feature engineering is the ML equivalent of prepping ingredients before cooking — you wouldn't throw a whole unpeeled potato into a stew and hope for the best. Dice it, scale it, one-hot it, and your model will actually taste the results.

## Why Features Matter

Better features = better models. Raw data rarely works out of the box.

> **🎮 Analogy:** Giving raw data to a model is like handing someone a grocery list written with emojis — 🥛🍞🥚🍌 — sure, you get the idea, but the model prefers clean columns: milk=1, bread=1, eggs=1, bananas=1. Feature engineering translates emoji-language to spreadsheet-language.

## Encoding Categories

> **🎮 Analogy:** One-hot encoding is like assigning each person at a party their own designated chair — "red" sits in chair 1, "blue" sits in chair 2, "green" sits in chair 3. Nobody fights over seats because everyone has their own binary throne.

```python

```python
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
import numpy as np

colors = np.array(["red", "blue", "green", "blue", "red"]).reshape(-1, 1)

ohe = OneHotEncoder(sparse_output=False)
encoded = ohe.fit_transform(colors)

print("One-hot encoded colors:")
for color, enc in zip(colors.flatten(), encoded):
    print(f"  {color}: {enc}")

print(f"\nCategories: {ohe.categories_[0]}")
```

**Output:**
```
One-hot encoded colors:
  red: [0. 0. 1.]
  blue: [1. 0. 0.]
  green: [0. 1. 0.]
  blue: [1. 0. 0.]
  red: [0. 0. 1.]

Categories: ['blue' 'green' 'red']
```

## Scaling Features

Models like features on similar scales:

> **🎮 Analogy:** Feature scaling is like converting everything to the same currency before splitting a restaurant bill — comparing ¥1000 and $10 is meaningless until you realize one is $7 and the other is $10. StandardScaler uses your bank's exchange rate; MinMaxScaler squeezes everyone between 0 and 1.

```python

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import numpy as np

data = np.array([[100], [200], [300], [400], [500]])

std_scaler = StandardScaler()
mm_scaler = MinMaxScaler()

standardized = std_scaler.fit_transform(data)
normalized = mm_scaler.fit_transform(data)

print("Original -> Standardized -> Normalized")
for orig, std, norm in zip(data.flatten(), standardized.flatten(), normalized.flatten()):
    print(f"  {orig:3d} -> {std:+.3f} -> {norm:.3f}")

print(f"\nStandardized: mean={standardized.mean():.3f}, std={standardized.std():.3f}")
print(f"Normalized:   min={normalized.min():.3f}, max={normalized.max():.3f}")
```

**Output:**
```
Original -> Standardized -> Normalized
  100 -> -1.414 -> 0.000
  200 -> -0.707 -> 0.250
  300 -> +0.000 -> 0.500
  400 -> +0.707 -> 0.750
  500 -> +1.414 -> 1.000

Standardized: mean=0.000, std=1.000
Normalized:   min=0.000, max=1.000
```

## Creating Features

> **🎮 Analogy:** Creating new features is like realizing "K/D ratio" is way more useful than tracking kills and deaths separately — combining raw stats into meaningful ratios, log transforms, and category flags gives your model the cheat codes it needs to see patterns.

```python
import numpy as np

raw = np.array([
    {"date": "2026-05-20", "price": 100, "items": 5},
    {"date": "2026-05-21", "price": 150, "items": 3},
    {"date": "2026-05-22", "price": 200, "items": 7},
])

def engineer_features(records):
    print("Feature engineering:\n")
    features = []
    for r in records:
        f = {
            "price_per_item": r["price"] / r["items"],
            "log_price": np.log(r["price"]),
            "price_squared": r["price"] ** 2,
            "has_items": 1 if r["items"] > 0 else 0,
            "items_category": "few" if r["items"] < 5 else "many",
        }
        features.append(f)
    return features

engineered = engineer_features(raw)
for i, f in enumerate(engineered):
    print(f"  Record {i}: {f}")
```

**Output:**
```
Feature engineering:

  Record 0: {'price_per_item': 20.0, 'log_price': 4.61, 'price_squared': 10000, 'has_items': 1, 'items_category': 'many'}
  Record 1: {'price_per_item': 50.0, 'log_price': 5.01, 'price_squared': 22500, 'has_items': 1, 'items_category': 'few'}
  Record 2: {'price_per_item': 28.57, 'log_price': 5.3, 'price_squared': 40000, 'has_items': 1, 'items_category': 'many'}
```

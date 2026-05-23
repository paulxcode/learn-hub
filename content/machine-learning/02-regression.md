---
title: Linear Regression
skill: machine-learning
order: 2
---

> **🎮 Analogy:** Regression is like throwing darts at a line of best fit — you're trying to predict exactly where the next one lands. Miss by a little and you're close; miss by a lot and your model is blindfolded.

## Predicting Continuous Values

Regression predicts numbers — prices, temperatures, etc.

> **🎮 Analogy:** Regression is like being a weather forecaster who only says "it'll be warmer than yesterday" — except you need to say "exactly 23.4°C with 60% humidity." Continuous values mean every decimal matters, not just "hot" or "cold."

```python
import numpy as np
from sklearn.linear_model import LinearRegression

hours = np.array([[1], [2], [3], [4], [5]])
scores = np.array([50, 55, 65, 70, 75])

model = LinearRegression()
model.fit(hours, scores)

pred = model.predict([[6]])
print(f"Predicted score for 6h: {pred[0]:.1f}")

print(f"Formula: score = {model.intercept_:.1f} + {model.coef_[0]:.1f} * hours")
```

> **🎮 Analogy:** `.fit()` is the model studying for a test by memorizing past scores. `.predict()` is the next pop quiz — and `intercept_` and `coef_` are the cheat sheet that reveals the exact formula the model is using.

**Output:**
```
Predicted score for 6h: 82.0
Formula: score = 47.0 + 6.0 * hours
```

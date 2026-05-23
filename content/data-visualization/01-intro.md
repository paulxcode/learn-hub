---
title: Why Visualize Data?
skill: data-visualization
order: 1
---

> **🎮 Analogy:** Data visualization is your HUD in a video game — raw health numbers are boring, but a pulsing red health bar instantly tells you you're about to die. Good viz turns spreadsheets into situational awareness.

## Data Visualization

Visualization turns numbers into insight. A good chart reveals patterns, outliers, and trends.

> **🎮 Analogy:** Raw data is like staring at your character sheet stats in an MMO — a million numbers. A good chart is the glowing item tooltip that immediately tells you "this sword is 3x better than your current one."

## Matplotlib Basics

> **🎮 Analogy:** Matplotlib is the blacksmith's workshop — it's not glamorous, but with enough hammering (plt.plot, plt.title, plt.xlabel) you can forge any chart imaginable, from a simple dagger to a legendary broadsword.

```python
import matplotlib.pyplot as plt
import numpy as np

x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

plt.plot(x, y, marker='o')
plt.title("Simple Line Chart")
plt.xlabel("X axis")
plt.ylabel("Y axis")
plt.grid(True)
plt.show()
```

The plot will display in the output area below.

---
title: Advanced Charts
skill: data-visualization
order: 8
quiz:
  - type: mc
    question: "What type of data is a heatmap best suited for?"
    options:
      - "Time series trends"
      - "Correlation matrices or 2D value grids"
      - "Geographic mapping"
      - "Single variable distribution"
    answer: 1
  - type: mc
    question: "Which seaborn function creates a grid of scatter plots for all pairs of variables?"
    options:
      - "sns.heatmap()"
      - "sns.pairplot()"
      - "sns.relplot()"
      - "sns.kdeplot()"
    answer: 1
  - type: mc
    question: "What is the purpose of plt.subplots() in matplotlib?"
    options:
      - "To create a single large figure"
      - "To create a grid of multiple subplots in one figure"
      - "To save a figure to a file"
      - "To change the color palette"
    answer: 1
---

> **🎮 Analogy:** Heatmaps are thermal vision from Predator — you see where the action is hot and where it's cold. Box plots are radar pings showing where the enemy cluster is, where the outliers flank, and where you're about to get ambushed by extreme values.

## Heatmaps with Seaborn

Heatmaps visualize 2D matrices where color encodes value:

> **🎮 Analogy:** A heatmap is the territory control overlay from a strategy game — the bright red zones are where your enemy has 90% map control (high correlation), the deep blue zones are uncontested (negative correlation), and the white areas are no-man's-land that nobody's claimed yet (near-zero correlation).

```python
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
data = np.random.randn(10, 12)
correlation = np.corrcoef(data)

plt.figure(figsize=(10, 8))
sns.heatmap(correlation,
            annot=True,
            fmt='.2f',
            cmap='RdBu_r',
            center=0,
            square=True,
            cbar_kws={"shrink": 0.8})
plt.title('Correlation Heatmap')
plt.tight_layout()
plt.show()
```

## Pair Plots

Pair plots visualize relationships between all numerical columns:

> **🎮 Analogy:** A pair plot is the team chemistry matrix in a sports game — it shows every player's stats against every other player's stats so you can see that Player A's speed and Player B's passing accuracy create a deadly combo, while Player C's aggression and Player D's defensive style clash like oil and water.

```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('iris')

sns.pairplot(df, hue='species', diag_kind='kde',
             markers=['o', 's', 'D'],
             palette='husl')
plt.suptitle('Iris Dataset - Pair Plot', y=1.02)
plt.show()
```

> **🎮 Analogy:** In a pair plot, the diagonal shows each variable's own distribution — that's like seeing each character's stat distribution solo (their HP histogram), while the off-diagonal scatter plots reveal how they synergize (does high strength correlate with high speed in this dataset?).

## 3D Plots

Matplotlib supports basic 3D visualization:

> **🎮 Analogy:** 3D plots are the free-cam mode in a racing game — instead of the fixed camera angle (2D) that only shows speed vs time, you can orbit the scene to see how speed, RPM, and gear ratio all interact. Sometimes the relationship between three variables is a helix, not a flat line.

```python
import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

x = np.random.randn(100)
y = np.random.randn(100)
z = np.random.randn(100)

scatter = ax.scatter(x, y, z, c=z, cmap='viridis', s=50, alpha=0.7)
ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_zlabel('Z axis')
plt.colorbar(scatter, label='Value')
plt.title('3D Scatter Plot')
plt.show()
```

> **🎮 Analogy:** A 3D scatter plot is like the character viewer in an RPG where you can rotate the model to see every angle — in 2D you might miss that the back of the armor has a weak spot (a hidden cluster of data), but with 3D rotation, nothing stays hidden.

## Subplots and Grid Layouts

Combine multiple charts in a single figure:

> **🎮 Analogy:** Subplots are the split-screen multiplayer mode of data viz — you and three friends can each play your own chart on the same TV (figure), comparing the sine waves like racing ghosts in Mario Kart. Each subplot gets its own lane, but they all share the same race track.

```python
import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 3, figsize=(15, 8))

x = np.linspace(0, 2 * np.pi, 100)

for i, ax in enumerate(axes.flat):
    ax.plot(x, np.sin(x + i * np.pi / 3), linewidth=2)
    ax.set_title(f'Sin(x + {i}π/3)')
    ax.grid(True, alpha=0.3)
    ax.set_xlim(0, 2 * np.pi)

plt.suptitle('Subplots Grid - Phase Shifted Sine Waves', fontsize=16)
plt.tight_layout()
plt.show()
```
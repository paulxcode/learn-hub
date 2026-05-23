---
title: Seaborn
skill: data-visualization
order: 3
---

> **🎮 Analogy:** Seaborn is like Photoshop filters for your data — Matplotlib gives you a RAW photo, but Seaborn adds the auto-enhance, color grading, and statistical retouching that makes your plots look like they belong on a magazine cover.

## Statistical Plotting

Seaborn builds on Matplotlib with beautiful defaults and statistical plots.

> **🎮 Analogy:** Using Seaborn is like activating the "auto-loot" and "auto-equip best gear" mods — Matplotlib makes you drag every item manually, but Seaborn just looks at your data and says "here's a gorgeous histogram with a kernel density estimate, you're welcome."

```python
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
tips = sns.load_dataset("tips")
print(tips.head())
```

**Output:**
```
   total_bill   tip     sex smoker  day    time  size
0       16.99  1.01  Female     No  Sun  Dinner     2
1       10.34  1.66    Male     No  Sun  Dinner     3
2       21.01  3.50    Male     No  Sun  Dinner     3
3       23.68  3.31    Male     No  Sun  Dinner     2
4       24.59  3.61  Female     No  Sun  Dinner     4
```

> **🎮 Analogy:** A distribution plot (histogram + KDE) is the XP-per-level chart for your character — you can see most players are clustered around level 20-40, a few power-gamers hit 80+, and that one outlier at level 99 is either a god or a bot.

```python
# Distribution plot
sns.histplot(tips['total_bill'], bins=20, kde=True)
plt.title("Distribution of Total Bills")
plt.show()
```

> **🎮 Analogy:** A box plot is the ELO rank distribution in a competitive game — the box shows where the middle 50% of players sit, the line in the middle is the median (silver), the whiskers stretch to the top 5%, and those little dots outside the whiskers? That's the smurf accounts and the Grandmasters ruining the curve.

```python
# Box plot by category
sns.boxplot(x='day', y='total_bill', data=tips)
plt.title("Bills by Day")
plt.show()
```

> **🎮 Analogy:** A correlation heatmap is the character affinity chart from a dating sim — dark red means "they love each other" (strong positive correlation), dark blue means "they can't stand each other" (strong negative), and white means they've never interacted. In data terms, it tells you which variables move together.

```python
# Heatmap - correlation
corr = tips.select_dtypes(include=[np.number]).corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', center=0)
plt.title("Feature Correlations")
plt.show()
```

> **🎮 Analogy:** A pair plot is the team overview screen in a tactical RPG — it shows every character's stats (HP, MP, ATK, DEF) compared against each other in a grid so you can spot synergies: "Oh, the healer has high MP but low DEF, and the tank has high DEF but low MP — they complement each other perfectly."

```python
# Pair plot
sns.pairplot(tips, hue='sex')
plt.show()
```

> **🎮 Analogy:** Different plot types are like different scout reports in an RTS — the histogram is your resource graph (how much of each resource you have), the box plot is the enemy's tech tree spread, and the heatmap is the territory control overlay. Use them all to get the full battle picture.

Each plot reveals different patterns in the data — distributions, outliers, group differences, and correlations.

---
title: Interactive Visualization
skill: data-visualization
order: 4
---

> **🎮 Analogy:** Plotly interactive charts are like clicking on your map in an RPG — static charts are a printed map you can only stare at, but interactive charts let you zoom into dungeons, hover over treasure chests, and toggle which quest markers to show.

## Why Interactive?

Static charts show data. Interactive charts let you explore it.

> **🎮 Analogy:** Static vs interactive charts is the difference between watching a pre-recorded dungeon run on YouTube and actually playing the game — one is passive viewing, the other lets you peek around every corner, zoom in on suspicious textures, and click every interactable object.

## Plotly Basics

> **🎮 Analogy:** Plotly is the developer console in a game — with one line of code (`fig.show()`), you unlock the ability to hover over any data point for its stats, zoom into time periods like a sniper scope, and toggle entire data series on and off like equipping different gear sets.

```python
import plotly.express as px
import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    'year': list(range(2016, 2026)) * 3,
    'sales': np.random.randint(100, 500, 30),
    'region': ['North'] * 10 + ['South'] * 10 + ['East'] * 10,
})

fig = px.line(df, x='year', y='sales', color='region',
              title='Sales by Region Over Time',
              markers=True)
fig.show()
```

> **🎮 Analogy:** An interactive scatter plot is the mini-map in an open-world game — each point is a location (or data observation), the axis shows different attributes (latitude/longitude or sepal_width/sepal_length), and hovering reveals the name of every settlement you've discovered.

## Interactive Scatter

```python
iris = px.data.iris()
fig = px.scatter(iris, x='sepal_width', y='sepal_length',
                 color='species', size='petal_length',
                 hover_data=['petal_width'],
                 title='Iris Dataset Explorer')
fig.show()
```

> **🎮 Analogy:** Hovering over an interactive scatter point is like inspecting an item in an RPG — the tooltip pops up with every stat: not just "Iron Sword" but also damage, durability, weight, and enchantment level, all without opening a separate menu.

## 3D Visualization

> **🎮 Analogy:** 3D scatter plots are the orbital camera in a strategy game — instead of a flat 2D map, you can rotate around your data points like they're a 3D terrain in Civilization, spotting clusters (mountain ranges) and outliers (that one lonely island) that 2D views would miss entirely.

```python
fig = px.scatter_3d(iris, x='sepal_length', y='sepal_width',
                     z='petal_length', color='species',
                     title='3D Iris Viewer')
fig.show()
```

> **🎮 Analogy:** 3D rotation in data is like inspecting a character model from every angle before choosing your class — sometimes relationships between three variables (damage, speed, armor) only make sense when you can orbit around them.

## Interactive Charts in Streamlit

> **🎮 Analogy:** Streamlit is the game engine that renders your Plotly charts into a playable dashboard — it's like putting your mini-map, health bar, and quest log all onto one screen that updates in real-time as the player (user) clicks and filters.

The same charts can be embedded in dashboards:

```python
import streamlit as st
import pandas as pd
import plotly.express as px

# st.title("Dashboard")
# st.plotly_chart(fig)

# This code powers interactive dashboards
# where users can filter, zoom, and hover
# to explore data in real-time.

print("Plotly + Streamlit = interactive dashboards")
```

**Output:**
```
Plotly + Streamlit = interactive dashboards
```

> **🎮 Analogy:** Interactive filters in a Streamlit dashboard are the cheat codes of data exploration — checkboxes to show/hide regions, sliders for date ranges, dropdowns for categories. It's like having a "god mode" where data rearranges itself to answer any question instantly.

Hover over points, zoom into regions, toggle traces — interactive visualization turns static charts into exploration tools.

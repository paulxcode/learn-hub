---
title: Best Practices
skill: data-visualization
order: 7
---

> **🎮 Analogy:** Chart design principles are the UI/UX rules of game design — nobody likes a menu with 47 fonts and neon-on-neon text, and nobody trusts a chart with truncated axes and rainbow color vomit.

## Choosing the Right Chart

> **🎮 Analogy:** Picking the right chart is like choosing the right spell in a boss fight — use Fireball (bar chart) when you need big category comparisons, use Frostbolt (line chart) for slowing down and tracking a trend over time, and use Arcane Intellect (scatter plot) when you need to reveal hidden relationships. Wrong spell = wasted mana, wrong chart = wasted insight.

```python
def recommend_chart(goal, data_type):
    chart_map = {
        ("comparison", "categorical"): "Bar chart",
        ("comparison", "numerical"): "Histogram / Box plot",
        ("trend", "time"): "Line chart",
        ("relationship", "numerical"): "Scatter plot",
        ("composition", "parts"): "Pie / Stacked bar",
        ("distribution", "numerical"): "Histogram / KDE",
        ("correlation", "numerical"): "Heatmap",
        ("ranking", "categorical"): "Horizontal bar",
    }

    chart = chart_map.get((goal, data_type), "Consider your options")
    print(f"Goal: {goal}")
    print(f"Data: {data_type}")
    print(f"Recommend: {chart}")
    return chart

recommend_chart("trend", "time")
print()
recommend_chart("relationship", "numerical")
print()
recommend_chart("composition", "parts")
```

**Output:**
```
Goal: trend
Data: time
Recommend: Line chart

Goal: relationship
Data: numerical
Recommend: Scatter plot

Goal: composition
Data: parts
Recommend: Pie / Stacked bar
```

> **🎮 Analogy:** The chart recommendation function is your party's auto-equip feature — feed it your goal ("I need to compare damage output") and your data type ("categorical — sword, bow, staff"), and it tells you exactly which chart weapon to equip instead of making you trial-and-error through the entire inventory menu.

## Accessibility

> **🎮 Analogy:** Colorblind accessibility in charts is like a game's colorblind mode — 8% of players (men) have red-green deficiency, so if your health bar is green and your poison status is red and they look identical, you've made the game unplayable for a chunk of your audience. Viridis and Cividis palettes are the "protanopia-friendly" toggle of data viz.
import matplotlib.pyplot as plt
import numpy as np

def make_colorblind_safe():
    print("Use colorblind-friendly palettes:\n")
    palettes = {
        "Viridis": ["#440154", "#3b528b", "#21918c", "#5ec962", "#fde725"],
        "Turbo":  ["#30123b", "#1ae4b6", "#fbdf4a", "#fc7c36", "#a50f15"],
        "Cividis":["#00204c", "#7a7c78", "#bebb8e", "#fdee9d", "#ffe4a0"],
    }
    for name, colors in palettes.items():
        print(f"  {name}: ", end="")
        for c in colors:
            print(f"\033[48;2;{int(c[1:3],16)};{int(c[3:5],16)};{int(c[5:7],16)}m  \033[0m", end=" ")
        print()

make_colorblind_safe()

# Also consider:
# - Shapes and markers (not just color)
# - Labels and annotations
# - High contrast ratios
# - Screen reader support for digital charts
```

**Output:**
```
Use colorblind-friendly palettes:

  Viridis:  ■  ■  ■  ■  ■
  Turbo:   ■  ■  ■  ■  ■
  Cividis: ■  ■  ■  ■  ■
```

> **🎮 Analogy:** Accessibility markers (shapes + labels) are like having distinct sound cues for different events — a player who can't see the red "low HP" flash can still hear the heartbeat thump. If your chart uses only color to distinguish lines, you've locked out the colorblind player from reading your story.

## Design Checklist

> **🎮 Analogy:** The visualization quality checklist is like the pre-raid gear check in World of Warcraft — before you present your chart to the boss (stakeholder), you run through every slot: is the chart type equipped right? Is the scale gem properly socketed? Are the labels enchanted? Missing one check means the raid leader sends you back to town.
def check_visualization():
    checklist = [
        ("Question", "Does this chart answer a clear question?"),
        ("Chart type", "Is the chart type appropriate for the data?"),
        ("Labels", "Are axes, legends, and titles clear?"),
        ("Scale", "Is the axis scale honest and appropriate?"),
        ("Color", "Are colors meaningful and accessible?"),
        ("Context", "Is there a benchmark or comparison?"),
        ("Anchors", "Are zero lines, targets, or thresholds shown?"),
        ("Data-ink", "Is every visual element necessary?"),
        ("Source", "Is the data source cited?"),
        ("Call to action", "Does the viewer know what to do?"),
    ]

    print("Visualization Quality Checklist:\n")
    for area, question in checklist:
        print(f"  [ ] {question}")
    print(f"\n{len(checklist)} checks before presenting data.")

check_visualization()
```

**Output:**
```
Visualization Quality Checklist:

  [ ] Does this chart answer a clear question?
  [ ] Is the chart type appropriate for the data?
  [ ] Are axes, legends, and titles clear?
  [ ] Is the axis scale honest and appropriate?
  [ ] Are colors meaningful and accessible?
  [ ] Is there a benchmark or comparison?
  [ ] Are zero lines, targets, or thresholds shown?
  [ ] Is every visual element necessary?
  [ ] Is the data source cited?
  [ ] Does the viewer know what to do?

10 checks before presenting data.
```

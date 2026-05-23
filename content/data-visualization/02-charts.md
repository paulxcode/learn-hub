---
title: Chart Types
skill: data-visualization
order: 2
---

> **🎮 Analogy:** Bar charts and line charts are your character's stat bars — that vertical bar showing your strength from 1 to 99? That's a bar chart. Your health bar depleting over time? That's a line chart. You've been reading charts your whole gaming life.

## Common Chart Types

> **🎮 Analogy:** Picking the right chart type is like choosing your weapon class in an RPG — use a bar chart (greatsword) when you need to compare categories head-to-head, a line chart (bow) for showing movement over time, and a scatter plot (magic staff) for revealing hidden relationships between variables.

### Bar Chart

> **🎮 Analogy:** A bar chart is your inventory screen sorted by quantity — you instantly see you have 500 iron ingots but only 3 diamonds. The taller the bar, the more you've got, no scrolling through spreadsheets required.

```python
import matplotlib.pyplot as plt

categories = ['Python', 'SQL', 'Pipelines', 'ML', 'Viz']
values = [95, 80, 75, 85, 90]

plt.bar(categories, values, color='royalblue')
plt.title("Skill Proficiency")
plt.ylabel("Confidence (%)")
plt.ylim(0, 100)

for i, v in enumerate(values):
    plt.text(i, v + 1, f"{v}%", ha='center')

plt.show()
```

> **🎮 Analogy:** A bar chart's superpower is comparison — like glancing at your party's HP bars and instantly knowing the mage is about to go down while the tank is still at 90%.

### Pie Chart

> **🎮 Analogy:** A pie chart is the loot distribution screen after a raid boss — you can immediately see who got the legendary drop (12%), who got gold (45%), and who got chewed-out by the RNG (3% got nothing). Just don't use it with more than 5 slices or it turns into a confusing pizza topping argument.

```python
import matplotlib.pyplot as plt

sizes = [30, 25, 20, 15, 10]
labels = ['Python', 'SQL', 'Pipelines', 'ML', 'Viz']
colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0']

plt.pie(sizes, labels=labels, colors=colors, autopct='%1.0f%%')
plt.title("Time Spent per Skill")
plt.show()
```

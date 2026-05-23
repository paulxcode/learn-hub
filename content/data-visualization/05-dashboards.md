---
title: Dashboards
skill: data-visualization
order: 5
---

> **🎮 Analogy:** A dashboard is the cockpit of a spaceship — your speed (revenue) on the main screen, fuel levels (inventory) on the left, enemy radar (market share) on the right, and a big red alert button when something goes below threshold.

## Dashboard Design Principles

- **Hierarchy**: Most important metric first
- **Context**: Compare against targets or history
- **Consistency**: Same colors = same meaning
- **Interactivity**: Let users drill down

> **🎮 Analogy:** Dashboard design principles are the HUD design rules from Halo — put the shield bar (most important KPI) front and center, keep the ammo counter (secondary metric) consistent in the corner, use red for "shields down" (danger) and green for "all clear" (healthy), and let players press down on the d-pad to see detailed weapon stats (drill-down).

## Building a Dashboard Mock

> **🎮 Analogy:** Building a dashboard with matplotlib subplots is like setting up your streaming overlay — you've got your facecam (KPI chart) in the top-left, the chat feed (trend line) on the right, the donation ticker (pie chart) bottom-right, and the game feed (main visualization) taking up the rest. Every panel has a job.

```python
import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.suptitle("Sales Dashboard", fontsize=16, fontweight='bold')

np.random.seed(42)

# KPI Cards
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
revenue = np.random.randint(80, 150, 6)
customers = np.random.randint(200, 500, 6)
conversion = np.random.uniform(2.5, 5.0, 6)

# Top-left: Revenue trend
axes[0, 0].plot(months, revenue, marker='o', color='#2ecc71', linewidth=2)
axes[0, 0].fill_between(range(6), revenue, alpha=0.2, color='#2ecc71')
axes[0, 0].set_title('Monthly Revenue ($K)')
axes[0, 0].set_ylim(0, 200)
axes[0, 0].grid(True, alpha=0.3)

# Top-right: Customers
axes[0, 1].bar(months, customers, color='#3498db', alpha=0.8)
axes[0, 1].set_title('New Customers')
axes[0, 1].set_ylim(0, 600)
axes[0, 1].grid(True, alpha=0.3)

# Bottom-left: Conversion rate
axes[1, 0].plot(months, conversion, marker='s', color='#e74c3c', linewidth=2)
axes[1, 0].axhline(y=conversion.mean(), color='gray', linestyle='--', alpha=0.5)
axes[1, 0].set_title('Conversion Rate (%)')
axes[1, 0].set_ylim(0, 6)
axes[1, 0].grid(True, alpha=0.3)

# Bottom-right: Revenue breakdown
categories = ['Product', 'Service', 'Subscription', 'Consulting']
values = [45, 25, 20, 10]
colors = ['#2ecc71', '#3498db', '#f39c12', '#9b59b6']
axes[1, 1].pie(values, labels=categories, colors=colors,
               autopct='%1.0f%%', startangle=90)
axes[1, 1].set_title('Revenue by Category')

plt.tight_layout()
plt.show()
```

## Dashboard Best Practices

> **🎮 Analogy:** Dashboard best practices are the UI optimization tips from speedrunning — "above the fold" means keeping the boss HP bar and your own health on screen at all times (no scrolling mid-fight), sparklines are the tiny cooldown indicators that show your skill's uptime at a glance, and filters are the hotkeys that let you swap loadouts without opening the menu.

1. **Above the fold**: Most important KPIs visible without scrolling
2. **Color with purpose**: Red = bad, green = good, blue = neutral
3. **Sparklines**: Mini line charts show trends in small spaces
4. **Filters**: Let users slice by date range, region, category
5. **Context**: Always show period-over-period comparisons
6. **Performance**: Pre-aggregate data, avoid live queries on large datasets

---
title: Data Storytelling
skill: data-visualization
order: 6
---

> **🎮 Analogy:** Data storytelling is gathering around a campfire after a raid — raw numbers are just loot drops, but a good storyteller weaves them into a tale of triumph, tragedy, and the one weird bug that nearly wiped the party.

## Visuals That Tell Stories

Data without context is noise. A good visualization answers a question.

> **🎮 Analogy:** A chart without context is like a boss fight with the HP bar turned off — technically the data is there, but you have no idea if you're winning or about to get one-shot. A good visualization is the boss's glowing weak point that tells you exactly where to hit.

## Bad vs Good Visuals

> **🎮 Analogy:** A truncated y-axis chart is the gaming equivalent of showing your K/D ratio as a bar chart that starts at 0.9 instead of 0 — suddenly your 1.2 K/D looks like you're a pro esports player when you're actually just barely above average. Always show the full axis, like always showing the full scoreboard.

```python
import matplotlib.pyplot as plt
import numpy as np

# Bad: misleading axis
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

months = ['Jan', 'Feb', 'Mar', 'Apr']
sales = [100, 102, 104, 103]

# Bad chart: truncated y-axis exaggerates change
ax1.plot(months, sales, marker='o', color='red', linewidth=2)
ax1.set_ylim(99, 105)
ax1.set_title("BAD: Truncated Y-Axis (drama!)")
ax1.grid(True, alpha=0.3)

# Good chart: zero-based y-axis shows truth
ax2.plot(months, sales, marker='o', color='green', linewidth=2)
ax2.set_ylim(0, 120)
ax2.set_title("GOOD: Full Y-Axis (honest)")
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
```

> **🎮 Analogy:** The "bad vs good" chart comparison is like showing two screenshots of the same game — one with the UI turned off (you see the game but nothing makes sense) and one with a clean, well-designed HUD (you immediately know your health, ammo, and objective).

## The Narrative Arc

> **🎮 Analogy:** A data story with a narrative arc is a full quest line in Skyrim — the setup is "there's a dragon attacking Helgen" (problem), the conflict is "you need the Elder Scroll but it's guarded by a thousand traps" (data exploration struggle), and the resolution is "Dragonrend shout unlocked, Alduin banished" (recommendation delivered).

```python
def tell_story():
    print("A good data story has three acts:\n")

    setup = {
        "question": "Are our sales declining?",
        "context": "Q1 2026 vs Q1 2025 comparison",
        "data_source": "Monthly sales reports"
    }
    print(f"ACT 1: Setup")
    print(f"  Question: {setup['question']}")
    print(f"  Context:  {setup['context']}")
    print(f"  Source:   {setup['data_source']}")

    conflict = {
        "finding": "Sales dropped 15% in March",
        "cause": "Supply chain disruption in Asia",
        "impact": "$2.3M revenue at risk"
    }
    print(f"\nACT 2: Conflict")
    print(f"  Finding: {conflict['finding']}")
    print(f"  Cause:   {conflict['cause']}")
    print(f"  Impact:  {conflict['impact']}")

    resolution = {
        "action": "Diversified suppliers in Europe",
        "result": "Sales recovering, projected +8% Q2",
        "recommendation": "Continue monitoring monthly"
    }
    print(f"\nACT 3: Resolution")
    print(f"  Action:  {resolution['action']}")
    print(f"  Result:  {resolution['result']}")
    print(f"  Next:    {resolution['recommendation']}")

tell_story()
```

**Output:**
```
A good data story has three acts:

ACT 1: Setup
  Question: Are our sales declining?
  Context:  Q1 2026 vs Q1 2025 comparison
  Source:   Monthly sales reports

ACT 2: Conflict
  Finding: Sales dropped 15% in March
  Cause:   Supply chain disruption in Asia
  Impact:  $2.3M revenue at risk

ACT 3: Resolution
  Action:  Diversified suppliers in Europe
  Result:  Sales recovering, projected +8% Q2
  Next:    Continue monitoring monthly
```

## Rules for Data Storytelling

> **🎮 Analogy:** The narrative arc in data is like the three-part structure of a Let's Play video — "here's the game and my goal" (setup), "oh no, I fell into a trap and lost all my gear" (conflict), "here's how I rebuilt and conquered the dungeon" (resolution). Your audience needs all three acts to stay engaged.

1. **Start with the question**, not the data
2. **Highlight the insight** — use color, annotation, callouts
3. **Remove noise** — every element must serve the story
4. **Show context** — compare against benchmark, prior period, target
5. **One chart, one message** — don't cram multiple stories
6. **Label directly** — legends make readers work harder

> **🎮 Analogy:** The "one chart, one message" rule is like having a single quest marker on your mini-map — if Skyrim put every quest, every shop, and every NPC on the same map marker, you'd be hopelessly lost. A chart with too many messages is a compass pointing everywhere at once.

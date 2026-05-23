---
title: Storytelling with Data
skill: data-visualization
order: 15
quiz:
  - type: mc
    question: "What is the '3-minute story' framework?"
    options:
      - "A presentation that must be exactly 3 minutes long"
      - "A technique for distilling your data insight into a compelling narrative that can be delivered in 3 minutes"
      - "A method for analyzing data in 3 minutes"
      - "A type of chart that takes 3 minutes to read"
    answer: 1
  - type: mc
    question: "According to Cole Nussbaumer Knaflic, what is the most effective way to draw attention in a visualization?"
    options:
      - "Use as many bright colors as possible"
      - "Use preattentive attributes (color, size, position) sparingly to highlight the most important elements"
      - "Add animation to every chart"
      - "Use 3D effects for depth"
    answer: 1
  - type: mc
    question: "What is an ethical concern in data presentation?"
    options:
      - "Using too many colors"
      - "Manipulating axis scales or cherry-picking data to mislead the audience"
      - "Showing too much data"
      - "Using simple language"
    answer: 1
---

> **🎮 Analogy:** Advanced data storytelling is a full RPG questline — you need a hook (the problem), rising action (data exploration), a plot twist (the unexpected insight), a climactic boss fight (the recommendation), and a satisfying epilogue (projected outcomes).

## Cole Nussbaumer Knaflic Principles

The book *Storytelling with Data* by Cole Nussbaumer Knaflic provides foundational principles:

> **🎮 Analogy:** Knaflic's principles are the game design pillars of data viz — just as a game needs clear core mechanics (Mario = jump, Portal = portal gun), a chart needs a clear purpose. If you can't state the "Big Idea" in one sentence before building the chart, you're designing the levels before deciding what game you're making.

```python
def knaflic_principles():
    principles = [
        {
            "principle": "1. Understand the context",
            "key_idea": "Who is your audience? What do you want them to know/do?",
            "action": "Write the 'Big Idea' in one sentence before creating anything.",
        },
        {
            "principle": "2. Choose an effective visual",
            "key_idea": "Simple, clear charts. Eliminate clutter (eliminate chartjunk).",
            "action": "Use bar/line only. Remove borders, gridlines, 3D effects.",
        },
        {
            "principle": "3. Focus attention",
            "key_idea": "Use preattentive attributes (color, size, position) strategically.",
            "action": "Make the key data point the only colored element (everything else gray).",
        },
        {
            "principle": "4. Think like a designer",
            "key_idea": "Use affordances, accessibility, and aesthetic integrity.",
            "action": "Align elements, use consistent fonts, respect white space.",
        },
        {
            "principle": "5. Tell a story",
            "key_idea": "Structure your presentation as a narrative, not a report.",
            "action": "Use the 3-minute story framework to crystallize your message.",
        },
    ]

    for p in principles:
        print(f"{p['principle']}")
        print(f"  Key idea: {p['key_idea']}")
        print(f"  Action:   {p['action']}\n")

knaflic_principles()
```

> **🎮 Analogy:** Principle 2 — 'Eliminate chartjunk' is the data viz equivalent of removing UI clutter in a game. Do you REALLY need that radial gradient behind the health bar, or the 3D bevel on the mini-map border? No. Strip it down to the functional core. A clean chart, like a clean HUD, lets the viewer focus on what matters.

> **🎮 Analogy:** Principle 3 — Preattentive attributes are the visual cues your brain processes before conscious thought, like how a red barrel in a game instantly registers as "explosive" before you read the label. Use one accent color for the insight and desaturate everything else — like the only glowing item in a dark dungeon is obviously the quest item.

> **🎮 Analogy:** Principle 4 — Accessibility in data viz is like subtitles and control remapping in games — not everyone experiences content the same way. Affordances (visual hints that show how to interact) are the subtle glow around an interactable object. Aesthetic integrity is using one consistent art style instead of mixing pixel art with photorealistic textures.

> **🎮 Analogy:** Principle 5 — Telling a story with data instead of dumping a report is the difference between a cinematic trailer and patch notes. The trailer makes you FEEL something and want to act; the patch notes list 47 bug fixes you'll forget in 3 seconds.

## The 3-Minute Story Framework

Distill your entire presentation into a compelling 3-minute narrative:

> **🎮 Analogy:** The 3-minute story framework is the elevator pitch for your game concept — if you can't explain "it's Dark Souls meets Stardew Valley with a grappling hook mechanic" in under 3 minutes, your game (data story) isn't focused enough. The 30-second setup is the logline, the 60-second conflict is the gameplay hook, the 90-second resolution is the unique selling point.

```python
def three_minute_story():
    print("Structure:\n")
    print("  1. SETUP  (30 seconds)")
    print("     'Our customer churn rate has increased 15% over the last quarter.'\n")
    print("  2. CONFLICT  (60 seconds)")
    print("     'We identified the root cause: a pricing change in April")
    print("      caused a 40% spike in cancellations among segment B customers.")
    print("      These customers are price-sensitive and were not given alternatives.'\n")
    print("  3. RESOLUTION  (90 seconds)")
    print("     'The recommendation is to:')
    print("       - Roll back the price increase for segment B")
    print("       - Offer a loyalty discount to at-risk accounts")
    print("       - Add a mid-tier pricing plan")
    print("      This is projected to recover 80% of lost customers within 60 days.'\n")

    print("Checklist for your 3-minute story:")
    checklist = [
        "Can I state the single most important insight in 10 seconds?",
        "Do I know what I want my audience to DO after this presentation?",
        "Can I explain why they should care in one sentence?",
        "Is every slide/section necessary to support the core narrative?",
    ]
    for i, item in enumerate(checklist, 1):
        print(f"  {i}. {item}")

three_minute_story()
```

> **🎮 Analogy:** The 3-minute story checklist is the "is my game fun?" playtest checklist — can you state the core loop in 10 seconds? Do you know what emotion you want players to feel? Is every mechanic necessary? If a level (slide) doesn't serve the core experience (narrative), cut it.

## Before/After Visualization Examples

The biggest impact comes from simplifying and focusing:

> **🎮 Analogy:** The Before/After visualization makeover is the "UI redesign your game desperately needed" — Before is the MMO interface from 2004 with 47 buttons, 3D-bevelled frames, a radial gradient background, and a font that looks like Papyrus. After is the modern HUD — minimal, purposeful, one call-to-action, and the insight is in the title like "You are taking too much damage" instead of "Damage Received Graph."

```python
def before_after():

    print("❌ BEFORE: Cluttered, overwhelming\n")
    print("  ┌────────────────────────────────────────────┐")
    print("  │ Sales Report (Q1 2024)                     │")
    print("  │ Revenue │ Cost │ Profit │ Growth │ ROI    │")
    print("  │  ████   │ ██   │  ███   │  ██    │ █      │")
    print("  │  ████   │ ██   │  ████  │  ██    │ ██     │")
    print("  │  ████   │ ██   │  ██    │  ██    │ █      │")
    print("  │  ████   │ ██   │  ████  │  ███   │ ███    │")
    print("  │ (gridlines, borders, legend, 3D, 12 colors)│")
    print("  └────────────────────────────────────────────┘\n")

    print("✅ AFTER: Focused, actionable\n")
    print("  ┌────────────────────────────────────────────┐")
    print("  │ Q1 Revenue is 8% Below Target              │  ← Big insight in title")
    print("  │                                            │")
    print("  │ $2.1M   ████████████████████████  ████████ │")
    print("  │         Actual                    Target   │")
    print("  │                                            │")
    print("  │  ● Shortfall is driven by Product Line B   │")
    print("  │  ● Recovery plan: increase B pricing 5%    │")
    print("  │                                            │")
    print("  │                         [single color: red]│")
    print("  └────────────────────────────────────────────┘")

    print("\n  Changes made:")
    print("    1. Replaced 5 charts with 1 focused visualization")
    print("    2. Put the insight in the title (not 'Sales Report')")
    print("    3. Used one accent color to draw attention to the gap")
    print("    4. Added clear call-to-action below the chart")

before_after()
```

> **🎮 Analogy:** The Before → After transformation is exactly the "Graphics: Low → Ultra" comparison in every game review — the Before is muddy textures and flat lighting (cluttered, confusing chart), the After is ray-traced reflections and ambient occlusion (clean, focused, insight-rich). The game is the same, but the experience is night and day.

## Ethics in Data Presentation

> **🎮 Analogy:** Misleading data tactics are the "fake loot box odds" of the data world — truncated y-axis is like showing "89.9% win rate" in big gold letters while hiding the 0.01% actual probability in the fine print. Cherry-picking data is showing only your best round in a multiplayer game and claiming you're a pro. Ethical data viz is like showing the full scoreboard including deaths and disconnects.

```python
def ethical_guidelines():
    print("Common misleading tactics to avoid:\n")

    ethics = [
        ("Truncated y-axis", "Starting axis above zero exaggerates differences"),
        ("Cherry-picking", "Selecting only data that supports your narrative"),
        ("Misleading scales", "Using dual y-axes to create false correlations"),
        ("Overaggregation", "Hiding important variation behind averages"),
        ("Data fishing", "Testing many hypotheses until one is 'significant'"),
        ("Confidence omission", "Not showing uncertainty or confidence intervals"),
        ("Context removal", "Showing absolute numbers without baseline/population"),
    ]

    print(f"{'Tactic':<25s} {'Why It Misleads'}")
    print("-" * 70)
    for tactic, reason in ethics:
        print(f"{tactic:<25s} {reason}")

    print("\nEthical presentation checklist:")
    checklist = [
        "Are my axes properly labeled and scaled?",
        "Am I showing the full context (not just favorable data)?",
        "Have I disclosed limitations and assumptions?",
        "Could someone misinterpret my visualization?",
        "Would I change anything if the results were unfavorable?",
    ]
    for i, item in enumerate(checklist, 1):
        print(f"  {i}. {item}")

    print("\n'Don't let the perfect be the enemy of the good'")
    print("but also: don't let the good be an excuse to mislead.")

ethical_guidelines()
```

> **🎮 Analogy:** The ethics checklist is the "before you publish your game" QA list — axes properly labeled is like making sure the tutorial text isn't cut off, full context is like showing system requirements honestly instead of claiming "runs on a potato," and "would I change this if the results were unfavorable?" is the "would I still ship this if a speedrunner found the glitch?" integrity check.

**Output:**
```
Tactic                    Why It Misleads
----------------------------------------------------------------------
Truncated y-axis          Starting axis above zero exaggerates differences
Cherry-picking            Selecting only data that supports your narrative
Misleading scales         Using dual y-axes to create false correlations
Overaggregation           Hiding important variation behind averages
Data fishing              Testing many hypotheses until one is 'significant'
Confidence omission       Not showing uncertainty or confidence intervals
Context removal           Showing absolute numbers without baseline/population

Ethical presentation checklist:
  1. Are my axes properly labeled and scaled?
  2. Am I showing the full context (not just favorable data)?
  3. Have I disclosed limitations and assumptions?
  4. Could someone misinterpret my visualization?
  5. Would I change anything if the results were unfavorable?
```

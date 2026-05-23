---
title: Dashboard Design
skill: data-visualization
order: 12
quiz:
  - type: mc
    question: "What is the best practice for dashboard layout?"
    options:
      - "Put the most important metric at the top-left (top-to-bottom, left-to-right reading)"
      - "Spread charts randomly for visual interest"
      - "Use as many colors as possible"
      - "Place all charts on separate tabs"
    answer: 0
  - type: mc
    question: "Which chart type is best for showing the distribution of a single numerical variable?"
    options:
      - "Pie chart"
      - "Histogram"
      - "Line chart"
      - "Scatter plot"
    answer: 1
  - type: mc
    question: "Why is color accessibility important in dashboards?"
    options:
      - "It makes dashboards look more professional"
      - "8% of men have color vision deficiency; using only red/green distinctions excludes them"
      - "It reduces file size"
      - "It improves query performance"
    answer: 1
---

> **🎮 Analogy:** Arranging a dashboard layout is like setting up your hotbar in an MMO — your most-used abilities (KPIs) go on the primary bar, cooldown timers (trends) on the secondary, and the fluff stays in the spellbook (appendix).

## Dashboard Layout Principles

A well-structured dashboard guides the eye naturally to the most important information:

> **🎮 Analogy:** The F-pattern dashboard layout is exactly how a fighting game's UI is arranged — your health bar (main KPI) is at the top, the timer (trend) is centered, your super meter (secondary metric) is bottom-left, and the combo counter (detail data) flashes in the corner. Players read the screen top-to-bottom, left-to-right, just like dashboard viewers.

```python

```python
def layout_principles():
    print("The F-pattern layout (top-left priority):\n")
    print("  ┌─────────────────────────────────────────────────┐")
    print("  │ ★ KPI: Revenue $2.4M    KPI: Users 48K        │  ← Most important at top")
    print("  │   KPI: Conversion 3.2%  KPI: Churn 1.1%        │")
    print("  ├──────────────────────┬──────────────────────────┤")
    print("  │ Revenue Over Time    │ Revenue by Region        │  ← Supporting detail")
    print("  │ (line chart)         │ (bar chart)              │")
    print("  ├──────────────────────┴──────────────────────────┤")
    print("  │ User Activity Table (sortable, filterable)      │  ← Detail data")
    print("  └─────────────────────────────────────────────────┘\n")

    print("Key principles:")
    principles = [
        "Hierarchy: KPI cards → charts → tables",
        "Consistency: same chart types for same metrics",
        "White space: don't overcrowd, aim for 5-9 visual elements max",
        "Context: always include benchmarks, targets, or time comparisons",
        "Scannability: title every chart, highlight key numbers",
    ]
    for p in principles:
        print(f"  - {p}")

layout_principles()
```

> **🎮 Analogy:** Every dashboard layout principle maps to a UI design rule from games — "hierarchy" is the boss health bar being bigger than the party member portraits, "consistency" is every game in a franchise using the same button for jump (A = jump, always), "white space" is the breathing room around HUD elements so you don't feel claustrophobic.

## Choosing the Right Chart Type

> **🎮 Analogy:** The chart type rule "if you need to explain the chart, pick a simpler one" is like the game design rule "if you need a tutorial pop-up for this mechanic, redesign the mechanic." A sunburst chart looks cool but confuses viewers — like a control scheme that requires a manual to understand. Stick to bar and line for the same reason games stick to WASD.

```python
def chart_selection_guide():
    print(f"{'Goal':<35s} {'Best Chart Type'}")
    print("-" * 65)
    guide = [
        ("Compare categories", "Bar chart (horizontal if many categories)"),
        ("Show trends over time", "Line chart"),
        ("Part-to-whole relationship", "Stacked bar chart (avoid pie charts > 5 categories)"),
        ("Distribution of one variable", "Histogram or box plot"),
        ("Relationship between two variables", "Scatter plot with trend line"),
        ("Geographic distribution", "Choropleth map or point map"),
        ("Change in rank over time", "Slope chart or bump chart"),
        ("Composition of a total", "100% stacked bar chart"),
        ("Correlation matrix", "Heatmap"),
        ("Hierarchical data", "Treemap or sunburst chart"),
    ]
    for goal, chart in guide:
        print(f"{goal:<35s} {chart}")
    print("\nRule: if you need to explain the chart type, pick a simpler one.")

chart_selection_guide()
```

**Output:**
```
Goal                                  Best Chart Type
-----------------------------------------------------------------
Compare categories                    Bar chart (horizontal if many)
Show trends over time                 Line chart
Part-to-whole relationship            Stacked bar (avoid pie > 5 categories)
Distribution of one variable          Histogram or box plot
Relationship between two variables    Scatter plot with trend line
Geographic distribution               Choropleth map or point map
Change in rank over time              Slope chart or bump chart
Composition of a total                100% stacked bar chart
Correlation matrix                    Heatmap
Hierarchical data                     Treemap or sunburst chart

Rule: if you need to explain the chart type, pick a simpler one.
```

## Color Theory and Accessibility

> **🎮 Analogy:** The chart selection guide is your party formation screen — comparing categories is the front-line tank (bar chart), showing trends is the back-line support (line chart), and revealing relationships is the scout (scatter plot). Put the wrong unit in the wrong role and your formation crumbles. Wrong chart type = wrong role.

```python
def color_guidelines():
    print("Color Do's and Don'ts:\n")

    print("  ✅ DO:")
    print("     - Use a consistent, limited palette (5-7 colors max)")
    print("     - Use sequential palettes for magnitude (light→dark)")
    print("     - Use diverging palettes for deviations from a midpoint")
    print("     - Use qualitative palettes for distinct categories")
    print("     - Check contrast for readability\n")

    print("  ❌ DON'T:")
    print("     - Use red/green alone for important distinctions")
    print("     - Use rainbow/jet color maps (perceptually non-uniform)")
    print("     - Use more than 2-3 font sizes")
    print("     - Put text on busy backgrounds\n")

    print("  Accessibility tools:")
    print("     - Color Oracle (simulates color blindness)")
    print("     - WebAIM Contrast Checker")
    print("     - ColorBrewer 2.0 (color-blind safe palettes)")
    print("     - Viridis, Plasma, Cividis (perceptually uniform)\n")

    print("  Example color-blind safe palette:")
    print("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("  #0077BB  #EE7733  #009988  #CC3311  #33BBEE")
    print("  (blue)   (orange) (teal)   (red)    (cyan)")

color_guidelines()
```

> **🎮 Analogy:** Color accessibility is the "colorblind mode" toggle that every modern game has — using red for "bad" and green for "good" is like making enemy outlines red and friendly outlines green, which works fine UNLESS 8% of your players can't tell them apart. ColorBrewer palettes are the equivalent of "Outlined Enemies" mode — everyone can see clearly regardless of color vision.

## Mobile-Friendly Dashboards

> **🎮 Analogy:** Mobile-friendly dashboards are the handheld/console mode in modern games — on desktop you have a full HUD with 12 elements, but on mobile you get the simplified version: just the health bar, mini-map, and quest marker. Same game (data), but the UI compresses down to what fits on a phone screen without losing the essential experience.
def mobile_dashboard():
    print("Mobile design considerations:\n")

    print("  1. Responsive layout")
    print("     - Single-column on mobile, multi-column on desktop")
    print("     - Stack KPIs vertically instead of horizontally\n")

    print("  2. Touch targets")
    print("     - Minimum 44x44px for interactive elements")
    print("     - Swipe gestures for horizontal scrolling through charts\n")

    print("  3. Content prioritization")
    print("     - Show only the top 3 KPIs and 2 charts on mobile")
    print("     - 'See more' expandable sections for detail\n")

    print("  4. Simplify interactions")
    print("     - No hover-dependent tooltips (tap instead)")
    print("     - Filters become dropdown menus, not drag-select\n")

    print("  5. Performance")
    print("     - Reduce data points for faster rendering")
    print("     - Lazy-load charts as user scrolls\n")

    print("  BI tool support:")
    print("     - Tableau: Device Layout Designer")
    print("     - Power BI: Phone report layouts")
    print("     - Looker: Responsive CSS grid")

mobile_dashboard()
```

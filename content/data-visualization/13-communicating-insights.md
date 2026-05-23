---
title: Communicating Insights
skill: data-visualization
order: 13
quiz:
  - type: mc
    question: "What is the recommended first step in structuring a data narrative?"
    options:
      - "Show all the data in a table"
      - "Start with the business question or problem you're solving"
      - "Build the most complex chart first"
      - "List every assumption you made"
    answer: 1
  - type: mc
    question: "How should you adapt a presentation for an executive audience?"
    options:
      - "Include all technical methodology details"
      - "Lead with the key insight and recommendation; put technical details in the appendix"
      - "Show raw data tables"
      - "Explain the math behind every statistical test"
    answer: 1
  - type: mc
    question: "What is the purpose of annotations in a data visualization?"
    options:
      - "To make the chart look more professional"
      - "To highlight key events, outliers, or changes that tell the story"
      - "To fill empty space on the dashboard"
      - "To replace the chart title"
    answer: 1
---

> **🎮 Analogy:** Presenting insights to stakeholders is like reporting your quest findings to the village council — skip the part where you killed 47 rats for 3 XP each, and get straight to "the dragon is weak to fire and lives in the northern cave."

## Structuring Data Narratives

Good data communication follows a story arc, not a data dump:

> **🎮 Analogy:** Structuring a data narrative is like planning your speedrun route — you don't show the audience every single room you cleared (raw data), you skip the trash mobs and only highlight the key skips (the insight), the boss fights (the conflicts), and the final time save (the recommendation). A "data dump" presentation is a speedrun where you fight every single goblin.

```python

```python
def narrative_structure():
    print("The Pyramid Principle (Barbara Minto):\n")
    print("  ┌──────────────────────────────────┐")
    print("  │   Key Insight / Recommendation    │  ← Start here")
    print("  ├──────────────────────────────────┤")
    print("  │      Supporting Arguments        │")
    print("  │   ├── Data Point 1               │")
    print("  │   ├── Data Point 2               │")
    print("  │   └── Data Point 3               │")
    print("  ├──────────────────────────────────┤")
    print("  │        Detailed Evidence         │")
    print("  │   charts, tables, methodology    │  ← Appendix")
    print("  └──────────────────────────────────┘\n")

    print("Alternative: Situation → Complication → Resolution\n")
    print("  Situation: 'Our customer base grew 20% this year'")
    print("  Complication: 'But retention dropped to 65%'")
    print("  Resolution: 'Implementing a loyalty program could recover 10 points'")

narrative_structure()
```

> **🎮 Analogy:** The Pyramid Principle (insight first, then support, then details) is exactly how game reviews are structured — "8.5/10 — great game, flawed ending" (key insight), then "combat is fluid and rewarding, but the final boss is bullet-spongy" (supporting arguments), then "here's my full playthrough with timestamps" (detailed evidence in the appendix).

## Executive vs Technical Audiences

> **🎮 Analogy:** Presenting to executives vs technical teams is like explaining a game to a producer vs a developer — the producer wants to know "will this ship on time and make money?" (top-line metrics, one-pager), while the developer wants to know "is the render pipeline optimized and does the netcode handle 60fps?" (full methodology, edge cases, and system architecture).

```python
def audience_adaptation():
    print(f"{'Aspect':<30s} {'Executive':<40s} {'Technical'}")
    print("-" * 100)
    rows = [
        ("Goal", "Decision support", "Deep understanding"),
        ("Level of detail", "Top-line metrics, one-pager", "Full methodology, edge cases"),
        ("Visualizations", "Simple bars, lines, big numbers", "Complex charts, distributions"),
        ("Language", "Business terms, no jargon", "Technical terminology OK"),
        ("Format", "Slide deck (5-10 slides)", "Report or notebook (20+ pages)"),
        ("Interaction", "Q&A at the end", "Deep dive throughout"),
        ("Ask", "What should we do?", "Why does this happen?"),
    ]
    for aspect, exec_aud, tech_aud in rows:
        print(f"{aspect:<30s} {exec_aud:<40s} {tech_aud}")
    print("\nPro tip: always prepare a 'one-pager' summary + detailed appendix.")

audience_adaptation()
```

**Output:**
```
Aspect                         Executive                              Technical
----------------------------------------------------------------------------------------------------
Goal                           Decision support                       Deep understanding
Level of detail                Top-line metrics, one-pager            Full methodology, edge cases
Visualizations                 Simple bars, lines, big numbers        Complex charts, distributions
Language                       Business terms, no jargon              Technical terminology OK
Format                         Slide deck (5-10 slides)               Report or notebook (20+ pages)
Interaction                    Q&A at the end                         Deep dive throughout
Ask                            What should we do?                     Why does this happen?

Pro tip: always prepare a 'one-pager' summary + detailed appendix.
```

> **🎮 Analogy:** The "one-pager + appendix" strategy is the "executive summary" of game design documents — the one-pager is what the publisher reads to decide if they fund the game, the appendix is what the dev team references during implementation. The exec doesn't need to know about the animation blend trees.

## Annotations and Callouts

Annotations transform charts from data displays into narratives:

> **🎮 Analogy:** Annotations on a chart are the quest markers and waypoints on your game map — without them, you're wandering aimlessly through data hoping to find something interesting. A well-placed arrow annotation saying "Sales spiked here after the marketing campaign (30% lift)" is the game telling you "the treasure is buried under the big X."

```python

```python
def annotation_guide():
    print("Annotation types and when to use them:\n")

    annotations = [
        ("Marker annotation", "Highlight a specific data point (e.g., product launch date)"),
        ("Range annotation", "Shade a period of interest (e.g., promotional period)"),
        ("Reference line", "Show a target, benchmark, or threshold"),
        ("Text annotation", "Explain an outlier or trend change directly on the chart"),
        ("Arrow + label", "Point to an event and describe its impact"),
        ("Trend line", "Show the overall direction (linear regression, moving average)"),
    ]

    for ann_type, use in annotations:
        print(f"  {ann_type:<25s} {use}")

    print("\nExample annotation on a line chart:")
    print("  sales |                              ★ Marketing campaign")
    print("        |     ╱╲                        (30% lift)")
    print("        |    ╱  ╲    ╱╲")
    print("        |   ╱    ╲  ╱  ╲")
    print("        |  ╱      ╲╱    ╲")
    print("        | ╱                      ─── Target")
    print("        └─────────────────────────────")
    print("           Jan  Feb  Mar  Apr  May")

annotation_guide()
```

> **🎮 Analogy:** Reference lines on a chart are like the par time in a racing game — the dotted line shows you the target (best lap / benchmark), and your actual data line shows if you're ahead or behind. Without that reference, a lap time of 1:32 means nothing — are you winning or terrible? The reference line is your context.

## Common Data Storytelling Frameworks

> **🎮 Analogy:** The "What? So What? Now What?" framework is the three stages of a boss guide on YouTube — "What" is the boss's health pool and moveset (the data), "So What" is "this boss has a one-shot mechanic that wipes your party" (why it matters), and "Now What" is "stand behind the pillar when he glows red, then DPS" (the action recommendation). Your data story needs all three stages too.
def storytelling_frameworks():
    frameworks = {
        "What? So What? Now What?": {
            "What": "The facts and data (e.g., sales dropped 15%)",
            "So What": "Why it matters (e.g., this puts Q4 targets at risk)",
            "Now What": "Recommended action (e.g., increase ad spend by 20%)",
        },
        "The 3-Act Structure": {
            "Setup": "Context and baseline metrics",
            "Conflict": "The insight or problem revealed by the data",
            "Resolution": "The recommendation and expected outcome",
        },
        "Before/After": {
            "Before": "The problem state (high churn, low engagement)",
            "After": "The improved state after intervention",
            "Bridge": "What changed and why it worked",
        },
    }

    for framework, stages in frameworks.items():
        print(f"{framework}:")
        for stage, desc in stages.items():
            print(f"  {stage:<15s} {desc}")
        print()

    print("Pick the framework that fits your audience and message.")
    print("For executives: 'What? So What? Now What?' is most effective.")

storytelling_frameworks()
```

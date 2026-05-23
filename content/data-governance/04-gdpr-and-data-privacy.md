---
title: GDPR and Data Privacy
skill: data-governance
order: 4
quiz:
  - type: mc
    question: "Under GDPR, what does the right to data portability mean?"
    options:
      - "Users can request their data be transferred to another controller in a machine-readable format"
      - "Users can delete all of their data permanently"
      - "Users can object to automated decision-making"
      - "Users can request correction of inaccurate data"
    answer: 0
  - type: mc
    question: "When is a Data Protection Impact Assessment (DPIA) required?"
    options:
      - "For all data processing activities"
      - "When processing is likely to result in high risk to individuals' rights and freedoms"
      - "Only when processing sensitive data outside the EU"
      - "When processing data for marketing purposes"
    answer: 1
  - type: mc
    question: "What does privacy by design require?"
    options:
      - "Privacy features are added after a product launch"
      - "Privacy is considered from the start of system design"
      - "Users must opt in to all data collection manually"
      - "Data must be stored in encrypted format only"
    answer: 1
---

> **🎮 Analogy:** GDPR is the bouncer of the data nightclub — you can't just grab someone's phone number from the guest list and start texting them memes at 2 AM. You need consent, a clear purpose, and the ability to delete that number when they tell you to buzz off.

## Key GDPR Principles

The General Data Protection Regulation (GDPR) gives individuals control over their personal data. Key rights include:

| Right | What It Means | Technical Impact |
|-------|---------------|-----------------|
| **Right to Access** | Individuals can request all data you hold about them | Need query to extract all data for a user ID |
| **Right to Erasure** | "Right to be forgotten" — delete personal data on request | Cascading deletes across all systems |
| **Right to Portability** | Export data in a machine-readable format (JSON, CSV) | Standardized export endpoint |
| **Right to Rectification** | Correct inaccurate personal data | Update propagation to downstream systems |

> **🎮 Analogy:** GDPR rights are like your character sheet in an MMO — you can inspect everything the devs know about your character (access), delete your save file (erasure), transfer your character to another server (portability), and fix the typo in your character name that you've been regretting since 2019 (rectification).

## Data Protection Impact Assessments (DPIA)

A DPIA is a risk assessment required when processing is likely to result in **high risk** to individuals. This includes:

- Systematic profiling of individuals
- Large-scale processing of special category data (health, biometrics, genetics)
- Public area monitoring (CCTV)
- New technologies deployed for processing

A DPIA documents the processing purpose, necessity assessment, risks, and mitigations.

> **🎮 Analogy:** A DPIA is the threat assessment your party does before entering a dragon's lair — is the dragon home (high risk), are we carrying too much gold (sensitive data), do we have fire resistance potions (mitigations), and should we maybe just leave the shiny armor at camp (data minimization).

## Consent Management

Consent must be **freely given, specific, informed, and unambiguous**. Pre-ticked checkboxes are invalid. You must:

- Record what the user consented to (versioned consent records)
- Allow withdrawal as easily as giving consent
- Refresh consent periodically for sensitive processing

```json
// Example: Consent record
{
  "user_id": "u_42a1",
  "timestamp": "2026-05-20T14:30:00Z",
  "purposes": {
    "marketing_emails": true,
    "analytics": true,
    "third_party_sharing": false
  },
  "version": "v2.1",
  "source": "signup_form"
}
```

> **🎮 Analogy:** Consent management is the party invite system in an online game — you need a clear "click here to join" button, a cancel option that's not hidden in three nested menus, and a record of exactly which expansions they agreed to get notifications about before you start spamming their inbox.

## Privacy by Design and Default

- **By design** — Privacy controls are architected into the system from day one, not bolted on later.
- **By default** — The most privacy-friendly settings apply automatically. Users opt *in* to less private settings.

> **🎮 Analogy:** Privacy by design is building your game with the fog of war on by default, the minimap only showing what the player has actually explored, and no wallhack cheat codes shipping with the disc. Privacy by default means that when a new player joins, their profile is automatically set to "invisible" — they opt in to being seen.

Practical implementation: data minimization (collect only what you need), pseudonymization, access controls, and short retention periods.

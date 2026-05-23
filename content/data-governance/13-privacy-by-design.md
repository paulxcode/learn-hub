---
title: Privacy by Design
skill: data-governance
order: 13
quiz:
  - type: mc
    question: "How many foundational principles make up Privacy by Design?"
    options:
      - "5"
      - "7"
      - "10"
      - "3"
    answer: 1
  - type: mc
    question: "Data minimization in practice means:"
    options:
      - "Storing only encrypted data"
      - "Collecting only the data directly needed for the specified purpose"
      - "Keeping data for the shortest possible time"
      - "Anonymizing all data after collection"
    answer: 1
  - type: mc
    question: "Purpose limitation requires that data is:"
    options:
      - "Collected for any purpose and used freely"
      - "Collected for specified, explicit, and legitimate purposes and not processed in incompatible ways"
      - "Stored indefinitely for research"
      - "Shared with all third parties"
    answer: 1
---

> **🎮 Analogy:** Privacy by design is the difference between building a castle with the moat already dug, the drawbridge already up, and the dragon already patrolling — versus building the castle, realizing you forgot a back door, and panic-welding iron bars over it after the siege has already started.

## The 7 Foundational Principles

Privacy by Design, developed by Dr. Ann Cavoukian, embeds privacy into the design of systems and processes from the start:

| # | Principle | Meaning |
|---|-----------|---------|
| 1 | **Proactive not Reactive** | Prevent privacy issues before they occur, don't wait for breaches |
| 2 | **Privacy as Default** | Personal data is automatically protected; users don't need to take action |
| 3 | **Privacy Embedded into Design** | Privacy is a core component, not a bolt-on afterthought |
| 4 | **Full Functionality** | Privacy doesn't degrade system functionality or user experience |
| 5 | **End-to-End Security** | Data is protected throughout its entire lifecycle |
| 6 | **Visibility and Transparency** | Operations are open; users can verify privacy promises |
| 7 | **Respect for User Privacy** | User-centric design; give users control over their data |

> **🎮 Analogy:** The 7 principles are like the design philosophy behind a legendary game console — proactive means patching security holes before hackers find them (not after), privacy as default means the parental controls are ON out of the box, embedded means the OS itself is sandboxed so apps can't peek at each other's memory, full functionality means privacy mode doesn't turn off online multiplayer, end-to-end means your save data is encrypted even while syncing, visibility means you can see exactly which apps accessed your camera, and respect means you get a clear "this app wants to see your friends list — allow or deny?" prompt.

## Data Minimization

Collect **only** the data you need — nothing more. If a feature can work with an age range instead of a birth date, use the range. If aggregated trends suffice, don't collect individual records.

> **🎮 Analogy:** Data minimization is the game developer who asks "do we actually need the player's full date of birth and home address for a high score leaderboard, or can we just ask for a display name and their time zone?" If the feature can work with an age range instead of a birth date, use the range. If aggregated stats suffice, don't log every button press.

```python
# Bad: collecting everything
signup_form = {
    "full_name": field,
    "birth_date": field,
    "phone": field,
    "address": field,
    "income": field,
    "interests": field,
    "device_id": field,
}
# Good: collect only what's needed
signup_form = {
    "email": field,        # Needed: account recovery
    "display_name": field, # Needed: profile display
    "age_range": field,    # Instead of birth_date
}
```

## Purpose Limitation

Data collected for one purpose cannot be repurposed without fresh consent or a lawful basis. A customer who gives their email for order confirmation did NOT consent to marketing emails.

Implementation strategies:

- **Separate consent checkboxes** for each purpose (not bundled together)
- **Purpose tagging** on all data — every field records why it was collected
- **Access controls** that block repurposing — e.g., marketing cannot query support data

> **🎮 Analogy:** Purpose limitation is the "no feeding the gremlins after midnight" rule of data — if a player gave you their email for a one-time password reset, you can't turn around and use that email to send "HEY, OUR NEW SEASON PASS IS OUT!" newsletters unless they specifically checked a separate box that says "yes, bother me about season passes." The support team's contact info is not the marketing team's mailing list.

## Privacy Impact Assessments

A Privacy Impact Assessment (PIA) is a systematic process to evaluate how a project or system affects individual privacy. It includes:

1. **Description** — What data is collected, from whom, and for what purpose
2. **Necessity assessment** — Is each data element necessary? Can it be minimized?
3. **Risk identification** — What could go wrong? (re-identification, unauthorized access, function creep)
4. **Mitigations** — Technical and organizational controls to reduce risks
5. **Sign-off** — Approval from privacy officer or DPO

> **🎮 Analogy:** A PIA is the pre-release security audit your game undergoes before going online — you document every telemetry point the game collects (what data, from who, why), ask "do we REALLY need to know their GPS coordinates or is city-level good enough," imagine what a hacker could do with this data, implement mitigations, and get a sign-off from the producer before shipping the online features.

```yaml
# Example: PIA summary
project: customer_personalization_engine
data_collected: [page_views, purchase_history, location_city]
lawful_basis: consent
risks:
  - profiling_without_transparency: high
  - re_identification_from_location: medium
mitigations:
  - implement_transparency_dashboard
  - anonymize_location_to_city_level
approved_by: dpo
status: conditional_approval
```

---
title: Data Classification
skill: data-governance
order: 12
quiz:
  - type: mc
    question: "Which classification level typically applies to data that would cause significant harm to the organization if disclosed?"
    options:
      - "Public"
      - "Internal"
      - "Confidential"
      - "Restricted"
    answer: 2
  - type: mc
    question: "What is automated data classification?"
    options:
      - "Users manually tagging files with labels"
      - "Using machine learning or pattern matching to detect and label sensitive data"
      - "Encrypting all data automatically"
      - "Creating backup copies of classified data"
    answer: 1
  - type: mc
    question: "A file labeled 'CUI' (Controlled Unclassified Information) is an example of:"
    options:
      - "Public data"
      - "Tagging sensitive but unclassified data"
      - "Top secret government data"
      - "Deleted data"
    answer: 1
---

> **🎮 Analogy:** Data classification is the Sorting Hat for your files — public data goes to Hufflepuff (hanging out for anyone to see), internal goes to Ravenclaw (need the right credentials), confidential goes to Slytherin (strict need-to-know), and restricted is the Restricted Section of the Hogwarts library where even Hermione needs permission.

## Classification Levels

Data classification organizes data into **tiers based on sensitivity and impact** if compromised:

| Level | Definition | Examples | Access | Encryption |
|-------|-----------|----------|--------|------------|
| **Public** | No harm if disclosed | Marketing materials, press releases | No restriction | Not required |
| **Internal** | Minor harm if disclosed | Internal wikis, org charts | All employees | At rest recommended |
| **Confidential** | Significant harm if disclosed | Customer data, financials | Need-to-know + approval | Required at rest and in transit |
| **Restricted** | Severe harm if disclosed | Trade secrets, PII, PHI | Named individuals + audit | Strong encryption + DLP |

> **🎮 Analogy:** Classification levels are like how developers treat game spoilers — public is the official trailer, internal is the early-access review that can talk about the first 10 hours, confidential is the full game review copy with NDAs, and restricted is the physical script locked in the writer's safe that even the voice actors only see their own lines.

## Automated Classification

Manual classification doesn't scale. Automated tools use:

- **Pattern matching** — Regex for credit cards (`\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b`), SSNs, email addresses
- **ML classifiers** — Trained models that detect sensitive content by context (e.g., "diagnosis" in a medical note)
- **Metadata inspection** — File properties, database column names, tags
- **Data fingerprinting** — Exact or fuzzy matching against known sensitive datasets

> **🎮 Analogy:** Automated classification is like a game's profanity filter on steroids — instead of just catching swear words, it's scanning every chat message for credit card numbers, social security numbers, and phone numbers, then auto-tagging that conversation as "sensitive" and routing it to the compliance team instead of the chat archive.

```python
# Example: Automated PII detection
import re

PII_PATTERNS = {
    "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
    "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
    "credit_card": r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b",
    "phone_us": r"\b\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b",
}

def classify_column(name, sample_values):
    detected_patterns = set()
    for value in sample_values:
        for pii_type, pattern in PII_PATTERNS.items():
            if re.search(pattern, str(value)):
                detected_patterns.add(pii_type)
    if detected_patterns:
        return "confidential", detected_patterns
    return "internal", []
```

## Labeling and Tagging

Classification is only useful if labels are visible and actionable. Apply labels at multiple layers:

- **File level** — Watermarks, metadata tags (e.g., Microsoft Purview sensitivity labels)
- **Database level** — Column tags: `customer.email [PII] [GDPR] [confidential]`
- **API level** — Response headers: `X-Data-Sensitivity: confidential`
- **UI level** — Visual indicators for sensitive dashboards

> **🎮 Analogy:** Labeling and tagging is like putting warning stickers on every item in your game — weapons with "CAUTION: CONTAINS PII" in red, armor with "GDPR_COMPLIANT" as a tag, and magical scrolls flagged with "RESTRICTED — requires quest completion to read." If the label is missing, players (and auditors) have no idea they're holding a nuke instead of a firecracker.

## Handling Sensitive Data

Once classified, sensitive data needs additional controls:

- **Access** — Require approval workflows, time-bound access, audit logging
- **Storage** — Encrypt at rest; separate from non-sensitive data in the same database
- **Transmission** — Encrypt in transit; block via DLP if sent to unauthorized destinations
- **Disposal** — Cryptographic destruction (destroy encryption keys) or physical shredding

> **🎮 Analogy:** Handling sensitive data is treating that data like a cursed item in an RPG — only certain party members (access approval) can even touch it, it stays in a special bag of holding separate from your normal inventory (separate storage), it can only be traded through secure guild channels (encrypted transmission), and when you finally get rid of it, you don't just drop it on the ground — you cast Disintegrate on the bag too (cryptographic destruction).

---
title: Compliance Standards
skill: data-governance
order: 10
quiz:
  - type: mc
    question: "SOC 2 reports are based on which set of criteria?"
    options:
      - "ISO 27001 controls"
      - "Trust Services Criteria (security, availability, confidentiality, processing integrity, privacy)"
      - "GDPR principles"
      - "HIPAA privacy rules"
    answer: 1
  - type: mc
    question: "Which of the following is a key requirement under HIPAA?"
    options:
      - "All data must be stored in the US"
      - "Protected Health Information (PHI) must have specific administrative, physical, and technical safeguards"
      - "Patients must opt in to all data processing"
      - "Data must be deleted after 30 days"
    answer: 1
  - type: mc
    question: "ISO 27001 focuses on:"
    options:
      - "Data privacy regulations"
      - "Information security management systems (ISMS)"
      - "Cloud infrastructure standards"
      - "Software development methodologies"
    answer: 1
---

> **🎮 Analogy:** Compliance audits are the Dark Souls of paperwork — SOC 2, ISO 27001, HIPAA, PCI DSS. Each standard is a boss fight with its own attack patterns, and getting certified means you've beaten them all without using cheat codes. The reward? Someone trusted you enough to handle their data.

## SOC 2

SOC 2 is an auditing standard developed by the American Institute of CPAs (AICPA). It evaluates controls based on the **Trust Services Criteria**:

| Category | Description |
|----------|-------------|
| **Security** | Protected against unauthorized access (the common criteria — always included) |
| **Availability** | System is available for operation and use as committed |
| **Confidentiality** | Confidential information is protected during processing |
| **Processing Integrity** | Processing is complete, valid, accurate, and authorized |
| **Privacy** | Personal information is collected, used, retained, and disclosed appropriately |

A SOC 2 report includes a description of controls plus an opinion from a licensed CPA firm.

> **🎮 Analogy:** SOC 2 is like getting DDoS-protected by Cloudflare — customers need to know you have basic defenses in place, so a CPA firm audits your security (always required), uptime promises, confidentiality, data processing accuracy, and privacy practices. It's the "verified blue checkmark" for data handlers.

## ISO 27001

ISO 27001 is an international standard for **Information Security Management Systems (ISMS)**. Key components:

- **Risk assessment** — Identify threats, vulnerabilities, and impacts
- **Annex A controls** — 93 controls across 4 domains (organizational, people, physical, technological)
- **Continuous improvement** — Plan-Do-Check-Act cycle
- **Certification** — Third-party audit, renewed every 3 years with surveillance audits

> **🎮 Analogy:** ISO 27001 is the "getting fit" plan for your data security — you assess your risks (where do I keep the snacks?), implement 93 controls across 4 domains (lock the fridge, meal prep, gym schedule, wearable tracker), and a personal trainer (auditor) checks your progress every 3 years to renew your certification.

## HIPAA

The Health Insurance Portability and Accountability Act applies to **covered entities** (healthcare providers, insurers) and **business associates** (vendors handling health data). Requirements include:

- **Administrative safeguards** — Risk analysis, training, contingency planning
- **Physical safeguards** — Facility access controls, workstation security
- **Technical safeguards** — Access control, audit controls, integrity controls, transmission security
- **Breach notification** — Notify affected individuals within 60 days

> **🎮 Analogy:** HIPAA is the hospital level in a stealth game — certain doorways require keycards (access control), alarms go off if you enter the wrong wing (audit controls), all conversations over the PA system (transmission) are encrypted, and if a patient's chart slips out the window, you have 60 days to tell them their medical history might be in the parking lot.

```yaml
# Example: Compliance mapping for a data platform
compliance_mapping:
  soc2:
    criteria: [security, availability, confidentiality]
    controls_implemented:
      - access_reviews_quarterly
      - encryption_at_rest
      - encryption_in_transit
      - incident_response_playbook
  hipaa:
    applies: false  # no PHI processed
  gdpr:
    applies: true
    dpo: assigned
    data_retention_schedule: published
    consent_management: implemented
```

## Industry-Specific Regulations

| Industry | Regulation | Key Requirement |
|----------|-----------|----------------|
| Finance | SOX | Audit trails for financial reporting |
| Finance | PCI DSS | Protect cardholder data |
| Healthcare | HIPAA | Protect PHI |
| Education | FERPA | Protect student records |
| Public sector | FedRAMP | Cloud security for government data |
| All (EU) | GDPR | Personal data protection |

> **🎮 Analogy:** Industry regulations are like different platform rules for game developers — Steam (SOC 2) has general store policies, the Nintendo seal of quality (ISO) means rigorous testing, hospital-themed games need extra disclaimers (HIPAA), and if you handle kids' data (FERPA/FedRAMP) you need ten times the parental consent forms and a government clearance badge.

---
title: Auditing Data Systems
skill: data-governance
order: 14
quiz:
  - type: mc
    question: "What information is essential in an audit log entry?"
    options:
      - "User ID, timestamp, action, resource, outcome"
      - "User ID and timestamp only"
      - "Action and resource only"
      - "IP address and browser type"
    answer: 0
  - type: mc
    question: "What is SIEM used for?"
    options:
      - "Data storage and retrieval"
      - "Real-time analysis of security alerts from multiple sources"
      - "Database performance monitoring"
      - "User authentication"
    answer: 1
  - type: mc
    question: "Which practice is critical for maintaining a trustworthy audit trail?"
    options:
      - "Storing logs in plain text for readability"
      - "Making audit logs append-only and tamper-evident"
      - "Deleting logs older than 30 days"
      - "Allowing administrators to edit log entries"
    answer: 1
---

> **🎮 Analogy:** Audit logs are the security camera system of your data fortress — except it's also watching the security guards, the cameras are tamper-proof, and there's a blockchain-powered notary taking notes on the notary taking notes. Inception, but for compliance.

## Audit Logs

An audit log records **who did what, when, and with what result**. Every data system should log:

| Field | Example | Why It Matters |
|-------|---------|----------------|
| **User ID** | `alice@company.com` | Who performed the action |
| **Timestamp** | `2026-05-22T14:30:00Z` | When it happened |
| **Action** | `SELECT`, `UPDATE`, `DELETE`, `EXPORT` | What was done |
| **Resource** | `analytics.fct_orders` | What data was affected |
| **Outcome** | `success`, `denied`, `error` | What happened |
| **Context** | `IP=10.0.1.42, app=crm_dashboard` | How it was done |

> **🎮 Analogy:** Audit logs are the combat log in an MMO — every time someone casts a spell, loots a corpse, or opens a door, the server records who, what, when, and whether it worked. When the guild master asks "WHO took the legendary sword from the guild bank?!" you don't need accusations — you query the audit log and find Fred from accounting did it at 3:17 AM.

```sql
-- Example: Querying audit logs
SELECT
    user_id,
    action,
    resource,
    timestamp
FROM audit_logs
WHERE resource LIKE '%customer%'
  AND action IN ('EXPORT', 'DELETE')
  AND timestamp >= NOW() - INTERVAL 30 DAYS
ORDER BY timestamp DESC;
```

## SIEM Integration

Security Information and Event Management (SIEM) tools ingest logs from across the organization — databases, cloud platforms, applications, network devices — and provide:

- **Correlation** — Link related events across systems (e.g., failed login + data export = possible breach)
- **Alerting** — Real-time notifications for suspicious patterns
- **Dashboards** — Visualize access trends, failed attempts, privilege escalations
- **Retention** — Long-term log storage for compliance

> **🎮 Analogy:** SIEM is the Game Master screen in a TTRPG that shows every player's recent actions on one big dashboard — when the rogue tries to pickpocket the king's guards, the GM sees the failed roll immediately, correlates it with the guard patrol schedule they're ignoring, and can trigger the alarm before the rogue even knows they've been caught.

Popular SIEMs: Splunk, Elastic SIEM, Microsoft Sentinel, Sumo Logic.

## Audit Trail Best Practices

| Practice | Why |
|----------|-----|
| **Append-only** | Logs cannot be modified or deleted (use immutable storage or cryptographic signing) |
| **Tamper-evident** | Hash chains or digital signatures detect log tampering |
| **Centralized** | Aggregated logs prevent silos and enable cross-system correlation |
| **Time-synchronized** | NTP ensures timestamps are consistent across systems |
| **Access-controlled** | Separate audit log access from regular system access — don't let admins edit their own logs |
| **Regular review** | Automated alerts for anomalies plus periodic manual review |

> **🎮 Analogy:** Audit trail best practices are like the security system for a casino — logs are append-only (you can't un-see someone winning the jackpot), tamper-evident (every log entry is cryptographically handcuffed to the previous one), centralized (all cameras feed to one room), time-synchronized (every camera clock matches), access-controlled (the security guards can't erase their own footage), and regularly reviewed (someone actually watches the tapes instead of letting them pile up).

```python
# Example: Tamper-evident log chain (simplified)
import hashlib

class AuditLogger:
    def __init__(self):
        self.chain = []

    def append(self, entry):
        prev_hash = self.chain[-1]["hash"] if self.chain else "0"
        entry["prev_hash"] = prev_hash
        entry["hash"] = hashlib.sha256(
            f"{entry}|{prev_hash}".encode()
        ).hexdigest()
        self.chain.append(entry)

    def verify(self):
        for i in range(1, len(self.chain)):
            expected = hashlib.sha256(
                f"{self.chain[i]}|{self.chain[i-1]['hash']}".encode()
            ).hexdigest()
            if self.chain[i]["hash"] != expected:
                return False
        return True
```

> **🎮 Analogy:** The tamper-evident hash chain is like writing every log entry in permanent ink in a numbered notebook, then taking a Polaroid of each page showing the previous page's photo — you can't swap page 5 without everyone noticing the photo on page 6 doesn't match. The hash is the photo; changing one entry breaks every subsequent "photo."

---
title: Access Control
skill: data-governance
order: 6
quiz:
  - type: mc
    question: "What is the key difference between RBAC and ABAC?"
    options:
      - "RBAC uses user attributes; ABAC uses roles"
      - "RBAC assigns permissions based on roles; ABAC uses policies based on user, resource, and environment attributes"
      - "RBAC is for databases; ABAC is for applications"
      - "There is no difference; they are the same concept"
    answer: 1
  - type: mc
    question: "The principle of least privilege means:"
    options:
      - "Users have unlimited access but are audited"
      - "Users get the minimum permissions needed to perform their job"
      - "Only administrators can access data"
      - "Permissions expire after 24 hours"
    answer: 1
  - type: mc
    question: "What does row-level security enforce?"
    options:
      - "Security rules at the column level only"
      - "Access restrictions on individual rows based on user attributes"
      - "Encryption at the row level"
      - "Network security for database servers"
    answer: 1
---

> **🎮 Analogy:** RBAC is like giving the new intern a keycard that only opens the break room and the bathroom — they don't need access to the CEO's filing cabinet to grab a coffee. ABAC is the overengineered version that also checks the time of day, their horoscope, and whether Mercury is in retrograde.

## RBAC vs ABAC

| Model | How It Works | Example |
|-------|-------------|---------|
| **RBAC** (Role-Based) | Permissions are assigned to roles; users are assigned to roles | `DataAnalyst` role can `SELECT` from `analytics.*` |
| **ABAC** (Attribute-Based) | Policies use attributes of user, resource, action, and environment | `IF user.department = resource.department AND time BETWEEN 9-17 THEN ALLOW` |

RBAC is simpler to manage for small teams. ABAC provides finer-grained control at the cost of policy complexity. Many organizations use a hybrid — RBAC for broad access categories, ABAC for sensitive edge cases.

> **🎮 Analogy:** RBAC is like keycards that open entire floors of an office building based on your job title. ABAC is a sentry AI that checks your face, the time of day, whether you clocked in, which floor you're on, and whether your boss approved the visit — before letting you through a single door.

## Principle of Least Privilege

Every user and system should have the **minimum permissions** required to function. Start with no access and grant incrementally. Review permissions quarterly.

```sql
-- Bad: overly permissive
GRANT ALL ON database.* TO 'analyst'@'%';

-- Good: least privilege
GRANT SELECT ON analytics.sales TO 'analyst'@'%';
GRANT SELECT ON analytics.customers TO 'analyst'@'%';
```

> **🎮 Analogy:** Least privilege is giving a new MMO character nothing but a wooden sword and a single health potion — they can't accidentally delete the guild bank, sell the raid gear to a vendor, or start a PvP battle in the safe zone. If they need more, they earn it through an approval quest.

## Row-Level Security

Row-level security (RLS) filters which rows a user can see based on their identity or attributes. This is critical for multi-tenant systems and compliance.

```sql
-- Example: RLS policy in Postgres
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::INT);

-- Users in tenant 42 only see rows where tenant_id = 42
```

> **🎮 Analogy:** Row-level security is like a hotel key card that only opens your room's door — every guest has the same "guest" role, but guest 42 can only see room 42's minibar charges and room 73 can't accidentally cancel your wake-up call.

## IAM for Data Systems

Identity and Access Management (IAM) for modern data platforms should include:

- **Centralized identity** — SSO via SAML/OIDC (Okta, Azure AD)
- **Service accounts** — Machine identities for pipelines, with short-lived credentials
- **Access reviews** — Automated certification campaigns every quarter
- **Provisioning** — Just-in-time access via workflows (e.g., PagerDuty + Slack approval)
- **Deprovisioning** — Automated removal when a user leaves or changes role

> **🎮 Analogy:** IAM for data systems is the account management for an entire gaming convention — SSO is your badge that works across every panel, service accounts are the robots running the projector and sound, access reviews are daily badge checks, JIT provisioning is getting temporary VIP access after proving you're on the speaker list, and deprovisioning is deactivating the badge of someone who already flew home.

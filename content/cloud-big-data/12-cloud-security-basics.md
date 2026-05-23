---
title: Cloud Security Basics
skill: cloud-big-data
order: 12
quiz:
  - type: mc
    question: "In the shared responsibility model, what is the customer responsible for?"
    options:
      - "Physical security of data centers"
      - "Network infrastructure security"
      - "Data encryption, IAM configuration, and OS patching"
      - "Hypervisor security"
    answer: 2
  - type: mc
    question: "What is the principle of least privilege?"
    options:
      - "Giving all users admin access for simplicity"
      - "Granting only the permissions necessary to perform a task"
      - "Granting permissions for a limited time only"
      - "Using only one IAM role for all services"
    answer: 1
  - type: mc
    question: "What is encryption in transit?"
    options:
      - "Data encrypted while stored on disk"
      - "Data encrypted while being transferred over the network"
      - "Data encrypted in memory"
      - "Data encrypted using customer-managed keys only"
    answer: 1
---

> **🎮 Analogy:** IAM policies are the guards at the city gate — least privilege means the baker only gets flour deliveries, not the keys to the armory, and MFA is the secret handshake your guard never writes on a sticky note taped to the gate.

## Shared Responsibility Model

Security in the cloud is a partnership. **Provider** secures the cloud: physical data centers, network infrastructure, hypervisors. **Customer** secures what's in the cloud: data, IAM configuration, OS patches, network ACLs.

> **🎮 Analogy:** Shared responsibility is like renting a storage unit — the facility owner is responsible for the building's locks, cameras, and fire alarms (provider), but you're responsible for padlocking your own unit, not storing hazardous materials, and not sharing the key with strangers (customer).

```
Provider responsible:          Customer responsible:
- Physical security            - Data classification
- Network infrastructure       - IAM roles and policies
- Hypervisor                   - OS and app patches
- Hardware and datacenters     - Encryption configuration
                               - Firewall rules
```

## IAM Best Practices

- **Least privilege** — Grant only the permissions needed. Start with none, add as required.

> **🎮 Analogy:** Least privilege is the guest account on your Steam library — your friend can play exactly one game you manually approved, not browse your entire library, and definitely not buy games with your saved credit card.

- **Use roles, not users** — Assign roles to services, not static user credentials.

> **🎮 Analogy:** IAM roles are the costume power-ups in Super Mario — instead of giving every plumber a permanent Fire Flower (access key), you give the "fire role" to whoever's wearing the Fire Mario costume right now, and the costume expires when they finish the level.

- **Rotate keys** — Regularly rotate access keys. Use temporary credentials (STS) where possible.

- **Audit with CloudTrail** — Log all API calls, monitor for suspicious activity.

> **🎮 Analogy:** CloudTrail is the combat log in an MMO — every sword swing, potion drink, and gold piece picked up is recorded with a timestamp. When someone accuses you of ninja-looting, the log doesn't lie.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

This IAM policy denies all actions if MFA is not present.

> **🎮 Analogy:** MFA is the two-factor authenticator for your RuneScape account — sure, you can still get phished, but the hacker needs both your password AND the 6-digit code from your phone, which they probably don't have unless they also stole your phone AND guessed your PIN.

## Encryption

**At rest** — Data encrypted when stored on disk. S3 server-side encryption (SSE-S3, SSE-KMS, SSE-C), EBS encryption, RDS encryption. **In transit** — Data encrypted over the network. TLS/SSL for API calls, VPN for site-to-site connections.

> **🎮 Analogy:** Encryption at rest is locking your save file in a safe when you're not playing. Encryption in transit is using a scrambled radio channel so the enemy team can't intercept your strategy callouts during a competitive match. Both stop the same nosy people, just at different times.

```python
import boto3

s3 = boto3.client("s3")

# Ensure encryption on upload
s3.put_object(
    Bucket="secure-bucket",
    Key="sensitive_data.csv",
    Body=b"credit_card,amount\n1234,100.00",
    ServerSideEncryption="AES256"
)

# Verify encryption
response = s3.head_object(Bucket="secure-bucket", Key="sensitive_data.csv")
print(f"Server-side encryption: {response.get('ServerSideEncryption', 'None')}")
```

## Security Groups and Firewalls

Security Groups act as virtual firewalls for EC2 instances. They're stateful — if you allow inbound on port 80, outbound response traffic is automatically allowed.

> **🎮 Analogy:** A stateful security group is the bouncer at a club who checks IDs on the way in but waves everyone out without checking — once you're inside (inbound allowed), you can leave anytime (outbound auto-allowed). A stateless firewall would check IDs both ways, which is ridiculous but more secure.

```bash
# Allow SSH from your office IP only
aws ec2 authorize-security-group-ingress \
    --group-id sg-12345678 \
    --protocol tcp \
    --port 22 \
    --cidr 203.0.113.0/24

# Allow HTTPS from anywhere
aws ec2 authorize-security-group-ingress \
    --group-id sg-12345678 \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0
```

Never open SSH (port 22) to `0.0.0.0/0`. Use bastion hosts or AWS Systems Manager Session Manager for secure access.

> **🎮 Analogy:** Opening SSH to `0.0.0.0/0` is leaving your front door unlocked in a GTA Online public lobby — sure, most players will walk past, but it only takes one jet-mounted griefer with a hacker tool to ruin your entire session.

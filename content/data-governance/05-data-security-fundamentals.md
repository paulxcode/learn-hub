---
title: Data Security Fundamentals
skill: data-governance
order: 5
quiz:
  - type: mc
    question: "Which type of encryption protects data while it is being processed in memory?"
    options:
      - "Encryption at rest"
      - "Encryption in transit"
      - "Encryption in use"
      - "Symmetric encryption"
    answer: 2
  - type: mc
    question: "What is the primary difference between data masking and anonymization?"
    options:
      - "Masking is reversible; anonymization is irreversible"
      - "Anonymization is reversible; masking is irreversible"
      - "Both are fully reversible"
      - "Both are irreversible"
    answer: 0
  - type: mc
    question: "In tokenization, where is the mapping between token and original value stored?"
    options:
      - "In the application database"
      - "In a secure token vault"
      - "In the token itself"
      - "In the network logs"
    answer: 1
---

> **🎮 Analogy:** Data encryption is like keeping your secret gamer tag in a triple-locked vault where the key is locked in a second vault, and the combination to the second vault is tattooed on a guy who's skydiving without a parachute — except he lands safely every time, that's how good key management is.

## Encryption States

Data exists in three states, each requiring different protection:

| State | Protection | Example |
|-------|-----------|---------|
| **At Rest** | Encrypt disks, databases, files | AES-256 for database tablespaces |
| **In Transit** | Encrypt network traffic | TLS 1.3 for API calls |
| **In Use** | Protect data during computation | Homomorphic encryption, confidential computing |

> **🎮 Analogy:** The three encryption states are like your save file security — at rest is having the cartridge locked in a drawer (AES-256), in transit is passing the cartridge through a secure delivery tube (TLS), and in use is playing the game in your Switch's memory where it's temporarily decrypted in a trusted execution environment that not even the OS can peek at.

```python
# Example: Encrypting a column with AES-256 (conceptual)
from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)
encrypted_email = cipher.encrypt(b"user@example.com")
```

## Data Masking and Anonymization

- **Data masking** — Replaces sensitive values with realistic but fictitious data. Reversible if you know the mapping. Used in non-production environments.
- **Anonymization** — Irreversibly removes the link between data and an individual. True anonymization must resist re-identification attacks (e.g., k-anonymity, differential privacy).

> **🎮 Analogy:** Data masking is putting a pixelated blur over the face of a witness in a documentary — you could un-blur it if you had the original footage. Anonymization is turning that witness into a generic 3D model with a voice synthesizer — there's no going back, and even the director doesn't know who they really are.

```sql
-- Example: Dynamic data masking in SQL
CREATE MASKING POLICY email_mask AS (val STRING)
  RETURNS STRING ->
    CASE WHEN CURRENT_ROLE() IN ('admin', 'compliance')
      THEN val
      ELSE CONCAT(LEFT(val, 2), '****@', SPLIT_PART(val, '@', 2))
    END;
```

## Tokenization vs Encryption

| Feature | Tokenization | Encryption |
|---------|-------------|------------|
| Reversibility | Via token vault | Via decryption key |
| Data format preserved | Yes (same length, format) | No (binary output) |
| Computational cost | Low (lookup) | Moderate (cipher operations) |
| Best for | PCI DSS (credit cards) | General data protection |

Tokenization replaces a sensitive value (e.g., credit card `4111-1111-1111-1111`) with a random token of the same format (`4929-3847-1029-4837`). The mapping lives in a hardened token vault.

> **🎮 Analogy:** Tokenization is like going to an arcade and exchanging your real cash for tokens — the arcade only handles tokens, the token-to-cash mapping is locked in the manager's safe, and if a thief breaks into the token dispenser they get useless plastic circles instead of your wallet. Encryption is handing over your actual debit card and trusting the cashier with the PIN.

## Key Management

All encryption is only as strong as the key management. Best practices:

- Use a dedicated key management service (AWS KMS, Azure Key Vault, HashiCorp Vault)
- Rotate keys on a schedule
- Separate encryption keys from encrypted data
- Use hardware security modules (HSMs) for root keys
- Audit all key access events

> **🎮 Analogy:** Key management is the metal health of your encryption — you can have the strongest lock in the world, but if the key is taped to the underside of the keyboard, you might as well leave the front door open. An HSM is like a safe with a retinal scanner that's bolted to the floor of a panic room inside a volcano lair.

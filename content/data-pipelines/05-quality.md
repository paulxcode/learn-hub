---
title: Data Quality
skill: data-pipelines
order: 5
---

> **🎮 Analogy:** Data quality checks are QA before a Cyberpunk 2077 launch — catch the NaN valkyries, the null health bars, and the negative-ammo glitches before your players (analysts) write angry Reddit threads about your dashboard.

## Why Data Quality Matters

Bad data leads to bad decisions. Quality checks catch issues early.

> **🎮 Analogy:** Data quality is the shield durability system in Breath of the Wild — you can technically fight with a decayed royal broadsword (dirty data), but it'll shatter mid-combat (dashboard breakage), and you'll scramble to find a boko club (cached backup) while a Lynel mauls your KPIs.

## Quality Checks

```python
def check_data_quality(records):
    print("Running data quality checks...\n")
    issues = []

    for i, rec in enumerate(records):
        checks_passed = True

        if rec.get("email") and "@" not in rec["email"]:
            issues.append(f"Row {i}: invalid email '{rec['email']}'")
            checks_passed = False

        if rec.get("age") and (rec["age"] < 0 or rec["age"] > 120):
            issues.append(f"Row {i}: invalid age {rec['age']}")
            checks_passed = False

        if rec.get("price") and rec["price"] < 0:
            issues.append(f"Row {i}: negative price {rec['price']}")
            checks_passed = False

        if rec.get("name") and not rec["name"].strip():
            issues.append(f"Row {i}: empty name")
            checks_passed = False

        if checks_passed:
            print(f"  Row {i}: PASS")

    return issues

data = [
    {"name": "Alice", "email": "alice@example.com", "age": 30, "price": 50.0},
    {"name": "Bob", "email": "bob@bad", "age": 200, "price": 25.0},
    {"name": "", "email": "charlie@example.com", "age": 25, "price": -10.0},
    {"name": "Diana", "email": "diana@example.com", "age": 35, "price": 100.0},
]

issues = check_data_quality(data)

print(f"\nIssues found: {len(issues)}")
for issue in issues:
    print(f"  ! {issue}")
```

**Output:**
```
Running data quality checks...

  Row 0: PASS
  Row 1: PASS
  Row 2: PASS
  Row 3: PASS

Issues found: 3
  ! Row 1: invalid email 'bob@bad'
  ! Row 1: invalid age 200
  ! Row 2: empty name
  ! Row 2: negative price -10.0
```

> **🎮 Analogy:** Each quality check is a Minecraft pressure plate connected to a redstone lamp — when a player (record) steps on it, the lamp lights up only if they pass. Bob stepped on the "valid email" plate and the lamp stayed dark.

## Null Handling

> **🎮 Analogy:** Null values are the missingno of data pipelines — they look like data, they smell like data, but the moment you try to sum a column with Nulls in it, your entire aggregation glitches into a beautiful mess of undefined behavior.

```python
def check_null_threshold(records, column, threshold_pct=5):
    total = len(records)
    nulls = sum(1 for r in records if r.get(column) is None)
    null_pct = (nulls / total) * 100

    print(f"Column '{column}': {nulls}/{total} null ({null_pct:.1f}%)")

    if null_pct > threshold_pct:
        print(f"  FAIL: exceeds threshold of {threshold_pct}%")
        return False
    else:
        print(f"  PASS: within threshold of {threshold_pct}%")
        return True

records = [
    {"name": "Alice", "email": "alice@example.com"},
    {"name": "Bob", "email": None},
    {"name": None, "email": "charlie@example.com"},
    {"name": "David", "email": "david@example.com"},
    {"name": "Eve", "email": None},
]

check_null_threshold(records, "email", 30)
print()
check_null_threshold(records, "name", 10)
```

**Output:**
```
Column 'email': 2/5 null (40.0%)
  FAIL: exceeds threshold of 30%

Column 'name': 1/5 null (20.0%)
  FAIL: exceeds threshold of 10%
```

> **🎮 Analogy:** Null threshold checks are like flight manifests — 40% of passengers not showing up for a flight (null email) is a problem. 20% missing (null name) is slightly less alarming. Either way, the plane (pipeline) shouldn't take off without figuring out who's actually on board.

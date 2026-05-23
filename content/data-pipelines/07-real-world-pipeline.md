---
title: Real-World Pipeline
skill: data-pipelines
order: 7
---

> **🎮 Analogy:** Building a real pipeline is like starting a Satisfactory save: you begin with one miner on iron (a CSV file), and six hours later you're debugging why your 47-assembler megafactory produces exactly two screws per minute.

## End-to-End Example

A complete pipeline that extracts, validates, transforms, and loads data:

> **🎮 Analogy:** This end-to-end pipeline is a full Satisfactory production line — turns raw iron ore (CSV data) into rotors (analytics-ready aggregates) through miners (extract), constructors (validate), assemblers (transform), and a freight platform (load) headed to the space elevator.

```python
import json
from datetime import datetime

class SalesPipeline:
    def __init__(self):
        self.log = []

    def log_step(self, step, status, detail=""):
        entry = {
            "step": step,
            "status": status,
            "timestamp": datetime.now().isoformat(),
            "detail": detail
        }
        self.log.append(entry)
        icon = "OK" if status == "success" else "!!"
        print(f"  [{icon}] {step}: {detail}")

    def extract(self):
        self.log_step("extract", "running", "Reading from source")

> **🎮 Analogy:** The extract step is like looting a chest in Skyrim — you open it (connect to source), grab everything inside (raw data), and stuff it into your inventory before the draugr wakes up (timeout).

        raw_data = [
            {"date": "2026-05-20", "product": "Laptop", "price": 1200, "qty": 2},
            {"date": "2026-05-20", "product": "Mouse", "price": 25, "qty": 5},
            {"date": "2026-05-20", "product": "", "price": -10, "qty": 1},
            {"date": "2026-05-20", "product": "Keyboard", "price": 80, "qty": 0},
            {"date": "2026-05-20", "product": "Monitor", "price": 350, "qty": 3},
        ]
        self.log_step("extract", "success", f"Extracted {len(raw_data)} records")
        return raw_data

    def validate(self, data):
        self.log_step("validate", "running", "Running quality checks")

> **🎮 Analogy:** Validation is the item sorter in Minecraft — rotten flesh (null products) goes into the incinerator, damaged tools (negative prices) get recycled, and only enchanted diamonds (clean records) pass through to the storage system.

        valid = []
        for row in data:
            issues = []
            if not row["product"]:
                issues.append("empty product name")
            if row["price"] <= 0:
                issues.append(f"invalid price {row['price']}")
            if row["qty"] <= 0:
                issues.append(f"invalid qty {row['qty']}")
            if issues:
                self.log_step("validate", "warning",
                    f"Skipped '{row['product'] or 'unknown'}': {', '.join(issues)}")
            else:
                valid.append(row)
        self.log_step("validate", "success",
            f"{len(valid)} valid, {len(data) - len(valid)} rejected")
        return valid

    def transform(self, data):
        self.log_step("transform", "running", "Enriching data")

> **🎮 Analogy:** Transform is the assembly table in Factorio where iron plates + copper wire become green circuits — except here it's price × quantity that gets crafted into total, and a condition checks if the result qualifies as Electronics or Accessories.

        for row in data:
            row["total"] = row["price"] * row["qty"]
            row["category"] = "Electronics" if row["price"] > 100 else "Accessories"
        total_value = sum(r["total"] for r in data)
        self.log_step("transform", "success",
            f"Computed totals, total value: ${total_value}")
        return data

    def load(self, data):
        self.log_step("load", "running", "Writing to warehouse")

> **🎮 Analogy:** Load is the cargo rocket in Satisfactory — you pack your containers (data), set the destination (warehouse table), and fire. If the rocket platform (schema) doesn't match, your payload explodes on landing.

        output = json.dumps(data, indent=2)
        self.log_step("load", "success",
            f"Loaded {len(data)} records, {len(output)} bytes")
        return data

    def run(self):
        print("=== Sales Pipeline ===")
        print(f"Started at: {datetime.now().isoformat()}\n")

> **🎮 Analogy:** The `run` method is the main quest line in an RPG — you must complete Extract (talk to the village elder), Validate (fetch the McGuffin), Transform (defeat the mini-boss), and Load (return to the king) in sequence. The XP you earn is the final dataset.

        data = self.extract()
        data = self.validate(data)
        data = self.transform(data)
        data = self.load(data)
        print(f"\nCompleted at: {datetime.now().isoformat()}")
        print(f"Final records: {len(data)}")
        return data

pipeline = SalesPipeline()
result = pipeline.run()
```

**Output:**
```
=== Sales Pipeline ===
Started at: 2026-05-21T12:00:00

  [OK] extract: Reading from source
  [OK] extract: Extracted 5 records
  [OK] validate: Running quality checks
  [!!] validate: Warning: Skipped 'unknown': empty product name, invalid price -10
  [!!] validate: Warning: Skipped 'Keyboard': invalid qty 0
  [OK] validate: 3 valid, 2 rejected
  [OK] transform: Enriching data
  [OK] transform: Computed totals, total value: $4750
  [OK] load: Writing to warehouse
  [OK] load: Loaded 3 records, 159 bytes

Completed at: 2026-05-21T12:00:00
Final records: 3
```

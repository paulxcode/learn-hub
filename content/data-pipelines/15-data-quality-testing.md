---
title: Data Quality Testing
skill: data-pipelines
order: 15
quiz:
  - type: mc
    question: "What is the primary purpose of Great Expectations?"
    options:
      - "To replace pandas for data analysis"
      - "To define, validate, and document data quality expectations in a standardized way"
      - "To visualize data distributions"
      - "To automatically fix data quality issues"
    answer: 1
  - type: mc
    question: "What is an Expectation Suite in Great Expectations?"
    options:
      - "A collection of database connection strings"
      - "A group of expectations (assertions) applied to a specific dataset"
      - "A set of Python configuration files"
      - "A dashboard for monitoring data quality"
    answer: 1
  - type: mc
    question: "Which approach is best for detecting anomalies in data quality over time?"
    options:
      - "Hard-coding expected values that never change"
      - "Using automated monitoring with statistical thresholds that adapt to historical patterns"
      - "Manually reviewing all data every day"
      - "Disabling quality checks in production"
    answer: 1
---

> **🎮 Analogy:** Great Expectations is the F3 debug screen in Minecraft — it tells you your exact coordinates (row count), what block you're looking at (schema), your FPS (pipeline latency), and whether you're about to fall into lava (null values in critical columns).

## Great Expectations Framework

Great Expectations is the de-facto standard for data quality testing in Python. It separates **expectations** (what you assert) from **validation** (checking whether data meets them):

> **🎮 Analogy:** Great Expectations is the Laws of the Game in Rocket League — you declare "the ball must not leave the pitch" (expectation), and the game engine constantly checks whether it has (validation). Unlike RL, Great Expectations won't let you demo the data.

```python
import great_expectations as ge
import pandas as pd

df = pd.DataFrame({
    "user_id": [1, 2, 3, 4, 5],
    "name": ["Alice", "Bob", "Charlie", "Diana", None],
    "email": ["a@x.com", "b@x.com", "c@x.com", "d@x.com", "e@x.com"],
    "age": [25, 30, 35, 40, 45],
    "salary": [50000, 60000, None, 80000, 90000],
})

ge_df = ge.from_pandas(df)

results = []

results.append(ge_df.expect_column_values_to_not_be_null("user_id"))
results.append(ge_df.expect_column_values_to_be_unique("user_id"))
results.append(ge_df.expect_column_values_to_not_be_null("email"))
results.append(ge_df.expect_column_values_to_be_between("age", 18, 65))
results.append(ge_df.expect_column_values_to_not_be_null("salary"))

for r in results:
    status = "PASS" if r.success else "FAIL"
    print(f"[{status}] {r.expectation_config.expectation_type}")
    if not r.success:
        print(f"  Details: {r.result}")
```

## Expectation Suites

Suites bundle expectations for a specific dataset and can be stored, versioned, and shared:

> **🎮 Analogy:** Expectation Suites are modpacks in Minecraft — you pick a curated set of mods (expectations) that work together for a specific playstyle (dataset). The "Vanilla+" pack has lightweight checks, the "GregTech" pack has 200+ brutal expectations for hardcore data engineers.

```python
class UserDataQualitySuite:
    def __init__(self, df):
        self.df = ge.from_pandas(df)
        self.results = []

    def expect_no_null_user_ids(self):
        r = self.df.expect_column_values_to_not_be_null("user_id")
        self.results.append(r)
        return r

    def expect_valid_emails(self):
        r = self.df.expect_column_values_to_match_regex(
            "email", r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        )
        self.results.append(r)
        return r

    def expect_age_in_range(self, min_age=18, max_age=120):
        r = self.df.expect_column_values_to_be_between("age", min_age, max_age)
        self.results.append(r)
        return r

    def expect_unique_user_ids(self):
        r = self.df.expect_column_values_to_be_unique("user_id")
        self.results.append(r)
        return r

    def run_all(self):
        self.expect_no_null_user_ids()
        self.expect_valid_emails()
        self.expect_age_in_range()
        self.expect_unique_user_ids()
        return self.summary()

    def summary(self):
        passed = sum(1 for r in self.results if r.success)
        total = len(self.results)
        print(f"Results: {passed}/{total} passed")
        for r in self.results:
            status = "✓" if r.success else "✗"
            print(f"  {status} {r.expectation_config.expectation_type}")
        return all(r.success for r in self.results)


data = pd.DataFrame({
    "user_id": [1, 2, 3, 4],
    "email": ["alice@x.com", "bob@x.com", "invalid-email", "diana@x.com"],
    "age": [25, 30, 200, 35],
})

suite = UserDataQualitySuite(data)
suite.run_all()
```

**Output:**
```
Results: 2/4 passed
  ✓ expect_column_values_to_not_be_null
  ✗ expect_column_values_to_match_regex
  ✗ expect_column_values_to_be_between
  ✓ expect_column_values_to_be_unique
```

## Data Validation in Pipelines

Embed quality checks anywhere in your pipeline — fail fast when data is bad:

> **🎮 Analogy:** Pipeline-stage validation is the anti-cheat system in CS:GO — it scans every round (stage) for wallhacks (null values), aimbots (schema violations), and spinbots (duplicate rows). If a player's movement is mathematically impossible, VAC bans them mid-match before they ruin the game.

```python
def validate_stage(input_df, stage_name):
    ge_df = ge.from_pandas(input_df)
    checks = []

    if stage_name == "raw":
        checks.append(ge_df.expect_column_to_exist("order_id"))
        checks.append(ge_df.expect_column_to_exist("amount"))
    elif stage_name == "clean":
        checks.append(ge_df.expect_column_values_to_not_be_null("order_id"))
        checks.append(ge_df.expect_column_values_to_be_between("amount", 0, 100000))
    elif stage_name == "aggregated":
        checks.append(ge_df.expect_column_values_to_be_unique("order_id"))
        checks.append(ge_df.expect_column_values_to_be_between("total_revenue", 0, None))

    all_pass = all(c.success for c in checks)
    if not all_pass:
        failed = [c for c in checks if not c.success]
        raise ValueError(
            f"Quality check failed at stage '{stage_name}': "
            f"{len(failed)}/{len(checks)} checks failed"
        )

    print(f"Stage '{stage_name}': all {len(checks)} checks passed")
    return True


def pipeline():
    raw = load_raw_data()
    validate_stage(raw, "raw")

    clean = clean_data(raw)
    validate_stage(clean, "clean")

    aggregated = aggregate_data(clean)
    validate_stage(aggregated, "aggregated")

    load_to_warehouse(aggregated)
```

## Anomaly Detection for Data Quality

Statistical monitoring catches problems that fixed thresholds miss:

> **🎮 Analogy:** Anomaly detection is the skill-based matchmaking in Apex Legends — instead of a fixed "level 50 required" (threshold), it analyzes your historical KD ratio, win rate, and damage per match (z-score), and flags you as an outlier if your next game stats are 3 standard deviations from your usual potato aim.

```python
import statistics


class DataQualityMonitor:
    def __init__(self, window_size=30):
        self.window_size = window_size
        self.history = []

    def record(self, metric_name, value):
        if metric_name not in self.history:
            self.history[metric_name] = []
        self.history[metric_name].append(value)
        if len(self.history[metric_name]) > self.window_size:
            self.history[metric_name].pop(0)

    def is_anomalous(self, metric_name, value, z_threshold=3.0):
        if metric_name not in self.history or len(self.history[metric_name]) < 10:
            return False

        values = self.history[metric_name]
        mean = statistics.mean(values)
        stdev = statistics.stdev(values)

        if stdev == 0:
            return value != mean

        z_score = (value - mean) / stdev
        is_outlier = abs(z_score) > z_threshold

        if is_outlier:
            print(f"ANOMALY [{metric_name}]: {value:.2f} "
                  f"(z-score: {z_score:.2f}, mean: {mean:.2f}, std: {stdev:.2f})")

        return is_outlier


monitor = DataQualityMonitor(window_size=20)

for day in range(1, 61):
    row_count = 1000 + (day * 5)

    if day == 45:
        row_count = 100

    monitor.record("row_count", row_count)
    monitor.is_anomalous("row_count", row_count)
```

> **🎮 Analogy:** Data quality is like maintaining your K/D ratio in a competitive FPS — you don't check it once at the start of the season and call it good. You review every death (data failure), adjust your crosshair placement (tune thresholds), and grind the practice range (test new expectations) between matches.

Data quality isn't a one-time check — it's an ongoing practice. Automate it, monitor it, and act on failures.

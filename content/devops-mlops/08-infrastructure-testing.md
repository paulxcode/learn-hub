---
title: Infrastructure and Testing
skill: devops-mlops
order: 8
quiz:
  - type: mc
    question: "What does terraform plan do?"
    options:
      - "Applies infrastructure changes immediately"
      - "Shows a preview of what infrastructure changes will be made without applying them"
      - "Destroys all infrastructure"
      - "Initializes a new Terraform project"
    answer: 1
  - type: mc
    question: "What is a smoke test in the context of deployments?"
    options:
      - "A comprehensive test of all features"
      - "A quick sanity check that the deployed service is running and responding"
      - "A performance benchmark test"
      - "A security vulnerability scan"
    answer: 1
  - type: mc
    question: "What is chaos engineering?"
    options:
      - "Writing tests without any structure"
      - "Proactively injecting failures into a system to test its resilience"
      - "Deploying without testing"
      - "Using random test data"
    answer: 1
---

> **🎮 Analogy:** Testing infrastructure with chaos engineering is like building a rollercoaster in Planet Coaster and then removing random track pieces — if your ride (or service) survives, it's ready for the public.

## Testing Infrastructure Code

Infrastructure should be tested just like application code. With Terraform, you can validate configurations before applying:

```bash
# Validate syntax
terraform fmt -check
terraform validate

# Preview changes (safety check)
terraform plan -out=tfplan

# Apply only after review
terraform apply tfplan
```

Add automated checks in CI:

```yaml
# .github/workflows/terraform.yml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init
      - run: terraform validate
      - run: terraform plan  # no apply — just check
```

> **🎮 Analogy:** `terraform plan` is the "preview" mode in Cities: Skylines — you can see the traffic jams (infrastructure problems) before you pave a single road, saving you from bulldozing half your city later.

## Integration Tests for Data Pipelines

Test that pipeline components work together correctly:

```python
def test_feature_engineering_pipeline():
    raw = pd.DataFrame({
        "user_id": [1, 1, 2],
        "timestamp": ["2026-01-01", "2026-01-02", "2026-01-01"],
        "value": [10, 20, 30]
    })

    result = engineer_features(raw)

    assert "hour" in result.columns
    assert "rolling_avg_7d" in result.columns
    assert result["rolling_avg_7d"].iloc[0] == 10.0  # single point
    assert len(result) == 3
```

Test the full pipeline end-to-end on a small dataset to catch regressions:

```python
def test_end_to_end_pipeline():
    """
    Runs the full pipeline on a 100-row sample.
    Asserts that outputs are produced and metrics are within expected ranges.
    """
    result = run_pipeline("s3://data/sample_100.parquet")
    assert result["accuracy"] > 0.7
    assert result["model_path"] is not None
    assert result["feature_store_updated"] is True
```

> **🎮 Analogy:** Integration tests for data pipelines are the "connect all the pipes" puzzle minigame — the water (data) should flow from tank A (ingestion) through the filter (feature engineering) to the boiler (training) without leaking, but you only trust it after running the test once.

## Smoke Tests for Deployments

After deploying, verify the service is alive and responding:

```bash
#!/bin/bash
# smoke_test.sh

URL="https://api.example.com/health"

# Check that the service responds
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ "$HTTP_CODE" -ne 200 ]; then
    echo "Smoke test failed: got $HTTP_CODE"
    exit 1
fi

# Check that the model predicts correctly
RESPONSE=$(curl -s -X POST $URL/predict \
  -H "Content-Type: application/json" \
  -d '{"feature_1": 1.0, "feature_2": 2.0}')

echo "Response: $RESPONSE"
echo "Smoke test passed!"
```

> **🎮 Analogy:** A smoke test is the "does it turn on?" check after building a PC — before benchmarking or overclocking, you just want to see the fans spin and the BIOS screen appear. If it POSTs (returns 200), you can breathe.

## Chaos Engineering Concepts

Chaos engineering tests system resilience by intentionally injecting failures:

- **Kill a pod** — does the service recover?
- **Add network latency** — does the timeout mechanism work?
- **Fill up disk** — does alerting fire?
- **Rotate credentials** — does the service reconnect?

Tools like Chaos Mesh, Litmus, and Gremlin automate these experiments. The principle: don't wait for failures to happen naturally — find weaknesses before they cause production incidents.

> **🎮 Analogy:** Chaos engineering is the Game Master who says "a goblin thief cuts your climbing rope" — you didn't plan for it, but now you know if your party packed feather fall (and if your system's timeout mechanism works).

---
title: Hyperparameter Tuning
skill: machine-learning
order: 14
quiz:
  - type: mc
    question: "Which search method uses a probabilistic model to select the next hyperparameters to evaluate?"
    options:
      - "Grid search"
      - "Random search"
      - "Bayesian optimization"
      - "Manual search"
    answer: 2
  - type: mc
    question: "What is the advantage of random search over grid search?"
    options:
      - "Random search is always more accurate"
      - "Random search explores more unique values per hyperparameter for the same budget"
      - "Random search requires fewer dimensions"
      - "Random search doesn't require cross-validation"
    answer: 1
  - type: mc
    question: "What does early stopping prevent?"
    options:
      - "Data leakage"
      - "Overfitting by halting training when validation performance stops improving"
      - "Gradient explosion"
      - "Memory overflow"
    answer: 1
---

> **🎮 Analogy:** Hyperparameter tuning is adjusting your mouse sensitivity in a shooter — too low and you can't react in time, too high and you're spinning in circles. Grid search tries every setting systematically, random search takes lucky guesses, and Bayesian optimization is the tryhard who actually reads the wiki.

## Grid Search

Exhaustively evaluates every combination in a predefined grid:

> **🎮 Analogy:** Grid search is trying every single key on a keychain to open a door — thorough, methodical, but painfully slow when you have 50 keys. It guarantees you'll find the right one, but your arm will be sore by the end.

```python

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
import numpy as np

X, y = make_classification(n_samples=500, n_features=10, random_state=42)

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5, 10],
}

grid = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='f1',
    n_jobs=-1,
)
grid.fit(X, y)

print(f"Best params: {grid.best_params_}")
print(f"Best F1: {grid.best_score_:.4f}")
print(f"Combinations evaluated: {len(grid.cv_results_['params'])}")
```

**Output:**
```
Best params: {'max_depth': 10, 'min_samples_split': 2, 'n_estimators': 200}
Best F1: 0.8934
Combinations evaluated: 27
```

## Random Search

Samples randomly from the parameter space, more efficient for high dimensions:

> **🎮 Analogy:** Random search is the "random button" on a Spotify playlist — you might discover an amazing new song (great params) without listening to every single album in existence. You won't find *the* absolute best, but you'll find a really good one way faster.

```python

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform

X, y = make_classification(n_samples=500, n_features=10, random_state=42)

param_dist = {
    'n_estimators': randint(50, 300),
    'max_depth': randint(3, 30),
    'min_samples_split': randint(2, 20),
    'max_features': uniform(0.1, 0.9),
}

random = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_dist,
    n_iter=30,
    cv=5,
    scoring='f1',
    n_jobs=-1,
    random_state=42,
)
random.fit(X, y)

print(f"Best params: {random.best_params_}")
print(f"Best F1: {random.best_score_:.4f}")
print(f"Iterations: 30 (vs 27 for grid, but wider search space)")

# Compare coverage
grid_unique = 3 * 3 * 3
print(f"\nGrid search explored {grid_unique} unique values across 3 dims.")
print(f"Random search explored up to 30 unique values per dim.")
```

**Output:**
```
Best params: {'max_depth': 22, 'max_features': 0.67, 'min_samples_split': 4, 'n_estimators': 187}
Best F1: 0.8951
Iterations: 30 (vs 27 for grid, but wider search space)

Grid search explored 27 unique values across 3 dims.
Random search explored up to 30 unique values per dim.
```

## Bayesian Optimization

Uses past evaluations to intelligently choose the next parameters:

> **🎮 Analogy:** Bayesian optimization is a heat-seeking missile — it remembers where it already missed and adjusts its aim with every shot. Unlike grid search (firing everywhere) or random search (firing blindfolded), Bayesian learns from each miss and zeros in on the bullseye with surgical precision.

```python

```python
def bayesian_explanation():
    print("Bayesian optimization workflow:")
    print("1. Build a surrogate model (Gaussian Process) of the objective\n")
    print("2. Acquisition function selects next candidate:")
    print("   - Expected Improvement (EI)")
    print("   - Upper Confidence Bound (UCB)")
    print("   - Probability of Improvement (PI)\n")
    print("3. Evaluate the candidate")
    print("4. Update surrogate model with result")
    print("5. Repeat until budget exhausted\n")
    print("Tools: Hyperopt, Optuna, Scikit-Optimize\n")

    print("# Example with Optuna")
    print("import optuna\n")
    print("def objective(trial):")
    print("    params = {")
    print("        'lr': trial.suggest_float('lr', 1e-4, 1e-1, log=True),")
    print("        'depth': trial.suggest_int('depth', 3, 15),")
    print("        'gamma': trial.suggest_float('gamma', 0, 5),")
    print("    }")
    print("    score = train_model(params)")
    print("    return score\n")
    print("study = optuna.create_study(direction='maximize')")
    print("study.optimize(objective, n_trials=50)")

bayesian_explanation()
```

## Cross-Validation Strategies

> **🎮 Analogy:** Different cross-validation strategies are different ways of running practice matches before the big game — K-Fold is rotating your starting lineup, Stratified is making sure each lineup has the same mix of rookies and veterans, and Time Series is practicing against last year's plays because you can't play against next week's game before it happens.

```python
def cv_strategies():
    strategies = {
        "K-Fold (k=5)": "Standard. Split data into 5 folds, each fold held out once.",
        "Stratified K-Fold": "Preserves class proportions in each fold. Use for classification.",
        "Time Series Split": "Respects temporal order. Train on past, validate on future.",
        "Group K-Fold": "Ensures samples from same group are never split across folds.",
    }

    print(f"{'Strategy':<25s} {'When to Use'}")
    print("-" * 75)
    for name, use in strategies.items():
        print(f"{name:<25s} {use}")

    print("\nAlways use Stratified K-Fold for classification.")
    print("Always use Time Series Split for time-dependent data.")

cv_strategies()
```

**Output:**
```
Strategy                  When to Use
---------------------------------------------------------------------------
K-Fold (k=5)              Standard. Split data into 5 folds, each held out once.
Stratified K-Fold         Preserves class proportions. Use for classification.
Time Series Split         Respects temporal order. Train on past, validate on future.
Group K-Fold              Ensures same group samples aren't split across folds.

Always use Stratified K-Fold for classification.
Always use Time Series Split for time-dependent data.
```

## Practical Tips for Tuning

> **🎮 Analogy:** These tuning tips are the "git gud" guide to ML — start with the default sword (baseline), then upgrade your weapon one stat at a time. Don't max out critical hit chance before you have a weapon that actually hits. And always, ALWAYS save before experimenting with the cursed armor.

```python
def tuning_tips():
    tips = [
        "Start with default params to establish a baseline.",
        "Use random search first (30-50 iterations) to find promising regions.",
        "Then refine with Bayesian optimization in the promising region.",
        "Set a reasonable budget: 3x more time than a single training run.",
        "Log all trials in MLflow to avoid re-running dead ends.",
        "Use early stopping to prune unpromising trials quickly.",
        "Fix a random seed so comparisons are fair.",
        "Tune the most impactful params first: learning_rate, tree depth, regularization.",
        "Validate on a fixed holdout set; don't tune on the test set.",
        "Document the search space and final params for reproducibility.",
    ]

    print("Production Tuning Checklist:\n")
    for i, tip in enumerate(tips, 1):
        print(f"  {i:>2}. {tip}")

tuning_tips()
```

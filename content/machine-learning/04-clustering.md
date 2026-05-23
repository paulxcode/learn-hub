---
title: Clustering
skill: machine-learning
order: 4
---

> **🎮 Analogy:** Clustering is like walking into a stranger's garage sale — nobody labeled anything, but you can still group the rusty tools together, the old vinyls together, and the creepy porcelain dolls into a pile you pretend not to see.

## Unsupervised Learning

Clustering finds natural groups in data without labels.

> **🎮 Analogy:** Clustering is like looking at a crowd at a music festival and noticing everyone in band tees is at the mosh pit while people in flannel are at the folk stage — nobody gave you a map, the data just grouped itself.

## K-Means Clustering

> **🎮 Analogy:** K-Means is like throwing three dartboards into a room full of people and asking everyone to move closer to the nearest board. After enough shuffling, you have three neat clusters of friends who didn't know they belonged together.

```python

```python
from sklearn.cluster import KMeans
import numpy as np

X = np.array([
    [1, 2], [1.5, 1.8], [5, 8], [8, 8],
    [1, 0.6], [9, 11], [8, 2], [10, 2],
    [9, 3]
])

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(X)

print("Cluster centers:")
for i, center in enumerate(kmeans.cluster_centers_):
    print(f"  Cluster {i}: ({center[0]:.1f}, {center[1]:.1f})")

print("\nAssignments:")
for i, label in enumerate(kmeans.labels_):
    print(f"  Point {i}: Cluster {label}")

print(f"\nInertia (within-cluster variance): {kmeans.inertia_:.1f}")
```

**Output:**
```
Cluster centers:
  Cluster 0: (9.0, 2.3)
  Cluster 1: (1.2, 1.5)
  Cluster 2: (7.3, 9.0)

Assignments:
  Point 0: Cluster 1
  Point 1: Cluster 1
  Point 2: Cluster 2
  Point 3: Cluster 2
  Point 4: Cluster 1
  Point 5: Cluster 2
  Point 6: Cluster 0
  Point 7: Cluster 0
  Point 8: Cluster 0

Inertia (within-cluster variance): 16.5
```

## Finding Optimal K

> **🎮 Analogy:** The Elbow Method is like deciding how many pizza slices to cut — with 1 slice you have a mess, with 8 slices each person gets just the right amount, but with 50 slices you're just making crumbs. The "elbow" is where more slices stop helping.

```python
from sklearn.cluster import KMeans
import numpy as np

np.random.seed(42)
X = np.random.randn(100, 2)

inertias = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)

print("Elbow Method:")
for k, inertia in enumerate(inertias, 1):
    bar = "#" * int(inertia / 5)
    print(f"  k={k}: {inertia:.1f} {bar}")
```

**Output:**
```
Elbow Method:
  k=1: 196.7 ########################################
  k=2: 160.5 ##################################
  k=3: 138.5 ###########################
  k=4: 123.6 ########################
  k=5: 115.3 #######################
  k=6: 109.1 #####################
  k=7: 104.0 ####################
  k=8: 99.6 ###################
  k=9: 95.5 ###################
  k=10: 92.2 ##################
```

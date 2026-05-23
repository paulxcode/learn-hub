---
title: Model Deployment
skill: machine-learning
order: 9
quiz:
  - type: mc
    question: "Which Python library is commonly used to serialize scikit-learn models to disk?"
    options:
      - "pickle or joblib"
      - "json"
      - "csv"
      - "yaml"
    answer: 0
  - type: mc
    question: "What is the purpose of A/B testing in model deployment?"
    options:
      - "To train two different models on the same data"
      - "To compare a new model's performance against the current production model on real traffic"
      - "To test the model on two different test sets"
      - "To split the data into two equal halves"
    answer: 1
  - type: mc
    question: "What is model versioning?"
    options:
      - "Training the same model multiple times"
      - "Tracking different versions of a model with metadata for rollback and comparison"
      - "Installing different versions of Python"
      - "Creating documentation for each model"
    answer: 1
---

> **🎮 Analogy:** Model deployment is the difference between building a LEGO masterpiece on your living room floor and shipping it in a box for someone else to assemble — pickle/joblib is the instruction manual, Flask is the delivery truck, and A/B testing is asking random strangers which version they like better.

## Saving and Loading Models

Once trained, a model must be serialized so it can be loaded later for inference:

> **🎮 Analogy:** Pickling a model is like freezing a lasagna — you spent hours cooking (training), and now you can pop it in the oven (load it) whenever someone's hungry for predictions. Without serialization, you'd cook a fresh lasagna every single time someone wants a bite.

```python
import pickle
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

X = np.random.randn(100, 5)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

joblib.dump(model, 'model.joblib')

with open('model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)

new_sample = np.array([[0.5, -0.2, 0.1, 0.3, -0.4]])
prediction = loaded_model.predict(new_sample)
probability = loaded_model.predict_proba(new_sample)

print(f"Prediction: {prediction[0]}")
print(f"Confidence: {probability[0][prediction[0]]:.3f}")
```

**Output:**
```
Prediction: 1
Confidence: 0.870
```

## Serving a Model with Flask

> **🎮 Analogy:** Flask serving is the drive-through window of ML — the model is the kitchen cooking predictions, Flask is the cashier taking orders and handing them out. Customers don't care how the burger was made; they just want it fast. `/predict` is the menu button they press.

```python
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load('model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    pred = model.predict(features)[0]
    proba = model.predict_proba(features)[0].tolist()

    return jsonify({
        'prediction': int(pred),
        'confidence': proba[int(pred)],
        'status': 'success'
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

# Run with: flask run --host=0.0.0.0 --port=5000
```

## Model Versioning

Track models with metadata for rollback and comparison:

> **🎮 Analogy:** Model versioning is like save scumming in an RPG — model v1 is your autosave before the boss fight, v2 is after you barely won, and v3 is the perfect run you manual-saved. When v2 starts crashing on new data, you reload v1 like nothing happened.

```python

```python
from datetime import datetime
import joblib
import json

class ModelRegistry:
    def __init__(self):
        self.versions = {}

    def register(self, name, model, metrics):
        version = len(self.versions) + 1
        entry = {
            'version': version,
            'model': model,
            'metrics': metrics,
            'created': datetime.now().isoformat(),
            'active': False
        }
        self.versions[version] = entry
        print(f"Registered {name} v{version}")
        return version

    def deploy(self, version):
        for v in self.versions:
            self.versions[v]['active'] = False
        self.versions[version]['active'] = True
        print(f"Deployed v{version}")

    def get_active_model(self):
        for v, entry in self.versions.items():
            if entry['active']:
                return entry['model']
        return None

registry = ModelRegistry()
registry.register("classifier", "model_v1.pkl", {"accuracy": 0.89})
registry.register("classifier", "model_v2.pkl", {"accuracy": 0.94})
registry.deploy(2)
```

**Output:**
```
Registered classifier v1
Registered classifier v2
Deployed v2
```
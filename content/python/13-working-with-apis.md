---
title: Working with APIs
skill: python
order: 13
quiz:
  - type: mc
    question: "What Python built-in module is used to decode JSON strings into Python dictionaries?"
    options:
      - "json.loads()"
      - "json.dumps()"
      - "json.parse()"
      - "json.decode()"
    answer: 0
  - type: code
    question: "Use urllib.request to open the URL 'https://api.example.com/data' and print the response status code."
    solution: "import urllib.request\nresponse = urllib.request.urlopen('https://api.example.com/data')\nprint(response.status)"
    hint: "Call urlopen(url) and access the .status attribute"
---

> **🎮 Analogy:** Calling an API is like radioing for backup in a shooter — you send a request, hold your breath for the response, and pray you get a 200 instead of a 404 telling you the extraction point doesn't exist.

## Making HTTP Requests

Python's standard library includes `urllib.request` for making HTTP requests:

```python
import urllib.request
import json

url = "https://api.github.com/repos/python/cpython"
response = urllib.request.urlopen(url)
data = json.loads(response.read())

print(f"Repository: {data['full_name']}")
print(f"Stars: {data['stargazers_count']}")
print(f"Description: {data['description']}")
```

**Output:**
```
Repository: python/cpython
Stars: 62000
Description: The Python programming language
```

> **🎮 Analogy:** `urllib.request.urlopen()` is your Cinnabon order at the airport — you send a request, the server shouts back a response, and if it's a `200` you get your cinnamon roll, but a `404` means "gate doesn't exist, buddy."

## Handling JSON Responses

The `json` module converts between JSON strings and Python objects:

```python
import json

json_string = '{"name": "Alice", "age": 30, "city": "London"}'
parsed = json.loads(json_string)
print(parsed["name"])
print(parsed["age"])

back_to_json = json.dumps(parsed, indent=2)
print(back_to_json)
```

**Output:**
```
Alice
30
{
  "name": "Alice",
  "age": 30,
  "city": "London"
}
```

> **🎮 Analogy:** `json.loads()` is the universal translator — it converts alien JSON text `{"name":"Alice"}` into a Python dictionary you can interrogate. `json.dumps()` is the reverse: it packs your Python data back into JSON for transmission.

## Error Handling for APIs

Networks are unreliable. Always handle potential errors:

```python
import urllib.request
import urllib.error
import json

def fetch_user(user_id):
    url = f"https://jsonplaceholder.typicode.com/users/{user_id}"
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read())
                return data
            else:
                print(f"Error: HTTP {response.status}")
                return None
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
    except urllib.error.URLError as e:
        print(f"Connection Error: {e.reason}")
    except TimeoutError:
        print("Request timed out")

user = fetch_user(1)
if user:
    print(f"Name: {user['name']}, Email: {user['email']}")
```

**Output:**
```
Name: Leanne Graham, Email: Sincere@april.biz
```

> **🎮 Analogy:** Network errors are the server's way of saying "I'm busy, come back later" — handling them with `try/except` is like carrying backup potions for every status effect because the dungeon master (network) is notoriously unreliable.

## Rate Limiting Basics

APIs often limit how many requests you can make. Use `time.sleep()` to respect rate limits:

```python
import time
import urllib.request

def rate_limited_fetch(urls, delay=1.0):
    results = []
    for url in urls:
        print(f"Fetching: {url}")
        try:
            with urllib.request.urlopen(url, timeout=5) as resp:
                results.append(resp.read())
        except Exception as e:
            print(f"Failed: {e}")
        time.sleep(delay)
    return results

urls = [
    "https://api.github.com",
    "https://api.github.com/repos/python/cpython",
    "https://api.github.com/repos/python/peps",
]

data = rate_limited_fetch(urls, delay=0.5)
print(f"Fetched {len(data)} resources")
```

**Output:**
```
Fetching: https://api.github.com
Fetching: https://api.github.com/repos/python/cpython
Fetching: https://api.github.com/repos/python/peps
Fetched 3 resources

> **🎮 Analogy:** Rate limiting is the "one enemy at a time" rule — `time.sleep(1)` inserts a cooldown between attacks so the API server doesn't ban you for button-mashing.
```

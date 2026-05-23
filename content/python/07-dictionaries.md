---
title: Dictionaries & Sets
skill: python
order: 7
quiz:
  - type: mc
    question: "How do you safely get a value from a dictionary with a fallback default?"
    options:
      - "dict.get(key, default)"
      - "dict[key] or default"
      - "dict.retrieve(key, default)"
      - "dict.fetch(key, default)"
    answer: 0
  - type: code
    question: "Create a dictionary named person with keys 'name' (value 'Alice') and 'age' (value 30), then print the age."
    solution: "person = {'name': 'Alice', 'age': 30}\nprint(person['age'])"
    hint: "Use curly braces {} with key: value pairs"
---

> **🎮 Analogy:** A dictionary is your spellbook in Skyrim — each spell name (key) instantly conjures its effect (value), and casting something you haven't learned throws a `KeyError` faster than a Draugr Deathlord.

## Dictionaries

Key-value pairs for structured data:

```python
student = {
    "name": "Alice",
    "age": 22,
    "courses": ["Math", "Physics"],
    "active": True
}

print(student["name"])
print(student.get("age"))
print(student.get("grade", "N/A"))

student["grade"] = "A"
student["age"] = 23
del student["active"]

print(student)
print(len(student))
```

**Output:**
```
Alice
22
N/A
{'name': 'Alice', 'age': 23, 'courses': ['Math', 'Physics'], 'grade': 'A'}
4
```

> **🎮 Analogy:** A dictionary key is a fast-travel point in an open-world game — mark `"Whiterun"` as the key and you're there instantly, no walking through bandit-infested roads every single time.

## Dictionary Methods

```python
capitals = {
    "France": "Paris",
    "Japan": "Tokyo",
    "Brazil": "Brasilia"
}

print(capitals.keys())
print(capitals.values())
print(capitals.items())

for country, capital in capitals.items():
    print(f"{capital} is the capital of {country}")
```

**Output:**
```
dict_keys(['France', 'Japan', 'Brazil'])
dict_values(['Paris', 'Tokyo', 'Brasilia'])
dict_items([('France', 'Paris'), ('Japan', 'Tokyo'), ('Brazil', 'Brasilia')])
Paris is the capital of France
Tokyo is the capital of Japan
Brasilia is the capital of Brazil
```

> **🎮 Analogy:** `.keys()`, `.values()`, and `.items()` are the three camera angles of your data — the wide shot (all keys), the close-up (all values), and the split-screen (both at once).

## Sets

Unordered collections of unique elements:

```python
fruits = {"apple", "banana", "cherry", "apple"}
print(fruits)

numbers = set([1, 2, 2, 3, 3, 4])
print(numbers)

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)
print(a & b)
print(a - b)
print(a ^ b)
```

**Output:**
```
{'banana', 'cherry', 'apple'}
{1, 2, 3, 4}
{1, 2, 3, 4, 5, 6}

> **🎮 Analogy:** A set is the anti-hoarder's inventory system — try to add a second `"apple"` and it vanishes, leaving you with a unique-only collection like a strict game master deleting your duplicate legendary drops.
{3, 4}
{1, 2}
{1, 2, 5, 6}

> **🎮 Analogy:** Set operations are Venn diagrams with loot — `|` is "everything from both dungeons," `&` is "the loot both bosses drop," `-` is "stuff only the first boss has," and `^` is "exclusive items neither shares."

## Dictionary Comprehension

```python
squares = {x: x**2 for x in range(5)}
print(squares)

celsius = {"Mon": 20, "Tue": 22, "Wed": 18}
fahrenheit = {day: temp * 9/5 + 32 for day, temp in celsius.items()}
print(fahrenheit)

words = ["hello", "world", "python"]
word_lengths = {word: len(word) for word in words}
print(word_lengths)
```

**Output:**
```
{0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
{'Mon': 68.0, 'Tue': 71.6, 'Wed': 64.4}
{'hello': 5, 'world': 5, 'python': 6}

> **🎮 Analogy:** Dictionary comprehensions are a crafting table recipe — feed in a list of raw materials like `["hello", "world"]` and out pops a labeled crate `{"hello": 5, "world": 5}` with zero manual assembly.
```

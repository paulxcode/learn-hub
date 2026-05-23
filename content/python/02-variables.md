---
title: Variables
skill: python
order: 2
quiz:
  - type: mc
    question: "Which of these is a valid Python variable name?"
    options:
      - "2nd_place"
      - "user-name"
      - "myVar1"
      - "class"
    answer: 2
  - type: code
    question: "Create a variable named city with value 'Tokyo' and print it."
    solution: "city = 'Tokyo'\nprint(city)"
    hint: "Use the assignment operator = and then print()"
---

> **🎮 Analogy:** Naming variables is like naming your character in an RPG — choose wisely, because `playerName = "ShadowSlayer99"` is a commitment you'll have to live with for the rest of the playthrough.

## Storing Data

Variables store values. No type declaration needed:

```python
name = "Alice"
age = 25
height = 1.68
is_student = True

print(name)
print(age)
print(height)
print(is_student)
```

**Output:**
```
Alice
25
1.68
True
```

> **🎮 Analogy:** Variables are like labeled boxes in your garage — Python lets you toss anything in without announcing the type first, unlike Java where you'd need to declare "this box is for ints only" before packing.

## Variable Naming Rules

- Must start with a letter or `_`
- Can contain letters, numbers, `_`
- Case-sensitive (`Name` ≠ `name`)
- Use `snake_case` by convention

```python
name = "Alice"
print(name)
name = 42
print(name)
```

**Output:**
```
Alice
42
```

> **🎮 Analogy:** Dynamic typing means Python doesn't care about labels — one minute you're holding a sword, the next you're holding a sandwich, and the game just rolls with it. Statically typed languages would make you empty your inventory first.

```python
user_name = "Bob"
user_age = 30
print(f"{user_name} is {user_age} years old")
```

**Output:**
```
Bob is 30 years old
```

> **🎮 Analogy:** f-strings are the in-flight entertainment of Python — just buckle up the `f"..."` seatbelt and sprinkle `{variable}` like snacks, no concatenation turbulence required.

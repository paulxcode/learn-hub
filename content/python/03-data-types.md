---
title: Data Types
skill: python
order: 3
quiz:
  - type: mc
    question: "What does type(3.14) return?"
    options:
      - "<class 'int'>"
      - "<class 'float'>"
      - "<class 'str'>"
      - "<class 'decimal'>"
    answer: 1
  - type: code
    question: "Convert the string '42' to an integer, add 8 to it, and print the result."
    solution: "num = int('42')\nprint(num + 8)"
    hint: "Use int() to convert the string, then add 8"
---

> **🎮 Analogy:** Choosing between `int`, `float`, `str`, and `bool` is like picking your starter Pokémon — each type has its own strengths, and jamming them together without care will leave you with a `TypeError` instead of a Charizard.

## Basic Types

Python has these built-in types:

```python
text = "Hello"
count = 42
pi = 3.14159
active = True
nothing = None

print(type(text))
print(type(count))
print(type(pi))
print(type(active))
print(type(nothing))
```

**Output:**
```
<class 'str'>
<class 'int'>
<class 'float'>
<class 'bool'>
<class 'NoneType'>
```

> **🎮 Analogy:** Each type is a different tool in your belt — `int` is a hammer (whole numbers only), `float` is a measuring tape (precision matters), `str` is a walkie-talkie (text), and `bool` is a light switch (on/off, no dimmer).

## Type Conversion

```python
age = "25"
age_num = int(age)
print(age_num + 5)

score = 100
message = "Score: " + str(score)
print(message)

print(int(3.99))
```

**Output:**
```
30
Score: 100
3
```

> **🎮 Analogy:** Type conversion is like using a universal adapter in a foreign country — `int("25")` plugs a string into an integer socket, but try converting `"hello"` to a number and you'll blow a fuse.

---
title: Hello, Python!
skill: python
order: 1
quiz:
  - type: mc
    question: "What does print(\"Python\", \"is\", \"fun!\") output?"
    options:
      - "Python is fun!"
      - "Python,is,fun!"
      - "\"Python\" \"is\" \"fun!\""
      - "Python is fun"
    answer: 0
  - type: code
    question: "Write code that prints the message 'Hello, world!'"
    solution: "print('Hello, world!')"
    hint: "Use the print() function with a string argument"
---

> **🎮 Analogy:** Your first `print()` statement is like finding a microphone in a quiet library — you just know you're about to make some noise.

## Your First Python Program

Python is a high-level, interpreted programming language. Let's start with the classic:

```python
print("Hello, Python learner!")
```

**Output:**
```
Hello, Python learner!
```

## The print() Function

`print()` outputs text to the console. You can pass multiple arguments:

```python
print("Python", "is", "fun!")
```

**Output:**
```
Python is fun!
```

> **🎮 Analogy:** Passing multiple arguments to `print()` is like throwing confetti at a party — each piece lands separately, and Python adds a space between them automatically, so you don't have to tape anything together.

## Comments

Comments are ignored by Python. Use `#` for single-line comments:

```python
# This is a comment
print("Comments are ignored")  # inline comment
```

**Output:**
```
Comments are ignored
```

> **🎮 Analogy:** Comments are the sticky notes you leave your future self — like writing "there's a mimic in this chest" on a napkin because you know you'll fall for it again in six months.

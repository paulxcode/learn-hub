---
title: Advanced Data Structures
skill: python
order: 12
quiz:
  - type: mc
    question: "What is the result of {1, 2, 3} & {2, 3, 4}?"
    options:
      - "{1, 2, 3, 4}"
      - "{2, 3}"
      - "{1, 4}"
      - "{1, 2, 3}"
    answer: 1
  - type: code
    question: "Use a list comprehension to create a list of squares for even numbers from 0 to 10, then print it."
    solution: "squares = [x**2 for x in range(11) if x % 2 == 0]\nprint(squares)"
    hint: "Use [expression for item in iterable if condition] syntax"
---

> **🎮 Analogy:** Sets and tuples are the special inventory bags of Python — sets are a "unique items only" pouch that auto-rejects duplicates, while tuples are the quest items that nobody, not even you, is allowed to change.

## Sets

Sets are unordered collections of unique elements. They excel at membership testing and eliminating duplicates:

```python
numbers = [1, 2, 2, 3, 3, 4, 5, 5]
unique = set(numbers)
print(unique)

print(2 in unique)
print(99 in unique)
```

**Output:**
```
{1, 2, 3, 4, 5}
True
False
```

> **🎮 Analogy:** A set is the guest list at an exclusive party — `set(["Alice", "Bob", "Alice"])` bounces the duplicate at the door and you're left with `{"Alice", "Bob"}`, no questions asked.

## Set Operations

```python
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

print(a | b)
print(a & b)
print(a - b)
print(a ^ b)
```

**Output:**
```
{1, 2, 3, 4, 5, 6, 7, 8}
{4, 5}
{1, 2, 3}
{1, 2, 3, 6, 7, 8}
```

> **🎮 Analogy:** Set operations are the friendship matchmaker — `|` combines everyone's friends, `&` finds mutuals, `-` shows who you know that they don't, and `^` is "people only one of you knows" (the awkward double-date reveal).

## Tuples

Tuples are immutable sequences, useful for fixed collections:

```python
point = (3, 4)
x, y = point
print(f"x={x}, y={y}")

coordinates = [(1, 2), (3, 4), (5, 6)]
for x, y in coordinates:
    print(f"({x}, {y})")
```

**Output:**
```
x=3, y=4
(1, 2)
(3, 4)
(5, 6)
```

> **🎮 Analogy:** Tuples are the unmodifiable quest items of Python — once you pick up `the_one_ring = ("precious", 1)` you can't edit it, rename it, or sell it. You're stuck with it forever, which is exactly the point when you want data that shouldn't change.

## List Comprehensions

A concise way to create lists:

```python
squares = [x**2 for x in range(10)]
print(squares)

evens = [x for x in range(20) if x % 2 == 0]
print(evens)

pairs = [(x, y) for x in range(3) for y in range(3)]
print(pairs)
```

**Output:**
```
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
[(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]
```

> **🎮 Analogy:** List comprehensions are the IKEA assembly instructions of Python — one dense diagram `[x**2 for x in range(10)]` replaces five pages of step-by-step manual labor.

## Dictionary Comprehensions

```python
squares_dict = {x: x**2 for x in range(6)}
print(squares_dict)

temps_c = {"Mon": 20, "Tue": 22, "Wed": 18}
temps_f = {day: c * 9/5 + 32 for day, c in temps_c.items()}
print(temps_f)
```

**Output:**
```
{0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
{'Mon': 68.0, 'Tue': 71.6, 'Wed': 64.4}
```

> **🎮 Analogy:** A comprehension with `{}` instead of `[]` is like turning a shopping list into a price catalog — `{day: temp*9/5+32 for day, temp in temps.items()}` transforms data while keeping labels attached.

## Generator Expressions

Generators produce values lazily, one at a time, without storing the entire sequence:

```python
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

for num in fibonacci(50):
    print(num, end=" ")
```

**Output:**
```
0 1 1 2 3 5 8 13 21 34
```

> **🎮 Analogy:** `yield` is the "to be continued..." of Python functions — instead of returning the entire season at once, it releases one episode at a time, pausing between each until you ask for the next.

Generator expressions use parentheses instead of brackets:

```python
gen = (x**2 for x in range(1000000))
print(next(gen))
print(next(gen))
print(next(gen))
```

**Output:**
```
0
1
4
```

> **🎮 Analogy:** Generator expressions are the "streaming, not downloading" approach — `(x**2 for x in range(1000000))` gives you values one at a time without the memory cost, like watching a 4K movie on Netflix instead of downloading the entire 50GB file first.

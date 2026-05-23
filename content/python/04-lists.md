---
title: Lists
skill: python
order: 4
quiz:
  - type: mc
    question: "Given fruits = ['apple', 'banana', 'cherry', 'date'], what does fruits[-1] return?"
    options:
      - "'apple'"
      - "'cherry'"
      - "'date'"
      - "IndexError"
    answer: 2
  - type: code
    question: "Use list comprehension to create a list of squares for numbers 0 through 4 and print it."
    solution: "squares = [x**2 for x in range(5)]\nprint(squares)"
    hint: "Use [x**2 for x in range(5)]"
---

> **🎮 Analogy:** A Python list is your RPG inventory bag — you can stuff a sword, a potion, and 47 rusty keys in there, grab items by slot number, and slice out a handful without dumping the whole bag on the floor.

## Lists — Ordered Collections

Lists store multiple items in a single variable. They're ordered, changeable, and allow duplicates.

```python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [42, "hello", True, 3.14]

print(fruits)
print(numbers)
print(mixed)
```

**Output:**
```
['apple', 'banana', 'cherry']
[1, 2, 3, 4, 5]
[42, 'hello', True, 3.14]
```

> **🎮 Analogy:** Lists are like an RPG party roster — you can stuff a fighter, a mage, and a rogue in the same `[]` squad, even if they have completely different stats and skills.

## Accessing Elements

Use index (starts at 0):

```python
fruits = ["apple", "banana", "cherry", "date"]
print(fruits[0])
print(fruits[-1])
print(fruits[1:3])
```

**Output:**
```
apple
date
['banana', 'cherry']
```

> **🎮 Analogy:** Indexing is raid callouts — `fruits[0]` calls out the first name on the list, `fruits[-1]` grabs the last like reaching into a dark bag of holding, and `fruits[1:3]` is a slice of the middle without pulling everything out.

## List Methods

```python
items = [1, 2, 3]

items.append(4)
print(items)

items.insert(0, 0)
print(items)

items.remove(2)
print(items)

popped = items.pop()
print(popped)
print(items)

items.sort(reverse=True)
print(items)
```

**Output:**
```
[1, 2, 3, 4]
[0, 1, 2, 3, 4]
[0, 1, 3, 4]
4
[0, 1, 3]
[3, 1, 0]
```

> **🎮 Analogy:** `.append()`, `.insert()`, `.remove()`, and `.pop()` are the four cardinal directions of inventory management — add a sword to the end, jam a potion at the front, delete the rusted key, or yoink the last item off the stack.

## List Comprehension

A concise way to create lists:

```python
squares = [x**2 for x in range(10)]
print(squares)

evens = [x for x in range(20) if x % 2 == 0]
print(evens)

pairs = [(x, y) for x in [1, 2] for y in [3, 4]]
print(pairs)
```

**Output:**
```
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
[(1, 3), (1, 4), (2, 3), (2, 4)]
```

> **🎮 Analogy:** List comprehensions are the speedrun strat of Python — instead of writing a four-line `for` loop like a casual, you one-shot the whole thing in `[x**2 for x in range(10)]` like a tool-assisted speedrunner.

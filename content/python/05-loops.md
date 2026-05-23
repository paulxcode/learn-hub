---
title: Loops
skill: python
order: 5
quiz:
  - type: mc
    question: "What does range(5) generate?"
    options:
      - "0, 1, 2, 3, 4, 5"
      - "0, 1, 2, 3, 4"
      - "1, 2, 3, 4, 5"
      - "1, 2, 3, 4"
    answer: 1
  - type: code
    question: "Write a for loop that prints each character in the string 'Python' on a new line."
    solution: "for char in 'Python':\n    print(char)"
    hint: "Use for char in 'Python':"
---

> **🎮 Analogy:** A `for` loop is the programming equivalent of grinding mobs in an MMO — you repeat the same action until you get the drop you want, except here the drop is a computed result instead of a legendary sword.

## For Loops

Iterate over sequences (lists, strings, ranges):

```python
for i in range(5):
    print(i, end=" ")
print()

fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

for char in "Python":
    print(char, end="-")
print()
```

**Output:**
```
0 1 2 3 4 
I like apple
I like banana
I like cherry
P-y-t-h-o-n-
```

> **🎮 Analogy:** A `for` loop is an assembly line in Satisfactory — each item on the belt (list, string, range) gets the same treatment as it passes by, no questions asked.

## While Loops

Repeat while a condition is true:

```python
count = 0
while count < 5:
    print(count, end=" ")
    count += 1
print()

# Break and Continue
for i in range(10):
    if i == 3:
        continue
    if i == 7:
        break
    print(i, end=" ")
print()
```

**Output:**
```
0 1 2 3 4 
0 1 2 4 5 6 
```

> **🎮 Analogy:** A `while` loop is a raid boss enrage timer — keep hitting until the condition dies. `break` is your "I'm out of potions" escape rope, and `continue` skips one attack without leaving the fight.

## Loop with Enumerate

Get both index and value:

```python
colors = ["red", "green", "blue"]
for idx, color in enumerate(colors, start=1):
    print(f"{idx}. {color}")
```

**Output:**
```
1. red
2. green
3. blue
```

> **🎮 Analogy:** `enumerate()` is the quest log that tells you not just what you found, but which chest number it came from — no more manually maintaining a `counter = 0` like a caveman.

## Nested Loops

```python
for i in range(3):
    for j in range(3):
        print(f"({i},{j})", end=" ")
    print()
```

**Output:**
```
(0,0) (0,1) (0,2) 
(1,0) (1,1) (1,2) 
(2,0) (2,1) (2,2) 
```

> **🎮 Analogy:** Nested loops are Inception dreams — for every tick of the outer dream, the inner one runs its full course before the outer one takes its next step.

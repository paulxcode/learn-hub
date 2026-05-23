---
title: Functions
skill: python
order: 6
quiz:
  - type: mc
    question: "Given def power(base, exp=2): return base ** exp, what does power(5) return?"
    options:
      - "5"
      - "10"
      - "25"
      - "32"
    answer: 2
  - type: code
    question: "Write a function multiply(a, b) that returns the product of a and b, then call it with 4 and 5 and print the result."
    solution: "def multiply(a, b):\n    return a * b\n\nprint(multiply(4, 5))"
    hint: "Use def to define the function and return to give back the result"
---

> **🎮 Analogy:** Defining a function is like learning a crafting recipe in Minecraft — write it once, and from then on you just call its name instead of placing each block manually.

## Defining Functions

Functions group reusable code. Define with `def`:

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)

def add(a, b):
    result = a + b
    return result

print(add(5, 3))
```

**Output:**
```
Hello, Alice!
8
```

> **🎮 Analogy:** A function is a macro in an MMO — record a sequence of actions once, bind it to a name, and from then on you just call its name instead of typing every keystroke by hand.

## Default Parameters

```python
def power(base, exp=2):
    return base ** exp

print(power(5))
print(power(5, 3))
print(power(2, 10))
```

**Output:**
```
25
125
1024
```

> **🎮 Analogy:** Default parameters are like ordering your usual coffee — `power(5)` assumes exponent 2 because you set that default, but `power(5, 3)` overrides it when you need the big guns.

## Keyword Arguments

```python
def describe_pet(name, animal_type="dog"):
    print(f"{name} is a {animal_type}")

describe_pet("Rex")
describe_pet("Whiskers", "cat")
describe_pet(animal_type="hamster", name="Nibbles")
```

**Output:**
```
Rex is a dog
Whiskers is a cat
Nibbles is a hamster
```

> **🎮 Analogy:** Keyword arguments let you fill out a character sheet out of order — `describe_pet(animal_type="hamster", name="Nibbles")` works because Python matches names, not seat positions.

## Variable Arguments

```python
def sum_all(*args):
    total = 0
    for n in args:
        total += n
    return total

print(sum_all(1, 2, 3))
print(sum_all(10, 20, 30, 40, 50))

def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=30, city="London")
```

**Output:**
```
6
150
name: Alice
age: 30
city: London
```

> **🎮 Analogy:** `*args` is the loot-all button on a chest — you don't know how many items you'll find, but `*args` stuffs them all into a tuple. `**kwargs` is a messenger bag of labeled pockets — every keyword and value arrive as a ready-to-use dictionary.

## Lambda Functions

One-line anonymous functions:

```python
square = lambda x: x ** 2
print(square(5))

numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(doubled)
print(evens)

sorted_by_len = sorted(["cat", "elephant", "dog", "bird"], key=lambda s: len(s))
print(sorted_by_len)
```

**Output:**
```
25
[2, 4, 6, 8, 10]
[2, 4]
['cat', 'dog', 'bird', 'elephant']
```

> **🎮 Analogy:** Lambda functions are the throwaway grenades of Python — craft them on the spot with `lambda x: x*2`, use them once in a `map()` or `filter()`, and never see them again. No name, no ceremony, just boom.

---
title: Modules & Imports
skill: python
order: 11
quiz:
  - type: mc
    question: "What does if __name__ == '__main__' do?"
    options:
      - "Prevents the module from being imported"
      - "Runs the code only when the file is executed directly, not when imported"
      - "Checks if the module has a main function"
      - "Defines the entry point for the Python interpreter"
    answer: 1
  - type: code
    question: "Write a line of code that imports only the sqrt and pi names from the math module, then prints sqrt(16)."
    solution: "from math import sqrt, pi\nprint(sqrt(16))"
    hint: "Use 'from module import name1, name2' syntax"
---

> **🎮 Analogy:** Importing modules is like buying DLC for your game — `math` didn't come with the base Python experience, but one import later you're calculating square roots like a DLC-powered warrior.

## Why Modules?

As programs grow, keeping everything in one file becomes unmanageable. Modules let you split code across files, organize related functions, and reuse logic without copying.

> **🎮 Analogy:** Modules are the expansion packs of your codebase — `math` is the "Geometry & Trigonometry" pack, `random` is the "RNG Simulator" pack, and you only load the ones your current playthrough needs.

A module is simply a `.py` file. You import its contents into another file using `import`.

## Importing Modules

```python
import math

print(math.sqrt(25))
print(math.pi)
print(math.floor(3.7))
```

**Output:**
```
5.0
3.141592653589793
3
```

> **🎮 Analogy:** `import math` is buying the whole DLC bundle. `from math import sqrt, pi` is buying only the two weapons you'll actually use — lighter download, faster load times.

## Selective Imports

Import only what you need:

```python
from math import sqrt, pi

print(sqrt(144))
print(pi)
```

**Output:**
```
12.0
3.141592653589793
```

## Aliasing

Give modules or names a shorter alias:

```python
import numpy as np
import pandas as pd
from math import sqrt as square_root

print(square_root(81))
```

**Output:**
```
9.0
```

> **🎮 Analogy:** Aliasing is giving your imported tools a nickname — `import numpy as np` is like renaming "Sir Reginald von Mathington III" to just "Reggie" because you're going to use it a hundred times before lunch.

## The `__name__ == '__main__'` Guard

When you run a Python file directly, `__name__` is set to `'__main__'`. When it's imported, `__name__` becomes the module's filename. This guard lets a file act as both a reusable module and a standalone script:

```python
# greetings.py
def greet(name):
    return f"Hello, {name}!"

if __name__ == '__main__':
    print(greet("World"))
```

Importing this module won't print anything. Running it directly prints "Hello, World!".

> **🎮 Analogy:** `if __name__ == '__main__':` is the "am I the main character?" check — run the file directly and you're the protagonist with the dramatic monologue, import it and you're just a supporting NPC whose lines stay quiet.

## Standard Library Tour

Python ships with a rich standard library:

```python
import os
import sys
import json
import math
import random

print(os.getcwd())
print(sys.version)
print(json.dumps({"key": "value"}, indent=2))
print(math.factorial(5))
print(random.randint(1, 10))
```

**Output:**
```
/Users/project
3.12.0 (main, ...)
{
  "key": "value"
}
120
7
```

> **🎮 Analogy:** Python's standard library is the cheat sheet taped to your monitor — `os` for file operations, `json` for data exchange, `math` for calculations, `random` for loot drops. Everything you need is already installed; you just have to remember it exists.

## Creating Your Own Module

```python
# mymodule.py
def add(a, b):
    return a + b

PI = 3.14159

class Calculator:
    def multiply(self, a, b):
        return a * b
```

```python
# main.py
import mymodule

print(mymodule.add(5, 3))
print(mymodule.PI)

calc = mymodule.Calculator()
print(calc.multiply(4, 7))
```

**Output:**
```
8
3.14159
28

> **🎮 Analogy:** Creating your own module is like building a custom weapon in Monster Hunter — forge the blueprint once in `mymodule.py`, then equip it in any hunt with `import mymodule` instead of crafting from scratch every time.
```

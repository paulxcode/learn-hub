---
title: File I/O
skill: python
order: 8
quiz:
  - type: mc
    question: "What does the 'w' mode do when opening a file with open()?"
    options:
      - "Read the file"
      - "Write to the file (overwrites existing content)"
      - "Append to the file"
      - "Create a new empty file (fails if exists)"
    answer: 1
  - type: code
    question: "Write code that writes the string 'Hello, file!' to a file called 'test.txt' using a with block."
    solution: "with open('test.txt', 'w') as f:\n    f.write('Hello, file!')"
    hint: "Use open() with 'w' mode inside a with statement, then call .write()"
---

> **🎮 Analogy:** File I/O is your program's save/load system — without it, all progress vanishes when the power dies, which is exactly the feeling of beating a boss and realizing you forgot to save.

## Reading Files

```python
# Create a sample file first
with open("sample.txt", "w") as f:
    f.write("Line 1: Hello\n")
    f.write("Line 2: World\n")
    f.write("Line 3: Python\n")

# Read entire file
with open("sample.txt", "r") as f:
    content = f.read()
print("Full content:")
print(content)

# Read line by line
with open("sample.txt", "r") as f:
    for line in f:
        print(f"Read: {line.strip()}")
```

**Output:**
```
Full content:
Line 1: Hello
Line 2: World
Line 3: Python

Read: Line 1: Hello
Read: Line 2: World
Read: Line 3: Python
```

> **🎮 Analogy:** The `with` statement is your auto-save feature — it opens a file, does the work, and closes it behind you like a responsible party leader who locks the dungeon door on the way out.

## Writing Files

```python
lines = ["First", "Second", "Third"]

with open("output.txt", "w") as f:
    for i, line in enumerate(lines, 1):
        f.write(f"{i}. {line}\n")

with open("output.txt", "r") as f:
    print(f.read())

# Append mode
with open("output.txt", "a") as f:
    f.write("4. Appended\n")

with open("output.txt", "r") as f:
    print(f.read())
```

**Output:**
```
1. First
2. Second
3. Third

1. First
2. Second
3. Third
4. Appended
```

> **🎮 Analogy:** Write mode (`"w"`) is "new game" — it overwrites your entire save file. Append mode (`"a"`) is "continue" — it picks up from where you left off without losing past progress.

## Working with CSV

```python
import csv

# Writing CSV
data = [
    ["Name", "Age", "City"],
    ["Alice", 30, "London"],
    ["Bob", 25, "Paris"],
    ["Charlie", 35, "Tokyo"]
]

with open("people.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(data)

# Reading CSV
with open("people.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['Name']} is {row['Age']} from {row['City']}")

import os
os.remove("sample.txt")
os.remove("output.txt")
os.remove("people.csv")
```

**Output:**
```
Alice is 30 from London
Bob is 25 from Paris
Charlie is 35 from Tokyo

> **🎮 Analogy:** CSV files are the spreadsheets of the programming world — `csv.writer` is like filling out a table in Excel with a robot arm, and `csv.DictReader` turns each row into a labeled map so you're not guessing which column is which.
```

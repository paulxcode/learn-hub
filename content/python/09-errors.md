---
title: Error Handling
skill: python
order: 9
quiz:
  - type: mc
    question: "Which block in a try/except/finally runs no matter what, even if an exception occurs?"
    options:
      - "try"
      - "except"
      - "else"
      - "finally"
    answer: 3
  - type: code
    question: "Write a try/except block that attempts to divide 10 by 0, catches ZeroDivisionError, and prints 'Cannot divide by zero'."
    solution: "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')"
    hint: "Use try: for the division and except ZeroDivisionError: to handle it"
---

> **🎮 Analogy:** Exception handling is your program's health bar — a `try/except` block is like chugging a health potion before a trap-filled dungeon, turning a fatal crash into a minor stumble and a helpful error message.

## Try / Except

Handle errors gracefully instead of crashing:

```python
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"Something went wrong: {e}")
```

We can't run this interactively (needs input), so let's simulate:

```python
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        return "Cannot divide by zero"
    except TypeError:
        return "Invalid types"

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(10, "two"))
```

**Output:**
```
5.0
Cannot divide by zero
Invalid types
```

> **🎮 Analogy:** A `try` block is walking into a trap-filled dungeon with a Phoenix Down in your pocket — if you trip a wire (`ValueError`) or get petrified (`TypeError`), the matching `except` catches you before the game-over screen.

## Finally and Else

```python
def process_file(filename):
    try:
        f = open(filename, "r")
    except FileNotFoundError:
        print(f"File {filename} not found")
        return
    else:
        print(f"File opened: {f.read()}")
    finally:
        print("Cleanup: closing file")
        try:
            f.close()
        except:
            pass

process_file("existing.txt")
process_file("nonexistent.txt")
```

**Output:**
```
File opened: (content of existing.txt)
Cleanup: closing file
File nonexistent.txt not found
Cleanup: closing file
```

> **🎮 Analogy:** `else` in a try block is the "no traps triggered" path — run the happy-day logic only if nothing exploded. `finally` is the janitor who cleans up regardless, like closing a door behind you even if a dragon just fireballed your party.

## Raising Exceptions

```python
def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    if age > 150:
        raise ValueError("Age seems unrealistic")
    return f"Valid age: {age}"

try:
    print(validate_age(25))
    print(validate_age(-5))
except ValueError as e:
    print(f"Error: {e}")

try:
    print(validate_age(200))
except ValueError as e:
    print(f"Error: {e}")
```

**Output:**
```
Valid age: 25
Error: Age cannot be negative
Error: Age seems unrealistic
```

> **🎮 Analogy:** `raise` is your game's assertion check — like `raise ValueError("Age cannot be negative")` is the game master saying "you can't go below level 1, buddy," stopping the nonsense right there.

## Custom Exceptions

```python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(f"Insufficient funds: have ${balance}, need ${amount}")

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount

try:
    withdraw(100, 150)
except InsufficientFundsError as e:
    print(f"Transaction failed: {e}")
```

**Output:**
```
Transaction failed: Insufficient funds: have $100, need $150

> **🎮 Analogy:** Custom exceptions are like modding your game's death messages — instead of the generic "you died," you get "killed by: Draugr Deathlord with ebony arrow" with your current HP and damage taken baked into the error text.
```

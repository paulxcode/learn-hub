---
title: OOP Basics
skill: python
order: 10
quiz:
  - type: mc
    question: "What is the __init__ method in a Python class?"
    options:
      - "A destructor called when an object is deleted"
      - "A constructor called when an object is created"
      - "A method that converts the object to a string"
      - "A method that compares two objects"
    answer: 1
  - type: code
    question: "Define a class Car with an __init__ method that takes make and model, and a method honk() that returns 'Beep!'"
    solution: "class Car:\n    def __init__(self, make, model):\n        self.make = make\n        self.model = model\n\n    def honk(self):\n        return 'Beep!'"
    hint: "Use class Car: and define __init__ with self, make, model parameters"
---

> **🎮 Analogy:** Classes and inheritance are the character-class system of programming — a `Mage` subclass of `Character` inherits health and mana but overrides `cast_spell()` with extra fireworks, just like picking a class in an RPG.

## Classes and Objects

Object-Oriented Programming organizes code into classes:

```python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says Woof!"

    def get_human_years(self):
        return self.age * 7

my_dog = Dog("Rex", 3)
print(my_dog.name)
print(my_dog.bark())
print(f"Human years: {my_dog.get_human_years()}")
```

**Output:**
```
Rex
Rex says Woof!
Human years: 21
```

> **🎮 Analogy:** A class is the character blueprint in an RPG creator — `Dog` defines what every dog can do (bark, age), and `my_dog = Dog("Rex", 3)` spawns your specific pupper with its own name and age stats.

## Class vs Instance Attributes

```python
class Employee:
    company = "TechCorp"

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

e1 = Employee("Alice", 50000)
e2 = Employee("Bob", 60000)

print(e1.company)
print(e1.name)
print(e2.name)

Employee.company = "NewCorp"
print(e1.company)
```

**Output:**
```
TechCorp
Alice
Bob
NewCorp
```

> **🎮 Analogy:** Class attributes are the company-wide email that every employee sees — change the company name and every employee instance gets the memo. Instance attributes are the email only one person reads.

## Inheritance

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

class Duck(Animal):
    def speak(self):
        return f"{self.name} says Quack!"

animals = [Cat("Whiskers"), Duck("Donald"), Animal("Generic")]
for a in animals:
    print(a.speak())
```

**Output:**
```
Whiskers says Meow!
Donald says Quack!
...
```

> **🎮 Analogy:** Inheritance is the skill tree of programming — `Cat` inherits `speak()` from `Animal` but overrides it with `"Meow!"`, like a class upgrade that keeps the base stats but replaces the ultimate ability.

## Magic Methods

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

v1 = Vector(2, 3)
v2 = Vector(4, 5)
print(v1 + v2)
print(v1 == Vector(2, 3))
print(v1 == v2)
```

**Output:**
```
Vector(6, 8)
True
False
```

> **🎮 Analogy:** Magic methods are the cheat codes of Python classes — define `__add__` and suddenly your `Vector` objects can use `+` like native numbers, same way infinite ammo codes bend the game's rules.

## Properties

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32

t = Temperature(25)
print(f"{t.celsius}C = {t.fahrenheit}F")
t.celsius = 30
print(f"{t.celsius}C = {t.fahrenheit}F")
```

**Output:**
```
25C = 77.0F
30C = 86.0F

> **🎮 Analogy:** `@property` turns a method into a fake attribute — it looks like you're reading `t.celsius` but behind the scenes a whole validation function runs, like a vending machine that looks like a regular wall but only dispenses snacks to people with exact change.
```

---
title: Working with Databases
skill: python
order: 15
quiz:
  - type: mc
    question: "What does SQLAlchemy Core provide compared to the sqlite3 module?"
    options:
      - "A high-level ORM with automatic table creation and relationship mapping"
      - "Faster query execution for all database types"
      - "A built-in web server for database administration"
      - "Automatic data visualization"
    answer: 0
  - type: mc
    question: "When writing a pandas DataFrame to a database, which method handles type conversion and conflict resolution?"
    options:
      - "pd.read_sql()"
      - "df.to_sql()"
      - "df.to_csv()"
      - "pd.DataFrame()"
    answer: 1
  - type: mc
    question: "Why is connection pooling important for data pipelines?"
    options:
      - "It prevents SQL injection attacks"
      - "It reuses database connections to reduce overhead and handle concurrent operations efficiently"
      - "It automatically indexes all columns"
      - "It encrypts data in transit"
    answer: 1
---

> **🎮 Analogy:** Querying a database from Python is like checking your quest log — you `SELECT` completed quests, `UPDATE` your progress, and if you forget the `WHERE` clause, every NPC in the game suddenly thinks you're the guild leader.

## SQLite from Python

The `sqlite3` module is built into Python's standard library — no extra installs needed:

```python
import sqlite3

conn = sqlite3.connect("analytics.db")
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        amount REAL,
        category TEXT,
        created_at TEXT
    )
""")

cursor.execute("""
    INSERT INTO transactions (user_id, amount, category)
    VALUES (?, ?, ?)
""", (101, 49.99, "subscription"))

conn.commit()

cursor.execute("SELECT category, SUM(amount) FROM transactions GROUP BY category")
for row in cursor.fetchall():
    print(f"{row[0]}: ${row[1]:.2f}")

conn.close()
```

Always use `?` placeholders — never f-strings — to prevent SQL injection.

> **🎮 Analogy:** `sqlite3` is the bicycle of databases — built into Python, no install needed, but don't ride it in a race (concurrent writes) because it's strictly single-file, single-rider.

## SQLAlchemy ORM Basics

SQLAlchemy is the de-facto ORM for Python. It maps Python classes to database tables:

```python
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

Base = declarative_base()


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


engine = create_engine("sqlite:///analytics.db")
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

tx = Transaction(user_id=101, amount=49.99, category="subscription")
session.add(tx)
session.commit()

totals = session.query(
    Transaction.category,
    func.sum(Transaction.amount)
).group_by(Transaction.category).all()

for category, total in totals:
    print(f"{category}: ${total:.2f}")
```

> **🎮 Analogy:** SQLAlchemy is the modding framework of databases — you define `class Transaction(Base)` like a character template, and it auto-generates the CREATE TABLE spell, saving you from writing raw SQL incantations by hand.

## Reading and Writing DataFrames

pandas integrates directly with SQLAlchemy engines:

```python
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("sqlite:///analytics.db")

df = pd.read_sql("SELECT * FROM transactions WHERE amount > 10", engine)
print(df.head())

new_data = pd.DataFrame([
    {"user_id": 102, "amount": 199.99, "category": "software"},
    {"user_id": 103, "amount": 9.99, "category": "music"},
])

new_data.to_sql("transactions", engine, if_exists="append", index=False)
```

`if_exists="append"` adds rows to an existing table. `"replace"` drops and recreates it. `"fail"` raises an error if the table exists.

> **🎮 Analogy:** pandas + SQL is the import/export truck of data — `pd.read_sql("SELECT * FROM transactions", engine) loads a whole warehouse onto your truck bed, and `df.to_sql("transactions", engine)` unloads it into the database like a forklift on steroids.

## Connection Pooling

Data pipelines process thousands of records. Creating a new connection per operation is slow. Connection pools reuse connections:

```python
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql://user:pass@host:5432/mydb",
    pool_size=5,
    max_overflow=10,
    pool_recycle=3600,
    pool_pre_ping=True,
)

with engine.connect() as conn:
    result = conn.execute("SELECT COUNT(*) FROM large_table")
    print(result.scalar())
```

Key pool settings:

| Parameter | Purpose |
|-----------|---------|
| `pool_size` | Number of persistent connections |
| `max_overflow` | Extra connections beyond pool_size during spikes |
| `pool_recycle` | Recycle connections after N seconds (avoids stale connections) |
| `pool_pre_ping` | Check connection is alive before using it |

For SQLite, pooling isn't needed (single-writer). For Postgres/MySQL in production pipelines, pooling is essential.

> **🎮 Analogy:** Connection pooling is the valet parking of databases — instead of walking to the lot (opening a new connection) every time you need your car, the pool keeps 5 cars ready at the curb so you're in and out in seconds.

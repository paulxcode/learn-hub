CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  skill TEXT NOT NULL,
  title TEXT NOT NULL,
  order_num INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  music_url TEXT DEFAULT '',
  theme TEXT DEFAULT 'cyberpunk',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress (
  lesson_id TEXT NOT NULL,
  user_id INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT DEFAULT '',
  PRIMARY KEY (lesson_id, user_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  lesson_id TEXT NOT NULL,
  user_id INTEGER NOT NULL DEFAULT 0,
  label TEXT NOT NULL,
  PRIMARY KEY (lesson_id, user_id, label)
);

CREATE TABLE IF NOT EXISTS quiz_results (
  lesson_id TEXT NOT NULL,
  user_id INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers TEXT DEFAULT '',
  completed_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (lesson_id, user_id)
);

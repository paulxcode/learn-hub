# Learn Hub

An interactive data engineering learning platform — **8 skill trees, 120 lessons**. Lessons are written in Markdown with embedded quizzes (multiple choice + coding). Python exercises run **in the browser** via Pyodide (no backend needed). Progress, bookmarks, and quiz scores are tracked per user.

## Tech Stack

**Backend:** Express.js (ESM), sql.js (SQLite WASM), express-session  
**Frontend:** Vanilla JS SPA — no framework, no bundler, no build step  
**Python Runner:** Pyodide 0.25.0 (numpy, pandas, matplotlib pre-loaded)  
**Auth:** Session-based (crypto.scryptSync password hashing)  
**Music:** YouTube IFrame API — per-user background tracks

## Skills

| Skill | Lessons |
|-------|---------|
| Python | 15 |
| SQL | 15 |
| Data Pipelines | 15 |
| Cloud & Big Data | 15 |
| Data Governance | 15 |
| Data Visualization | 15 |
| Machine Learning | 15 |
| DevOps / MLOps | 15 |

## Features

- **Interactive Python Runner** — Click *Run* on any Python code block; Pyodide executes in the browser and captures stdout + matplotlib figures
- **Quizzes** — Multiple-choice with instant feedback; coding exercises verified against expected output
- **Progress Tracking** — Mark lessons complete, save notes, bookmark favorites, track streaks, view per-skill progress bars on the dashboard
- **Themed UI** — Cyberpunk-inspired design with a custom YouTube music player per user
- **Session Auth** — Register/login with username + email; profile settings to change password or set a custom music URL
- **Real-time Search** — Filter lessons across all skills instantly

## Quick Start

```bash
# Requires Node.js 18+
npm install
npm run dev
```

Opens at `http://localhost:3000`. The `learning.db` file is created automatically on first run.

- `npm run dev` — dev mode with `node --watch` (auto-restart on file changes)
- `npm start` — production start

## Project Structure

```
content/                  # 8 skill dirs, 15 markdown lessons each
database/
  db.js                   # sql.js wrapper (load/save binary DB)
  schema.sql              # Users + lessons + progress tables
routes/
  auth.js                 # Register, login, logout, settings
  content.js              # Lesson indexing and serving
  progress.js             # Completion, notes, bookmarks, quizzes
public/
  index.html              # SPA shell
  js/app.js               # Entire SPA frontend (vanilla JS)
  js/pyodide/runner.js    # Pyodide bootstrap + code runner
  css/style.css           # All styles, 5 themes
  config/themes.json      # Theme→YouTube video mappings
server.js                 # Express entry point
```

## Architecture Notes

- **sql.js** is SQLite compiled to WebAssembly — the binary `learning.db` file is loaded into memory on startup and saved to disk on every write
- **Sessions** are stored in-memory (MemoryStore) — a server restart logs all users out
- **Content re-indexes on restart** — `DELETE` + re-`INSERT` all lessons from the `content/` directory
- **No build step** — the frontend is vanilla JS served as static files

## License

MIT

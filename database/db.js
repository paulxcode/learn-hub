import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'learning.db');

let db;

export async function initDb() {
  try {
    const SQL = await initSqlJs();
    if (existsSync(DB_PATH)) {
      const buffer = readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    db.run(schema);

    function columnExists(table, col) {
      const result = db.exec(`PRAGMA table_info(${table})`);
      if (result.length === 0) return false;
      return result[0].values.some(row => row[1] === col);
    }

    if (!columnExists('progress', 'user_id')) {
      db.run('ALTER TABLE progress ADD COLUMN user_id INTEGER DEFAULT 0');
    }
    if (!columnExists('bookmarks', 'user_id')) {
      db.run('ALTER TABLE bookmarks ADD COLUMN user_id INTEGER DEFAULT 0');
    }
    if (!columnExists('quiz_results', 'user_id')) {
      db.run('ALTER TABLE quiz_results ADD COLUMN user_id INTEGER DEFAULT 0');
    }
    if (!columnExists('users', 'music_url')) {
      db.run("ALTER TABLE users ADD COLUMN music_url TEXT DEFAULT ''");
    }
    if (!columnExists('users', 'theme')) {
      db.run("ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'cyberpunk'");
    }

    return db;
  } catch (err) {
    throw new Error(`Failed to initialize database: ${err.message}`);
  }
}

export function getDb() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(DB_PATH, buffer);
}

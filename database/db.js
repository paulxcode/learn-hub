import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', err => console.error('Pool error:', err.message));

export async function initDb() {
  const { readFileSync, existsSync } = await import('fs');
  const { join, dirname } = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  await pool.query(schema);

  async function columnExists(table, col) {
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = $2`,
      [table, col]
    );
    return result.rows.length > 0;
  }

  if (!(await columnExists('progress', 'user_id'))) {
    await pool.query('ALTER TABLE progress ADD COLUMN user_id INTEGER DEFAULT 0');
  }
  if (!(await columnExists('bookmarks', 'user_id'))) {
    await pool.query('ALTER TABLE bookmarks ADD COLUMN user_id INTEGER DEFAULT 0');
  }
  if (!(await columnExists('quiz_results', 'user_id'))) {
    await pool.query('ALTER TABLE quiz_results ADD COLUMN user_id INTEGER DEFAULT 0');
  }
  if (!(await columnExists('users', 'music_url'))) {
    await pool.query("ALTER TABLE users ADD COLUMN music_url TEXT DEFAULT ''");
  }
  if (!(await columnExists('users', 'theme'))) {
    await pool.query("ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'cyberpunk'");
  }
}

export function getDb() {
  return pool;
}

export { pool };

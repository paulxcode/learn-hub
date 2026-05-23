import { Router } from 'express';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { getDb, saveDb } from '../database/db.js';

export const authRouter = Router();

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${key}`;
}

function verifyPassword(password, stored) {
  const [salt, key] = stored.split(':');
  const keyBuf = Buffer.from(key, 'hex');
  const derivedBuf = scryptSync(password, salt, 64);
  return keyBuf.length === derivedBuf.length && timingSafeEqual(keyBuf, derivedBuf);
}

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

authRouter.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, password required' });
  }
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ error: 'Username must be 3-30 characters' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const db = getDb();
  const existing = db.exec('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
  if (existing.length > 0 && existing[0].values.length > 0) {
    return res.status(409).json({ error: 'Username or email already taken' });
  }

  const hash = hashPassword(password);
  db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash]);
  saveDb();

  const userResult = db.exec('SELECT id, username, email, music_url, theme FROM users WHERE email = ?', [email]);
  const user = userResult[0].values[0];
  req.session.userId = user[0];

  res.json({ user: { id: user[0], username: user[1], email: user[2], music_url: user[3] || '', theme: user[4] || 'cyberpunk' } });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  const db = getDb();
  const result = db.exec('SELECT id, username, email, password_hash, music_url FROM users WHERE email = ?', [email]);
  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const [id, username, userEmail, hash, musicUrl, theme] = result[0].values[0];
  if (!verifyPassword(password, hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  req.session.userId = id;
  res.json({ user: { id, username, email: userEmail, music_url: musicUrl || '', theme: theme || 'cyberpunk' } });
});

authRouter.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

authRouter.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const db = getDb();
  const result = db.exec('SELECT id, username, email, music_url, theme FROM users WHERE id = ?', [req.session.userId]);
  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(401).json({ error: 'User not found' });
  }
  const [id, username, email, musicUrl, theme] = result[0].values[0];
  res.json({ user: { id, username, email, music_url: musicUrl || '', theme: theme || 'cyberpunk' } });
});

authRouter.put('/settings', requireAuth, (req, res) => {
  const { username, password, music_url, theme } = req.body;
  const db = getDb();

  if (username) {
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be 3-30 characters' });
    }
    const existing = db.exec('SELECT id FROM users WHERE username = ? AND id != ?', [username, req.session.userId]);
    if (existing.length > 0 && existing[0].values.length > 0) {
      return res.status(409).json({ error: 'Username already taken' });
    }
    db.run('UPDATE users SET username = ? WHERE id = ?', [username, req.session.userId]);
  }

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const hash = hashPassword(password);
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.session.userId]);
  }

  if (music_url !== undefined) {
    db.run('UPDATE users SET music_url = ? WHERE id = ?', [music_url, req.session.userId]);
  }

  if (theme !== undefined) {
    db.run('UPDATE users SET theme = ? WHERE id = ?', [theme, req.session.userId]);
  }

  saveDb();

  const result = db.exec('SELECT id, username, email, music_url, theme FROM users WHERE id = ?', [req.session.userId]);
  const [id, uname, email, musicUrl, userTheme] = result[0].values[0];
  res.json({ user: { id, username: uname, email, music_url: musicUrl || '', theme: userTheme || 'cyberpunk' } });
});

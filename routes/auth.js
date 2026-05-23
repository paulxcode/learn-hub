import { Router } from 'express';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { pool } from '../database/db.js';

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

authRouter.post('/register', async (req, res) => {
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

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already taken' });
    }

    const hash = hashPassword(password);
    await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, hash]);

    const userResult = await pool.query('SELECT id, username, email, music_url, theme FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    req.session.userId = user.id;

    res.json({ user: { id: user.id, username: user.username, email: user.email, music_url: user.music_url || '', theme: user.theme || 'cyberpunk' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  try {
    const result = await pool.query('SELECT id, username, email, password_hash, music_url, theme FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.userId = user.id;
    res.json({ user: { id: user.id, username: user.username, email: user.email, music_url: user.music_url || '', theme: user.theme || 'cyberpunk' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

authRouter.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const result = await pool.query('SELECT id, username, email, music_url, theme FROM users WHERE id = $1', [req.session.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    res.json({ user: { id: user.id, username: user.username, email: user.email, music_url: user.music_url || '', theme: user.theme || 'cyberpunk' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.put('/settings', requireAuth, async (req, res) => {
  const { username, password, music_url, theme } = req.body;

  try {
    if (username) {
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Username must be 3-30 characters' });
      }
      const existing = await pool.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, req.session.userId]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Username already taken' });
      }
      await pool.query('UPDATE users SET username = $1 WHERE id = $2', [username, req.session.userId]);
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const hash = hashPassword(password);
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.session.userId]);
    }

    if (music_url !== undefined) {
      await pool.query('UPDATE users SET music_url = $1 WHERE id = $2', [music_url, req.session.userId]);
    }

    if (theme !== undefined) {
      await pool.query('UPDATE users SET theme = $1 WHERE id = $2', [theme, req.session.userId]);
    }

    const result = await pool.query('SELECT id, username, email, music_url, theme FROM users WHERE id = $1', [req.session.userId]);
    const user = result.rows[0];
    res.json({ user: { id: user.id, username: user.username, email: user.email, music_url: user.music_url || '', theme: user.theme || 'cyberpunk' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

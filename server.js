import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { initDb, pool } from './database/db.js';
import { contentRouter, scanContent } from './routes/content.js';
import { progressRouter } from './routes/progress.js';
import { authRouter } from './routes/auth.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new (pgSession(session))({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'learn-hub-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use('/api/auth', authRouter);
app.use('/api/content', contentRouter);
app.use('/api/progress', progressRouter);

app.use(express.static(join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

(async () => {
  try {
    await initDb();
    await scanContent();
    app.listen(PORT, () => {
      console.log(`Learn Hub running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
})();

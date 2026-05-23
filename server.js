import express from 'express';
import session from 'express-session';
import { initDb } from './database/db.js';
import { contentRouter, scanContent } from './routes/content.js';
import { progressRouter } from './routes/progress.js';
import { authRouter } from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'learning-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' },
}));
app.use(express.static('public'));

app.use('/api/auth', authRouter);
app.use('/api/content', contentRouter);
app.use('/api/progress', progressRouter);

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

(async () => {
  await initDb();
  scanContent();
  app.listen(PORT, () => {
    console.log(`Learning site running at http://localhost:${PORT}`);
  });
})();

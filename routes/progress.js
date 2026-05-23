import { Router } from 'express';
import { getDb, saveDb } from '../database/db.js';

export const progressRouter = Router();

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

progressRouter.use(requireAuth);

progressRouter.get('/', (req, res) => {
  const db = getDb();
  const completed = db.exec('SELECT * FROM progress WHERE user_id = ?', [req.session.userId]);
  const bookmarks = db.exec('SELECT * FROM bookmarks WHERE user_id = ?', [req.session.userId]);
  res.json({
    completed: completed.length > 0 ? completed[0].values.map(r => ({
      lesson_id: r[0], completed_at: r[1], notes: r[2]
    })) : [],
    bookmarks: bookmarks.length > 0 ? bookmarks[0].values.map(r => ({
      lesson_id: r[0], label: r[1]
    })) : [],
  });
});

progressRouter.post('/complete', (req, res) => {
  const { lessonId } = req.body;
  if (!lessonId) return res.status(400).json({ error: 'lessonId required' });
  const db = getDb();
  const existing = db.exec('SELECT notes FROM progress WHERE lesson_id = ? AND user_id = ?', [lessonId, req.session.userId]);
  const notes = (existing.length > 0 && existing[0].values.length > 0) ? existing[0].values[0][0] : '';
  db.run(
    'INSERT OR REPLACE INTO progress (lesson_id, user_id, completed_at, notes) VALUES (?, ?, datetime(\'now\'), ?)',
    [lessonId, req.session.userId, notes || '']
  );
  saveDb();
  res.json({ ok: true });
});

progressRouter.delete('/complete/:lessonId', (req, res) => {
  const db = getDb();
  db.run('DELETE FROM progress WHERE lesson_id = ? AND user_id = ?', [req.params.lessonId, req.session.userId]);
  saveDb();
  res.json({ ok: true });
});

progressRouter.put('/notes', (req, res) => {
  const { lessonId, notes } = req.body;
  if (!lessonId) return res.status(400).json({ error: 'lessonId required' });
  const db = getDb();
  const existing = db.exec('SELECT completed_at FROM progress WHERE lesson_id = ? AND user_id = ?', [lessonId, req.session.userId]);
  if (existing.length > 0 && existing[0].values.length > 0) {
    db.run('UPDATE progress SET notes = ? WHERE lesson_id = ? AND user_id = ?', [notes || '', lessonId, req.session.userId]);
  } else {
    db.run('INSERT INTO progress (lesson_id, user_id, notes, completed_at) VALUES (?, ?, ?, NULL)', [lessonId, req.session.userId, notes || '']);
  }
  saveDb();
  res.json({ ok: true });
});

progressRouter.post('/bookmark', (req, res) => {
  const { lessonId, label } = req.body;
  if (!lessonId || !label) return res.status(400).json({ error: 'lessonId and label required' });
  const db = getDb();
  db.run('INSERT OR IGNORE INTO bookmarks (lesson_id, user_id, label) VALUES (?, ?, ?)', [lessonId, req.session.userId, label]);
  saveDb();
  res.json({ ok: true });
});

progressRouter.delete('/bookmark/:lessonId/:label', (req, res) => {
  const db = getDb();
  db.run('DELETE FROM bookmarks WHERE lesson_id = ? AND user_id = ? AND label = ?', [req.params.lessonId, req.session.userId, req.params.label]);
  saveDb();
  res.json({ ok: true });
});

progressRouter.post('/quiz-result', (req, res) => {
  const { lessonId, score, total, answers } = req.body;
  if (!lessonId || score === undefined || total === undefined) {
    return res.status(400).json({ error: 'lessonId, score, total required' });
  }
  const db = getDb();
  db.run(
    'INSERT OR REPLACE INTO quiz_results (lesson_id, user_id, score, total, answers, completed_at) VALUES (?, ?, ?, ?, ?, datetime(\'now\'))',
    [lessonId, req.session.userId, score, total, answers || '']
  );
  saveDb();
  res.json({ ok: true });
});

progressRouter.get('/dashboard', (req, res) => {
  const db = getDb();

  const totalsResult = db.exec('SELECT skill, COUNT(*) as cnt FROM lessons GROUP BY skill ORDER BY skill');
  const totals = {};
  if (totalsResult.length > 0) {
    for (const row of totalsResult[0].values) {
      totals[row[0]] = row[1];
    }
  }

  const completedResult = db.exec(`
    SELECT l.skill, COUNT(*) as cnt
    FROM progress p JOIN lessons l ON p.lesson_id = l.id
    WHERE p.completed_at IS NOT NULL AND p.user_id = ?
    GROUP BY l.skill
  `, [req.session.userId]);
  const completed = {};
  if (completedResult.length > 0) {
    for (const row of completedResult[0].values) {
      completed[row[0]] = row[1];
    }
  }

  const quizResult = db.exec(`
    SELECT l.skill, AVG(q.score * 1.0 / q.total * 100) as avg_score
    FROM quiz_results q
    JOIN lessons l ON q.lesson_id = l.id
    WHERE q.user_id = ?
    GROUP BY l.skill
  `, [req.session.userId]);
  const quizScores = {};
  if (quizResult.length > 0) {
    for (const row of quizResult[0].values) {
      quizScores[row[0]] = Math.round(row[1]);
    }
  }

  const datesResult = db.exec('SELECT DISTINCT DATE(completed_at) as d FROM progress WHERE completed_at IS NOT NULL AND user_id = ? ORDER BY d DESC', [req.session.userId]);
  let streak = 0;
  if (datesResult.length > 0) {
    const dates = datesResult[0].values.map(r => r[0]);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (prev - curr) / 86400000;
        if (diff === 1) streak++;
        else break;
      }
    }
  }

  const bmResult = db.exec('SELECT lesson_id, label FROM bookmarks WHERE user_id = ?', [req.session.userId]);
  const bookmarks = bmResult.length > 0
    ? bmResult[0].values.map(r => ({ lessonId: r[0], label: r[1] }))
    : [];

  res.json({ totals, completed, quizScores, streak, bookmarks });
});

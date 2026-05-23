import { Router } from 'express';
import { pool } from '../database/db.js';

export const progressRouter = Router();

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

progressRouter.use(requireAuth);

progressRouter.get('/', async (req, res) => {
  const completedResult = await pool.query('SELECT * FROM progress WHERE user_id = $1', [req.session.userId]);
  const bookmarksResult = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1', [req.session.userId]);
  res.json({
    completed: completedResult.rows.map(r => ({
      lesson_id: r.lesson_id, completed_at: r.completed_at, notes: r.notes
    })),
    bookmarks: bookmarksResult.rows.map(r => ({
      lesson_id: r.lesson_id, label: r.label
    })),
  });
});

progressRouter.post('/complete', async (req, res) => {
  const { lessonId } = req.body;
  if (!lessonId) return res.status(400).json({ error: 'lessonId required' });
  const existing = await pool.query('SELECT notes FROM progress WHERE lesson_id = $1 AND user_id = $2', [lessonId, req.session.userId]);
  const notes = existing.rows.length > 0 ? existing.rows[0].notes : '';
  await pool.query(
    `INSERT INTO progress (lesson_id, user_id, completed_at, notes) VALUES ($1, $2, NOW(), $3) ON CONFLICT (lesson_id, user_id) DO UPDATE SET completed_at = NOW(), notes = EXCLUDED.notes`,
    [lessonId, req.session.userId, notes || '']
  );
  res.json({ ok: true });
});

progressRouter.delete('/complete/:lessonId', async (req, res) => {
  await pool.query('DELETE FROM progress WHERE lesson_id = $1 AND user_id = $2', [req.params.lessonId, req.session.userId]);
  res.json({ ok: true });
});

progressRouter.put('/notes', async (req, res) => {
  const { lessonId, notes } = req.body;
  if (!lessonId) return res.status(400).json({ error: 'lessonId required' });
  const existing = await pool.query('SELECT completed_at FROM progress WHERE lesson_id = $1 AND user_id = $2', [lessonId, req.session.userId]);
  if (existing.rows.length > 0) {
    await pool.query('UPDATE progress SET notes = $1 WHERE lesson_id = $2 AND user_id = $3', [notes || '', lessonId, req.session.userId]);
  } else {
    await pool.query('INSERT INTO progress (lesson_id, user_id, notes, completed_at) VALUES ($1, $2, $3, NULL)', [lessonId, req.session.userId, notes || '']);
  }
  res.json({ ok: true });
});

progressRouter.post('/bookmark', async (req, res) => {
  const { lessonId, label } = req.body;
  if (!lessonId || !label) return res.status(400).json({ error: 'lessonId and label required' });
  await pool.query('INSERT INTO bookmarks (lesson_id, user_id, label) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [lessonId, req.session.userId, label]);
  res.json({ ok: true });
});

progressRouter.delete('/bookmark/:lessonId/:label', async (req, res) => {
  await pool.query('DELETE FROM bookmarks WHERE lesson_id = $1 AND user_id = $2 AND label = $3', [req.params.lessonId, req.session.userId, req.params.label]);
  res.json({ ok: true });
});

progressRouter.post('/quiz-result', async (req, res) => {
  const { lessonId, score, total, answers } = req.body;
  if (!lessonId || score === undefined || total === undefined) {
    return res.status(400).json({ error: 'lessonId, score, total required' });
  }
  await pool.query(
    `INSERT INTO quiz_results (lesson_id, user_id, score, total, answers, completed_at) VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (lesson_id, user_id) DO UPDATE SET score = EXCLUDED.score, total = EXCLUDED.total, answers = EXCLUDED.answers, completed_at = NOW()`,
    [lessonId, req.session.userId, score, total, answers || '']
  );
  res.json({ ok: true });
});

progressRouter.get('/dashboard', async (req, res) => {
  const totalsResult = await pool.query('SELECT skill, COUNT(*)::int as cnt FROM lessons GROUP BY skill ORDER BY skill');
  const totals = {};
  for (const row of totalsResult.rows) {
    totals[row.skill] = row.cnt;
  }

  const completedResult = await pool.query(`
    SELECT l.skill, COUNT(*)::int as cnt
    FROM progress p JOIN lessons l ON p.lesson_id = l.id
    WHERE p.completed_at IS NOT NULL AND p.user_id = $1
    GROUP BY l.skill
  `, [req.session.userId]);
  const completed = {};
  for (const row of completedResult.rows) {
    completed[row.skill] = row.cnt;
  }

  const quizResult = await pool.query(`
    SELECT l.skill, AVG(q.score * 1.0 / q.total * 100)::float as avg_score
    FROM quiz_results q
    JOIN lessons l ON q.lesson_id = l.id
    WHERE q.user_id = $1
    GROUP BY l.skill
  `, [req.session.userId]);
  const quizScores = {};
  for (const row of quizResult.rows) {
    quizScores[row.skill] = Math.round(row.avg_score);
  }

  const datesResult = await pool.query('SELECT DISTINCT DATE(completed_at) as d FROM progress WHERE completed_at IS NOT NULL AND user_id = $1 ORDER BY d DESC', [req.session.userId]);
  let streak = 0;
  if (datesResult.rows.length > 0) {
    const dates = datesResult.rows.map(r => r.d);
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

  const bmResult = await pool.query('SELECT lesson_id, label FROM bookmarks WHERE user_id = $1', [req.session.userId]);
  const bookmarks = bmResult.rows.map(r => ({ lessonId: r.lesson_id, label: r.label }));

  res.json({ totals, completed, quizScores, streak, bookmarks });
});

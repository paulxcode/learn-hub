import { Router } from 'express';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { pool } from '../database/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');

export const contentRouter = Router();

export async function scanContent() {
  const skills = readdirSync(CONTENT_DIR).filter(e =>
    statSync(join(CONTENT_DIR, e)).isDirectory()
  );

  await pool.query('DELETE FROM lessons');

  for (const skill of skills) {
    const skillDir = join(CONTENT_DIR, skill);
    const files = readdirSync(skillDir)
      .filter(f => f.endsWith('.md'))
      .sort();

    for (const file of files) {
      const raw = readFileSync(join(skillDir, file), 'utf-8');
      const { data } = matter(raw);
      const id = `${skill}/${file.replace(/^\d+-/, '').replace('.md', '')}`;
      await pool.query(
        'INSERT INTO lessons (id, skill, title, order_num) VALUES ($1, $2, $3, $4)',
        [id, skill, data.title || file, data.order || 0]
      );
    }
  }
}

contentRouter.get('/skills', async (req, res) => {
  const result = await pool.query('SELECT id, skill, title, order_num FROM lessons ORDER BY order_num');

  const tree = {};
  for (const row of result.rows) {
    if (!tree[row.skill]) tree[row.skill] = [];
    tree[row.skill].push({ id: row.id, title: row.title });
  }

  res.json(tree);
});

contentRouter.get('/lesson/:id(.*)', async (req, res) => {
  const result = await pool.query('SELECT id, skill, title FROM lessons WHERE id = $1', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const { id, skill, title } = result.rows[0];
  const skillDir = join(CONTENT_DIR, skill);
  const namePart = id.split('/').slice(1).join('/');
  const files = readdirSync(skillDir)
    .filter(f => f.endsWith('.md') && f.includes(namePart));

  if (files.length === 0) {
    return res.status(404).json({ error: 'Content file not found' });
  }

  const raw = readFileSync(join(CONTENT_DIR, skill, files[0]), 'utf-8');
  const { content } = matter(raw);
  const html = marked(content);

  res.json({ id, title, html });
});

contentRouter.get('/quiz/:id(.*)', async (req, res) => {
  const skill = req.params.id.split('/')[0];
  const skillDir = join(CONTENT_DIR, skill);
  const namePart = req.params.id.split('/').slice(1).join('/');
  if (!existsSync(skillDir)) {
    return res.status(404).json({ error: 'Skill not found' });
  }
  const files = readdirSync(skillDir)
    .filter(f => f.endsWith('.md') && f.includes(namePart));
  if (files.length === 0) {
    return res.status(404).json({ error: 'Lesson not found' });
  }
  const raw = readFileSync(join(CONTENT_DIR, skill, files[0]), 'utf-8');
  const { data } = matter(raw);
  const quiz = data.quiz || [];
  res.json({ lessonId: req.params.id, questions: quiz });
});

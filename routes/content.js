import { Router } from 'express';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { getDb, saveDb } from '../database/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');

export const contentRouter = Router();

export function scanContent() {
  const db = getDb();
  const skills = readdirSync(CONTENT_DIR).filter(e =>
    statSync(join(CONTENT_DIR, e)).isDirectory()
  );

  db.run('DELETE FROM lessons');

  for (const skill of skills) {
    const skillDir = join(CONTENT_DIR, skill);
    const files = readdirSync(skillDir)
      .filter(f => f.endsWith('.md'))
      .sort();

    for (const file of files) {
      const raw = readFileSync(join(skillDir, file), 'utf-8');
      const { data } = matter(raw);
      const id = `${skill}/${file.replace(/^\d+-/, '').replace('.md', '')}`;
      db.run('INSERT INTO lessons VALUES (?, ?, ?, ?)', [id, skill, data.title || file, data.order || 0]);
    }
  }

  saveDb();
}

contentRouter.get('/skills', (req, res) => {
  const db = getDb();
  const result = db.exec('SELECT id, skill, title, order_num FROM lessons ORDER BY order_num');

  const tree = {};
  if (result.length > 0) {
    for (const row of result[0].values) {
      const [id, skill, title] = row;
      if (!tree[skill]) tree[skill] = [];
      tree[skill].push({ id, title });
    }
  }

  res.json(tree);
});

contentRouter.get('/lesson/:id(.*)', (req, res) => {
  const db = getDb();
  const result = db.exec(`SELECT id, skill, title FROM lessons WHERE id = '${req.params.id}'`);

  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const [id, skill, title] = result[0].values[0];
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

contentRouter.get('/quiz/:id(.*)', (req, res) => {
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

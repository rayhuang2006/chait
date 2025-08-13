import express from 'express';
import db from './db.js';
import { authRequired, adminRequired } from './middleware.js';

const router = express.Router();

// 角色 CRUD
router.get('/characters', authRequired, adminRequired, (req, res) => {
  const rows = db.prepare('SELECT * FROM characters ORDER BY id DESC').all();
  res.json(rows);
});

router.post('/characters', authRequired, adminRequired, (req, res) => {
  const { name, system_prompt, color = '#ffffff', avatar = '🙂' } = req.body || {};
  if (!name || !system_prompt) return res.status(400).json({ error: 'Missing fields' });
  try {
    const info = db.prepare('INSERT INTO characters (name, system_prompt, color, avatar) VALUES (?, ?, ?, ?)').run(name, system_prompt, color, avatar);
    const row = db.prepare('SELECT * FROM characters WHERE id = ?').get(info.lastInsertRowid);
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: 'Character name exists or invalid' });
  }
});

router.put('/characters/:id', authRequired, adminRequired, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const { name = row.name, system_prompt = row.system_prompt, color = row.color, avatar = row.avatar } = req.body || {};
  db.prepare('UPDATE characters SET name = ?, system_prompt = ?, color = ?, avatar = ? WHERE id = ?')
    .run(name, system_prompt, color, avatar, id);
  const updated = db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
  res.json(updated);
});

router.delete('/characters/:id', authRequired, adminRequired, (req, res) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM characters WHERE id = ?').run(id);
  res.json({ ok: true });
});

export default router;

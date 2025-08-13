import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const { JWT_SECRET } = process.env;

router.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (exists) return res.status(409).json({ error: 'Username already exists' });
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, hash, 'user');
  return res.json({ id: info.lastInsertRowid, username });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = db.prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?').get(username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

export default router;

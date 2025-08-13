import express from 'express';
import db from './db.js';
import fetch from 'node-fetch';
import { authRequired } from './middleware.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const { OLLAMA_HOST = 'http://localhost:11434', MODEL_NAME = 'gpt-oss:20b' } = process.env;

// 取得可用角色（一般使用者也可看）
router.get('/characters', authRequired, (req, res) => {
  const rows = db.prepare('SELECT id, name, color, avatar FROM characters ORDER BY id').all();
  res.json(rows);
});

// 建/取對話（針對特定角色）
router.post('/conversation', authRequired, (req, res) => {
  const { characterId } = req.body || {};
  if (!characterId) return res.status(400).json({ error: 'Missing characterId' });
  // 直接新建一條對話
  const info = db.prepare('INSERT INTO conversations (user_id, character_id) VALUES (?, ?)').run(req.user.id, characterId);
  const convo = db.prepare('SELECT * FROM conversations WHERE id = ?').get(info.lastInsertRowid);
  res.json(convo);
});

// 取對話歷史
router.get('/conversation/:id/messages', authRequired, (req, res) => {
  const id = Number(req.params.id);
  // 確認屬於本人
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!conv) return res.status(404).json({ error: 'Not found' });

  const msgs = db.prepare('SELECT id, role, content, created_at FROM messages WHERE conversation_id = ? ORDER BY id').all(id);
  res.json(msgs);
});

// 發送訊息並呼叫 Ollama
router.post('/conversation/:id/send', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const conv = db.prepare('SELECT * FROM conversations WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!conv) return res.status(404).json({ error: 'Not found' });

  const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(conv.character_id);
  if (!character) return res.status(400).json({ error: 'Character not found' });

  // 寫入使用者訊息
  db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)').run(id, 'user', text);

  // 準備訊息（含系統提示）
  const history = db.prepare('SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id').all(id);
  const messages = [
    { role: 'system', content: character.system_prompt },
    ...history
  ];

  try {
    const r = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages,
        stream: false
      })
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: 'Ollama error', detail: txt });
    }

    const data = await r.json();
    const reply = data?.message?.content || data?.response || '(no response)';
    db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)').run(id, 'assistant', reply);

    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'Failed to connect to Ollama', detail: String(e) });
  }
});

// 我的所有對話列表
router.get('/conversations', authRequired, (req, res) => {
  const rows = db.prepare(`
    SELECT c.id, c.created_at, ch.name as character_name, ch.avatar, ch.color
    FROM conversations c
    JOIN characters ch ON ch.id = c.character_id
    WHERE c.user_id = ?
    ORDER BY c.id DESC
  `).all(req.user.id);
  res.json(rows);
});

export default router;

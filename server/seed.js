import db from './db.js';
import bcrypt from 'bcryptjs';

function upsertUser(username, password, role='user') {
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  const hash = bcrypt.hashSync(password, 10);
  if (exists) {
    db.prepare('UPDATE users SET password_hash = ?, role = ? WHERE id = ?').run(hash, role, exists.id);
    return exists.id;
  } else {
    const info = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, hash, role);
    return info.lastInsertRowid;
  }
}

function upsertCharacter(name, system_prompt, color, avatar) {
  const exists = db.prepare('SELECT id FROM characters WHERE name = ?').get(name);
  if (exists) {
    db.prepare('UPDATE characters SET system_prompt = ?, color = ?, avatar = ? WHERE id = ?')
      .run(system_prompt, color, avatar, exists.id);
    return exists.id;
  } else {
    const info = db.prepare('INSERT INTO characters (name, system_prompt, color, avatar) VALUES (?, ?, ?, ?)').run(name, system_prompt, color, avatar);
    return info.lastInsertRowid;
  }
}

const adminId = upsertUser('root', 'root', 'admin');

// 預設三個 Q 彈角色
upsertCharacter(
  'Helpful Buddy',
  'You are a friendly, concise assistant. Use simple language and short paragraphs.',
  '#e7f0ff',
  '🫧'
);
upsertCharacter(
  'Code Mentor',
  'You are a precise senior developer. Provide step-by-step solutions and runnable examples.',
  '#ffe7f1',
  '💡'
);
upsertCharacter(
  'Teacher',
  'You teach patiently and check understanding. Include analogies and mini-quizzes.',
  '#ffffff',
  '🍬'
);

console.log('Seed completed. Admin user: root/root');

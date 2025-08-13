import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import chatRoutes from './chat.js';
import { authRequired, adminRequired } from './middleware.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PORT = 4091 } = process.env;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// 若要用後端服務前端（build 後）→ 打開下面三行：
// app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html')));

app.listen(PORT, () => {
  console.log(`CHait backend running on http://localhost:${PORT}`);
});

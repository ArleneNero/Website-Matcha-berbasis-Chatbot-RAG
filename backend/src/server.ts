import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { chatRouter } from './routes/chatRoute.js';
import { vectorStore } from './rag/vectorStore.js';
import { getAiClient } from './services/geminiService.js';

const getDirname = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {}
  return process.cwd();
};
const __dirname = getDirname();

const app = express();
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', chatRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'xiaomimi-matcha-backend' });
});

// Resolve frontend dist path
const distPath = [
  path.join(process.cwd(), 'frontend', 'dist'),
  path.join(process.cwd(), 'dist', 'client'),
  path.join(process.cwd(), 'dist'),
  path.resolve(__dirname, '../../frontend/dist'),
].find((p) => fs.existsSync(p)) || path.join(process.cwd(), 'frontend', 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Background pre-warming
if (process.env.AI_API_KEY || process.env.GEMINI_API_KEY) {
  try {
    const ai = getAiClient();
    vectorStore.ensureIndexed(ai).catch((err) => {
      console.warn('[RAG Engine] Background indexing warning:', err?.message || err);
    });
  } catch (err: any) {
    console.warn('[RAG Engine] Pre-warming skipped:', err?.message || err);
  }
}

// Standalone server mode
if (process.env.NODE_ENV !== 'production' || process.env.RENDER || process.env.PORT) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍵 Xiaomimi Backend running on http://0.0.0.0:${PORT}`);
  });
}

// Export default app for Vercel Serverless Function
export default app;

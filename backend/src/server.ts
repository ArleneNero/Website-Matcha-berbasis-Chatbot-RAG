import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
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

export async function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Mount API routes
  app.use('/api', chatRouter);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'xiaomimi-matcha-backend' });
  });

  // Resolve frontend paths
  const frontendPath = [
    path.join(process.cwd(), 'frontend'),
    path.resolve(__dirname, '../../frontend'),
    path.resolve(__dirname, '../frontend'),
  ].find((p) => fs.existsSync(p)) || path.join(process.cwd(), 'frontend');

  const distPath = [
    path.join(process.cwd(), 'frontend', 'dist'),
    path.join(process.cwd(), 'dist', 'client'),
    path.join(process.cwd(), 'dist'),
    path.resolve(__dirname, '../../frontend/dist'),
  ].find((p) => fs.existsSync(p)) || path.join(process.cwd(), 'frontend', 'dist');

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== 'production' && fs.existsSync(frontendPath)) {
    const vite = await createViteServer({
      root: frontendPath,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = await createServer();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍵 Xiaomimi Backend running on http://0.0.0.0:${PORT}`);

    // Pre-warm RAG vector index in background if API key is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getAiClient();
        vectorStore.ensureIndexed(ai).catch((err) => {
          console.warn('[RAG Engine] Background indexing warning:', err?.message || err);
        });
      } catch (err: any) {
        console.warn('[RAG Engine] Pre-warming skipped:', err?.message || err);
      }
    }
  });
}

startServer();


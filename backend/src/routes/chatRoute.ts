import { Router, Request, Response } from 'express';
import { getAiClient, generateGroundedReply, ChatMessage } from '../services/geminiService.js';
import { vectorStore } from '../rag/vectorStore.js';

export const chatRouter = Router();

chatRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Data percakapan tidak valid' });
    }

    const ai = getAiClient();

    // Extract last user message for vector retrieval
    const lastUserMessage = [...messages].reverse().find((m: ChatMessage) => m.from === 'user');
    const queryText = lastUserMessage ? lastUserMessage.text : '';

    // 1. RETRIEVAL PHASE: Retrieve top relevant chunks from PDF vector store
    const retrievedChunks = await vectorStore.retrieveRelevantChunks(ai, queryText, 5);

    const retrievedContextText = retrievedChunks
      .map((chunk) => `[Dokumen PDF - ${chunk.section}]\n${chunk.text}`)
      .join('\n\n');

    // 2. GENERATION PHASE: Grounded response via Gemini
    const replyText = await generateGroundedReply(ai, retrievedContextText, messages);

    return res.json({
      text: replyText,
      retrievedSections: retrievedChunks.map((c) => c.section),
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({
      error: error.message || 'Gagal berkomunikasi dengan Gemini API.',
    });
  }
});

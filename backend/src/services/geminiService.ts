import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('AI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

export async function generateGroundedReply(
  ai: GoogleGenAI,
  retrievedContextText: string,
  messages: ChatMessage[]
): Promise<string> {
  const recentMessages = messages.slice(-6);
  const formattedHistory = recentMessages
    .map((m) => {
      const sender = m.from === 'user' ? 'Pelanggan' : 'Xiaomimi Assistant';
      return `${sender}: ${m.text}`;
    })
    .join('\n');

  const systemInstruction = `Kamu adalah Xiaomimi Assistant, CS AI resmi yang ramah, hangat, dan sangat membantu untuk kafe "Xiaomimi Matcha".

Jawablah pertanyaan pelanggan berdasarkan Informasi Resmi dari Dokumen PDF yang diperoleh melalui sistem RAG berikut:

${retrievedContextText}

PETUNJUK RESPON:
1. Jawablah pertanyaan pelanggan secara lengkap, jelas, dan ramah sesuai data dari dokumen RAG di atas.
2. Bila pelanggan bertanya tentang promo, menu, harga, jam buka, fasilitas, atau lokasi, sebutkan semua poin relevan yang terdapat di dokumen RAG.
3. Gunakan Bahasa Indonesia yang sopan dan ramah dengan 1-2 emotikon khas (seperti 🍵, ✨, 🌸).
4. Jika informasi yang ditanyakan tidak tersedia dalam dokumen RAG di atas, sampaikan dengan santun bahwa informasi tersebut belum ada dalam dokumen resmi kami.`;

  const prompt = `Riwayat percakapan:\n${formattedHistory}\n\nJawablah pertanyaan terakhir pelanggan dengan lengkap dan ramah:`;

  const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini Service] Model ${model} encountered error, trying fallback...`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('Gagal memproses tanggapan dari Gemini AI.');
}

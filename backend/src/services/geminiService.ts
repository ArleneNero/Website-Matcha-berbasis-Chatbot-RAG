/**
 * Bariska Cloud AI Service (OpenAI-compatible)
 * Supports https://api.bariska.cloud/v1
 */

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

export async function generateGroundedReply(
  retrievedContextText: string,
  messages: ChatMessage[]
): Promise<string> {
  const apiKey =
    process.env.Bariska_Cloud_API ||
    process.env.BARISKA_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('API Key untuk Bariska Cloud (Bariska_Cloud_API / AI_API_KEY) belum disetel');
  }

  const rawBaseUrl = process.env.BARISKA_BASE_URL || 'https://api.bariska.cloud/v1';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const endpoint = `${baseUrl}/chat/completions`;

  const recentMessages = messages.slice(-8);
  const systemInstruction = `Kamu adalah Xiaomimi Assistant, CS AI resmi yang ramah, hangat, dan sangat membantu untuk kafe "Xiaomimi Matcha".

Gunakan informasi resmi dari basis data kafe berikut untuk menjawab:
${retrievedContextText}

ATURAN UTAMA:
1. Jawab pertanyaan seputar menu, harga, promo, fasilitas, atau lokasi Xiaomimi Matcha dengan sopan dan ramah (sertakan emotikon khas seperti 🍵, ✨).
2. Jika ada hal yang ditanyakan di luar konteks kafe atau tidak ada datanya, beritahukan dengan santun bahwa informasi tersebut belum tersedia.`;

  const conversationHistory = recentMessages.map((m) => ({
    role: m.from === 'user' ? 'user' : 'assistant',
    content: m.text,
  }));

  const payload = {
    model: process.env.BARISKA_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemInstruction },
      ...conversationHistory,
    ],
    temperature: 0.3,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as any;

  if (!response.ok) {
    const errorDetail = data?.error?.message || data?.message || `HTTP ${response.status} Gagal memproses ke Bariska Cloud`;
    throw new Error(errorDetail);
  }

  const replyText =
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.reply;

  if (!replyText) {
    throw new Error('Tidak menerima teks respon dari Bariska Cloud.');
  }

  return replyText;
}

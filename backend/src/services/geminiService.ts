/**
 * Bariska Cloud AI Service (OpenAI-compatible)
 * Supports https://api.bariska.cloud/v1
 */

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

let verifiedModel: string | null = null;

async function discoverAvailableModel(baseUrl: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(`${baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as any;
    const list = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
    const modelsList: string[] = list
      .map((item: any) => item?.id || item?.name || (typeof item === 'string' ? item : null))
      .filter((id: any): id is string => typeof id === 'string');

    console.log('[Bariska Cloud] Available models reported:', modelsList);

    // Prioritize Qwen 3.8 Flash variations
    const qwen38 = modelsList.find((m) => {
      const lower = m.toLowerCase();
      return lower.includes('qwen') && (lower.includes('3.8') || lower.includes('flash'));
    });
    if (qwen38) return qwen38;

    // Fallback to any Qwen model
    const anyQwen = modelsList.find((m) => m.toLowerCase().includes('qwen'));
    if (anyQwen) return anyQwen;

    if (modelsList.length > 0) return modelsList[0];
  } catch (err) {
    console.warn('[Bariska Cloud] Model discovery error:', err);
  }
  return null;
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

  const configuredModel = process.env.BARISKA_MODEL;

  const candidateModels: string[] = [];
  if (configuredModel) {
    candidateModels.push(configuredModel);
  }
  if (verifiedModel && !candidateModels.includes(verifiedModel)) {
    candidateModels.push(verifiedModel);
  }

  // Common naming patterns for Qwen 3.8 Flash & Qwen models on OpenAI-compatible proxies
  const defaultCandidates = [
    'qwen-3.8-flash',
    'qwen3.8-flash',
    'Qwen/Qwen3.8-Flash',
    'qwen/qwen-3.8-flash',
    'qwen/qwen3.8-flash',
    'Qwen-3.8-Flash',
    'qwen-3.8b-flash',
    'qwen3.8-flash-instruct',
    'qwen-flash',
    'qwen2.5-7b-instruct',
    'qwen-2.5-7b-instruct',
    'qwen-turbo',
    'qwen-plus',
  ];

  for (const m of defaultCandidates) {
    if (!candidateModels.includes(m)) {
      candidateModels.push(m);
    }
  }

  // Attempt dynamic discovery if not already verified
  if (!verifiedModel) {
    const discovered = await discoverAvailableModel(baseUrl, apiKey);
    if (discovered && !candidateModels.includes(discovered)) {
      candidateModels.unshift(discovered);
    }
  }

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const payload = {
        model,
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
        const errorDetail =
          (typeof data?.error === 'string' ? data.error : data?.error?.message) ||
          data?.message ||
          `HTTP ${response.status} Gagal memproses ke model ${model}`;
        console.warn(`[Bariska Cloud] Model "${model}" failed: ${errorDetail}`);
        lastError = new Error(errorDetail);
        continue;
      }

      const replyText =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        data?.reply;

      if (replyText) {
        verifiedModel = model;
        return replyText;
      }
    } catch (err: any) {
      console.warn(`[Bariska Cloud] Exception trying model "${model}":`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('Tidak menerima tanggapan dari Bariska Cloud.');
}

/**
 * Chat Service
 * Handles API communication with the backend RAG endpoint.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Sends conversation messages to backend RAG API.
 * @param {Array<{from: string, text: string}>} messages
 * @returns {Promise<{text: string, retrievedSections?: string[]}>}
 */
export async function sendChatMessage(messages) {
  const url = `${API_BASE_URL}/api/chat`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || `HTTP error ${response.status}: Gagal memproses permintaan`;
    throw new Error(errorMsg);
  }

  return {
    text: data.text || 'Maaf, tidak ada tanggapan.',
    retrievedSections: data.retrievedSections || [],
  };
}

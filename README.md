# Xiaomimi Matcha — Full-Stack Refactored Architecture

Website kafe spesialis matcha ceremonial grade dengan integrasi chatbot CS cerdas berbasis **In-Memory Hybrid RAG (Retrieval-Augmented Generation)** menggunakan Google Gemini API.

Proyek ini telah direfaktor menjadi arsitektur modular yang memisahkan **Frontend (React/Vite)** dan **Backend (Node.js/Express + RAG Engine)** secara bersih dalam satu repositori.

---

## 📁 Struktur Direktori

```text
.
├── frontend/                     # Frontend Client (React 18 + Vite)
│   ├── public/
│   │   └── images/               # Aset gambar produk & cutout
│   ├── src/
│   │   ├── components/           # Komponen UI (Nav, Hero, Menu, ChatWidget, dll.)
│   │   ├── services/             # API client services (chatService.js)
│   │   ├── data/                 # Static data & menu content (data.js)
│   │   ├── styles/               # Desain token & CSS global (styles.css)
│   │   ├── App.jsx               # Root component
│   │   └── main.jsx              # Client entry point
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Konfigurasi Vite & dev proxy
│   └── package.json              # Dependency & script frontend
├── backend/                      # Backend Server & RAG Engine (Node.js / Express 5)
│   ├── knowledge/                # Dokumen referensi nonpublik
│   │   └── xiaomimi-matcha-knowledge-base.pdf
│   ├── src/
│   │   ├── routes/               # Express router (chatRoute.ts)
│   │   ├── services/             # Gemini API client & generator (geminiService.ts)
│   │   ├── rag/                  # RAG loader & vector store (pdfLoader.ts, vectorStore.ts)
│   │   └── server.ts             # Server entry point & Vite middleware integration
│   └── package.json              # Dependency & script backend
├── dist/                         # Hasil kompilasi production
├── package.json                  # Root runner & unified scripts
├── vite.config.js                # Root Vite config
├── server.ts                     # Root delegator ke backend/src/server.ts
├── .env.example                  # Contoh variabel lingkungan
├── .gitignore
└── README.md
```

---

## 🛠️ Alur Arsitektur & RAG Pipeline

1. **Knowledge Ingestion & Parsing:**
   - Dokumen `backend/knowledge/xiaomimi-matcha-knowledge-base.pdf` dibaca secara biner menggunakan `pdf-parse` (`backend/src/rag/pdfLoader.ts`).
   - Teks diekstrak dan dipecah menjadi chunk dinamis terstruktur berbasis nomor seksi.

2. **Vector Indexing & Hybrid Retrieval:**
   - Vektor embedding 768-dimensi di-generate per chunk menggunakan `gemini-embedding-2-preview` (`backend/src/rag/vectorStore.ts`).
   - Vektor disimpan secara in-memory (RAM) dan di-cache sehingga tidak di-index ulang pada setiap request.
   - Saat pengguna bertanya, backend menghitung **Cosine Similarity** antara query vector dan chunk vectors, digabung dengan **lexical keyword boost** (+0.4 per exact match) untuk menghasilkan skor relevansi gabungan.

3. **Grounded Generation:**
   - 5 chunk terbaik diinjeksikan ke dalam `systemInstruction` dengan pembatasan faktual (*low temperature 0.3*).
   - Inferensi dieksekusi oleh model `gemini-3.6-flash`.
   - Frontend memanggil `/api/chat` melalui service client (`frontend/src/services/chatService.js`) dan me-render hasil dalam format Markdown.

---

## ⚙️ Variabel Lingkungan (.env)

Buat file `.env` di root project dengan referensi dari `.env.example`:

```bash
# Wajib: API Key untuk Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Port server (default: 3000)
PORT=3000

# Base URL API untuk frontend (opsional, default: same-origin)
VITE_API_BASE_URL=
```

---

## 🚀 Menjalankan Aplikasi

### 1. Unified Mode (Full-Stack Dev Server)
Menjalankan backend Express beserta Vite middleware di port 3000 secara terintegrasi:

```bash
npm run dev
```

Buka browser di `http://localhost:3000`.

### 2. Standalone Frontend & Backend Dev
Bila ingin mengembangkan frontend dan backend secara terpisah:

- **Jalankan Backend (Port 3000):**
  ```bash
  npm run dev:backend
  # atau: cd backend && npm run dev
  ```

- **Jalankan Frontend (Port 5173 dengan proxy ke port 3000):**
  ```bash
  npm run dev:frontend
  # atau: cd frontend && npm run dev
  ```

---

## 📦 Production Build & Deployment

1. **Build Frontend & Backend:**
   ```bash
   npm run build
   ```
   Perintah ini akan:
   - Mengompilasi frontend React menggunakan Vite ke direktori `dist/` atau `frontend/dist/`.
   - Mem-bundle backend `server.ts` menggunakan `esbuild` ke `dist/server.cjs`.

2. **Jalankan Production Server:**
   ```bash
   npm run start
   ```

---

## 🔌 API Endpoints

- `POST /api/chat`: Menerima `{ messages: [{ from: 'user', text: '...' }] }`, menjalankan retrieval RAG, dan mengembalikan `{ text, retrievedSections }`.
- `GET /api/health`: Healthcheck endpoint `{ status: 'ok', service: 'xiaomimi-matcha-backend' }`.

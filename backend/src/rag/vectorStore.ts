import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { GoogleGenAI } from '@google/genai';
import { loadAndChunkPDF, DynamicChunk } from './pdfLoader.js';

const getDirname = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {}
  return process.cwd();
};
const __dirname = getDirname();

export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function resolvePdfPath(): string {
  const candidates = [
    path.join(process.cwd(), 'backend', 'knowledge', 'xiaomimi-matcha-knowledge-base.pdf'),
    path.resolve(__dirname, '../../knowledge/xiaomimi-matcha-knowledge-base.pdf'),
    path.resolve(__dirname, '../../../backend/knowledge/xiaomimi-matcha-knowledge-base.pdf'),
    path.join(process.cwd(), 'knowledge', 'xiaomimi-matcha-knowledge-base.pdf'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

const DEFAULT_SECTIONS = [
  `1. Profil Singkat Xiaomimi Matcha\nXiaomimi Matcha adalah kafe spesialis matcha yang berdiri sejak tahun 2023 di Jakarta dan berfokus pada daun teh hijau Jepang ceremonial grade dari Uji, Kyoto. Nama Xiaomimi diambil dari kucing penjaga toko pertama pemiliknya yang menjadi maskot. Minuman andalan adalah Signature Matcha (OG) iced latte dan Strawberry Matcha musiman. Menyeduh 500+ cangkir per hari dengan rating 4.9/5.`,
  `2. Lokasi, Jam Buka, dan Suasana Gerai\nGerai utama berada di Jalan Kemang Raya No. 27B, Bangka, Mampang Prapatan, Jakarta Selatan 12730 (dekat toko bunga, 5 menit dari halte TransJakarta Kemang Raya). Buka Senin-Jumat 08.00-21.00 WIB; Sabtu-Minggu/Libur 09.00-22.00 WIB. Last order 30 menit sebelum tutup. Kapasitas 38 kursi indoor + 6 kursi outdoor.`,
  `3. Fasilitas Gerai\nWi-Fi gratis XiaomimiGuest (password: matcha2023, limit 90 menit jam ramai). Stop kontak di communal table & bar counter. Mushola 2 orang, toilet, area cuci tangan, ramp kursi roda. Highchair anak 2 unit. Parkir motor gratis di depan, parkir mobil basement sebelah Rp 5.000 flat (reimburse min Rp 100.000). Bebas asap rokok & rokok elektrik di seluruh area. Hewan kecil hanya di area outdoor. No reservasi biasa (first come first served), reservasi hanya untuk >=8 orang atau sewa tempat.`,
  `4. Filosofi Produk dan Asal Bahan\nBahan dari kebun mitra Uji (Kyoto) & Nishio (Aichi), dinaungi ~20 hari sebelum panen. Digiling batu granit batch kecil, dikirim vakum berpendingin. Matcha dibuka disimpan di kulkas 4°C maks 7 hari. Diseduh 2 gram ceremonial grade dengan air 75°C. Tanpa sirup instan, tanpa pewarna, tanpa krimer nabati. Pemanis gula aren cair & simple syrup gula tebu.`,
  `5. Menu Minuman\n- Signature Matcha (OG) Iced Latte: Rp 30.000 (Andalan, ceremonial + susu segar, gurih manis lembut).\n- Strawberry Matcha: Rp 34.000 (Flavor musiman baru, selai stroberi Ciwidey + susu + matcha 3 lapis, hanya dingin).\n- Hot Usucha: Rp 28.000 (Matcha murni tanpa susu/gula, seduh mangkuk chawan otentik).\n- Yuzu Matcha Fizz: Rp 32.000 (Matcha + sari yuzu + soda, 100% vegan, segar berkarbonasi).\n- Hojicha Swirl: Rp 33.000 (Teh hijau sangrai + susu + gula aren, karamel berasap, kafein terendah 15-20mg).\n- Matcha Frappe: Rp 36.000 (Blended es halus + topping krim, termanis, favorit anak/remaja).`,
  `6. Makanan Pendamping\nMatcha Basque Cheesecake Rp 38.000, Dorayaki Pasta Kacang Merah Rp 25.000, Matcha Cookies White Chocolate Rp 18.000, Wagashi Musiman Rp 22.000. Dibuat tiap pagi, tidak dikirim jauh.`,
  `7. Kustomisasi Pesanan\nGratis kustomisasi manis (0%, 25%, 50%, 75%, Normal 100%) dan es (tanpa es, sedikit es, normal). Extra shot matcha +1g (+Rp 8.000). Ganti susu nabati (+Rp 6.000): Oat, Almond, Kedelai. Topping: Krim Matcha Rp 7.000, Boba Gula Aren Rp 6.000, Jelly Yuzu Rp 6.000, Taburan bubuk matcha GRATIS. Diskon membawa tumbler sendiri Rp 3.000.`,
  `8. Bubuk Matcha Kemasan & Alat Seduh\nKaleng kedap cahaya. Masa simpan 12 bulan (sebelum dibuka), 2 bulan (setelah dibuka).\n- Ceremonial 30g: Rp 145.000 (Panen pertama Uji, paling halus untuk usucha).\n- Culinary 100g: Rp 95.000 (Tajam untuk kue, es krim, adonan roti).\n- Latte Blend 150g: Rp 89.000 (Mudah larut di susu untuk konsumsi harian).\n- Hojicha Blend 100g: Rp 99.000 (Teh sangrai aroma karamel).\nAlat: Chasen bambu Rp 185.000, Chashaku Rp 45.000, Ayakan Rp 65.000, Chawan Rp 210.000, Starter Kit Rp 395.000 (hemat Rp 45.000).`,
  `9. Cara Menyeduh dan Menyimpan di Rumah\nUsucha: 2g ceremonial diayak + 70ml air 75°C, kocok chasen pola W 20 detik sampai berbusa. Matcha Latte: 3g Latte Blend + 40ml air hangat + 150ml susu dingin + es. Simpan kaleng di tempat sejuk/kering. Kulkas harus ditunggu suhu ruang sebelum dibuka agar tidak mengembun/menggumpal.`,
  `10. Gizi, Kafein, Alergen & Halal\nSignature Matcha 16 oz normal ~180 kalori (tanpa gula ~120 kalori). Hot Usucha ~0 kalori. Kafein 2g ceremonial = 60-70mg (setara 1 shot espresso, efek tenang karena L-theanine). Hojicha kafein terendah 15-20mg. Dapur mengandung susu, gandum, telur, kacang, kedelai. 100% halal, tanpa alkohol.`,
  `11. Pemesanan, Pengantaran & Pembayaran\nPemesanan via kasir / WhatsApp 0812-1000-7788 (pick-up). GoFood, GrabFood, ShopeeFood. Pembayaran: Cash, Debit, Kredit, QRIS, GoPay, OVO, Dana, ShopeePay. Gratis ongkir bubuk se-Jawa untuk pembelian > Rp 300.000.`,
  `12. Promo & Membership Mimi Club\nMembership Mimi Club gratis via nomor HP di kasir (Rp 10.000 = 1 poin, 100 poin = 1 minuman gratis). Promo Morning Matcha (Senin-Kamis 08.00-10.00 potong Rp 5.000 menu panas), B2G1 Signature Matcha (Rabu dine-in), Diskon Pelajar/Mahasiswa 10% hari kerja. Diskon Tumbler Rp 3.000.`,
  `13. Kelas Matcha, Sewa Tempat & Kontak\nKelas Matcha Basic tiap Sabtu 10.00 WIB (Rp 350.000/orang include 1 kaleng Ceremonial 30g + snack). Sewa tempat privat min Rp 5.000.000/3 jam. Kontak: WA 0812-1000-7788, Email halo@xiaomimimatcha.id, IG/TikTok @xiaomimimatcha.`,
  `14. Keberlanjutan & Garansi\nTukar 10 kaleng bubuk kosong = Gratis 1 kaleng Latte Blend 150g. Garansi minuman salah buat/rusak diganti baru gratis di hari yang sama.`
];

function ensurePDFExistsOnDisk(pdfPath: string): Promise<void> {
  return new Promise((resolve) => {
    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let needsCreation = false;
    if (!fs.existsSync(pdfPath)) {
      needsCreation = true;
    } else {
      const stat = fs.statSync(pdfPath);
      if (stat.size < 500) {
        needsCreation = true;
      }
    }

    if (!needsCreation) {
      return resolve();
    }

    console.log(`📄 [PDF Generator] Writing binary PDF file to disk: ${pdfPath}`);
    const doc = new PDFDocument({ margin: 40 });
    const writeStream = fs.createWriteStream(pdfPath);

    writeStream.on('finish', () => {
      console.log(`✅ [PDF Generator] Binary PDF file write completed.`);
      resolve();
    });

    writeStream.on('error', (err: any) => {
      console.error(`❌ [PDF Generator] Error writing PDF:`, err);
      resolve();
    });

    doc.pipe(writeStream);
    doc.fontSize(20).text('Xiaomimi Matcha — Dokumen Informasi Kafe (Knowledge Base)', { align: 'center' });
    doc.moveDown();

    for (const sec of DEFAULT_SECTIONS) {
      doc.fontSize(11).text(sec);
      doc.moveDown();
    }

    doc.end();
  });
}

export class VectorStore {
  private chunks: DynamicChunk[] = DEFAULT_SECTIONS.map((sec, idx) => ({
    id: `chunk_${idx + 1}`,
    section: sec.split('\n')[0].substring(0, 60),
    text: sec,
  }));
  private isIndexed: boolean = false;
  private indexingPromise: Promise<void> | null = null;

  public async ensureIndexed(ai: GoogleGenAI): Promise<void> {
    if (this.isIndexed) return;
    if (this.indexingPromise) return this.indexingPromise;

    this.indexingPromise = (async () => {
      const pdfPath = resolvePdfPath();
      await ensurePDFExistsOnDisk(pdfPath);

      try {
        const pdfChunks = await loadAndChunkPDF(pdfPath);
        if (pdfChunks && pdfChunks.length > 0) {
          this.chunks = pdfChunks;
        }
      } catch (e) {
        console.warn('PDF parsing error, keeping default section chunks:', e);
      }

      console.log(`⚡ [RAG Engine] Generating embeddings for ${this.chunks.length} PDF chunks using gemini-embedding-2-preview...`);
      await Promise.allSettled(
        this.chunks.map(async (chunk) => {
          try {
            const res = await ai.models.embedContent({
              model: 'text-embedding-004',
              contents: `${chunk.section}: ${chunk.text}`,
            });
            if (res.embedding?.values) {
              chunk.embedding = res.embedding.values;
            }
          } catch (err) {
            console.error(`Error embedding PDF chunk ${chunk.id}:`, err);
          }
        })
      );

      this.isIndexed = true;
      console.log(`✅ [RAG Engine] Successfully indexed ${this.chunks.length} chunks from PDF into memory vector store!`);
    })();

    return this.indexingPromise;
  }

  public async retrieveRelevantChunks(
    ai: GoogleGenAI,
    userQuery: string,
    topK: number = 5
  ): Promise<DynamicChunk[]> {
    await this.ensureIndexed(ai);

    if (this.chunks.length === 0) return [];

    const queryLower = userQuery.toLowerCase();
    const keywords = queryLower
      .split(/[\s,?.!]+/)
      .filter((w) => w.length >= 3 && !['ada', 'apa', 'yang', 'ini', 'dan', 'dari', 'bisa', 'dong'].includes(w));

    try {
      const queryEmbeddingRes = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: userQuery,
      });

      const queryVector = queryEmbeddingRes.embedding?.values;

      const scoredChunks = this.chunks.map((chunk) => {
        let vectorScore = 0;
        if (queryVector && chunk.embedding) {
          vectorScore = calculateCosineSimilarity(queryVector, chunk.embedding);
        }

        // Keyword boost
        let keywordScore = 0;
        const chunkTextLower = (chunk.section + ' ' + chunk.text).toLowerCase();
        for (const kw of keywords) {
          if (chunkTextLower.includes(kw)) {
            keywordScore += 0.4;
          }
        }

        return { chunk, score: vectorScore + keywordScore };
      });

      scoredChunks.sort((a, b) => b.score - a.score);

      return scoredChunks.slice(0, topK).map((sc) => sc.chunk);
    } catch (err) {
      console.warn('Embedding search fallback to keyword matching:', err);
      return this.fallbackKeywordSearch(userQuery, topK);
    }
  }

  private fallbackKeywordSearch(query: string, topK: number): DynamicChunk[] {
    const q = query.toLowerCase();
    const scored = this.chunks.map((chunk) => {
      let score = 0;
      const t = chunk.text.toLowerCase();
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      for (const w of words) {
        if (t.includes(w)) score += 1;
      }
      return { chunk, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map((s) => s.chunk);
  }
}

export const vectorStore = new VectorStore();

import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

export interface DynamicChunk {
  id: string;
  section: string;
  text: string;
  embedding?: number[];
}

export async function loadAndChunkPDF(pdfFilePath: string): Promise<DynamicChunk[]> {
  if (!fs.existsSync(pdfFilePath)) {
    console.warn(`[PDF Loader] File not found at ${pdfFilePath}`);
    return [];
  }

  const fileBuffer = fs.readFileSync(pdfFilePath);
  if (fileBuffer.length === 0) {
    console.warn(`[PDF Loader] File at ${pdfFilePath} is empty (0 bytes).`);
    return [];
  }

  const uint8Data = new Uint8Array(fileBuffer);

  try {
    let rawText = '';
    if (typeof PDFParse === 'function') {
      const parser = new PDFParse(uint8Data);
      if (typeof parser.getText === 'function') {
        const parsed = await parser.getText();
        rawText = parsed?.text || '';
      }
    }

    if (!rawText.trim()) {
      return [];
    }

    console.log(`[PDF Loader] Extracted ${rawText.length} characters from ${path.basename(pdfFilePath)}.`);

    // Split text into section blocks (e.g. "1. ", "2. ", or double newlines)
    const sections = rawText
      .split(/(?=(?:\r?\n|^)\d+\.\s+)|(?=\r?\n\r?\n)/g)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 20);

    const targetSections = sections.length > 0 ? sections : [rawText];

    const chunks: DynamicChunk[] = targetSections.map((sec: string, idx: number) => {
      const lines = sec.split('\n').map(l => l.trim()).filter(Boolean);
      const title = lines[0] ? lines[0].substring(0, 60) : `Bagian ${idx + 1}`;
      return {
        id: `pdf_chunk_${idx + 1}`,
        section: title,
        text: sec,
      };
    });

    console.log(`[PDF Loader] Successfully generated ${chunks.length} dynamic chunks from PDF.`);
    return chunks;
  } catch (err) {
    console.error(`[PDF Loader] Failed to parse PDF file:`, err);
    return [];
  }
}

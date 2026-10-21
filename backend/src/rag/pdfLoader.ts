import fs from 'fs';
import path from 'path';

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

  try {
    let rawText = '';
    const pdfParseModule = await import('pdf-parse').catch(() => null);
    const PDFParse = pdfParseModule?.PDFParse || pdfParseModule?.default;

    if (typeof PDFParse === 'function') {
      try {
        const parser = new PDFParse(new Uint8Array(fileBuffer));
        if (typeof parser.getText === 'function') {
          const parsed = await parser.getText();
          rawText = parsed?.text || '';
        }
      } catch (err) {
        console.warn('[PDF Loader] PDFParse execution skipped:', err);
      }
    }

    if (!rawText.trim()) {
      return [];
    }

    console.log(`[PDF Loader] Extracted ${rawText.length} characters from ${path.basename(pdfFilePath)}.`);

    const sections = rawText
      .split(/(?=(?:\r?\n|^)\d+\.\s+)|(?=\r?\n\r?\n)/g)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 20);

    const targetSections = sections.length > 0 ? sections : [rawText];

    const chunks: DynamicChunk[] = targetSections.map((sec: string, idx: number) => {
      const match = sec.match(/^(\d+\.[^\n]+)\n([\s\S]*)$/);
      const sectionTitle = match ? match[1].trim() : `Bagian ${idx + 1}`;
      const sectionContent = match ? match[2].trim() : sec.trim();

      return {
        id: `pdf_chunk_${idx + 1}`,
        section: sectionTitle,
        text: sectionContent,
      };
    });

    return chunks;
  } catch (error) {
    console.warn('[PDF Loader] Skipped dynamic PDF parsing, defaulting to embedded sections:', error);
    return [];
  }
}

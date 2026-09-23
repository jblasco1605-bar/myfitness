import { extractTextFromImage } from "@/lib/ocr";

// Los tickets rara vez pasan de 1-2 páginas; limitamos para no colgar el móvil con PDFs enormes.
const MAX_PAGES = 3;
// Por debajo de esto asumimos que el PDF es una foto escaneada sin texto seleccionable.
const MIN_TEXT_CHARS = 20;

interface PdfTextItem {
  str: string;
  transform: number[];
}

/**
 * Lee un ticket en PDF en el navegador. Los tickets digitales (p.ej. el
 * ticket por email del supermercado) traen el texto dentro y se leen al
 * instante; si es un escaneo sin texto, renderizamos las páginas y les
 * pasamos el mismo OCR que a las fotos.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  // Import dinámico: pdf.js solo se descarga cuando alguien sube un PDF.
  // Usamos la build "legacy" porque incluye polyfills para Safari de iOS antiguos.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // Next 14 no sabe empaquetar el worker (.mjs), así que lo servimos desde el
  // mismo CDN que ya usa Tesseract, fijado a la versión instalada.
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);

  try {
    const pageTexts: string[] = [];
    for (let n = 1; n <= pageCount; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      pageTexts.push(groupIntoLines(content.items as PdfTextItem[]));
    }
    const text = pageTexts.join("\n");
    if (text.replace(/\s/g, "").length >= MIN_TEXT_CHARS) return text;

    const ocrTexts: string[] = [];
    for (let n = 1; n <= pageCount; n++) {
      const page = await pdf.getPage(n);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      if (!context) continue;
      await page.render({ canvasContext: context, viewport }).promise;
      ocrTexts.push(await extractTextFromImage(canvas));
    }
    return ocrTexts.join("\n");
  } finally {
    await pdf.destroy();
  }
}

/**
 * pdf.js devuelve fragmentos sueltos; los reagrupamos por altura (Y) para
 * reconstruir las líneas del ticket, que es lo que esperan el filtro de
 * tickets y la IA ("PECH POLLO ... 5,20" en la misma línea).
 */
function groupIntoLines(items: PdfTextItem[]): string {
  const lines = new Map<number, { x: number; str: string }[]>();
  for (const item of items) {
    if (!item.str?.trim()) continue;
    const y = Math.round(item.transform[5]);
    const key = [...lines.keys()].find((k) => Math.abs(k - y) <= 2) ?? y;
    const line = lines.get(key) ?? [];
    line.push({ x: item.transform[4], str: item.str });
    lines.set(key, line);
  }
  return [...lines.entries()]
    .sort(([a], [b]) => b - a)
    .map(([, parts]) =>
      parts
        .sort((a, b) => a.x - b.x)
        .map((p) => p.str.trim())
        .join(" ")
    )
    .join("\n");
}

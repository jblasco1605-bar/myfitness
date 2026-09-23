import { createWorker } from "tesseract.js";

/** OCR 100% en el navegador, sin backend ni coste. Acepta fotos o páginas de PDF ya renderizadas. */
export async function extractTextFromImage(image: File | HTMLCanvasElement): Promise<string> {
  const worker = await createWorker("spa");
  try {
    const {
      data: { text },
    } = await worker.recognize(image);
    return text;
  } finally {
    await worker.terminate();
  }
}

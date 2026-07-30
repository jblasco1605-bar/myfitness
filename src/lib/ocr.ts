import { createWorker } from "tesseract.js";

/** OCR 100% en el navegador, sin backend ni coste. Solo funciona con imágenes. */
export async function extractTextFromImage(file: File): Promise<string> {
  const worker = await createWorker("spa");
  try {
    const {
      data: { text },
    } = await worker.recognize(file);
    return text;
  } finally {
    await worker.terminate();
  }
}

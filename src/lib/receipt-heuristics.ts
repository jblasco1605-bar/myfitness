const PRICE_PATTERN = /\d+[.,]\d{2}\b/;

const RECEIPT_KEYWORDS = [
  "total", "iva", "ticket", "tiquet", "factura", "caja", "articulo", "artículo",
  "unidad", "unidades", "kg", "ud", "eur", "cambio", "tarjeta", "efectivo",
  "importe", "descuento", "subtotal", "recibo", "compra", "cif", "nif",
  "mercadona", "carrefour", "lidl", "dia", "eroski", "alcampo", "hipercor",
  "supermercado", "super", "consum", "gadis", "aldi",
];

export type ReceiptSignal = "likely" | "unlikely" | "ambiguous";

/**
 * Filtro rápido y determinista (sin IA) para descartar de entrada fotos que
 * claramente no son un ticket (paisajes, personas, documentos random...).
 * No decide por sí solo que algo SÍ es un ticket válido: eso lo confirma la
 * extracción de ingredientes; solo evita gastar una llamada a la IA (y el
 * riesgo de que sea demasiado estricta) en casos obvios.
 */
export function classifyReceiptText(text: string): ReceiptSignal {
  const lower = text.toLowerCase();
  const hasPrice = PRICE_PATTERN.test(text);
  const keywordHits = RECEIPT_KEYWORDS.filter((k) => lower.includes(k)).length;
  const lineCount = text.split("\n").filter((l) => l.trim().length > 0).length;

  if ((hasPrice && lineCount >= 2) || keywordHits >= 2) return "likely";
  if (!hasPrice && keywordHits === 0 && lineCount < 3) return "unlikely";
  return "ambiguous";
}

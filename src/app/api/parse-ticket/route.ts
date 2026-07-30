import { NextResponse } from "next/server";
import { callGroqJson } from "@/lib/groq";
import { detectIngredientsFromTicket } from "@/lib/mock-data";
import { classifyReceiptText } from "@/lib/receipt-heuristics";

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text: string };
  const cleaned = (text ?? "").trim();

  if (cleaned.replace(/\s/g, "").length < 8) {
    return NextResponse.json({ valid: false, ingredients: [] });
  }

  // Filtro rápido y determinista: si el texto ni siquiera tiene pinta de
  // ticket (sin precios, sin palabras típicas de un ticket, casi sin líneas),
  // lo rechazamos sin gastar una llamada a la IA ni arriesgarnos a que
  // "adivine" productos de una foto que no tiene nada que ver.
  if (classifyReceiptText(cleaned) === "unlikely") {
    return NextResponse.json({ valid: false, ingredients: [] });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      valid: true,
      demo: true,
      ingredients: detectIngredientsFromTicket().map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
      })),
    });
  }

  try {
    const result = await callGroqJson<{ ingredients: ParsedIngredient[] }>({
      system:
        "Extraes los alimentos comprados a partir del texto en bruto (con errores de OCR: letras mal leídas, líneas cortadas, " +
        "acentos raros...) de la foto de un ticket de supermercado español. Es normal que el texto tenga ruido por el OCR — " +
        "no lo rechaces por eso, haz tu mejor estimación igualmente. Ignora precios, códigos de barras, totales, IVA y el nombre " +
        "de la tienda. Normaliza los nombres de producto a español genérico y sencillo " +
        '(ej: "PECH POLLO FRESC" -> "Pechuga de pollo"). Estima una cantidad y unidad razonable si el ticket no la indica ' +
        'claramente (unidades en "g", "ml" o "ud"). Si de verdad no consigues identificar ningún producto de alimentación en ' +
        'el texto, devuelve una lista vacía en vez de inventar. Responde SOLO JSON con la forma ' +
        '{"ingredients":[{"name":string,"quantity":number,"unit":string}]}.',
      user: cleaned,
    });

    return NextResponse.json({ valid: true, ingredients: result.ingredients ?? [] });
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        ingredients: [],
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

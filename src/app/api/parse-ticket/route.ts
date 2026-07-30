import { NextResponse } from "next/server";
import { callGroqJson } from "@/lib/groq";
import { detectIngredientsFromTicket } from "@/lib/mock-data";

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
}

interface ParseResult {
  valid: boolean;
  ingredients: ParsedIngredient[];
}

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text: string };
  const cleaned = (text ?? "").trim();

  // Si el OCR apenas ha extraído texto legible, ni siquiera merece la pena
  // preguntarle a la IA: no puede ser un ticket de compra.
  if (cleaned.replace(/\s/g, "").length < 8) {
    return NextResponse.json({ valid: false, ingredients: [] });
  }

  if (!process.env.GROQ_API_KEY) {
    // Modo demo explícito: sin clave configurada no podemos analizar nada de
    // verdad, así que lo marcamos como tal en vez de fingir un análisis real.
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
    const result = await callGroqJson<ParseResult>({
      system:
        "Analizas texto en bruto (con posibles errores de OCR) extraído de una foto subida por un usuario. " +
        "Primero decide si ese texto proviene realmente de un TICKET DE COMPRA de supermercado o alimentación " +
        "(debe contener nombres de productos y, normalmente, precios, cantidades o el nombre de una tienda). " +
        "Si el texto NO parece un ticket de compra (por ejemplo: describe una escena, una persona, un paisaje, " +
        "un documento no relacionado, o es ilegible/sin sentido), responde EXACTAMENTE " +
        '{"valid":false,"ingredients":[]}. No inventes productos en ese caso bajo ningún concepto. ' +
        "Si SÍ es un ticket de compra, responde " +
        '{"valid":true,"ingredients":[{"name":string,"quantity":number,"unit":string}]} usando SOLO los productos ' +
        'que aparecen literalmente en el texto (normaliza el nombre a español sencillo, ej: "PECH POLLO FRESC" -> ' +
        '"Pechuga de pollo"), sin añadir productos que no estén escritos. Si el ticket es válido pero no reconoces ' +
        "ningún producto con claridad, devuelve ingredients:[] igualmente, sin inventar.",
      user: cleaned,
    });

    return NextResponse.json(result);
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

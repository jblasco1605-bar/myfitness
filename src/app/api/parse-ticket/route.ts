import { NextResponse } from "next/server";
import { callGroqJson } from "@/lib/groq";

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text: string };

  if (!text || text.trim().length < 3) {
    return NextResponse.json({ ingredients: [] });
  }

  try {
    const result = await callGroqJson<{ ingredients: ParsedIngredient[] }>({
      system:
        "Eres un asistente que extrae alimentos comprados a partir del texto en bruto (con errores de OCR) de un ticket de supermercado español. " +
        "Ignora precios, códigos de barras, totales, IVA y nombres de la tienda. Normaliza los nombres de producto a español genérico y sencillo " +
        '(ej: "PECH POLLO FRESC" -> "Pechuga de pollo"). Estima una cantidad y unidad razonable si el ticket no la indica claramente ' +
        '(unidades en "g", "ml" o "ud"). Responde SOLO JSON con la forma {"ingredients":[{"name":string,"quantity":number,"unit":string}]}.',
      user: text,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { callGroqJson } from "@/lib/groq";
import type { GoalId, Ingredient, PantryStaple, Recipe } from "@/lib/types";
import { generateRecipes as mockGenerateRecipes } from "@/lib/mock-data";

const GOAL_LABEL: Record<GoalId, string> = {
  muscle: "ganar músculo (hipertrofia, alta proteína)",
  fat: "perder grasa (déficit calórico, alta saciedad)",
  maintain: "mantenimiento (equilibrio y rendimiento)",
};

export async function POST(request: Request) {
  const { goalId, ingredients, pantry } = (await request.json()) as {
    goalId: GoalId | null;
    ingredients: Ingredient[];
    pantry: PantryStaple[];
  };

  const availablePantry = pantry.filter((p) => p.hasIt);

  try {
    const result = await callGroqJson<{ recipes: Recipe[] }>({
      system:
        "Eres un chef nutricionista. Generas 3 recetas sencillas en español a partir de una lista de ingredientes disponibles, " +
        "priorizando el objetivo indicado. Puedes usar únicamente los ingredientes de la lista (no inventes otros). " +
        "Cada receta debe incluir un resumen breve en prosa de cómo se cocina (2-3 frases) además de los pasos numerados. " +
        'Responde SOLO JSON con la forma {"recipes":[{"id":string,"title":string,"emoji":string,"minutes":number,' +
        '"calories":number,"protein":number,"carbs":number,"fat":number,"ingredients":string[],"steps":string[],"summary":string}]}.',
      user: JSON.stringify({
        objetivo: goalId ? GOAL_LABEL[goalId] : "equilibrio general",
        ingredientes_ticket: ingredients.map((i) => `${i.quantity} ${i.unit} de ${i.name}`),
        despensa_disponible: availablePantry.map((p) => `${p.quantity} ${p.unit} de ${p.name}`),
      }),
    });

    return NextResponse.json(result);
  } catch (error) {
    // Sin GROQ_API_KEY (o si Groq falla), devolvemos las recetas de ejemplo para que el flujo nunca se rompa.
    return NextResponse.json({
      recipes: mockGenerateRecipes(goalId, ingredients, pantry),
      fallback: true,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

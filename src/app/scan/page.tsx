"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanTicketScreen } from "@/components/ScanTicketScreen";
import { useFlow } from "@/lib/flow-context";
import { detectIngredientsFromTicket, createIngredient } from "@/lib/mock-data";
import { extractTextFromImage } from "@/lib/ocr";
import type { Ingredient } from "@/lib/types";

export default function ScanPage() {
  const router = useRouter();
  const { goalId, setTicketFile, setIngredients } = useFlow();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!goalId) router.replace("/");
  }, [goalId, router]);

  const handleAnalyze = async (file: File) => {
    setTicketFile(file);
    setIsAnalyzing(true);

    try {
      let ingredients: Ingredient[];

      if (file.type === "application/pdf") {
        // TODO: extraer texto del PDF (p.ej. con pdf.js) antes de pasarlo por /api/parse-ticket.
        ingredients = detectIngredientsFromTicket();
      } else {
        const text = await extractTextFromImage(file);
        const res = await fetch("/api/parse-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        ingredients =
          data.ingredients?.length > 0
            ? data.ingredients.map((i: { name: string; quantity: number; unit: string }) => ({
                ...createIngredient(i.name),
                quantity: i.quantity,
                unit: i.unit,
                detected: true,
              }))
            : detectIngredientsFromTicket();
      }

      setIngredients(ingredients);
    } catch {
      setIngredients(detectIngredientsFromTicket());
    } finally {
      router.push("/ingredients");
    }
  };

  return (
    <ScanTicketScreen
      goalId={goalId}
      isAnalyzing={isAnalyzing}
      onAnalyze={handleAnalyze}
      onBack={() => router.push("/")}
    />
  );
}

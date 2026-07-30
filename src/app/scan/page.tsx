"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanTicketScreen } from "@/components/ScanTicketScreen";
import { useFlow } from "@/lib/flow-context";
import { createIngredient } from "@/lib/mock-data";
import { extractTextFromImage } from "@/lib/ocr";
import type { Ingredient } from "@/lib/types";

const INVALID_TICKET_MESSAGE =
  "Imagen incorrecta. Por favor, sube un ticket de compra válido.";
const NO_PRODUCTS_MESSAGE =
  "Hemos leído la imagen pero no hemos reconocido ningún producto. Prueba con una foto más nítida y bien encuadrada.";
const GENERIC_ERROR_MESSAGE =
  "No hemos podido analizar la imagen. Inténtalo de nuevo.";
const PDF_UNSUPPORTED_MESSAGE =
  "De momento solo podemos leer tickets en foto o imagen. Sube una imagen (JPG/PNG) en vez de un PDF.";

export default function ScanPage() {
  const router = useRouter();
  const { goalId, setTicketFile, setIngredients, setIsDemoData } = useFlow();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!goalId) router.replace("/");
  }, [goalId, router]);

  const handleAnalyze = async (file: File) => {
    setTicketFile(file);
    setError(null);
    setIsDemoData(false);

    if (file.type === "application/pdf") {
      // TODO: extraer texto real del PDF (p.ej. con pdf.js) para poder analizarlo de verdad.
      setError(PDF_UNSUPPORTED_MESSAGE);
      return;
    }

    setIsAnalyzing(true);

    try {
      const text = await extractTextFromImage(file);

      const res = await fetch("/api/parse-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) {
        setIsAnalyzing(false);
        setError(GENERIC_ERROR_MESSAGE);
        return;
      }

      if (!data.valid) {
        setIsAnalyzing(false);
        setError(INVALID_TICKET_MESSAGE);
        return;
      }

      if (!data.ingredients || data.ingredients.length === 0) {
        setIsAnalyzing(false);
        setError(NO_PRODUCTS_MESSAGE);
        return;
      }

      const ingredients: Ingredient[] = data.ingredients.map(
        (i: { name: string; quantity: number; unit: string }) => ({
          ...createIngredient(i.name),
          quantity: i.quantity,
          unit: i.unit,
          detected: true,
        })
      );

      setIsDemoData(Boolean(data.demo));
      setIngredients(ingredients);
      router.push("/ingredients");
    } catch {
      setIsAnalyzing(false);
      setError(GENERIC_ERROR_MESSAGE);
    }
  };

  return (
    <ScanTicketScreen
      goalId={goalId}
      isAnalyzing={isAnalyzing}
      error={error}
      onFileChange={() => setError(null)}
      onAnalyze={handleAnalyze}
      onBack={() => router.push("/")}
    />
  );
}

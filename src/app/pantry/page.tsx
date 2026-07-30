"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PantryScreen } from "@/components/PantryScreen";
import { useFlow } from "@/lib/flow-context";
import { generateRecipes as mockGenerateRecipes } from "@/lib/mock-data";

export default function PantryPage() {
  const router = useRouter();
  const {
    goalId,
    ingredients,
    pantry,
    toggleStapleHasIt,
    updateStapleQuantity,
    setRecipes,
  } = useFlow();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!goalId || ingredients.length === 0) router.replace("/ingredients");
  }, [goalId, ingredients, router]);

  const handleContinue = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, ingredients, pantry }),
      });
      const data = await res.json();
      setRecipes(
        data.recipes?.length > 0
          ? data.recipes
          : mockGenerateRecipes(goalId, ingredients, pantry)
      );
    } catch {
      setRecipes(mockGenerateRecipes(goalId, ingredients, pantry));
    } finally {
      router.push("/recipes");
    }
  };

  return (
    <PantryScreen
      pantry={pantry}
      onToggleHasIt={toggleStapleHasIt}
      onUpdateQuantity={updateStapleQuantity}
      onBack={() => router.push("/ingredients")}
      onContinue={handleContinue}
      isGenerating={isGenerating}
    />
  );
}

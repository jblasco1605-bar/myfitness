"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IngredientsScreen } from "@/components/IngredientsScreen";
import { useFlow } from "@/lib/flow-context";

export default function IngredientsPage() {
  const router = useRouter();
  const {
    goalId,
    ingredients,
    updateIngredientQuantity,
    removeIngredient,
    addIngredient,
  } = useFlow();

  useEffect(() => {
    if (!goalId) router.replace("/");
  }, [goalId, router]);

  return (
    <IngredientsScreen
      ingredients={ingredients}
      onUpdateQuantity={updateIngredientQuantity}
      onRemove={removeIngredient}
      onAdd={addIngredient}
      onBack={() => router.push("/scan")}
      onContinue={() => router.push("/pantry")}
    />
  );
}

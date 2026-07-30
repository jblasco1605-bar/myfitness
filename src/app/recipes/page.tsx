"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlow } from "@/lib/flow-context";
import { GOALS } from "@/lib/types";

export default function RecipesPage() {
  const router = useRouter();
  const { goalId, recipes } = useFlow();
  const goal = GOALS.find((g) => g.id === goalId) ?? null;

  useEffect(() => {
    if (!goalId || recipes.length === 0) router.replace("/");
  }, [goalId, recipes, router]);

  return (
    <main className="flex min-h-dvh flex-col px-5 pb-10 pt-8">
      <header className="mb-6">
        <p className="text-sm font-medium text-brand-textMuted">Paso 5 de 5</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-brand-text">
          Tus recetas
        </h1>
        {goal && (
          <p className="mt-2 text-sm text-brand-textMuted">
            Pensadas para tu objetivo: {goal.title.toLowerCase()}.
          </p>
        )}
      </header>

      <div className="flex flex-col gap-3">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            type="button"
            onClick={() => router.push(`/recipes/${recipe.id}`)}
            className="flex items-center gap-4 rounded-card border border-brand-border bg-brand-surface p-4 text-left"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-surfaceAlt text-2xl" aria-hidden="true">
              {recipe.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-brand-text">
                {recipe.title}
              </p>
              <p className="mt-0.5 text-sm text-brand-textMuted">
                {recipe.minutes} min · {recipe.calories} kcal
              </p>
              <p className="mt-1 text-xs text-brand-textMuted">
                P {recipe.protein}g · C {recipe.carbs}g · G {recipe.fat}g
              </p>
            </div>
            <svg className="h-5 w-5 shrink-0 text-brand-textMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="mt-6 text-center text-sm font-medium text-brand-textMuted"
      >
        Empezar de nuevo
      </button>
    </main>
  );
}

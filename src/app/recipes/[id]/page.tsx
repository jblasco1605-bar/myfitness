"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFlow } from "@/lib/flow-context";
import { StarRating } from "@/components/StarRating";

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { recipes, addHistoryEntry } = useFlow();
  const recipe = recipes.find((r) => r.id === params.id) ?? null;
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (recipes.length > 0 && !recipe) router.replace("/recipes");
  }, [recipes, recipe, router]);

  if (!recipe) return null;

  const handleConfirmRating = () => {
    if (rating === 0) return;
    addHistoryEntry(recipe, rating);
    router.push("/");
  };

  if (isRating) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-8 text-center">
        <span className="text-4xl" aria-hidden="true">
          {recipe.emoji}
        </span>
        <div>
          <h1 className="text-xl font-bold text-brand-text">¿Qué te ha parecido?</h1>
          <p className="mt-1 text-sm text-brand-textMuted">{recipe.title}</p>
        </div>

        <StarRating value={rating} onChange={setRating} />

        <button
          type="button"
          disabled={rating === 0}
          onClick={handleConfirmRating}
          className="mt-2 w-full max-w-xs rounded-2xl bg-brand-text py-4 text-center text-base font-semibold text-brand-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          Guardar valoración
        </button>
        <button
          type="button"
          onClick={() => setIsRating(false)}
          className="text-sm text-brand-textMuted"
        >
          Cancelar
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col px-5 pb-28 pt-8">
      <button
        type="button"
        onClick={() => router.push("/recipes")}
        className="mb-6 flex w-fit items-center gap-1 text-sm font-medium text-brand-textMuted"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Ver otras recetas
      </button>

      <div className="mb-2 flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-surfaceAlt text-2xl" aria-hidden="true">
          {recipe.emoji}
        </span>
        <h1 className="text-xl font-bold leading-tight text-brand-text">
          {recipe.title}
        </h1>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-2 rounded-card border border-brand-border bg-brand-surface p-3 text-center">
        <div>
          <p className="text-sm font-semibold text-brand-text">{recipe.minutes}</p>
          <p className="text-xs text-brand-textMuted">min</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-text">{recipe.calories}</p>
          <p className="text-xs text-brand-textMuted">kcal</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-text">{recipe.protein}g</p>
          <p className="text-xs text-brand-textMuted">proteína</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-text">{recipe.carbs}g</p>
          <p className="text-xs text-brand-textMuted">carbos</p>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-textMuted">
          Ingredientes
        </h2>
        <ul className="flex flex-col gap-1.5">
          {recipe.ingredients.map((ing) => (
            <li key={ing} className="flex items-center gap-2 text-sm text-brand-text">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-textMuted" aria-hidden="true" />
              {ing}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-textMuted">
          Pasos
        </h2>
        <ol className="flex flex-col gap-3">
          {recipe.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-brand-text">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-surfaceAlt text-xs font-semibold">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-card border border-brand-border bg-brand-surface p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-textMuted">
          Cómo se cocina
        </h2>
        <p className="text-sm leading-relaxed text-brand-textMuted">{recipe.summary}</p>
      </section>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-brand-border bg-brand-bg/95 p-5 backdrop-blur">
        <button
          type="button"
          onClick={() => setIsRating(true)}
          className="w-full rounded-2xl bg-brand-text py-4 text-center text-base font-semibold text-brand-bg"
        >
          Terminado
        </button>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { GOALS, type GoalId } from "@/lib/types";
import { GoalCard } from "@/components/GoalCard";

interface GoalSelectionScreenProps {
  onContinue: (goalId: GoalId) => void;
  onViewHistory: () => void;
}

export function GoalSelectionScreen({ onContinue, onViewHistory }: GoalSelectionScreenProps) {
  const [selected, setSelected] = useState<GoalId | null>(null);

  return (
    <main className="flex min-h-dvh flex-col px-5 pb-28 pt-8">
      <header className="mb-8 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand-textMuted">Paso 1 de 5</p>
          <h1 className="mt-1 text-2xl font-bold leading-tight text-brand-text">
            ¿Cuál es tu objetivo?
          </h1>
          <p className="mt-2 text-sm text-brand-textMuted">
            Elige tu meta para personalizar las recetas que generemos a partir
            de tu ticket de compra.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewHistory}
          aria-label="Ver recetas que ya has hecho"
          className="flex shrink-0 flex-col items-center gap-1 rounded-2xl border border-brand-border bg-brand-surface px-3 py-2"
        >
          <span className="text-lg" aria-hidden="true">🕘</span>
          <span className="text-[10px] font-medium text-brand-textMuted">Historial</span>
        </button>
      </header>

      <div role="radiogroup" aria-label="Selecciona tu objetivo" className="flex flex-col gap-3">
        {GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            selected={selected === goal.id}
            onSelect={setSelected}
          />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-brand-border bg-brand-bg/95 p-5 backdrop-blur">
        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onContinue(selected)}
          className="w-full rounded-2xl bg-brand-text py-4 text-center text-base font-semibold text-brand-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continuar
        </button>
      </div>
    </main>
  );
}

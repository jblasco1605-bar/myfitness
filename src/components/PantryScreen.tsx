"use client";

import type { PantryStaple } from "@/lib/types";
import { QuantityStepper } from "@/components/QuantityStepper";

interface PantryScreenProps {
  pantry: PantryStaple[];
  onToggleHasIt: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onBack: () => void;
  onContinue: () => void;
  isGenerating: boolean;
}

export function PantryScreen({
  pantry,
  onToggleHasIt,
  onUpdateQuantity,
  onBack,
  onContinue,
  isGenerating,
}: PantryScreenProps) {
  if (isGenerating) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-8 text-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-brand-border border-t-brand-text"
          role="status"
          aria-label="Generando recetas"
        />
        <p className="text-base font-medium text-brand-text">
          Creando tus recetas...
        </p>
        <p className="text-sm text-brand-textMuted">
          Combinando tus ingredientes con tu objetivo
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col px-5 pb-28 pt-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex w-fit items-center gap-1 text-sm font-medium text-brand-textMuted"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Atrás
      </button>

      <header className="mb-6">
        <p className="text-sm font-medium text-brand-textMuted">Paso 4 de 5</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-brand-text">
          ¿Tienes estos básicos?
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted">
          Aunque no salgan en el ticket, solemos dar por hecho que tienes
          cosas como aceite, sal o huevos. Confírmalo y ajusta la cantidad
          real que tienes en casa.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {pantry.map((staple) => (
          <div
            key={staple.id}
            className={`flex items-center justify-between gap-3 rounded-card border border-brand-border bg-brand-surface p-3 transition-opacity ${
              staple.hasIt ? "" : "opacity-50"
            }`}
          >
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-brand-text">
              {staple.name}
            </p>

            {staple.hasIt && (
              <QuantityStepper
                quantity={staple.quantity}
                unit={staple.unit}
                onDecrement={() => onUpdateQuantity(staple.id, -1)}
                onIncrement={() => onUpdateQuantity(staple.id, 1)}
              />
            )}

            <div
              role="group"
              aria-label={`¿Tienes ${staple.name}?`}
              className="flex shrink-0 overflow-hidden rounded-full border border-brand-border"
            >
              <button
                type="button"
                aria-pressed={staple.hasIt}
                onClick={() => !staple.hasIt && onToggleHasIt(staple.id)}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  staple.hasIt ? "bg-brand-text text-brand-bg" : "text-brand-textMuted"
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                aria-pressed={!staple.hasIt}
                onClick={() => staple.hasIt && onToggleHasIt(staple.id)}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  !staple.hasIt ? "bg-brand-text text-brand-bg" : "text-brand-textMuted"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-brand-border bg-brand-bg/95 p-5 backdrop-blur">
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-2xl bg-brand-text py-4 text-center text-base font-semibold text-brand-bg"
        >
          Generar recetas
        </button>
      </div>
    </main>
  );
}

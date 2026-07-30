"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/types";
import { QuantityStepper } from "@/components/QuantityStepper";

interface IngredientsScreenProps {
  ingredients: Ingredient[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onAdd: (name: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function IngredientsScreen({
  ingredients,
  onUpdateQuantity,
  onRemove,
  onAdd,
  onBack,
  onContinue,
}: IngredientsScreenProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName("");
    setIsAdding(false);
  };

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
        <p className="text-sm font-medium text-brand-textMuted">Paso 3 de 5</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-brand-text">
          Ingredientes detectados
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted">
          Revisa las cantidades, ajústalas con + / − o añade algo que no
          hayamos detectado en el ticket.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {ingredients.length === 0 && (
          <p className="rounded-card border border-dashed border-brand-border p-4 text-center text-sm text-brand-textMuted">
            No hay ingredientes todavía. Añade alguno manualmente.
          </p>
        )}

        {ingredients.map((ing) => (
          <div
            key={ing.id}
            className="flex items-center justify-between gap-3 rounded-card border border-brand-border bg-brand-surface p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-brand-text">{ing.name}</p>
              {!ing.detected && (
                <p className="text-xs text-brand-textMuted">Añadido manualmente</p>
              )}
            </div>

            <QuantityStepper
              quantity={ing.quantity}
              unit={ing.unit}
              onDecrement={() => onUpdateQuantity(ing.id, -1)}
              onIncrement={() => onUpdateQuantity(ing.id, 1)}
            />

            <button
              type="button"
              onClick={() => onRemove(ing.id)}
              aria-label={`Eliminar ${ing.name}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-textMuted"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="mt-3 flex items-center gap-2 rounded-card border border-brand-border bg-brand-surface p-3">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Nombre del ingrediente"
            className="flex-1 bg-transparent text-sm text-brand-text placeholder:text-brand-textMuted focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-xl bg-brand-text px-3 py-1.5 text-xs font-semibold text-brand-bg"
          >
            Añadir
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewName("");
            }}
            className="text-xs text-brand-textMuted"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-brand-border py-3 text-sm font-medium text-brand-text"
        >
          <span aria-hidden="true">+</span> Añadir ingrediente
        </button>
      )}

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-brand-border bg-brand-bg/95 p-5 backdrop-blur">
        <button
          type="button"
          disabled={ingredients.length === 0}
          onClick={onContinue}
          className="w-full rounded-2xl bg-brand-text py-4 text-center text-base font-semibold text-brand-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continuar
        </button>
      </div>
    </main>
  );
}

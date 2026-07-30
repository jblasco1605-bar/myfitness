"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { GoalId, HistoryEntry, Ingredient, PantryStaple, Recipe } from "@/lib/types";
import { getDefaultPantryStaples } from "@/lib/mock-data";

const HISTORY_STORAGE_KEY = "myfitness_history";

interface FlowState {
  goalId: GoalId | null;
  setGoalId: (id: GoalId) => void;
  ticketFile: File | null;
  setTicketFile: (file: File | null) => void;
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
  updateIngredientQuantity: (id: string, delta: number) => void;
  removeIngredient: (id: string) => void;
  addIngredient: (name: string) => void;
  pantry: PantryStaple[];
  toggleStapleHasIt: (id: string) => void;
  updateStapleQuantity: (id: string, delta: number) => void;
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
  history: HistoryEntry[];
  addHistoryEntry: (recipe: Recipe, rating: number) => void;
}

const FlowContext = createContext<FlowState | null>(null);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [pantry, setPantry] = useState<PantryStaple[]>(getDefaultPantryStaples());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        // ignora historial corrupto
      }
    }
  }, []);

  const value = useMemo<FlowState>(
    () => ({
      goalId,
      setGoalId,
      ticketFile,
      setTicketFile,
      ingredients,
      setIngredients,
      updateIngredientQuantity: (id, delta) =>
        setIngredients((prev) =>
          prev.map((ing) =>
            ing.id === id
              ? { ...ing, quantity: Math.max(0, ing.quantity + delta * ing.step) }
              : ing
          )
        ),
      removeIngredient: (id) =>
        setIngredients((prev) => prev.filter((ing) => ing.id !== id)),
      addIngredient: (name) =>
        setIngredients((prev) => [
          ...prev,
          {
            id: `custom-${Date.now()}`,
            name,
            quantity: 1,
            unit: "ud",
            step: 1,
            detected: false,
          },
        ]),
      pantry,
      toggleStapleHasIt: (id) =>
        setPantry((prev) =>
          prev.map((s) => (s.id === id ? { ...s, hasIt: !s.hasIt } : s))
        ),
      updateStapleQuantity: (id, delta) =>
        setPantry((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, quantity: Math.max(0, s.quantity + delta * s.step) }
              : s
          )
        ),
      recipes,
      setRecipes,
      history,
      addHistoryEntry: (recipe, rating) =>
        setHistory((prev) => {
          const next = [
            {
              id: `hist-${Date.now()}`,
              recipeId: recipe.id,
              title: recipe.title,
              emoji: recipe.emoji,
              rating,
              completedAt: new Date().toISOString(),
            },
            ...prev,
          ];
          window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
          return next;
        }),
    }),
    [goalId, ticketFile, ingredients, pantry, recipes, history]
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow debe usarse dentro de <FlowProvider>");
  return ctx;
}

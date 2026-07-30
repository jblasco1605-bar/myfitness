"use client";

import type { Goal } from "@/lib/types";

interface GoalCardProps {
  goal: Goal;
  selected: boolean;
  onSelect: (id: Goal["id"]) => void;
}

export function GoalCard({ goal, selected, onSelect }: GoalCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(goal.id)}
      className={`flex w-full items-center gap-4 rounded-card border border-brand-border bg-brand-surface p-4 text-left transition-all active:scale-[0.98] ${
        selected ? `ring-2 ${goal.classes.ring} bg-brand-surfaceAlt` : "ring-0"
      }`}
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${goal.classes.iconBg}`}
        aria-hidden="true"
      >
        {goal.emoji}
      </span>

      <span className="flex-1">
        <span className="block text-base font-semibold text-brand-text">
          {goal.title}
        </span>
        <span className="block text-sm text-brand-textMuted">
          {goal.description}
        </span>
      </span>

      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected
            ? `${goal.classes.ring} border-transparent ${goal.classes.dot}`
            : "border-brand-border"
        }`}
        aria-hidden="true"
      >
        {selected && (
          <svg
            className="h-3.5 w-3.5 text-brand-bg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </button>
  );
}

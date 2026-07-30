"use client";

import { useRouter } from "next/navigation";
import { useFlow } from "@/lib/flow-context";

export default function HistoryPage() {
  const router = useRouter();
  const { history } = useFlow();

  return (
    <main className="flex min-h-dvh flex-col px-5 pb-10 pt-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex w-fit items-center gap-1 text-sm font-medium text-brand-textMuted"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Atrás
      </button>

      <header className="mb-6">
        <h1 className="text-2xl font-bold leading-tight text-brand-text">
          Recetas que has hecho
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted">
          Tu historial de recetas terminadas y valoradas.
        </p>
      </header>

      {history.length === 0 ? (
        <p className="rounded-card border border-dashed border-brand-border p-6 text-center text-sm text-brand-textMuted">
          Aún no has terminado ninguna receta. Cuando marques una como
          &quot;Terminado&quot; y la valores, aparecerá aquí.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 rounded-card border border-brand-border bg-brand-surface p-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-surfaceAlt text-xl" aria-hidden="true">
                {entry.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-brand-text">
                  {entry.title}
                </p>
                <p className="mt-0.5 text-xs text-brand-textMuted">
                  {new Date(entry.completedAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-0.5" aria-label={`${entry.rating} de 5 estrellas`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= entry.rating ? "text-goal-maintain" : "text-brand-border"}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import { useRef, useState } from "react";
import { GOALS, type GoalId } from "@/lib/types";

interface ScanTicketScreenProps {
  goalId: GoalId | null;
  onBack: () => void;
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
  error: string | null;
  onFileChange?: () => void;
}

const LOADING_STEPS = [
  "Leyendo el ticket...",
  "Detectando ingredientes...",
  "Preparando la lista para ti...",
];

const ACCEPTED_TYPES = "image/*,application/pdf";

export function ScanTicketScreen({
  goalId,
  onBack,
  onAnalyze,
  isAnalyzing,
  error,
  onFileChange,
}: ScanTicketScreenProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const goal = GOALS.find((g) => g.id === goalId) ?? null;
  const isPdf = file?.type === "application/pdf";

  const handleFile = (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(selected.type === "application/pdf" ? null : URL.createObjectURL(selected));
    onFileChange?.();
  };

  const handleAnalyze = () => {
    if (!file) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((step) => Math.min(step + 1, LOADING_STEPS.length - 1));
    }, 900);
    onAnalyze(file);
    setTimeout(() => clearInterval(interval), LOADING_STEPS.length * 900);
  };

  if (isAnalyzing) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-8 text-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-brand-border border-t-brand-text"
          role="status"
          aria-label="Analizando ticket"
        />
        <p aria-live="polite" className="text-base font-medium text-brand-text">
          {LOADING_STEPS[loadingStep]}
        </p>
        <p className="text-sm text-brand-textMuted">
          Esto puede tardar unos segundos
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

      <header className="mb-8">
        <p className="text-sm font-medium text-brand-textMuted">Paso 2 de 5</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-brand-text">
          Escanea tu ticket
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted">
          Sube una foto o un PDF del ticket de tu compra
          {goal ? ` para tu objetivo: ${goal.title.toLowerCase()}` : ""}.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-card border border-danger/40 bg-danger-soft p-3 text-sm text-brand-text"
        >
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <div className="flex flex-1 flex-col items-center justify-center rounded-card border-2 border-dashed border-brand-border bg-brand-surface p-6 text-center">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Vista previa del ticket"
            className="max-h-72 w-full rounded-2xl object-contain"
          />
        ) : isPdf && file ? (
          <div className="flex w-full items-center gap-3 rounded-2xl bg-brand-surfaceAlt p-4 text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-bg text-2xl" aria-hidden="true">
              📄
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-brand-text">{file.name}</p>
              <p className="text-xs text-brand-textMuted">
                PDF · {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        ) : (
          <>
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surfaceAlt text-3xl" aria-hidden="true">
              🧾
            </span>
            <p className="text-base font-medium text-brand-text">
              Aún no has subido ningún ticket
            </p>
            <p className="mt-1 text-sm text-brand-textMuted">
              Hazle una foto, o sube una imagen o PDF desde tu galería/archivos
            </p>
          </>
        )}

        <div className="mt-6 flex w-full gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 rounded-2xl border border-brand-border bg-brand-surfaceAlt py-3 text-sm font-semibold text-brand-text"
          >
            Tomar foto
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex-1 rounded-2xl border border-brand-border bg-brand-surfaceAlt py-3 text-sm font-semibold text-brand-text"
          >
            Subir imagen o PDF
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-brand-border bg-brand-bg/95 p-5 backdrop-blur">
        <button
          type="button"
          disabled={!file}
          onClick={handleAnalyze}
          className="w-full rounded-2xl bg-brand-text py-4 text-center text-base font-semibold text-brand-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          Analizar ticket
        </button>
      </div>
    </main>
  );
}

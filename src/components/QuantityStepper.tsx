"use client";

interface QuantityStepperProps {
  quantity: number;
  unit: string;
  onDecrement: () => void;
  onIncrement: () => void;
  disabled?: boolean;
}

export function QuantityStepper({
  quantity,
  unit,
  onDecrement,
  onIncrement,
  disabled,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        aria-label={`Restar ${unit}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-border text-brand-text disabled:opacity-30"
      >
        −
      </button>
      <span className="w-16 shrink-0 text-center text-sm font-medium text-brand-text">
        {quantity} {unit}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        aria-label={`Sumar ${unit}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-border text-brand-text disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

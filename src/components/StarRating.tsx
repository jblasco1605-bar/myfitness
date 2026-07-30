"use client";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div role="radiogroup" aria-label="Valoración de la receta" className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          className="p-1 text-4xl leading-none transition-transform active:scale-90"
        >
          <span className={star <= value ? "text-goal-maintain" : "text-brand-border"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

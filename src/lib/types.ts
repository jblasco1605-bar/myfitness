export type GoalId = "muscle" | "fat" | "maintain";

export interface Goal {
  id: GoalId;
  emoji: string;
  title: string;
  description: string;
  /** Tailwind classes escritas literalmente para que el JIT scanner las detecte */
  classes: {
    ring: string;
    text: string;
    iconBg: string;
    dot: string;
  };
}

export const GOALS: Goal[] = [
  {
    id: "muscle",
    emoji: "💪",
    title: "Ganar Músculo",
    description: "Hipertrofia y alta proteína",
    classes: {
      ring: "ring-goal-muscle",
      text: "text-goal-muscle",
      iconBg: "bg-goal-muscleSoft",
      dot: "bg-goal-muscle",
    },
  },
  {
    id: "fat",
    emoji: "🔥",
    title: "Perder Grasa",
    description: "Déficit calórico y saciedad",
    classes: {
      ring: "ring-goal-fat",
      text: "text-goal-fat",
      iconBg: "bg-goal-fatSoft",
      dot: "bg-goal-fat",
    },
  },
  {
    id: "maintain",
    emoji: "⚖️",
    title: "Mantenimiento",
    description: "Equilibrio y rendimiento",
    classes: {
      ring: "ring-goal-maintain",
      text: "text-goal-maintain",
      iconBg: "bg-goal-maintainSoft",
      dot: "bg-goal-maintain",
    },
  },
];

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  /** Incremento al pulsar +/- (p.ej. 50 g, 1 ud) */
  step: number;
  detected: boolean;
}

export interface PantryStaple {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  step: number;
  hasIt: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  minutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  steps: string[];
  /** Breve explicación en prosa de cómo se cocina, debajo de los pasos */
  summary: string;
}

export interface HistoryEntry {
  id: string;
  recipeId: string;
  title: string;
  emoji: string;
  rating: number;
  completedAt: string;
}

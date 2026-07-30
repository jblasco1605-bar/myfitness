import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0B0F14",
          surface: "#141A21",
          surfaceAlt: "#1B232C",
          border: "#26303A",
          text: "#F5F7FA",
          textMuted: "#9AA6B2",
        },
        goal: {
          muscle: "#22C55E",
          muscleSoft: "#16321F",
          fat: "#3B82F6",
          fatSoft: "#132338",
          maintain: "#F97316",
          maintainSoft: "#3A2413",
        },
      },
      borderRadius: {
        card: "1.25rem",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        line: "#e3e7ee",
        mist: "#f8fafc",
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c"
        },
        accent: {
          500: "#14b8a6",
          600: "#0d9488"
        },
        sun: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706"
        },
        fresh: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669"
        }
      },
      boxShadow: {
        panel: "0 18px 45px rgba(17, 24, 39, 0.08)",
        soft: "0 8px 24px rgba(17, 24, 39, 0.07)"
      }
    },
  },
  plugins: [],
};

export default config;

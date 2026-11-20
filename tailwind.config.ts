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
        ink: "#282521",
        line: "#e1dbd2",
        mist: "#f5f2ec",
        paper: "#faf8f3",
        muted: "#625b54",
        brand: {
          50: "#fcf0ec",
          100: "#f4ddd5",
          500: "#c03e2f",
          600: "#a72e22",
          700: "#84231a"
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
        panel: "0 16px 42px rgba(46, 36, 26, 0.09)",
        soft: "0 3px 10px rgba(46, 36, 26, 0.06)"
      },
    },
  },
  plugins: [],
};

export default config;

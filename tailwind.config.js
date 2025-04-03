/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        silkscreen: ["Silkscreen", "cursive"],
        mono: ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
  safelist: [
    "light",
    "dark",
    {
      pattern: /(light|dark)\.(green|slate|rose|gray|black|white)-theme/,
    },
    // Safelist dynamic theme colors for progress bars
    "bg-green-500",
    "bg-slate-500",
    "bg-rose-500",
    "bg-gray-500",
    "bg-neutral-500", // Tailwind uses "neutral" instead of "black"
    "bg-gray-200", // For white theme bar (white text on bg-gray)
  ],
};

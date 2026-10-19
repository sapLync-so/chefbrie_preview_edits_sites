import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        "bg-elevated": "rgb(var(--color-bg-elevated) / <alpha-value>)",
        "bg-muted": "rgb(var(--color-bg-muted) / <alpha-value>)",
        cream: "rgb(var(--color-surface-cream) / <alpha-value>)",
        "cream-muted": "rgb(var(--color-surface-cream-muted) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--color-ink) / 0.72)",
        "ink-subtle": "rgb(var(--color-ink) / 0.45)",
        "ink-cream": "rgb(var(--color-ink-on-cream) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        "gold-bright": "rgb(var(--color-gold-bright) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        dark: "#0d0d0d",
        "dark-card": "#111111",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: "var(--text-hero)",
      },
      spacing: {
        section: "var(--space-section)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        glow: "var(--shadow-glow)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
    },
  },
  plugins: [],
};

export default config;

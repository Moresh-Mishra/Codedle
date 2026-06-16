/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Modernized palette: Zinc neutrals with Emerald accents
        primary: {
          DEFAULT: "#10b981", // emerald-500
          foreground: "#ffffff",
          container: "#dcfce7", // emerald-100
          onContainer: "#064e3b", // emerald-900
          dim: "#059669", // emerald-600
        },
        secondary: {
          DEFAULT: "#64748b", // slate-500
          foreground: "#ffffff",
          container: "#f1f5f9", // slate-100
          onContainer: "#0f172a", // slate-900
        },
        background: {
          DEFAULT: "#fdfdfc", // very light neutral
          paper: "#ffffff",
          muted: "#f4f4f5", // zinc-100
        },
        surface: {
          DEFAULT: "#ffffff",
          dim: "#f4f4f5",
          variant: "#e4e4e7", // zinc-200
          outline: "#d4d4d8", // zinc-300
        },
        accent: {
          emerald: "#84cc16", // original codedle green
          slate: "#0f172a",
        },
        error: "#ef4444",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        margin: "32px",
        gutter: "24px",
        base: "8px",
        "container-max": "1280px",
      },
      fontFamily: {
        hanken: ["Hanken Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "Hanken Grotesk", "sans-serif"],
      },
      fontSize: {
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.04em", fontWeight: "800" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};

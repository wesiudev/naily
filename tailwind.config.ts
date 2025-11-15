/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          "50": "#faf5ff",
          "100": "#f3e8ff",
          "200": "#e9d5ff",
          "300": "#d8b4fe",
          "400": "#c084fc",
          "500": "#a855f7",
          "600": "#9333ea",
          "700": "#7c3aed",
          "800": "#6b21a8",
          "900": "#581c87",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          "50": "#f8fafc",
          "100": "#f1f5f9",
          "200": "#e2e8f0",
          "300": "#cbd5e1",
          "400": "#94a3b8",
          "500": "#64748b",
          "600": "#475569",
          "700": "#334155",
          "800": "#1e293b",
          "900": "#0f172a",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          "50": "#f0fdfa",
          "100": "#ccfbf1",
          "200": "#99f6e4",
          "300": "#5eead4",
          "400": "#2dd4bf",
          "500": "#14b8a6",
          "600": "#0d9488",
          "700": "#0f766e",
          "800": "#115e59",
          "900": "#134e4a",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        neutral: {
          "50": "#f9fafb",
          "100": "#f3f4f6",
          "200": "#e5e7eb",
          "300": "#d1d5db",
          "400": "#9ca3af",
          "500": "#6b7280",
          "600": "#4b5563",
          "700": "#374151",
          "800": "#1f2937",
          "900": "#111827",
        },
        purple: {
          "50": "#faf5ff",
          "100": "#f3e8ff",
          "200": "#e9d5ff",
          "300": "#d8b4fe",
          "400": "#c084fc",
          "500": "#a855f7",
          "600": "#9333ea",
          "700": "#7c3aed",
          "800": "#6b21a8",
          "900": "#581c87",
        },
        rose: {
          "50": "#fff1f2",
          "100": "#ffe4e6",
          "200": "#fecdd3",
          "300": "#fda4af",
          "400": "#fb7185",
          "500": "#f43f5e",
          "600": "#e11d48",
          "700": "#be123c",
          "800": "#9f1239",
          "900": "#881337",
        },
        success: {
          "50": "#f0fdf4",
          "100": "#dcfce7",
          "200": "#bbf7d0",
          "300": "#86efac",
          "400": "#4ade80",
          "500": "#22c55e",
          "600": "#16a34a",
          "700": "#15803d",
          "800": "#166534",
          "900": "#14532d",
        },
        warning: {
          "50": "#fffbeb",
          "100": "#fef3c7",
          "200": "#fde68a",
          "300": "#fcd34d",
          "400": "#fbbf24",
          "500": "#f59e0b",
          "600": "#d97706",
          "700": "#b45309",
          "800": "#92400e",
          "900": "#78350f",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        archivo: ["var(--font-archivo-black)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        marcellus: ["var(--font-marcellus)", "serif"],
        cinzel: ["var(--font-cinzel)", "serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
        lora: ["var(--font-lora)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        openSans: ["var(--font-open-sans)", "sans-serif"],
        sourceSans: ["var(--font-source-sans)", "sans-serif"],
        body: ["var(--app-font-family, var(--font-inter))", "sans-serif"],
        baloo: ["var(--baloo, var(--font-baloo))", "sans-serif"],
      },
      fontSize: {
        xs: [
          "0.75rem",
          {
            lineHeight: "1.2",
          },
        ],
        sm: [
          "0.875rem",
          {
            lineHeight: "1.4",
          },
        ],
        base: [
          "1rem",
          {
            lineHeight: "1.5",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.5",
          },
        ],
        xl: [
          "1.25rem",
          {
            lineHeight: "1.4",
          },
        ],
        "2xl": [
          "1.5rem",
          {
            lineHeight: "1.3",
          },
        ],
        "3xl": [
          "1.875rem",
          {
            lineHeight: "1.2",
          },
        ],
        "4xl": [
          "2.25rem",
          {
            lineHeight: "1.1",
          },
        ],
        "5xl": [
          "3rem",
          {
            lineHeight: "1.1",
          },
        ],
        "6xl": [
          "3.75rem",
          {
            lineHeight: "1.1",
          },
        ],
        "7xl": [
          "4.5rem",
          {
            lineHeight: "1",
          },
        ],
        "8xl": [
          "6rem",
          {
            lineHeight: "1",
          },
        ],
        "9xl": [
          "8rem",
          {
            lineHeight: "1",
          },
        ],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "var(--radius)",
        xl: "12px",
        "2xl": "16px",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "professional-gradient":
          "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        "professional-pattern":
          "radial-gradient(circle at 25% 25%, rgba(30, 64, 175, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(13, 148, 136, 0.05) 0%, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-in": "slideIn 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      const newUtilities = {
        ".text-overflow-safe": {
          "overflow-wrap": "break-word",
          "word-wrap": "break-word",
          hyphens: "auto",
        },
        ".touch-target": {
          "min-height": "44px",
          "min-width": "44px",
        },
        ".prevent-overflow": {
          "overflow-x": "hidden",
          "max-width": "100%",
        },
      };
      addUtilities(newUtilities);
    },
    require("tailwindcss-animate"),
  ],
} satisfies Config;

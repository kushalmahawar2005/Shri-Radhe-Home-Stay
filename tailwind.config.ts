import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // ——— Brand palette (Nathdwara Pichwai heritage) ———
        cream: {
          DEFAULT: "#F7F1E1",
          light: "#FBF6EA",
          alt: "#EFE6D0", // alternate section background
        },
        emerald: {
          DEFAULT: "#1E4A3C", // primary — bands, buttons, footer
          dark: "#163528",
          light: "#2A5F4D",
        },
        gold: {
          DEFAULT: "#C7A24A", // borders, dividers, icons
          dark: "#A8842F",
          light: "#E0C77E",
        },
        ink: "#33291E", // body text
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-mukta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(51, 41, 30, 0.18)",
        nav: "0 6px 24px -10px rgba(51, 41, 30, 0.20)",
        soft: "0 4px 18px -8px rgba(51, 41, 30, 0.15)",
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sway: {
          "0%,100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        sway: "sway 4s ease-in-out infinite",
      },
      backgroundImage: {
        "cream-gradient":
          "linear-gradient(180deg, #FBF6EA 0%, #F7F1E1 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

/**
 * Configuration TailwindCSS pour Rassoul Shop
 * 
 * Palette premium sombre :
 * - noir profond pour le fond
 * - or chaud pour les accents
 * - crème pour le texte principal
 * - gris subtils pour le texte secondaire
 * 
 * Typographies :
 * - Playfair Display (serif élégant) pour les titres
 * - Inter (sans-serif moderne) pour le corps
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* Palette principale premium */
        noir: {
          950: "#050505",
          900: "#0a0a0a",
          800: "#141414",
          700: "#1e1e1e",
          600: "#2a2a2a",
        },
        gold: {
          DEFAULT: "#c9a96e",
          light: "#dfc9a0",
          dark: "#a88b4a",
        },
        cream: {
          DEFAULT: "#f5f0eb",
          soft: "#e8e0d6",
        },
        muted: "#8a8279",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      /* Animations personnalisées pour les transitions premium */
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in": "slideIn 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

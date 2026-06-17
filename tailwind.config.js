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
        /* Palette principale premium — alignée sur le logo (marron + or vif) */
        noir: {
          950: "#070503",
          900: "#0c0805",
          800: "#161009",
          700: "#21180e",
          600: "#2d2113",
        },
        /* Or vif et lumineux du logo */
        gold: {
          DEFAULT: "#D7A12B",
          light: "#F3CF5C",
          pale: "#FCE9A8",
          deep: "#B5811E",
          dark: "#9A6E18",
        },
        /* Marron chocolat du logo (gift box + bandeau SHOP SN) */
        brand: {
          brown: "#6E3410",
          brownDark: "#4A2208",
          brownDeep: "#2A1305",
          brownLight: "#8C4A1E",
        },
        cream: {
          DEFAULT: "#f7f1e6",
          soft: "#ece1d0",
        },
        muted: "#9a8a76",
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

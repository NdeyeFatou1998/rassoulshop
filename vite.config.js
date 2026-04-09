/**
 * Configuration Vite pour le frontend Rassoul Shop
 * 
 * - Plugin React activé pour le support JSX/HMR
 * - Proxy API vers le backend Express (port 3001)
 *   pour éviter les problèmes CORS en développement
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    /* Proxy des appels /api et /uploads vers le backend Express */
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});

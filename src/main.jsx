/**
 * Point d'entrée principal de l'application React
 * Monte le composant App dans le DOM avec React.StrictMode
 * Importe les styles TailwindCSS globaux
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

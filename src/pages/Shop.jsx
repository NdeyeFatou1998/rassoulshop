/**
 * Page Shop — Boutique Rassoul Shop
 *
 * Composition :
 * - Header épuré avec titre
 * - FilterableProductGrid : tous les produits + filtre catégorie
 *   → La catégorie initiale est lue depuis ?category=X dans l'URL
 *   → Par défaut : "Tous les produits"
 */

import { motion } from "framer-motion";
import { useSearchParams, Navigate } from "react-router-dom";
import FilterableProductGrid from "../components/sections/FilterableProductGrid";

const COFFRETS_CATEGORY = "sets-cadeau";

export default function Shop() {
  const [searchParams] = useSearchParams();
  /* Catégorie initiale depuis l'URL (?category=montres) — null si absente */
  const initialCategory = searchParams.get("category") || null;

  if (initialCategory === COFFRETS_CATEGORY) {
    return <Navigate to="/coffrets" replace />;
  }

  return (
    <>
      {/* ---- Header ---- */}
      <section className="pt-20 md:pt-24 pb-5" style={{ background: "#030303" }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-5 lg:px-10 text-center"
        >
          <h1 className="font-serif text-3xl md:text-4xl text-white">
            Boutique
          </h1>
          <div className="w-10 h-px bg-gold/50 mx-auto mt-3" />
        </motion.div>
      </section>

      {/* ---- Grille filtrée — catégorie initiale depuis URL ---- */}
      <FilterableProductGrid limit={100} defaultCategory={initialCategory} showFilters />
    </>
  );
}

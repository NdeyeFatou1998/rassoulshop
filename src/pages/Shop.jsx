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
import { useSearchParams } from "react-router-dom";
import FilterableProductGrid from "../components/sections/FilterableProductGrid";

export default function Shop() {
  const [searchParams] = useSearchParams();
  /* Catégorie initiale depuis l'URL (?category=montres) — null si absente */
  const initialCategory = searchParams.get("category") || null;

  return (
    <>
      {/* ---- Header ---- */}
      <section className="bg-[#080807] pt-24 md:pt-28 pb-10 border-b border-white/[0.05]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-5 lg:px-10 text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
            Notre collection
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-white mt-2">
            Boutique
          </h1>
          <div className="w-10 h-px bg-gold/50 mx-auto mt-4" />
        </motion.div>
      </section>

      {/* ---- Grille filtrée — catégorie initiale depuis URL ---- */}
      <FilterableProductGrid limit={100} defaultCategory={initialCategory} showFilters />
    </>
  );
}

/**
 * Page Shop - Boutique complète Rassoul Shop v2
 * 
 * Design amélioré avec plus de blanc et doré :
 * - Bannière hero crème/dorée en haut (casser le noir)
 * - Sous-titre descriptif
 * - Séparateur doré animé
 * - Grille produits responsive (12 produits)
 * - Filtres catégorie redessinés
 */

import { motion } from "framer-motion";
import ProductGrid from "../components/sections/ProductGrid";
import { useSearchParams } from "react-router-dom";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  return (
    <>
      {/* ---- Header compact — juste le titre ---- */}
      <section className="pt-24 md:pt-28 pb-2 w-full px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-px bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
              Collection
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-cream leading-tight">
            Boutique
          </h1>
        </motion.div>
      </section>

      {/* ---- Grille produits avec filtres catégorie ---- */}
      <ProductGrid
        limit={12}
        showTitle={false}
        showFilter={true}
        initialCategory={category}
      />
    </>
  );
}

/**
 * Composant ProductGrid - Grille de produits responsive
 * 
 * Affiche les produits depuis l'API dans une grille adaptative :
 * - 2 colonnes sur mobile
 * - 3 colonnes sur tablette
 * - 4 colonnes sur desktop
 * - Titre de section avec ligne dorée
 * - État de chargement avec skeleton animé
 * - Filtrage par catégorie (onglets horizontaux scrollables)
 * 
 * Props :
 * - limit     : nombre de produits à afficher (défaut: 8)
 * - showTitle : afficher le titre de section (défaut: true)
 * - showFilter: afficher les filtres catégorie (défaut: false)
 */

import { useState } from "react";
import ProductCard from "../ui/ProductCard";
import AnimatedSection from "../ui/AnimatedSection";
import { useProducts } from "../../hooks/useProducts";
import { fetchCategories } from "../../services/api";
import { useEffect } from "react";

export default function ProductGrid({
  limit = 8,
  showTitle = true,
  showFilter = false,
  initialCategory = null,
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setActiveCategory(initialCategory || null);
  }, [initialCategory]);

  /* Récupère les produits via le hook personnalisé */
  const { products, loading } = useProducts({
    category: activeCategory,
    limit: activeCategory ? undefined : limit,
  });

  /* Charge les catégories si les filtres sont activés */
  useEffect(() => {
    if (showFilter) {
      fetchCategories().then(setCategories);
    }
  }, [showFilter]);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
      {/* ---- En-tête de section ---- */}
      {showTitle && (
        <AnimatedSection className="mb-10 md:mb-14 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-medium">
            Notre sélection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-cream mt-2">
            Idées cadeaux
          </h2>
          <div className="w-10 h-px bg-gold/30 mx-auto mt-4" />
        </AnimatedSection>
      )}

      {/* ---- Filtres par catégorie ---- */}
      {showFilter && categories.length > 0 && (
        <AnimatedSection className="mb-10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 justify-center">
            {/* Bouton "Tout" */}
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-5 py-2 text-[10px] uppercase tracking-[0.15em] font-medium rounded-full border transition-all duration-300 ${
                !activeCategory
                  ? "bg-gold text-noir-950 border-gold"
                  : "bg-transparent text-cream/40 border-white/8 hover:border-gold/25 hover:text-cream/70"
              }`}
            >
              Tout
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 text-[10px] uppercase tracking-[0.15em] font-medium rounded-full border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gold text-noir-950 border-gold"
                    : "bg-transparent text-cream/40 border-white/8 hover:border-gold/25 hover:text-cream/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* ---- Grille de produits ---- */}
      {loading ? (
        /* Skeleton shimmer */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] shimmer rounded-xl" />
              <div className="mt-3 space-y-2">
                <div className="h-2 shimmer rounded-full w-1/4" />
                <div className="h-3 shimmer rounded-full w-3/4" />
                <div className="h-3 shimmer rounded-full w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grille des produits */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

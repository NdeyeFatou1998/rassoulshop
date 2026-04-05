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

export default function ProductGrid({ limit = 8, showTitle = true, showFilter = false }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);

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
    <section className="w-full px-3 md:px-5 lg:px-8 py-16 md:py-24">
      {/* ---- En-tête de section ---- */}
      {showTitle && (
        <AnimatedSection className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
              Sélection
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-cream">
            La collection
          </h2>
        </AnimatedSection>
      )}

      {/* ---- Filtres par catégorie (scroll horizontal sur mobile) ---- */}
      {showFilter && categories.length > 0 && (
        <AnimatedSection className="mb-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {/* Bouton "Tout" */}
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-4 py-2 text-xs uppercase tracking-[0.1em] font-medium rounded-full border transition-all duration-300 ${
                !activeCategory
                  ? "bg-gold text-noir-900 border-gold"
                  : "bg-transparent text-muted border-white/10 hover:border-gold/30 hover:text-cream"
              }`}
            >
              Tout
            </button>
            {/* Boutons de catégories */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 text-xs uppercase tracking-[0.1em] font-medium rounded-full border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gold text-noir-900 border-gold"
                    : "bg-transparent text-muted border-white/10 hover:border-gold/30 hover:text-cream"
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
        /* Skeleton shimmer premium — reflet doré glissant */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-white/[0.03]"
            >
              <div className="aspect-[3/4] shimmer" />
              <div className="p-3 md:p-4 space-y-2.5 bg-noir-800">
                <div className="h-2 shimmer rounded-full w-1/3" />
                <div className="h-3 shimmer rounded-full w-3/4" />
                <div className="h-3 shimmer rounded-full w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grille des produits chargés */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

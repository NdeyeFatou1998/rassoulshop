/**
 * Composant ShopCategoryCarousel
 *
 * Affiche une section par catégorie avec un carrousel horizontal.
 * 
 * Design sur fond clair :
 * - Fond blanc ou crème (#F7F4EF) en alternance via prop idx
 * - Titre de catégorie serif sombre
 * - Lien "Voir tout →" sur desktop
 * - Skeleton clair (shimmer-light)
 * - Scroll horizontal fluide mobile
 *
 * Props :
 * - category (string)  : slug de la catégorie
 * - limit (number)     : nombre de produits max (défaut: 12)
 * - idx (number)       : index pour alterner le fond (défaut: 0)
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import AnimatedSection from "../ui/AnimatedSection";
import { useProducts } from "../../hooks/useProducts";

export default function ShopCategoryCarousel({ category, limit = 12, idx = 0 }) {
  const { products, loading } = useProducts({ category, limit });

  /* Nom affiché : category_name de l'API sinon le slug en entrée */
  const displayName =
    products && products.length > 0
      ? (products[0].category_name || category)
      : category;

  /* Ne pas afficher de section vide */
  if (!loading && products.length === 0) return null;

  /* Fond alternant : noir profond → noir légèrement chaud */
  const bg = idx % 2 === 0 ? "bg-[#080807]" : "bg-[#0c0b09]";

  return (
    <section className={`${bg} py-12 md:py-16`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* ---- En-tête de section ---- */}
        <AnimatedSection className="mb-7 md:mb-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.28em] text-gold font-semibold">
                Catégorie
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-white leading-tight mt-1.5">
                {displayName}
              </h2>
            </div>
            {/* Lien "Voir tout" desktop */}
            <Link
              to={`/shop?category=${encodeURIComponent(category)}`}
              className="hidden md:flex items-center gap-1.5 text-xs text-white/30 hover:text-gold transition-colors duration-300 flex-shrink-0 pb-1"
            >
              Voir tout
              <ArrowRight size={13} />
            </Link>
          </div>
        </AnimatedSection>

        {/* ---- Carrousel produits ---- */}
        {loading ? (
          /* Skeleton clair */
          <div className="flex gap-4 md:gap-5 overflow-x-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[185px] sm:w-[210px] md:w-[240px] flex-shrink-0">
                <div className="aspect-[4/5] shimmer-light" />
                <div className="mt-3 space-y-2 px-1">
                  <div className="h-2 bg-gray-200 animate-pulse rounded-full w-1/4" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded-full w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Carrousel scroll horizontal */
          <div className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-3">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="w-[185px] sm:w-[210px] md:w-[240px] lg:w-[260px] flex-shrink-0"
              >
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}

        {/* Lien "Voir tout" mobile */}
        <div className="mt-5 md:hidden text-center">
          <Link
            to={`/shop?category=${encodeURIComponent(category)}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-gold transition-colors"
          >
            Voir tout <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}

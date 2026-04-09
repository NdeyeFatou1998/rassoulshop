/**
 * Composant ShopCategoryCarousel
 *
 * Rôle :
 * - Afficher une catégorie de produits sous forme de “ligne” (section) avec un carrousel horizontal.
 * - Charger les produits via le hook `useProducts` (API + fallback).
 *
 * Comportement :
 * - Affiche un titre de catégorie + un séparateur discret.
 * - Affiche une rangée scrollable horizontalement (overflow-x) de `ProductCard`.
 * - Affiche un état skeleton pendant le chargement.
 *
 * Props :
 * - category (string) : nom/slug de la catégorie à afficher.
 * - limit (number)   : nombre de produits max pour cette catégorie (défaut: 12).
 */

import ProductCard from "../ui/ProductCard";
import AnimatedSection from "../ui/AnimatedSection";
import { useProducts } from "../../hooks/useProducts";

export default function ShopCategoryCarousel({ category, limit = 12 }) {
  const { products, loading } = useProducts({ category, limit });

  return (
    <section className="w-full px-3 md:px-5 lg:px-8 py-10 md:py-12">
      <AnimatedSection className="mb-5 md:mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-px bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
                Catégorie
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight">
              {category}
            </h2>
          </div>
          <div className="hidden md:block h-px flex-1 bg-white/[0.06]" />
        </div>
      </AnimatedSection>

      {loading ? (
        <div className="flex gap-3 md:gap-4 overflow-x-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[220px] md:w-[260px] lg:w-[280px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.03]"
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
        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[220px] md:w-[260px] lg:w-[280px] flex-shrink-0"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

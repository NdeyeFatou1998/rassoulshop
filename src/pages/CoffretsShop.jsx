/**
 * CoffretsShop — /coffrets (design premium aligné accueil)
 */

import { Package } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ui/ProductCard";
import PageHeader from "../components/ui/PageHeader";

const COFFRETS_CATEGORY = "sets-cadeau";

export default function CoffretsShop() {
  const { products, loading } = useProducts({ category: COFFRETS_CATEGORY, limit: 100 });

  return (
    <>
      <PageHeader
        title="Coffrets"
        breadcrumb="Accueil · Coffrets"
        subtitle="Des ensembles prêts à offrir"
      />

      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 pb-24 home-products-premium">
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white border border-black/[0.06]">
                <div className="aspect-[4/5] shimmer-light" />
                <div className="px-2.5 py-2 space-y-1.5">
                  <div className="h-2.5 shimmer-light rounded-full w-[88%]" />
                  <div className="h-2 shimmer-light rounded-full w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Package size={40} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500 text-sm">Aucun coffret disponible pour le moment</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                lightBackground
                premium
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

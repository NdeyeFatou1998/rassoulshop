/**
 * CoffretsShop — /coffrets
 * Même présentation que Box Cadeau : header centré + grille éditoriale.
 * Affiche les produits de la catégorie « sets-cadeau ».
 */

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ui/ProductCard";

const COFFRETS_CATEGORY = "sets-cadeau";

export default function CoffretsShop() {
  const { products, loading } = useProducts({ category: COFFRETS_CATEGORY, limit: 100 });

  return (
    <div className="min-h-screen" style={{ background: "#030303" }}>
      {/* ---- Header (identique à Box Cadeau) ---- */}
      <section className="pt-20 md:pt-24 pb-5 max-w-7xl mx-auto px-5 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-3xl md:text-4xl text-white">Coffrets</h1>
          <div className="w-10 h-px bg-gold/50 mx-auto mt-3" />
        </motion.div>
      </section>

      {/* ---- Grille ---- */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-8 pb-24">
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden aspect-[4/5] shimmer"
                style={{ background: "#111010", border: "0.5px solid rgba(255,255,255,0.14)" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Package size={40} className="mx-auto mb-4 text-white/30" />
            <p className="text-white/60 text-sm">Aucun coffret disponible pour le moment</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

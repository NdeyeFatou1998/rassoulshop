/**
 * GiftBoxShop — /gift-boxes (design premium aligné accueil)
 */

import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GiftBoxCard from "../components/ui/GiftBoxCard";

export default function GiftBoxShop() {
  const [giftBoxes, setGiftBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gift-boxes")
      .then(r => r.json())
      .then(d => setGiftBoxes((d.giftBoxes || []).filter(b => b.active)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title="Box Cadeau"
        breadcrumb="Accueil · Box Cadeau"
        subtitle="Composez un coffret sur mesure"
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
        ) : giftBoxes.length === 0 ? (
          <div className="text-center py-24">
            <Gift size={40} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500 text-sm">Aucun coffret disponible pour le moment</p>
          </div>
        ) : (
          <div className="product-grid">
            {giftBoxes.map((box, i) => (
              <GiftBoxCard key={box.id} box={box} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

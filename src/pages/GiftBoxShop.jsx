/**
 * GiftBoxShop — /gift-boxes (design premium aligné accueil)
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";

const DEFAULT_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#faf7f2"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <rect x="70" y="70" width="660" height="660" rx="48" fill="#ffffff" stroke="#e8dfd0" stroke-width="10"/>
  <path d="M400 245c-42-62-145-42-145 36 0 54 52 89 145 129 93-40 145-75 145-129 0-78-103-98-145-36z" fill="#D7A12B" opacity="0.35"/>
  <text x="400" y="560" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#1a1612" text-anchor="middle">Coffret</text>
</svg>
`)}`;

export default function GiftBoxShop() {
  const [giftBoxes, setGiftBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gift-boxes")
      .then(r => r.json())
      .then(d => setGiftBoxes((d.giftBoxes || []).filter(b => b.active && Number(b.stock) > 0)))
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
              <motion.article
                key={box.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col w-full overflow-hidden product-card-premium rounded-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <Link to={`/gift-boxes/${box.id}`} className="absolute inset-0 block">
                    <img
                      src={box.image || DEFAULT_IMG}
                      alt={box.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
                      onError={e => { e.currentTarget.src = DEFAULT_IMG; }}
                    />
                  </Link>
                  {box.is_customizable && (
                    <span className="absolute top-2 left-2 z-10 text-[8px] uppercase tracking-[0.12em] font-extrabold px-2 py-0.5 rounded-sm bg-[#D7A12B] text-[#0a0a0a]">
                      Personnalisable
                    </span>
                  )}
                </div>
                <Link to={`/gift-boxes/${box.id}`} className="block px-2.5 py-2.5 text-center product-card-caption-premium">
                  <h3 className="product-card-title-below product-card-title-below--premium line-clamp-1">{box.name}</h3>
                  <span className="product-card-price-below product-card-price-below--premium leading-none whitespace-nowrap">
                    {(box.price || 0).toLocaleString("fr-FR")}
                    <span className="product-card-price-unit-below"> FCFA</span>
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

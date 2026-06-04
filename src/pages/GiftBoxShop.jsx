/**
 * GiftBoxShop — /gift-boxes
 * Grille de cards cadeaux cliquables, mène vers /gift-boxes/:id
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Link } from "react-router-dom";

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
  <path d="M260 340h280v300H260z" fill="#1a1612" opacity="0.06"/>
  <path d="M270 380h260v260H270z" fill="#ffffff" stroke="#e8dfd0" stroke-width="8" rx="20"/>
  <path d="M400 245c-42-62-145-42-145 36 0 54 52 89 145 129 93-40 145-75 145-129 0-78-103-98-145-36z" fill="#C5A55A" opacity="0.35"/>
  <text x="400" y="560" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#1a1612" text-anchor="middle">Coffret</text>
  <text x="400" y="604" font-family="Arial, sans-serif" font-size="18" fill="#8a6a42" text-anchor="middle" letter-spacing="2">RASSOUL SHOP</text>
</svg>
`)}`;

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
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0d0a05 0%, #131108 50%, #0d0a05 100%)" }}>
      {/* ---- Header ---- */}
      <section className="pt-20 md:pt-24 pb-5 max-w-7xl mx-auto px-5 lg:px-10 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-serif text-3xl md:text-4xl text-white">Coffrets Cadeaux</h1>
          <div className="w-10 h-px bg-gold/50 mx-auto mt-3" />
        </motion.div>
      </section>

      {/* ---- Grille ---- */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-8 pb-24">
        {loading ? (
          /* Skeletons */
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#111010", border: "1px solid rgba(197,165,90,0.25)" }}>
                <div className="aspect-square shimmer" />
                <div className="px-3.5 py-3 space-y-2 border-t border-white/[0.05]">
                  <div className="h-2 shimmer rounded w-1/3" />
                  <div className="h-3 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-2/5 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : giftBoxes.length === 0 ? (
          <div className="text-center py-24">
            <Gift size={40} className="mx-auto mb-4 text-white/30" />
            <p className="text-white/60 text-sm">Aucun coffret disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {giftBoxes.map((box, i) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/gift-boxes/${box.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-400"
                  style={{ background: "#111010", border: "1px solid rgba(197,165,90,0.28)" }}
                >
                  {/* Image */}
                  <div className="relative w-full aspect-square overflow-hidden">
                    <img
                      src={box.image || DEFAULT_IMG}
                      alt={box.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMG;
                      }}
                    />
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    {/* Badge personnalisable */}
                    {box.is_customizable && (
                      <span className="absolute top-2.5 left-2.5 text-[7px] uppercase tracking-[0.16em] font-bold bg-gold text-noir-950 px-2 py-[3px] rounded-full">
                        Personnalisable
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="px-3.5 pt-3 pb-4" style={{ borderTop: "1px solid rgba(197,165,90,0.18)" }}>
                    <p className="text-[8px] uppercase tracking-[0.22em] font-bold mb-1.5" style={{ color: "#C5A55A" }}>
                      Coffret cadeau
                    </p>
                    <h3 className="text-[14px] font-bold leading-snug line-clamp-2 transition-colors duration-300"
                        style={{ color: "#D4BA78" }}>
                      {box.name}
                    </h3>
                    {box.items?.length > 0 && (
                      <p className="text-[10px] mt-1" style={{ color: "rgba(240,234,216,0.65)" }}>
                        {box.items.length} article{box.items.length > 1 ? "s" : ""}
                      </p>
                    )}
                    <div className="mt-3 pt-2.5" style={{ borderTop: "1px solid rgba(197,165,90,0.15)" }}>
                      <span className="text-[16px] font-bold" style={{ color: "#f0ead8" }}>
                        {(box.price || 0).toLocaleString("fr-FR")}
                        <span className="text-[9px] font-normal ml-0.5" style={{ color: "rgba(240,234,216,0.60)" }}>FCFA</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

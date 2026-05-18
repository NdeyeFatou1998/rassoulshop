/**
 * GiftBoxShop — /gift-boxes
 * Grille de cards cadeaux cliquables, mène vers /gift-boxes/:id
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-[#080807]">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-[#0f0f0e] border border-white/[0.07]">
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
            <Gift size={40} className="mx-auto mb-4 text-white/10" />
            <p className="text-white/30 text-sm">Aucun coffret disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {giftBoxes.map((box, i) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/gift-boxes/${box.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden
                             bg-[#0f0f0e] border border-white/[0.07]
                             hover:border-gold/25 hover:shadow-[0_0_24px_rgba(197,165,90,0.08)]
                             transition-all duration-400"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-square overflow-hidden">
                    {box.image ? (
                      <img
                        src={box.image}
                        alt={box.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#141412] flex items-center justify-center">
                        <Gift size={36} className="text-gold/20" />
                      </div>
                    )}
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
                  <div className="px-3.5 pt-3 pb-3.5 border-t border-white/[0.05]">
                    <p className="text-[8px] uppercase tracking-[0.22em] text-gold/70 font-semibold mb-1.5">
                      Coffret cadeau
                    </p>
                    <h3 className="text-[12px] font-medium text-white/90 leading-snug line-clamp-2
                                   group-hover:text-white transition-colors duration-300">
                      {box.name}
                    </h3>
                    {/* Nombre d'articles */}
                    {box.items?.length > 0 && (
                      <p className="text-[10px] text-white/30 mt-1">
                        {box.items.length} article{box.items.length > 1 ? "s" : ""}
                      </p>
                    )}
                    {/* Prix */}
                    <div className="mt-2.5 pt-2.5 border-t border-white/[0.05]">
                      <span className="text-[13px] font-semibold text-white/90 leading-none">
                        {(box.price || 0).toLocaleString("fr-FR")}
                        <span className="text-[8px] font-normal text-white/30 ml-0.5">FCFA</span>
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

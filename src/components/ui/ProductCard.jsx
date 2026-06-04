/**
 * ProductCard — Image carrée en haut, texte en bas
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const GOLD = "#C8A84B";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const hasPromo = product.promo_active && product.promo_price;

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
    addToCart(product, 1);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col rounded-xl overflow-hidden"
      style={{ background: "#111010", border: "1px solid rgba(197,165,90,0.22)" }}
    >
      {/* ---- Image carrée ---- */}
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full flex-shrink-0 overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        <img
          src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />

        {/* Badges haut gauche */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2 py-[3px] text-[8px] uppercase tracking-[0.12em] font-bold rounded-full"
              style={{ background: GOLD, color: "#0c0a07" }}>
              {product.badge}
            </span>
          )}
          {product.is_vip && (
            <span className="inline-flex items-center gap-0.5 text-[7px] uppercase tracking-[0.12em] font-bold px-2 py-[3px] rounded-full"
              style={{ background: "rgba(0,0,0,0.70)", color: GOLD, border: `1px solid ${GOLD}`, backdropFilter: "blur(4px)" }}>
              ★ VIP
            </span>
          )}
        </div>

        {/* Badge promo haut droite */}
        {hasPromo && (
          <span className="absolute top-2 right-2 z-10 text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#e53e3e", color: "#fff" }}>
            -{Math.round((1 - product.promo_price / product.price) * 100)}%
          </span>
        )}

        {/* Bouton panier */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100"
          style={justAdded
            ? { background: "#22c55e", color: "#fff" }
            : { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)" }
          }
          aria-label="Ajouter au panier"
        >
          {justAdded ? <Check size={12} strokeWidth={2.5} /> : <ShoppingCart size={12} strokeWidth={1.8} />}
        </button>
      </Link>

      {/* ---- Mini-card infos EN BAS avec contour gold ---- */}
      <div className="px-2.5 py-2.5">
        <div
          className="rounded-lg px-3 py-2.5 flex flex-col gap-1"
          style={{
            background: "linear-gradient(135deg, rgba(197,165,90,0.08) 0%, rgba(197,165,90,0.03) 100%)",
            border: "1px solid rgba(197,165,90,0.40)",
            boxShadow: "0 0 10px rgba(197,165,90,0.07), inset 0 1px 0 rgba(197,165,90,0.12)",
          }}
        >
          {/* Catégorie */}
          <p className="text-[8px] uppercase tracking-[0.18em] font-bold" style={{ color: GOLD }}>
            {product.category_name || product.category || ""}
          </p>

          {/* Nom encadré */}
          <h3 className="text-[13px] md:text-[14px] font-semibold leading-tight line-clamp-2" style={{ color: "#f0ead8" }}>
            {product.title}
          </h3>

          {/* Prix */}
          <div className="flex items-baseline gap-1.5 pt-1.5" style={{ borderTop: "1px solid rgba(197,165,90,0.18)" }}>
            {hasPromo ? (
              <>
                <span className="text-[10px] line-through" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {product.price.toLocaleString("fr-FR")}
                </span>
                <span className="text-[14px] font-bold" style={{ color: GOLD }}>
                  {product.promo_price.toLocaleString("fr-FR")}
                  <span className="text-[8px] font-normal ml-0.5" style={{ color: "rgba(200,168,75,0.60)" }}>FCFA</span>
                </span>
              </>
            ) : (
              <span className="text-[14px] font-bold" style={{ color: "#f0ead8" }}>
                {product.price.toLocaleString("fr-FR")}
                <span className="text-[8px] font-normal ml-0.5" style={{ color: "rgba(240,234,216,0.48)" }}>FCFA</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

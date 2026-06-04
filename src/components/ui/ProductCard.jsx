/**
 * ProductCard — Fond brun chaud, titre gold animé luisant, VIP en haut image
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CARD_BG = "linear-gradient(160deg, #38311f 0%, #2a2416 100%)";
const CARD_BORDER = "1px solid rgba(197,165,90,0.30)";
const CARD_BORDER_HOVER = "1px solid rgba(212,186,120,0.65)";
const GOLD = "#C8A84B";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

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
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-400"
      style={{
        background: CARD_BG,
        border: hovered ? CARD_BORDER_HOVER : CARD_BORDER,
        boxShadow: hovered
          ? "0 8px 40px rgba(197,165,90,0.22), 0 2px 8px rgba(0,0,0,0.5)"
          : "0 2px 16px rgba(0,0,0,0.45)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ---- Image ---- */}
      <Link to={`/product/${product.id}`} className="relative w-full aspect-square block overflow-hidden">
        <img
          src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Gradient bas */}
        <div
          className="absolute inset-0 transition-opacity duration-400"
          style={{
            background: "linear-gradient(to top, rgba(30,22,10,0.65) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0.3,
          }}
        />

        {/* Badges en haut gauche : badge produit + VIP empilés */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className="px-2 py-[3px] text-[8px] uppercase tracking-[0.14em] font-bold rounded-full"
              style={{ background: GOLD, color: "#0c0a07" }}
            >
              {product.badge}
            </span>
          )}
          {product.is_vip && (
            <span
              className="inline-flex items-center gap-0.5 text-[7px] uppercase tracking-[0.15em] font-bold px-2 py-[3px] rounded-full"
              style={{
                background: "rgba(197,165,90,0.22)",
                color: GOLD,
                border: "1px solid rgba(197,165,90,0.50)",
                backdropFilter: "blur(4px)",
              }}
            >
              ★ VIP
            </span>
          )}
        </div>

        {/* Badge promo % — haut droite */}
        {hasPromo && (
          <span
            className="absolute top-2.5 right-2.5 text-[8px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#e53e3e", color: "#fff" }}
          >
            -{Math.round((1 - product.promo_price / product.price) * 100)}%
          </span>
        )}

        {/* Bouton quick-add */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-2.5 right-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center
            transition-all duration-300 active:scale-95
            opacity-100 md:opacity-0 md:group-hover:opacity-100`}
          style={justAdded
            ? { background: "#22c55e", color: "#fff" }
            : { background: "rgba(12,10,7,0.82)", backdropFilter: "blur(6px)", color: "rgba(255,255,255,0.9)" }
          }
          aria-label="Ajouter au panier"
        >
          {justAdded
            ? <Check size={13} strokeWidth={2.5} />
            : <ShoppingCart size={13} strokeWidth={1.8} />
          }
        </button>
      </Link>

      {/* ---- Infos ---- */}
      <div
        className="px-3.5 pt-3 pb-4 flex flex-col"
        style={{ borderTop: "1px solid rgba(197,165,90,0.18)" }}
      >
        {/* Catégorie */}
        <p
          className="text-[8px] uppercase tracking-[0.22em] font-bold mb-1.5"
          style={{ color: "rgba(197,165,90,0.80)" }}
        >
          {product.category_name || product.category || ""}
        </p>

        {/* Titre — gold luisant animé */}
        <h3 className="text-gold-shine text-[14px] leading-snug line-clamp-2">
          {product.title}
        </h3>

        {/* Swatches variantes */}
        {product.variant_types && product.variant_types.length > 0 && (() => {
          const imgType = product.variant_types.find(t => t.options?.some(o => o.image));
          if (!imgType) return null;
          const swatches = imgType.options.filter(o => o.image).slice(0, 4);
          const extra = imgType.options.filter(o => o.image).length - 4;
          return (
            <div className="flex items-center gap-1 mt-2">
              {swatches.map(opt => (
                <img key={opt.id} src={opt.image} alt={opt.name} title={opt.name}
                  className="w-4 h-4 rounded-full object-cover"
                  style={{ border: "1px solid rgba(197,165,90,0.30)" }} />
              ))}
              {extra > 0 && <span className="text-[9px] ml-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>+{extra}</span>}
            </div>
          );
        })()}

        {/* Prix */}
        <div
          className="flex items-baseline gap-2 mt-3 pt-2.5"
          style={{ borderTop: "1px solid rgba(197,165,90,0.15)" }}
        >
          {hasPromo ? (
            <>
              <span className="text-[11px] line-through" style={{ color: "rgba(255,255,255,0.38)" }}>
                {product.price.toLocaleString("fr-FR")}
              </span>
              <span className="text-[16px] font-bold" style={{ color: GOLD }}>
                {product.promo_price.toLocaleString("fr-FR")}
                <span className="text-[9px] font-normal ml-0.5" style={{ color: "rgba(197,165,90,0.65)" }}>FCFA</span>
              </span>
            </>
          ) : (
            <span className="text-[16px] font-bold" style={{ color: "#f0ead8" }}>
              {product.price.toLocaleString("fr-FR")}
              <span className="text-[9px] font-normal ml-0.5" style={{ color: "rgba(240,234,216,0.55)" }}>FCFA</span>
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

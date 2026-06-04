/**
 * ProductCard — Card entièrement carrée, infos en overlay bas
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
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-xl overflow-hidden"
      style={{
        aspectRatio: "1 / 1",
        border: "1px solid rgba(197,165,90,0.22)",
      }}
    >
      {/* ---- Image plein format ---- */}
      <Link to={`/product/${product.id}`} className="absolute inset-0 block">
        <img
          src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
      </Link>

      {/* Gradient bas pour lisibilité du texte */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)",
        }}
      />

      {/* ---- Badges haut gauche ---- */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {product.badge && (
          <span
            className="px-2 py-[3px] text-[8px] uppercase tracking-[0.12em] font-bold rounded-full"
            style={{ background: GOLD, color: "#0c0a07" }}
          >
            {product.badge}
          </span>
        )}
        {product.is_vip && (
          <span
            className="inline-flex items-center gap-0.5 text-[7px] uppercase tracking-[0.12em] font-bold px-2 py-[3px] rounded-full"
            style={{
              background: "rgba(0,0,0,0.70)",
              color: GOLD,
              border: `1px solid ${GOLD}`,
              backdropFilter: "blur(4px)",
            }}
          >
            ★ VIP
          </span>
        )}
      </div>

      {/* Badge promo haut droite */}
      {hasPromo && (
        <span
          className="absolute top-2 right-2 z-10 text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "#e53e3e", color: "#fff" }}
        >
          -{Math.round((1 - product.promo_price / product.price) * 100)}%
        </span>
      )}

      {/* ---- Infos en overlay bas ---- */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3 pt-6 pointer-events-none">
        {/* Catégorie */}
        <p className="text-[8px] uppercase tracking-[0.18em] font-semibold mb-0.5" style={{ color: GOLD }}>
          {product.category_name || product.category || ""}
        </p>

        {/* Nom */}
        <h3
          className="text-[13px] md:text-[14px] font-semibold leading-tight line-clamp-2"
          style={{ color: "#f0ead8" }}
        >
          {product.title}
        </h3>

        {/* Prix */}
        <div className="flex items-baseline gap-1.5 mt-1.5">
          {hasPromo ? (
            <>
              <span className="text-[10px] line-through" style={{ color: "rgba(255,255,255,0.40)" }}>
                {product.price.toLocaleString("fr-FR")}
              </span>
              <span className="text-[14px] font-bold" style={{ color: GOLD }}>
                {product.promo_price.toLocaleString("fr-FR")}
                <span className="text-[8px] font-normal ml-0.5" style={{ color: "rgba(200,168,75,0.70)" }}>FCFA</span>
              </span>
            </>
          ) : (
            <span className="text-[14px] font-bold" style={{ color: "#f0ead8" }}>
              {product.price.toLocaleString("fr-FR")}
              <span className="text-[8px] font-normal ml-0.5" style={{ color: "rgba(240,234,216,0.55)" }}>FCFA</span>
            </span>
          )}
        </div>
      </div>

      {/* Bouton panier bas droite */}
      <button
        onClick={handleQuickAdd}
        className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        style={justAdded
          ? { background: "#22c55e", color: "#fff" }
          : { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", color: "#fff", border: "1px solid rgba(255,255,255,0.20)" }
        }
        aria-label="Ajouter au panier"
      >
        {justAdded ? <Check size={12} strokeWidth={2.5} /> : <ShoppingCart size={12} strokeWidth={1.8} />}
      </button>
    </motion.div>
  );
}

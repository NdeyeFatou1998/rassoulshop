/**
 * ProductCard — Card entièrement carrée, image 70%, info 30%
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
      style={{
        aspectRatio: "1 / 1",
        background: "#111010",
        border: "0.5px solid rgba(255,255,255,0.18)",
      }}
    >
      {/* Image — 68% de la hauteur */}
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full overflow-hidden flex-shrink-0"
        style={{ height: "68%" }}
      >
        <img
          src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />

        {/* Badges haut gauche */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-1.5 py-[2px] text-[7px] uppercase tracking-[0.10em] font-bold rounded-full"
              style={{ background: GOLD, color: "#0c0a07" }}>
              {product.badge}
            </span>
          )}
          {product.is_vip && (
            <span className="text-[7px] uppercase font-bold px-1.5 py-[2px] rounded-full"
              style={{ background: "rgba(0,0,0,0.70)", color: GOLD, border: `1px solid ${GOLD}` }}>
              ★ VIP
            </span>
          )}
        </div>

        {/* Badge promo */}
        {hasPromo && (
          <span className="absolute top-1.5 right-1.5 z-10 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "#e53e3e", color: "#fff" }}>
            -{Math.round((1 - product.promo_price / product.price) * 100)}%
          </span>
        )}

        {/* Bouton panier */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-1.5 right-1.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100"
          style={justAdded
            ? { background: "#22c55e", color: "#fff" }
            : { background: "rgba(0,0,0,0.75)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }
          }
          aria-label="Ajouter au panier"
        >
          {justAdded ? <Check size={11} strokeWidth={2.5} /> : <ShoppingCart size={11} strokeWidth={1.8} />}
        </button>
      </Link>

      {/* Infos — 32% de la hauteur, tout centré */}
      <div
        className="flex flex-col items-center justify-center gap-0.5 px-2"
        style={{ height: "32%", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Catégorie */}
        <p className="text-[7px] uppercase tracking-[0.15em] font-bold text-center" style={{ color: GOLD }}>
          {product.category_name || product.category || ""}
        </p>

        {/* Nom — mini-card contour blanc */}
        <div
          className="w-full rounded px-2 py-1 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.45)",
          }}
        >
          <h3 className="text-[10px] md:text-[11px] font-semibold leading-tight line-clamp-1" style={{ color: "#f0ead8" }}>
            {product.title}
          </h3>
        </div>

        {/* Prix */}
        <p className="text-[11px] md:text-[12px] font-bold text-center" style={{ color: GOLD }}>
          {(hasPromo ? product.promo_price : product.price).toLocaleString("fr-FR")} FCFA
        </p>
      </div>
    </motion.article>
  );
}

/**
 * ProductCard — Image plein cadre + légende compacte sous l'image
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const GOLD = "#D7A12B";

export default function ProductCard({ product, index = 0, lightBackground = false }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const hasPromo = product.promo_active && product.promo_price;
  const displayPrice = hasPromo ? product.promo_price : product.price;
  const category = product.category_name || product.category;

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
      className="group flex flex-col w-full overflow-hidden rounded-2xl transition-shadow duration-300"
      style={{
        background: lightBackground ? "#FFFBF5" : "#111010",
        border: lightBackground
          ? "0.5px solid rgba(215,161,43,0.18)"
          : "0.5px solid rgba(255,255,255,0.12)",
        boxShadow: lightBackground
          ? "0 4px 18px -8px rgba(107,84,48,0.18)"
          : "0 10px 30px -12px rgba(0,0,0,0.7)",
      }}
    >
      {/* Zone image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0e0d0c]">
        <Link to={`/product/${product.id}`} className="absolute inset-0 block">
          <img
            src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
          {category && (
            <span
              className="px-1.5 py-[2px] text-[7px] uppercase tracking-[0.14em] font-bold rounded-full backdrop-blur-sm max-w-[130px] truncate"
              style={{ background: "rgba(0,0,0,0.55)", color: GOLD, border: `1px solid ${GOLD}` }}
            >
              {category}
            </span>
          )}
          {product.is_vip && (
            <span
              className="text-[7px] uppercase font-bold px-1.5 py-[2px] rounded-full backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.55)", color: GOLD, border: `1px solid ${GOLD}` }}
            >
              ★ VIP
            </span>
          )}
        </div>

        {hasPromo && (
          <span
            className="absolute top-2 right-2 z-10 text-[8px] font-bold px-1.5 py-[2px] rounded-full pointer-events-none"
            style={{ background: "#e53e3e", color: "#fff" }}
          >
            -{Math.round((1 - product.promo_price / product.price) * 100)}%
          </span>
        )}

        {/* Ajout panier — coin bas droit */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 group-hover:scale-105"
          style={{
            background: justAdded ? "rgba(34,197,94,0.85)" : "rgba(8,6,4,0.72)",
            color: justAdded ? "#fff" : GOLD,
            border: `1px solid ${justAdded ? "rgba(34,197,94,0.5)" : "rgba(215,161,43,0.45)"}`,
            boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
          }}
          aria-label="Ajouter au panier"
        >
          {justAdded ? <Check size={15} strokeWidth={2.4} /> : <ShoppingCart size={15} strokeWidth={1.9} />}
        </button>
      </div>

      {/* Légende compacte sous l'image */}
      <Link
        to={`/product/${product.id}`}
        className="block px-2.5 py-2 text-center transition-colors duration-300"
        style={{
          borderTop: lightBackground
            ? "1px solid rgba(215,161,43,0.14)"
            : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h3
          className={`product-card-title-below line-clamp-1 ${
            lightBackground ? "product-card-title-below--light" : ""
          }`}
        >
          {product.title}
        </h3>
        <div className="flex items-baseline justify-center gap-1.5 mt-0.5 min-h-[1.15rem]">
          <span className="product-card-price-below leading-none whitespace-nowrap">
            {Number(displayPrice).toLocaleString("fr-FR")}
            <span className="product-card-price-unit"> FCFA</span>
          </span>
          {hasPromo && (
            <span
              className={`text-[10px] line-through leading-none ${
                lightBackground ? "text-neutral-400" : "text-white/30"
              }`}
            >
              {Number(product.price).toLocaleString("fr-FR")}
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

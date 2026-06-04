/**
 * ProductCard — Format portrait 4/5, image max, texte Playfair/Inter
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
      className="group flex flex-col w-full rounded-2xl overflow-hidden"
      style={{
        aspectRatio: "4 / 5",
        background: "#111010",
        border: "0.5px solid rgba(255,255,255,0.18)",
      }}
    >
      {/* Image — occupe l'espace restant */}
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full flex-1 min-h-0 overflow-hidden"
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
            <span className="px-1.5 py-[2px] text-[8px] uppercase tracking-[0.10em] font-bold rounded-full"
              style={{ background: GOLD, color: "#0c0a07" }}>
              {product.badge}
            </span>
          )}
          {product.is_vip && (
            <span className="text-[8px] uppercase font-bold px-1.5 py-[2px] rounded-full"
              style={{ background: "rgba(0,0,0,0.70)", color: GOLD, border: `1px solid ${GOLD}` }}>
              ★ VIP
            </span>
          )}
        </div>

        {/* Badge promo */}
        {hasPromo && (
          <span className="absolute top-1.5 right-1.5 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "#e53e3e", color: "#fff" }}>
            -{Math.round((1 - product.promo_price / product.price) * 100)}%
          </span>
        )}

        {/* Catégorie sur l'image */}
        {(product.category_name || product.category) && (
          <div className="absolute bottom-0 left-0 right-0 z-10 px-2 py-1.5 bg-gradient-to-t from-black/92 via-black/50 to-transparent pointer-events-none">
            <p className="product-card-category text-center line-clamp-1">
              {product.category_name || product.category}
            </p>
          </div>
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

      {/* Infos — hauteur selon le contenu */}
      <div
        className="flex flex-shrink-0 flex-col items-center justify-center gap-1 px-2.5 py-2 w-full"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="product-card-title w-full text-center line-clamp-2 px-0.5">
          {product.title}
        </h3>
        <p className="product-card-price mt-1 text-center shrink-0 leading-none">
          {(hasPromo ? product.promo_price : product.price).toLocaleString("fr-FR")} FCFA
        </p>
      </div>
    </motion.article>
  );
}

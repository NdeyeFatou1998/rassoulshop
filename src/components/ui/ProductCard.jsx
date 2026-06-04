/**
 * ProductCard — Design éditorial plein cadre
 * L'image remplit toute la carte ; nom, catégorie et prix posés sur un voile dégradé.
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
      className="group relative w-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "4 / 5",
        background: "#111010",
        border: "0.5px solid rgba(255,255,255,0.14)",
        boxShadow: "0 10px 30px -12px rgba(0,0,0,0.7)",
      }}
    >
      <Link to={`/product/${product.id}`} className="absolute inset-0 block">
        {/* Image plein cadre */}
        <img
          src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />

        {/* Voile dégradé pour la lisibilité du texte en bas */}
        <div
          className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(6,5,3,0.94) 0%, rgba(6,5,3,0.78) 28%, rgba(6,5,3,0.30) 62%, transparent 100%)",
          }}
        />

        {/* Badges haut */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
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
              className="text-[8px] uppercase font-bold px-2 py-[3px] rounded-full backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.55)", color: GOLD, border: `1px solid ${GOLD}` }}
            >
              ★ VIP
            </span>
          )}
        </div>

        {hasPromo && (
          <span
            className="absolute top-2.5 right-2.5 z-10 text-[9px] font-bold px-2 py-[3px] rounded-full"
            style={{ background: "#e53e3e", color: "#fff" }}
          >
            -{Math.round((1 - product.promo_price / product.price) * 100)}%
          </span>
        )}

        {/* Bloc texte éditorial en bas */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-3.5 pb-3.5 pt-6">
          {category && (
            <p className="product-card-category mb-1.5 line-clamp-1">{category}</p>
          )}

          <h3 className="product-card-title line-clamp-2 mb-2">{product.title}</h3>

          <div className="flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="product-card-price leading-none">
                {Number(displayPrice).toLocaleString("fr-FR")} FCFA
              </span>
              {hasPromo && (
                <span className="text-[11px] text-white/45 line-through leading-none">
                  {Number(product.price).toLocaleString("fr-FR")}
                </span>
              )}
            </div>

            {/* Bouton ajout panier */}
            <button
              onClick={handleQuickAdd}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90"
              style={
                justAdded
                  ? { background: "#22c55e", color: "#fff" }
                  : {
                      background: "rgba(200,168,75,0.16)",
                      color: GOLD,
                      border: "1px solid rgba(200,168,75,0.55)",
                      backdropFilter: "blur(6px)",
                    }
              }
              onMouseEnter={(e) => {
                if (!justAdded) {
                  e.currentTarget.style.background = GOLD;
                  e.currentTarget.style.color = "#0c0a07";
                }
              }}
              onMouseLeave={(e) => {
                if (!justAdded) {
                  e.currentTarget.style.background = "rgba(200,168,75,0.16)";
                  e.currentTarget.style.color = GOLD;
                }
              }}
              aria-label="Ajouter au panier"
            >
              {justAdded ? (
                <Check size={15} strokeWidth={2.5} />
              ) : (
                <ShoppingCart size={15} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

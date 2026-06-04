/**
 * ProductCard — Carte produit premium
 * Fond sable chaud, titre en gold gras, prix blanc bold
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

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
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col rounded-2xl overflow-hidden
                 bg-[#211e17] border border-gold/[0.18]
                 hover:border-gold/50 hover:shadow-[0_6px_36px_rgba(197,165,90,0.18)]
                 transition-all duration-400"
    >
      {/* ---- Image ---- */}
      <Link to={`/product/${product.id}`} className="relative w-full aspect-square block overflow-hidden">
        <img
          src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Gradient bas subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211e17]/70 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Badge produit */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 px-2 py-[3px] text-[8px] uppercase tracking-[0.14em] font-bold bg-gold text-[#0c0a07] rounded-full">
            {product.badge}
          </span>
        )}

        {/* Badge promo % */}
        {hasPromo && (
          <span className="absolute top-2.5 right-2.5 text-[8px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shadow-md">
            -{Math.round((1 - product.promo_price / product.price) * 100)}%
          </span>
        )}

        {/* Bouton quick-add */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-2.5 right-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center
            transition-all duration-300 active:scale-95
            opacity-100 md:opacity-0 md:group-hover:opacity-100 ${
              justAdded
                ? "bg-green-500 text-white scale-110"
                : "bg-[#0c0a07]/80 backdrop-blur-sm text-white hover:bg-gold hover:text-[#0c0a07]"
            }`}
          aria-label="Ajouter au panier"
        >
          {justAdded
            ? <Check size={13} strokeWidth={2.5} />
            : <ShoppingCart size={13} strokeWidth={1.8} />
          }
        </button>
      </Link>

      {/* ---- Infos ---- */}
      <div className="px-3.5 pt-3 pb-4 flex flex-col bg-gradient-to-b from-[#211e17] to-[#1a1710] border-t border-gold/[0.12]">

        {/* Catégorie */}
        <p className="text-[8px] uppercase tracking-[0.22em] text-gold/80 font-bold mb-1.5">
          {product.category_name || product.category || ""}
        </p>

        {/* Titre — gold gras */}
        <h3 className="text-[13px] font-bold text-gold leading-snug line-clamp-2
                       group-hover:text-gold-light transition-colors duration-300">
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
                  className="w-4 h-4 rounded-full object-cover border border-gold/25" />
              ))}
              {extra > 0 && <span className="text-[9px] text-white/50 ml-0.5">+{extra}</span>}
            </div>
          );
        })()}

        {/* Tag VIP */}
        {product.is_vip && (
          <span className="self-start mt-2 inline-flex items-center gap-1 text-[7px] uppercase tracking-[0.18em] font-bold bg-gold/20 text-gold border border-gold/40 px-2 py-[3px] rounded-full">
            ★ VIP
          </span>
        )}

        {/* Prix */}
        <div className="flex items-baseline gap-2 mt-3 pt-2.5 border-t border-gold/[0.12]">
          {hasPromo ? (
            <>
              <span className="text-[11px] text-white/40 line-through">
                {product.price.toLocaleString("fr-FR")}
              </span>
              <span className="text-[15px] font-bold text-gold leading-none">
                {product.promo_price.toLocaleString("fr-FR")}
                <span className="text-[9px] font-normal ml-0.5 text-gold/70">FCFA</span>
              </span>
            </>
          ) : (
            <span className="text-[15px] font-bold text-white leading-none">
              {product.price.toLocaleString("fr-FR")}
              <span className="text-[9px] font-normal text-white/55 ml-0.5">FCFA</span>
            </span>
          )}
        </div>

      </div>
    </motion.article>
  );
}

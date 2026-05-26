/**
 * Composant ProductCard — Carte produit (fond blanc)
 * 
 * Design premium sur fond clair :
 * - Carte blanche avec ombre subtile et coins arrondis
 * - Image avec zoom au hover
 * - Badge gold en haut à gauche
 * - Infos : catégorie or, titre sombre, prix sombre
 * - Bouton panier : visible mobile, hover desktop
 * - Lift de 3px + ombre renforcée au hover
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  /* Promo active — l'API retourne les champs en snake_case depuis PostgreSQL */
  const hasPromo = product.promo_active && product.promo_price;

  /** Ajout rapide au panier */
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
                 bg-[#0f0f0e] border border-white/[0.07]
                 hover:border-gold/25 hover:shadow-[0_0_24px_rgba(197,165,90,0.08)]
                 transition-all duration-400"
    >
      {/* ---- Image (haut de la card) ---- */}
      <Link to={`/product/${product.id}`} className="relative w-full aspect-square block overflow-hidden">
        <img
          src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Gradient bas au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Badge produit */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 px-2 py-[3px] text-[7px] uppercase tracking-[0.16em] font-bold bg-gold text-noir-950 rounded-full">
            {product.badge}
          </span>
        )}

        {/* Badge promo % */}
        {hasPromo && (
          <span className="absolute top-2.5 right-2.5 text-[7px] font-bold bg-red-500/80 text-white px-1.5 py-0.5 rounded-full">
            -{Math.round((1 - product.promo_price / product.price) * 100)}%
          </span>
        )}

        {/* Bouton quick-add */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center
            transition-all duration-300 active:scale-95
            opacity-100 md:opacity-0 md:group-hover:opacity-100 ${
              justAdded
                ? "bg-green-500 text-white scale-110"
                : "bg-noir-950/75 backdrop-blur-sm text-white/70 hover:bg-gold hover:text-noir-950"
            }`}
          aria-label="Ajouter au panier"
        >
          {justAdded
            ? <Check size={12} strokeWidth={2.5} />
            : <ShoppingCart size={12} strokeWidth={1.8} />
          }
        </button>
      </Link>

      {/* ---- Infos (bas de la card, dans le même conteneur) ---- */}
      <div className="px-3.5 pt-3 pb-3.5 flex flex-col border-t border-white/[0.05]">

        {/* Catégorie */}
        <p className="text-[8px] uppercase tracking-[0.22em] text-gold/70 font-semibold mb-1.5">
          {product.category_name || product.category || ""}
        </p>

        {/* Titre */}
        <h3 className="text-[12px] font-medium text-white/90 leading-snug line-clamp-2
                       group-hover:text-white transition-colors duration-300">
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
                  className="w-4 h-4 rounded-full object-cover border border-white/10" />
              ))}
              {extra > 0 && <span className="text-[9px] text-white/25 ml-0.5">+{extra}</span>}
            </div>
          );
        })()}

        {/* Tag VIP — visible uniquement pour les boîtes marquées VIP */}
        {product.is_vip && (
          <span className="self-start mt-2 inline-flex items-center gap-1 text-[7px] uppercase tracking-[0.18em] font-bold bg-gold/15 text-gold border border-gold/30 px-2 py-[3px] rounded-full">
            ★ VIP
          </span>
        )}

        {/* Prix */}
        <div className="flex items-baseline gap-1.5 mt-2.5 pt-2.5 border-t border-white/[0.05]">
          {hasPromo ? (
            <>
              <span className="text-[10px] text-white/25 line-through">
                {product.price.toLocaleString("fr-FR")}
              </span>
              <span className="text-[13px] font-bold text-gold leading-none">
                {product.promo_price.toLocaleString("fr-FR")}
                <span className="text-[8px] font-normal ml-0.5">FCFA</span>
              </span>
            </>
          ) : (
            <span className="text-[13px] font-semibold text-white/90 leading-none">
              {product.price.toLocaleString("fr-FR")}
              <span className="text-[8px] font-normal text-white/30 ml-0.5">FCFA</span>
            </span>
          )}
        </div>

      </div>
    </motion.article>
  );
}

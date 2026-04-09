/**
 * Composant ProductCard - Carte produit premium cliquable
 * 
 * Design v2 — cohérent web & mobile :
 * - Clic sur la card → page détail produit (/product/:id)
 * - Icône panier TOUJOURS visible sur mobile (pas de hover sur tactile)
 * - Icône panier apparaît au hover sur desktop
 * - Animation fly-to-cart améliorée avec courbe de Bézier
 * - Card premium avec lift au hover (desktop)
 * - Badge animé, étoile toujours visible, prix FCFA
 * - Micro-interactions : press effect sur le bouton panier
 * - Bouton "Épuisé" rouge quand stock = 0
 * - Prix promo avec prix barré si promo active
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Check, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, flyTargetRef } = useCart();
  const imgRef = useRef(null);
  const [justAdded, setJustAdded] = useState(false);

  /* Déterminer si le produit est en rupture de stock */
  const isSoldOut = product.stock !== undefined && product.stock <= 0;

  /* Déterminer si une promo est active */
  const hasPromo = product.promoActive && product.promoPrice;

  /**
   * Ajouter au panier avec animation fly-to-cart améliorée
   * Clone de l'image qui rétrécit et vole vers le panier flottant
   */
  function handleQuickAdd(e) {
    /* Empêcher la navigation vers la page détail */
    e.preventDefault();
    e.stopPropagation();

    /* Feedback visuel immédiat sur le bouton */
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);

    /* Animation fly : clone miniature de l'image vers le panier */
    if (imgRef.current && flyTargetRef.current) {
      const imgRect = imgRef.current.getBoundingClientRect();
      const cartRect = flyTargetRef.current.getBoundingClientRect();

      /* Créer un petit clone carré (miniature) */
      const flyEl = document.createElement("div");
      flyEl.style.cssText = `
        position: fixed;
        top: ${imgRect.top + imgRect.height * 0.3}px;
        left: ${imgRect.left + imgRect.width * 0.3}px;
        width: ${imgRect.width * 0.4}px;
        height: ${imgRect.width * 0.4}px;
        border-radius: 50%;
        overflow: hidden;
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 8px 32px rgba(201,169,110,0.4);
        transition: all 0.65s cubic-bezier(0.32, 0, 0.07, 1);
      `;
      const flyImg = document.createElement("img");
      flyImg.src = product.image;
      flyImg.style.cssText = "width:100%;height:100%;object-fit:cover;";
      flyEl.appendChild(flyImg);
      document.body.appendChild(flyEl);
      flyEl.offsetHeight; /* Forcer le reflow */

      /* Animer vers la position du panier flottant */
      flyEl.style.top = `${cartRect.top + cartRect.height / 2 - 16}px`;
      flyEl.style.left = `${cartRect.left + cartRect.width / 2 - 16}px`;
      flyEl.style.width = "32px";
      flyEl.style.height = "32px";
      flyEl.style.opacity = "0";
      flyEl.style.boxShadow = "0 0 20px rgba(201,169,110,0.6)";

      setTimeout(() => flyEl.remove(), 700);
    }

    addToCart(product, 1);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative card-premium"
    >
      {/* ---- Lien vers la page détail (toute la card est cliquable) ---- */}
      <Link to={`/product/${product.id}`} className="block">
        {/* Zone image avec overlay */}
        <div ref={imgRef} className="relative aspect-[3/4] overflow-hidden bg-noir-700">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover img-zoom"
          />

          {/* Overlay gradient — léger permanent, plus fort au hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 via-transparent to-transparent" />
          <div className="absolute inset-0 overlay-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge animé (si présent) */}
          {product.badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06 + 0.3 }}
              className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] font-bold bg-gold text-noir-900 rounded-full shadow-[0_2px_12px_rgba(201,169,110,0.3)]"
            >
              {product.badge}
            </motion.span>
          )}

          {/* Note étoile — toujours visible en bas à gauche */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-noir-900/60 backdrop-blur-sm">
            <Star size={10} className="text-gold fill-gold" />
            <span className="text-[10px] text-cream/90 font-semibold">
              {Number(product.rating).toFixed(1)}
            </span>
          </div>
        </div>

        {/* ---- Infos produit ---- */}
        <div className="p-3 md:p-4 space-y-1">
          {/* Catégorie en micro-label */}
          <p className="text-[9px] uppercase tracking-[0.15em] text-gold/60 font-medium">
            {product.category}
          </p>
          {/* Titre du produit */}
          <h3 className="text-[13px] md:text-sm font-medium text-cream/90 leading-snug line-clamp-1 group-hover:text-cream transition-colors duration-300">
            {product.title}
          </h3>
          {/* Prix en FCFA — avec support promo (prix barré + prix réduit) */}
          <div className="flex items-center gap-2">
            {hasPromo ? (
              <>
                <p className="text-[11px] md:text-xs text-muted line-through">
                  {product.price.toLocaleString("fr-FR")}
                </p>
                <p className="text-[13px] md:text-sm font-bold text-red-400">
                  {product.promoPrice.toLocaleString("fr-FR")} <span className="text-[9px] font-normal">FCFA</span>
                </p>
              </>
            ) : (
              <p className="text-[13px] md:text-sm font-bold text-cream">
                {product.price.toLocaleString("fr-FR")} <span className="text-[9px] font-normal text-muted">FCFA</span>
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* ---- Bouton panier rapide / Épuisé ----
           Si stock = 0 : badge "Épuisé" rouge, désactivé
           Sinon : bouton panier normal
           MOBILE : toujours visible (opacity-100)
           DESKTOP : apparaît au hover avec transition slide-up
      */}
      {isSoldOut ? (
        <div
          className="absolute bottom-[72px] md:bottom-[76px] right-2.5 px-2.5 h-9 rounded-full flex items-center justify-center gap-1 shadow-lg bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider opacity-100"
        >
          <XCircle size={12} />
          Épuisé
        </div>
      ) : (
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-[72px] md:bottom-[76px] right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-lg btn-press transition-all duration-300 opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 ${
            justAdded
              ? "bg-green-500 text-white scale-110"
              : "bg-gold text-noir-900 glow-gold-hover"
          }`}
          aria-label="Ajouter au panier"
        >
          {justAdded ? <Check size={14} strokeWidth={3} /> : <ShoppingBag size={14} strokeWidth={2.5} />}
        </button>
      )}
    </motion.article>
  );
}

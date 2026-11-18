/**
 * GiftBoxCard — Carte d'une box cadeau (même rendu que ProductCard premium)
 * Utilisée sur /gift-boxes et dans la grille accueil / boutique.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const GIFT_BOX_DEFAULT_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#faf7f2"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <rect x="70" y="70" width="660" height="660" rx="48" fill="#ffffff" stroke="#e8dfd0" stroke-width="10"/>
  <path d="M400 245c-42-62-145-42-145 36 0 54 52 89 145 129 93-40 145-75 145-129 0-78-103-98-145-36z" fill="#D7A12B" opacity="0.35"/>
  <text x="400" y="560" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#1a1612" text-anchor="middle">Coffret</text>
</svg>
`)}`;

export default function GiftBoxCard({ box, index = 0, showBoxBadge = false }) {
  const href = `/gift-boxes/${box.id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col w-full overflow-hidden product-card-premium rounded-xl transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <Link to={href} className="absolute inset-0 block">
          <img
            src={box.image || GIFT_BOX_DEFAULT_IMG}
            alt={box.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
            onError={(e) => {
              e.currentTarget.src = GIFT_BOX_DEFAULT_IMG;
            }}
          />
        </Link>
        <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1 pointer-events-none">
          {showBoxBadge && (
            <span className="text-[8px] uppercase tracking-[0.12em] font-extrabold px-2 py-0.5 rounded-sm bg-[#0a0a0a] text-[#D7A12B]">
              Box cadeau
            </span>
          )}
          {box.is_customizable && (
            <span className="text-[8px] uppercase tracking-[0.12em] font-extrabold px-2 py-0.5 rounded-sm bg-[#D7A12B] text-[#0a0a0a]">
              Personnalisable
            </span>
          )}
        </div>
      </div>
      <Link to={href} className="block px-2.5 py-2.5 text-center product-card-caption-premium">
        <h3 className="product-card-title-below product-card-title-below--premium line-clamp-1">{box.name}</h3>
        <span className="product-card-price-below product-card-price-below--premium leading-none whitespace-nowrap">
          {(Number(box.price) || 0).toLocaleString("fr-FR")}
          <span className="product-card-price-unit-below"> FCFA</span>
        </span>
      </Link>
    </motion.article>
  );
}

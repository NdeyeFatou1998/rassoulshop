/**
 * Composant PromoBanner — Bannière de promotions défilante avec minuteur
 *
 * Affiche les produits en promo active depuis l'API :
 * - Défilement automatique (marquee) des promos
 * - Minuteur compte à rebours pour chaque promo (jours, heures, minutes, secondes)
 * - Design doré premium cohérent avec le site
 * - Se masque automatiquement si aucune promo active
 *
 * Placement : en haut de la page Home, avant le Hero
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPromos } from "../../services/adminApi";

/** Composant individuel pour une promo — texte simple et discret */
function PromoItem({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="inline-flex items-center gap-1.5 mx-8 whitespace-nowrap group"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A55A]/80 group-hover:text-[#C5A55A] transition-colors">
        {product.title}
      </span>
      <span className="text-[10px] text-[#555] line-through">
        {product.price?.toLocaleString("fr-FR")}F
      </span>
      <span className="text-[10px] text-[#C5A55A] font-medium">
        {product.promoPrice?.toLocaleString("fr-FR")}F
      </span>
      <span className="text-[#333] mx-4">•</span>
    </Link>
  );
}

export default function PromoBanner() {
  const [promos, setPromos] = useState([]);

  /** Charger les promos actives au montage */
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPromos();
        /* Filtrer les promos non expirées */
        const active = (data || []).filter((p) => {
          if (!p.promoEndsAt) return true;
          return new Date(p.promoEndsAt).getTime() > Date.now();
        });
        setPromos(active);
      } catch {
        /* Silencieux si l'API est indisponible */
      }
    }
    load();
  }, []);

  /* Ne rien afficher si aucune promo */
  if (promos.length === 0) return null;

  return (
    <div className="relative z-40 bg-[#0a0a0a] border-b border-[#1a1a1a] overflow-hidden h-7 flex items-center">
      {/* Marquee défilant — fine barre minimaliste */}
      <div className="marquee-track flex whitespace-nowrap">
        {promos.map((p) => (
          <PromoItem key={`a-${p.id}`} product={p} />
        ))}
        {promos.map((p) => (
          <PromoItem key={`b-${p.id}`} product={p} />
        ))}
        {promos.length < 4 && promos.map((p) => (
          <PromoItem key={`c-${p.id}`} product={p} />
        ))}
      </div>
    </div>
  );
}

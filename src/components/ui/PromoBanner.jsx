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
import { Clock, Flame } from "lucide-react";
import { fetchPromos } from "../../services/adminApi";

/**
 * useCountdown — Hook personnalisé pour le compte à rebours
 * Retourne { days, hours, minutes, seconds, isExpired }
 */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

/** Calcule le temps restant jusqu'à une date cible */
function calcTimeLeft(target) {
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
}

/** Composant individuel pour une promo avec minuteur */
function PromoItem({ product }) {
  const countdown = useCountdown(product.promoEndsAt);

  /** Formater un nombre sur 2 chiffres */
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <Link
      to={`/product/${product.id}`}
      className="inline-flex items-center gap-3 mx-6 md:mx-8 whitespace-nowrap group"
    >
      {/* Icône flamme */}
      <Flame size={12} className="text-red-400 flex-shrink-0" />

      {/* Nom du produit */}
      <span className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] group-hover:text-[#8b6914] transition-colors">
        {product.title}
      </span>

      {/* Prix barré + prix promo */}
      <span className="text-[10px] text-[#888] line-through">
        {product.price?.toLocaleString("fr-FR")} FCFA
      </span>
      <span className="text-[11px] font-bold text-red-600">
        {product.promoPrice?.toLocaleString("fr-FR")} FCFA
      </span>

      {/* Minuteur compte à rebours */}
      {!countdown.isExpired && (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#0a0a0a] text-[#D4AF37] px-2 py-0.5 rounded-full">
          <Clock size={9} />
          {countdown.days > 0 && `${countdown.days}j `}
          {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
        </span>
      )}

      {/* Séparateur visuel */}
      <span className="text-[#D4AF37]/40 mx-2">&mdash;</span>
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
    <div className="relative z-40 bg-gradient-to-r from-[#D4AF37] via-[#E0C055] to-[#D4AF37] border-b border-[#B8960F]/30 overflow-hidden">
      {/* Marquee défilant — double les items pour un scroll infini */}
      <div className="marquee-track flex whitespace-nowrap py-2">
        {/* Première copie */}
        {promos.map((p) => (
          <PromoItem key={`a-${p.id}`} product={p} />
        ))}
        {/* Seconde copie pour boucle infinie */}
        {promos.map((p) => (
          <PromoItem key={`b-${p.id}`} product={p} />
        ))}
        {/* Troisième copie si peu de promos */}
        {promos.length < 3 && promos.map((p) => (
          <PromoItem key={`c-${p.id}`} product={p} />
        ))}
      </div>
    </div>
  );
}

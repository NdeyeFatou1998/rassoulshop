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
      className="inline-flex items-center gap-2 mx-4 md:mx-6 whitespace-nowrap group"
    >
      {/* Icône flamme */}
      <Flame size={10} className="text-red-500 flex-shrink-0" />

      {/* Nom du produit */}
      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.12em] font-semibold text-[#0a0a0a] group-hover:text-[#6b5020] transition-colors">
        {product.title}
      </span>

      {/* Prix barré + prix promo */}
      <span className="text-[9px] text-[#666] line-through">
        {product.price?.toLocaleString("fr-FR")} F
      </span>
      <span className="text-[10px] font-bold text-red-700">
        {product.promoPrice?.toLocaleString("fr-FR")} F
      </span>

      {/* Minuteur compte à rebours */}
      {!countdown.isExpired && (
        <span className="inline-flex items-center gap-0.5 text-[9px] font-mono bg-[#0a0a0a]/80 text-[#C5A55A] px-1.5 py-px rounded-full">
          <Clock size={8} />
          {countdown.days > 0 && `${countdown.days}j `}
          {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
        </span>
      )}

      {/* Séparateur visuel */}
      <span className="text-[#A68B3C]/30 mx-1">·</span>
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
    <div className="relative z-40 bg-gradient-to-r from-[#C5A55A] via-[#D4BA78] to-[#C5A55A] border-b border-[#A68B3C]/20 overflow-hidden">
      {/* Marquee défilant — compact, discret */}
      <div className="marquee-track flex whitespace-nowrap py-1">
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

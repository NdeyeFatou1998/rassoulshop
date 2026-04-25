/**
 * FilterableProductGrid — Grille produits avec filtres catégories (squircles)
 *
 * Fonctionnement :
 * - Charge TOUS les produits en une seule requête API
 * - Filtre côté client selon la catégorie active (null = Tous)
 * - Catégories affichées comme des squircles avec image + contour doré tournant
 * - Le contour (conic-gradient) tourne en continu, plus vif sur l'actif
 * - Transitions animées sur la grille au changement de filtre
 *
 * Props :
 * - limit (number)           : produits max à charger (défaut: 80)
 * - defaultCategory (string) : catégorie active au chargement (défaut: null)
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import { useProducts } from "../../hooks/useProducts";

/* Squircle radius en px */
const R_OUT = 20; /* border-radius du contour tournant */
const R_IN  = 17; /* border-radius de l'image intérieure */

/* Catégories avec image représentative */
const CATEGORIES = [
  {
    label: "Tous",
    slug:  null,
    image: "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg",
  },
  {
    label: "Peluches",
    slug:  "peluches",
    image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.08.jpeg",
  },
  {
    label: "Montres",
    slug:  "montres",
    image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.58.jpeg",
  },
  {
    label: "Bijoux",
    slug:  "bijoux",
    image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.09.jpeg",
  },
  {
    label: "Sets Cadeau",
    slug:  "sets-cadeau",
    image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.10.jpeg",
  },
  {
    label: "Sacs",
    slug:  "sacs",
    image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.15.jpeg",
  },
  {
    label: "Accessoires",
    slug:  "accessoires",
    image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.12.jpeg",
  },
];

/* ---- Squircle individuel ---- */
function CategorySquircle({ label, image, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-center gap-3 group focus:outline-none"
    >
      {/* Conteneur squircle */}
      <div
        className={`relative transition-transform duration-300 ${
          isActive ? "scale-110" : "scale-100 group-hover:scale-[1.05]"
        }`}
        style={{ width: 68, height: 68 }}
      >
        {/* ---- Couche contour doré tournant ---- */}
        {/* conic-gradient simulant un arc lumineux (~35°) qui tourne */}
        <div
          className={isActive ? "spin-border-fast" : "spin-border-slow"}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: R_OUT,
            /* Arc doré court → effet "comète lumineuse" */
            background: isActive
              ? "conic-gradient(from 0deg, transparent 60%, rgba(197,165,90,0.55) 72%, rgba(255,215,100,1) 80%, rgba(197,165,90,0.55) 88%, transparent 100%)"
              : "conic-gradient(from 0deg, transparent 68%, rgba(197,165,90,0.3) 78%, rgba(197,165,90,0.65) 83%, rgba(197,165,90,0.3) 88%, transparent 100%)",
            /* Lueur dorée externe uniquement sur l'actif */
            boxShadow: isActive
              ? "0 0 18px rgba(197,165,90,0.45), 0 0 4px rgba(197,165,90,0.25)"
              : "none",
          }}
        />

        {/* ---- Image intérieure (ne tourne PAS) ---- */}
        <div
          style={{
            position: "absolute",
            inset: "2.5px",
            borderRadius: R_IN,
            overflow: "hidden",
            background: "#1a1919",
          }}
        >
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover"
          />
          {/* Assombrir légèrement l'inactif pour faire ressortir l'actif */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: "rgba(0,0,0,0.38)", opacity: isActive ? 0 : 1 }}
          />
        </div>
      </div>

      {/* ---- Label ---- */}
      <span
        className={`text-[10px] uppercase tracking-[0.17em] font-semibold whitespace-nowrap transition-colors duration-300 ${
          isActive
            ? "text-gold"
            : "text-white/38 group-hover:text-white/65"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/* ---- Cartes promo inline (inserts marketing) ---- */
const PROMO_CARDS = [
  {
    id: "coffrets",
    tag: "Coup de cœur",
    title: "Nos coffrets font la différence.",
    desc: "Sets complets emballés avec soin, prêts à offrir. À partir de 25 000 FCFA.",
    cta: "Voir les coffrets",
    href: "/shop?category=sets-cadeau",
    image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.10.jpeg",
    accent: "left",
  },
  {
    id: "perso",
    tag: "Service exclusif",
    title: "Personnalisez votre cadeau.",
    desc: "Gravure sur montre, broderie sur peluche, message manuscrit — une touche unique qui dit tout.",
    cta: "En savoir plus",
    href: "/gift-boxes",
    image: null,
    accent: "center",
  },
];

function PromoCard({ card }) {
  /* Variante centrée (pas d'image) */
  if (card.accent === "center") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full my-2 rounded-2xl border border-gold/10 bg-gradient-to-br from-[#131210] to-[#0d0c09] px-8 py-10 text-center"
      >
        <span className="text-[9px] uppercase tracking-[0.28em] text-gold font-semibold">
          {card.tag}
        </span>
        <h3 className="font-serif text-xl md:text-2xl text-white mt-3 mb-2 leading-tight">
          {card.title}
        </h3>
        <p className="text-sm text-white/35 max-w-md mx-auto leading-relaxed">
          {card.desc}
        </p>
        <Link
          to={card.href}
          className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold border border-gold/30 text-gold rounded-full hover:bg-gold/[0.08] transition-all duration-300"
        >
          {card.cta} <span className="text-[8px]">→</span>
        </Link>
      </motion.div>
    );
  }

  /* Variante avec image à droite */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full my-2 rounded-2xl border border-white/[0.06] bg-gradient-to-r from-[#131210] to-[#0e0d0b] overflow-hidden flex flex-col md:flex-row items-stretch"
    >
      {/* Texte */}
      <div className="flex-1 px-7 md:px-10 py-8 md:py-9 flex flex-col justify-center">
        <span className="text-[9px] uppercase tracking-[0.28em] text-gold font-semibold mb-3">
          {card.tag}
        </span>
        <h3 className="font-serif text-xl md:text-2xl text-white leading-tight mb-2">
          {card.title}
        </h3>
        <p className="text-sm text-white/32 leading-relaxed max-w-xs">
          {card.desc}
        </p>
        <Link
          to={card.href}
          className="inline-flex items-center gap-2 mt-6 w-fit px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold bg-gold/[0.09] border border-gold/25 text-gold rounded-full hover:bg-gold/[0.15] transition-all duration-300"
        >
          {card.cta} <span className="text-[8px]">→</span>
        </Link>
      </div>
      {/* Image */}
      {card.image && (
        <div className="w-full md:w-52 lg:w-64 h-40 md:h-auto flex-shrink-0 overflow-hidden">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      )}
    </motion.div>
  );
}

/* ---- Composant principal ---- */
export default function FilterableProductGrid({ limit = 80, defaultCategory = null }) {
  const [active, setActive] = useState(defaultCategory);
  const { products, loading } = useProducts({ limit });

  /* Filtrage côté client */
  const filtered = useMemo(() => {
    if (!active) return products;
    return products.filter(
      (p) => p.category_slug === active || p.category === active
    );
  }, [products, active]);

  return (
    <section className="bg-[#080807] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* ---- Bande de squircles ---- */}
        <div className="flex gap-5 md:gap-7 overflow-x-auto no-scrollbar pb-8 mb-6 md:mb-10 md:justify-center">
          {CATEGORIES.map((cat) => (
            <CategorySquircle
              key={cat.slug ?? "all"}
              label={cat.label}
              image={cat.image}
              isActive={active === cat.slug}
              onClick={() => setActive(cat.slug)}
            />
          ))}
        </div>

        {/* ---- Grille produits ---- */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/5] shimmer rounded-xl" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 shimmer rounded-full w-1/4" />
                  <div className="h-3 shimmer rounded-full w-3/4" />
                  <div className="h-3 shimmer rounded-full w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-white/25 text-sm">Aucun produit dans cette catégorie.</p>
          </div>
        ) : (
          /* Rendu en chunks : grille → promo → grille → promo → ... */
          <div className="space-y-3">
            {Array.from({ length: Math.ceil(filtered.length / 8) }, (_, chunkIdx) => {
              const chunk = filtered.slice(chunkIdx * 8, chunkIdx * 8 + 8);
              return (
                <div key={`chunk-${chunkIdx}`}>
                  {/* Grille du chunk */}
                  <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
                  >
                    <AnimatePresence mode="popLayout">
                      {chunk.map((product, i) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 0.28,
                            delay: i < 8 ? i * 0.03 : 0,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <ProductCard product={product} index={chunkIdx * 8 + i} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* PromoCard insérée après le chunk (si pas le dernier et si promo disponible) */}
                  {chunkIdx < Math.ceil(filtered.length / 8) - 1 && PROMO_CARDS[chunkIdx] && (
                    <PromoCard card={PROMO_CARDS[chunkIdx]} />
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

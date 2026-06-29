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

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, X, SlidersHorizontal } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { fetchCategoriesFull } from "../../services/api";
import { getCategoryImageUrl } from "../../utils/categoryImage";

/* Squircle radius en px */
const R_OUT = 20; /* border-radius du contour tournant */
const R_IN  = 17; /* border-radius de l'image intérieure */

/* Catégories fallback si l'API est indisponible */
const FALLBACK_CATEGORIES = [
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
      className="flex-shrink-0 group focus:outline-none"
    >
      {/* Conteneur squircle */}
      <div
        className={`relative transition-transform duration-300 ${
          isActive ? "scale-110" : "scale-100 group-hover:scale-[1.05]"
        }`}
        style={{ width: 88, height: 88 }}
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
              ? "conic-gradient(from 0deg, transparent 60%, rgba(181,129,30,0.55) 72%, rgba(243,207,92,1) 80%, rgba(181,129,30,0.55) 88%, transparent 100%)"
              : "conic-gradient(from 0deg, transparent 68%, rgba(215,161,43,0.3) 78%, rgba(215,161,43,0.65) 83%, rgba(215,161,43,0.3) 88%, transparent 100%)",
            /* Lueur dorée externe uniquement sur l'actif */
            boxShadow: isActive
              ? "0 0 18px rgba(215,161,43,0.48), 0 0 4px rgba(215,161,43,0.28)"
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
          {/* Nom catégorie sur l'image */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-1.5 py-1.5 bg-gradient-to-t from-black/92 via-black/60 to-transparent">
            <span
              className={`block text-center text-[9px] uppercase tracking-[0.12em] font-bold leading-tight line-clamp-2 transition-colors duration-300 ${
                isActive ? "text-gold" : "text-white/90 group-hover:text-gold"
              }`}
            >
              {label}
            </span>
          </div>
        </div>
      </div>
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
    href: "/coffrets",
    image: null,
    accent: "center",
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
        className="w-full my-2 rounded-2xl border border-gold/25 bg-gradient-to-br from-[#2a1809] to-[#15100a] px-8 py-10 text-center"
      >
        <span className="text-[9px] uppercase tracking-[0.28em] text-gold font-bold">
          {card.tag}
        </span>
        <h3 className="font-serif text-xl md:text-2xl text-white mt-3 mb-2 leading-tight">
          {card.title}
        </h3>
        <p className="text-sm text-white/65 max-w-md mx-auto leading-relaxed">
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
      className="w-full my-2 rounded-2xl border border-gold/20 bg-gradient-to-r from-[#2a1809] to-[#15100a] overflow-hidden flex flex-col md:flex-row items-stretch"
    >
      {/* Texte */}
      <div className="flex-1 px-7 md:px-10 py-8 md:py-9 flex flex-col justify-center">
        <span className="text-[9px] uppercase tracking-[0.28em] text-gold font-semibold mb-3">
          {card.tag}
        </span>
        <h3 className="font-serif text-xl md:text-2xl text-white leading-tight mb-2">
          {card.title}
        </h3>
        <p className="text-sm text-white/65 leading-relaxed max-w-xs">
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

/* Pas du slider prix en FCFA */
const PRICE_STEP = 500;

/* ---- Composant principal ---- */
export default function FilterableProductGrid({
  limit = 80,
  defaultCategory = null,
  showFilters = false,
  showPromoCards = true,
  lightBackground = false,
  premium = false,
  showPageHeader = false,
}) {
  const [active, setActive]       = useState(defaultCategory);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    setActive(defaultCategory);
  }, [defaultCategory]);
  const [minVal, setMinVal]       = useState(0);
  const [maxVal, setMaxVal]       = useState(200000);
  const [applied, setApplied]     = useState(null); /* { min, max } ou null */
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const { products, loading } = useProducts({ limit });

  useEffect(() => {
    fetchCategoriesFull({ activeOnly: true }).then((rows) => {
      if (!rows.length) return;
      setCategories([
        {
          label: "Tous",
          slug: null,
          image: getCategoryImageUrl(rows[0]?.image_url),
        },
        ...rows.map((cat) => ({
          label: cat.name,
          slug: cat.slug,
          image: getCategoryImageUrl(cat.image_url),
        })),
      ]);
    });
  }, []);

  /* Étendue réelle des prix depuis les produits chargés */
  const priceExtent = useMemo(() => {
    if (!products.length) return [0, 200000];
    const prices = products.map(p => (p.promo_active && p.promo_price) ? p.promo_price : p.price);
    const hi = Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP;
    return [0, hi];
  }, [products]);

  /* Initialiser le slider dès que les produits sont chargés */
  useEffect(() => {
    if (products.length) {
      setMinVal(priceExtent[0]);
      setMaxVal(priceExtent[1]);
    }
  }, [priceExtent[1]]);

  /* Pourcentage pour le positionnement du fill et des thumbs */
  function pct(val) {
    const [lo, hi] = priceExtent;
    if (hi === lo) return 0;
    return ((val - lo) / (hi - lo)) * 100;
  }

  /* Filtrage côté client : catégorie + recherche + prix appliqué */
  const filtered = useMemo(() => {
    let result = products;
    if (active) result = result.filter(p => p.category_slug === active || p.category === active);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q));
    }
    if (applied) {
      result = result.filter(p => {
        const price = (p.promo_active && p.promo_price) ? p.promo_price : p.price;
        return price >= applied.min && price <= applied.max;
      });
    }
    return result;
  }, [products, active, search, applied]);

  /* Actif si au moins un filtre secondaire est appliqué */
  const hasActiveFilters = search.trim() !== "" || applied !== null;

  return (
    <section
      className={`${premium ? "home-products-premium" : ""} ${
        lightBackground ? "pt-4 pb-12 md:pt-8 md:pb-16" : "pt-6 pb-10 md:pt-10 md:pb-14"
      }`}
      style={{ background: "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

        {showPageHeader && (
          <header className="text-center mb-8 md:mb-12 pt-2 md:pt-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-neutral-400 font-semibold mb-3">
              Accueil · Collections
            </p>
            <h1 className="font-serif text-[1.75rem] sm:text-4xl md:text-[2.65rem] font-semibold text-[#0a0a0a] tracking-tight leading-tight">
              Nos Créations
            </h1>
            <div
              className="mx-auto mt-3 h-px w-24"
              style={{ background: "linear-gradient(90deg, transparent, #D7A12B, transparent)" }}
            />
            <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-medium max-w-md mx-auto leading-relaxed">
              Des cadeaux qui transforment un instant en souvenir
            </p>
          </header>
        )}

        {/* ---- Barre recherche + filtre prix (Shop uniquement) ---- */}
        {showFilters && (
          <div className="mb-8 space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un produit…"
                className="w-full pl-11 pr-10 py-3 bg-[#1e1b12] border border-gold/[0.20] rounded-xl
                           text-sm text-white placeholder-white/50
                           focus:border-gold/60 focus:outline-none focus:bg-[#231f14]
                           transition-all duration-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Double slider prix — compact inline */}
            <div className="flex items-center gap-3 bg-[#1e1b12] border border-gold/[0.18] rounded-xl px-4 py-3">
              {/* Icône + label */}
              <SlidersHorizontal size={13} className="text-gold/50 flex-shrink-0" />

              {/* Slider + valeurs */}
              <div className="flex-1 min-w-0">
                {/* Valeurs */}
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-white/50">{minVal.toLocaleString("fr-FR")} FCFA</span>
                  <span className="text-[10px] text-white/50">{maxVal.toLocaleString("fr-FR")} FCFA</span>
                </div>
                {/* Track + inputs */}
                <div className="relative h-5 flex items-center">
                  <div className="absolute w-full h-[3px] bg-white/[0.08] rounded-full" />
                  <div
                    className="absolute h-[3px] bg-gold/50 rounded-full"
                    style={{ left: `${pct(minVal)}%`, right: `${100 - pct(maxVal)}%` }}
                  />
                  <input type="range" className="range-price"
                    min={priceExtent[0]} max={priceExtent[1]} step={PRICE_STEP}
                    value={minVal}
                    onChange={e => setMinVal(Math.min(Number(e.target.value), maxVal - PRICE_STEP))}
                  />
                  <input type="range" className="range-price"
                    min={priceExtent[0]} max={priceExtent[1]} step={PRICE_STEP}
                    value={maxVal}
                    onChange={e => setMaxVal(Math.max(Number(e.target.value), minVal + PRICE_STEP))}
                  />
                </div>
              </div>

              {/* Bouton Filtrer */}
              <button
                onClick={() => setApplied({ min: minVal, max: maxVal })}
                className="flex-shrink-0 px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-semibold
                           bg-gold/10 border border-gold/30 text-gold rounded-lg
                           hover:bg-gold/20 transition-all duration-300"
              >
                Filtrer
              </button>
            </div>

            {/* Compteur résultats + reset */}
            {!loading && (
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-white/55">
                  {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setSearch(""); setApplied(null); setMinVal(priceExtent[0]); setMaxVal(priceExtent[1]); }}
                    className="text-[10px] text-gold/60 hover:text-gold transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---- Titre avant les catégories ---- */}
        <div className={`text-center mb-5 ${showFilters ? "mt-4" : showPageHeader ? "mt-2" : "mt-8 md:mt-12"}`}>
          <h2
            className={`font-serif font-semibold ${
              lightBackground ? (premium ? "text-[#0a0a0a] text-lg md:text-xl" : "text-[#1a1612]") : "text-white"
            }`}
            style={!premium ? { fontSize: "clamp(1.1rem, 3vw, 1.6rem)" } : undefined}
          >
            {premium ? "Parcourir par catégorie" : "Découvrez nos catégories"}
          </h2>
          <div className="mx-auto mt-2 h-px w-16" style={{ background: "linear-gradient(90deg, transparent, #D7A12B, transparent)" }} />
        </div>

        {/* ---- Bande de squircles — répétée 10× pour défilement infini ---- */}
        <div className={`flex gap-5 md:gap-8 overflow-x-auto no-scrollbar pb-8 mb-6 md:mb-10 ${premium ? "justify-center md:justify-start" : ""}`}>
          {Array.from({ length: 10 }).flatMap((_, rep) =>
            categories.map((cat) => (
              <CategorySquircle
                key={`${rep}-${cat.slug ?? "all"}`}
                label={cat.label}
                image={cat.image}
                isActive={active === cat.slug}
                onClick={() => setActive(cat.slug)}
              />
            ))
          )}
        </div>

        {/* ---- Grille produits ---- */}
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden ${
                  premium ? "bg-white border border-black/[0.06]" : ""
                }`}
                style={!premium ? { border: "0.5px solid rgba(255,255,255,0.08)" } : undefined}
              >
                <div className="aspect-[4/5] shimmer" />
                <div className="px-2.5 py-2 space-y-1.5">
                  <div className="h-2.5 shimmer rounded-full w-[88%]" />
                  <div className="h-2 shimmer rounded-full w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className={`text-sm ${lightBackground ? "text-neutral-500" : "text-white/55"}`}>
              Aucun produit dans cette catégorie.
            </p>
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
                    className="product-grid"
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
                          <ProductCard
                            product={product}
                            index={chunkIdx * 8 + i}
                            lightBackground={lightBackground}
                            premium={premium}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* PromoCard insérée après le chunk (si pas le dernier et si promo disponible) */}
                  {showPromoCards &&
                    chunkIdx < Math.ceil(filtered.length / 8) - 1 &&
                    PROMO_CARDS[chunkIdx] && (
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

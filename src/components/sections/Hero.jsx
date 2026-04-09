/**
 * Composant Hero - Section héro plein écran v2
 * 
 * Design immersif premium avec :
 * - Photo plein écran avec effet parallax au scroll
 * - Overlays multi-couches pour profondeur cinématique
 * - Animations staggered fluides (kicker → titre → sous-titre → CTA)
 * - CTA doré avec glow effect
 * - Bannière marquee dorée défilante
 * - Indicateur scroll capsule animé
 * - Optimisé mobile : tailles de texte adaptées, espacement ajusté
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero({ imageSrc, title, subtitle }) {
  /* Parallax : décaler l'image en fonction du scroll */
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        /* Seulement si la section est visible */
        if (rect.bottom > 0) {
          setScrollY(window.scrollY * 0.35);
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Variants Framer Motion pour les animations staggered */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.4 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  };
  const fadeUpSlow = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[65svh] min-h-[440px] max-h-[720px] flex items-end overflow-hidden w-full"
    >
      {/* ---- Photo de fond avec effet parallax ---- */}
      {imageSrc ? (
        <motion.img
          src={imageSrc}
          alt="Rassoul Shop Hero"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ transform: `translateY(${scrollY}px) scale(1.1)` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-noir-900 via-noir-800 to-noir-700" />
      )}

      {/* ---- Overlays multi-couches pour profondeur cinématique ---- */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-900/60 to-noir-900/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-noir-900/40 via-transparent to-transparent" />

      {/* ---- Contenu textuel superposé avec stagger ---- */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full px-5 md:px-12 lg:px-20 pb-14 md:pb-16"
      >
        {/* Kicker animé */}
        <motion.div variants={fadeUpSlow} className="flex items-center gap-3 mb-4 md:mb-5">
          <div className="w-8 md:w-10 h-px bg-gold" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-gold font-semibold">
            Collection 2026
          </span>
        </motion.div>

        {/* Titre principal — serif, impact visuel maximal */}
        <motion.h1
          variants={fadeUp}
          className="font-serif text-[2.6rem] sm:text-5xl md:text-7xl lg:text-[6.5rem] font-semibold leading-[0.9] tracking-tight text-cream max-w-5xl"
        >
          {title || "Silhouette premium"}
        </motion.h1>

        {/* Sous-titre minimaliste */}
        <motion.p
          variants={fadeUpSlow}
          className="mt-4 md:mt-6 text-[13px] md:text-[15px] text-cream/40 max-w-md leading-relaxed font-light"
        >
          {subtitle || "Design dense, visuel, immersif."}
        </motion.p>

        {/* CTA avec glow */}
        <motion.div variants={fadeUpSlow} className="mt-7 md:mt-8 flex items-center gap-3 md:gap-4">
          <Link
            to="/shop"
            className="px-7 md:px-8 py-3 md:py-3.5 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold bg-gold text-noir-900 rounded-full glow-gold glow-gold-hover transition-all duration-400 btn-press"
          >
            Découvrir
          </Link>
          <Link
            to="/lookbook"
            className="px-7 md:px-8 py-3 md:py-3.5 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold border border-cream/12 text-cream/50 rounded-full hover:border-gold/30 hover:text-cream transition-all duration-400 btn-press"
          >
            Lookbook
          </Link>
        </motion.div>
      </motion.div>

      {/* ---- Bannière marquee — fond crème lumineux + texte doré ---- */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-gold/20 bg-cream">
        <div className="marquee-track flex whitespace-nowrap py-2.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-6 md:mx-8 text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-gold-dark font-semibold">
              Rassoul Shop &mdash; Premium Fashion &mdash; Collection 2026 &mdash; Style &mdash; Élégance
            </span>
          ))}
        </div>
      </div>

      {/* ---- Indicateur scroll capsule animé ---- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 md:bottom-11 left-1/2 -translate-x-1/2 z-30"
      >
        <div className="w-5 h-8 rounded-full border border-cream/15 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-gold/60"
          />
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Composant Hero — Section héro plein écran Rassoul Shop
 * 
 * Design luxe immersif plein écran :
 * - Image de fond avec parallax subtil
 * - Overlay dégradé pour lisibilité (sans écraser l'image)
 * - Contenu centré : kicker doré + titre serif grand format + sous-titre + CTAs
 * - Indicateur scroll discret en bas
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";

/* Rayon du squircle hero */
const HERO_R_OUT = 28; /* px — contour tournant */
const HERO_R_IN  = 24; /* px — image intérieure   */

export default function Hero({ imageSrc, title, subtitle }) {
  /* Parallax léger (sur l'image intérieure uniquement) */
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      if (sectionRef.current && sectionRef.current.getBoundingClientRect().bottom > 0) {
        setScrollY(window.scrollY * 0.18);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Animations staggerées */
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    /* ---- Section wrapper : fond noir + padding pour laisser voir le contour ---- */
    <section
      ref={sectionRef}
      className="px-3 md:px-5 pt-[72px] md:pt-[84px] pb-4 md:pb-6"
      style={{ background: "linear-gradient(180deg, #0d0a05 0%, #131108 100%)" }}
    >
      {/* ---- Squircle géant avec spinning border ---- */}
      <div
        className="relative w-full"
        style={{
          height: "clamp(190px, 32svh, 420px)",
        }}
      >
        {/* Couche conic-gradient tournante (le contour doré) */}
        <div
          className="spin-border-hero absolute inset-0"
          style={{
            borderRadius: HERO_R_OUT,
            background:
              "conic-gradient(from 0deg, transparent 65%, rgba(197,165,90,0.35) 74%, rgba(255,215,100,0.92) 80%, rgba(197,165,90,0.35) 86%, transparent 100%)",
            boxShadow: "0 0 28px rgba(197,165,90,0.22), 0 0 6px rgba(197,165,90,0.12)",
          }}
        />

        {/* ---- Contenu intérieur (image + overlays + texte) ---- */}
        <div
          className="absolute overflow-hidden flex items-center justify-center"
          style={{ inset: "3px", borderRadius: HERO_R_IN }}
        >
          {/* Image avec parallax */}
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Rassoul Shop"
              className="absolute inset-0 w-full h-full object-cover select-none"
              style={{
                transform: `translateY(${scrollY}px) scale(1.08)`,
                transformOrigin: "center",
              }}
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-noir-900" />
          )}

          {/* Overlay dégradé */}
          <div className="absolute inset-0 bg-gradient-to-b from-noir-950/45 via-noir-950/20 to-noir-950/80 pointer-events-none" />
          <div className="absolute inset-0 bg-noir-950/10 pointer-events-none" />

          {/* ---- Texte centré ---- */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative z-10 text-center px-6 sm:px-10 max-w-3xl mx-auto"
          >
            {/* Kicker */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-5">
              <div className="w-8 h-px bg-gold/50" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold/90 font-medium">
                L'art d'offrir
              </span>
              <div className="w-8 h-px bg-gold/50" />
            </motion.div>

            {/* Titre */}
            <motion.h1
              variants={fadeUp}
              className="font-serif font-medium leading-[1.06] tracking-tight text-white
                         text-[2.2rem] sm:text-5xl md:text-6xl lg:text-[5rem]"
            >
              {title || "Cadeaux d'exception"}
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              variants={fadeUp}
              className="mt-4 md:mt-5 text-sm md:text-[15px] text-white/80 max-w-md mx-auto leading-relaxed font-light"
            >
              {subtitle || "Peluches, montres, bijoux et coffrets premium — Dakar, Sénégal."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-8 md:mt-9 flex items-center justify-center gap-3 md:gap-4 flex-wrap"
            >
              <Link
                to="/shop"
                className="px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] font-semibold bg-gold text-white rounded-full hover:bg-gold-light active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(197,165,90,0.35)]"
              >
                Découvrir
              </Link>
              <Link
                to="/gift-boxes"
                className="px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] font-semibold border border-white/30 text-white/80 rounded-full hover:border-gold/60 hover:text-white active:scale-95 transition-all duration-300"
              >
                Coffrets
              </Link>
            </motion.div>
          </motion.div>

          {/* ---- Scroll indicator ---- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/45"
            >
              <ArrowDown size={18} strokeWidth={1} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

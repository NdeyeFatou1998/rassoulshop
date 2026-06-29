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

/* Rayon du squircle hero */
const HERO_R_OUT = 28; /* px — contour tournant */
const HERO_R_IN  = 24; /* px — image intérieure   */

export default function Hero({ imageSrc, title, subtitle, lightBackground = false, variant = "default" }) {
  const isPremium = variant === "premium" || lightBackground;
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
      className={`px-3 md:px-5 pb-4 md:pb-6 ${
        isPremium ? "pt-[68px] md:pt-[80px] home-hero-premium" : "pt-[72px] md:pt-[84px]"
      }`}
      style={{ background: isPremium ? "transparent" : "#080503" }}
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
            background: isPremium
              ? "conic-gradient(from 0deg, transparent 62%, rgba(181,129,30,0.25) 72%, rgba(215,161,43,0.85) 80%, rgba(181,129,30,0.25) 90%, transparent 100%)"
              : "conic-gradient(from 0deg, transparent 65%, rgba(181,129,30,0.35) 74%, rgba(243,207,92,0.95) 80%, rgba(181,129,30,0.35) 86%, transparent 100%)",
            boxShadow: isPremium
              ? "0 8px 40px -12px rgba(107,84,48,0.22), 0 0 0 1px rgba(215,161,43,0.12)"
              : "0 0 28px rgba(215,161,43,0.24), 0 0 6px rgba(215,161,43,0.14)",
          }}
        />

        {/* ---- Contenu intérieur (image + overlays + texte) ---- */}
        <div
          className="absolute overflow-hidden"
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

          {/* L'art d'offrir — en haut + trait gold */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-4 left-0 right-0 z-10 text-center px-6"
          >
            <p
              className="text-white font-semibold uppercase tracking-[0.32em]"
              style={{ fontSize: "clamp(0.55rem, 1.5vw, 0.8rem)" }}
            >
              L'art d'offrir
            </p>
            <div
              className="mx-auto mt-2 h-px w-16"
              style={{ background: "linear-gradient(90deg, transparent, #D7A12B, transparent)" }}
            />
          </motion.div>

          {/* Slogan — en bas de la bannière */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="absolute bottom-4 left-0 right-0 z-10 text-center px-6 sm:px-10"
          >
            <motion.p
              variants={fadeUp}
              className="font-serif max-w-xl mx-auto leading-tight tracking-wide"
              style={{
                fontSize: "clamp(1.1rem, 3vw, 2rem)",
                fontWeight: 600,
                fontStyle: "italic",
                background: "linear-gradient(100deg, #B5811E 0%, #FCE9A8 45%, #D7A12B 70%, #F3CF5C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {subtitle || "Offrez plus qu'un cadeau, offrez une émotion !"}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

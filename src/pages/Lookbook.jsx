/**
 * Page Lookbook - Galerie visuelle premium v3
 *
 * Hero cinématique plein fond noir/doré :
 * - Vidéo en fond avec spinning border doré (identique au hero accueil)
 * - Titre serif animé en stagger + kicker doré
 * - Scroll indicator pulsé
 * Galerie :
 * - Mosaïque bento-grid (images + vidéos)
 * - Lightbox plein écran avec navigation clavier
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, ChevronLeft, ChevronRight, Play, ArrowDown } from "lucide-react";
import AnimatedSection from "../components/ui/AnimatedSection";

export default function Lookbook() {
  /**
   * Données du lookbook — TOUTES les images + TOUTES les vidéos
   * span: taille dans la grille CSS (tall = 2 rows, wide = 2 cols)
   */
  const looks = [
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.08.jpeg", span: "tall" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.09.jpeg", span: "normal" },
    { type: "video", src: "/assets/videos/WhatsApp Video 2026-03-24 at 01.28.04.mp4", span: "wide" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.10.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.11.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.12.jpeg", span: "tall" },
    { type: "video", src: "/assets/videos/WhatsApp Video 2026-03-24 at 01.27.56.mp4", span: "wide" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.15.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.57.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.58.jpeg", span: "tall" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.28.14.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/WhatsApp 2Image 2026-03-24 at 01.27.58.jpeg", span: "wide" },
    { type: "image", src: "/assets/images/WhatsApp I2mage 2026-03-24 at 01.28.14.jpeg", span: "normal" },
    { type: "video", src: "/assets/videos/WhatsApp Video 2026-03-24 at 01.27.43.mp4", span: "wide" },
    { type: "image", src: "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/WhatsApp Image 22026-03-24 at 01.27.09.jpeg", span: "tall" },
    { type: "image", src: "/assets/images/WhatsApp Image 22026-03-24 at 01.27.10.jpeg", span: "normal" },
  ];

  /* État de la lightbox */
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  /* Ouvrir la lightbox au clic sur un item */
  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setMuted(true);
  }, []);

  /* Fermer la lightbox */
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  /* Navigation précédent / suivant dans la lightbox */
  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % looks.length);
    setMuted(true);
  }, [looks.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + looks.length) % looks.length);
    setMuted(true);
  }, [looks.length]);

  /* Gestion des touches clavier dans la lightbox */
  useEffect(() => {
    if (lightboxIndex === null) return;
    function handleKey(e) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  /* Toggle mute sur la vidéo en cours */
  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  }, []);

  /**
   * Calcul des classes CSS pour le span dans la grille bento
   * tall: occupe 2 rangées, wide: occupe 2 colonnes
   */
  const getSpanClass = (span) => {
    switch (span) {
      case "tall": return "row-span-2";
      case "wide": return "col-span-2";
      default: return "";
    }
  };

  /* Item courant dans la lightbox */
  const currentItem = lightboxIndex !== null ? looks[lightboxIndex] : null;

  /* Animations staggerées (identiques au hero accueil) */
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.4 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
  };

  /* Vidéo de fond du hero — première vidéo du lookbook */
  const heroBgVideo = "/assets/videos/WhatsApp Video 2026-03-24 at 01.28.04.mp4";

  return (
    <>
      {/* ================================================================
          HERO CINÉMATIQUE — fond noir + vidéo + spinning border doré
          ================================================================ */}
      <section className="bg-[#080807] px-3 md:px-5 pt-[72px] md:pt-[84px] pb-4 md:pb-6">
        <div
          className="relative w-full"
          style={{ height: "clamp(380px, 58svh, 760px)" }}
        >
          {/* Contour spinning doré (identique au hero accueil) */}
          <div
            className="spin-border-hero absolute inset-0"
            style={{
              borderRadius: 28,
              background:
                "conic-gradient(from 0deg, transparent 60%, rgba(197,165,90,0.3) 72%, rgba(255,215,100,0.88) 80%, rgba(197,165,90,0.3) 88%, transparent 100%)",
              boxShadow: "0 0 32px rgba(197,165,90,0.18), 0 0 8px rgba(197,165,90,0.1)",
            }}
          />

          {/* Contenu intérieur */}
          <div
            className="absolute overflow-hidden flex items-center justify-center"
            style={{ inset: "3px", borderRadius: 24 }}
          >
            {/* Vidéo de fond */}
            <video
              src={heroBgVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover scale-[1.04]"
            />

            {/* Overlays sombres pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-noir-950/55 via-noir-950/30 to-noir-950/80 pointer-events-none" />
            <div className="absolute inset-0 bg-noir-950/20 pointer-events-none" />

            {/* Halo doré central subtil */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(197,165,90,0.08) 0%, transparent 70%)",
              }}
            />

            {/* ---- Texte centré animé ---- */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="relative z-10 text-center px-6 sm:px-10 max-w-2xl mx-auto"
            >
              {/* Kicker */}
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-5">
                <div className="w-8 h-px bg-gold/50" />
                <span className="text-[10px] uppercase tracking-[0.42em] text-gold/85 font-medium">
                  Collection visuelle
                </span>
                <div className="w-8 h-px bg-gold/50" />
              </motion.div>

              {/* Titre serif */}
              <motion.h1
                variants={fadeUp}
                className="font-serif font-medium leading-[1.0] tracking-tight text-white
                           text-[3rem] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
              >
                Lookbook
              </motion.h1>

              {/* Ligne or animée */}
              <motion.div
                variants={fadeUp}
                className="w-14 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-5"
              />

              {/* Sous-titre */}
              <motion.p
                variants={fadeUp}
                className="text-[12px] md:text-[13px] uppercase tracking-[0.28em] text-white/40 font-light"
              >
                Photos &amp; Vidéos
              </motion.p>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
              className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="text-white/20"
              >
                <ArrowDown size={17} strokeWidth={1} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---- Séparateur compteur ---- */}
      <div className="flex items-center gap-5 px-4 md:px-8 py-6">
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="text-[10px] uppercase tracking-[0.35em] text-gold/50 font-medium whitespace-nowrap">
          {looks.length} visuels
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
      </div>

      {/* ---- Grille mosaïque bento ---- */}
      <section className="w-full px-3 md:px-5 lg:px-8 pb-20 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] md:auto-rows-[240px] gap-2 md:gap-3">
          {looks.map((look, i) => (
            <AnimatedSection
              key={i}
              delay={i * 0.04}
              className={`${getSpanClass(look.span)} group`}
            >
              <div
                onClick={() => openLightbox(i)}
                className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer border border-white/[0.04] hover:border-gold/20 transition-all duration-500"
              >
                {look.type === "video" ? (
                  <>
                    {/* Vidéo en autoplay muet dans la grille */}
                    <video
                      src={look.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover img-zoom"
                    />
                    {/* Icône play sur les vidéos pour indiquer qu'on peut cliquer */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cream/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play size={16} className="text-noir-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  /* Image */
                  <img
                    src={look.src}
                    alt={`Look ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover img-zoom"
                  />
                )}

                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-noir-900/0 group-hover:bg-noir-900/15 transition-all duration-500" />

                {/* Numéro du look visible au hover */}
                <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-cream/80 font-semibold px-2 py-1 rounded-full bg-noir-900/50 backdrop-blur-sm">
                    {look.type === "video" ? "Vidéo" : "Look"} {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ---- Lightbox plein écran ---- */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-noir-950/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Contenu de la lightbox — empêcher la propagation du clic */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-[92vw] h-[85vh] md:w-[80vw] md:h-[85vh] max-w-5xl rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {currentItem.type === "video" ? (
                /* Vidéo plein écran avec contrôles */
                <video
                  ref={videoRef}
                  key={currentItem.src}
                  src={currentItem.src}
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  className="w-full h-full object-contain bg-noir-950"
                />
              ) : (
                /* Image plein écran */
                <img
                  src={currentItem.src}
                  alt={`Look ${lightboxIndex + 1}`}
                  className="w-full h-full object-contain bg-noir-950"
                />
              )}

              {/* ---- Contrôles de la lightbox ---- */}

              {/* Bouton fermer (X) en haut à droite */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-noir-900/70 backdrop-blur-sm text-cream/80 hover:text-cream flex items-center justify-center transition-colors btn-press"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>

              {/* Bouton volume (vidéos uniquement) — en haut à gauche */}
              {currentItem.type === "video" && (
                <button
                  onClick={toggleMute}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-noir-900/70 backdrop-blur-sm text-cream/80 hover:text-cream flex items-center justify-center transition-colors btn-press"
                  aria-label={muted ? "Activer le son" : "Couper le son"}
                >
                  {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
              )}

              {/* Flèche gauche (précédent) */}
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-noir-900/60 backdrop-blur-sm text-cream/70 hover:text-cream flex items-center justify-center transition-colors btn-press"
                aria-label="Précédent"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Flèche droite (suivant) */}
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-noir-900/60 backdrop-blur-sm text-cream/70 hover:text-cream flex items-center justify-center transition-colors btn-press"
                aria-label="Suivant"
              >
                <ChevronRight size={20} />
              </button>

              {/* Compteur en bas au centre */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-noir-900/60 backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-[0.15em] text-cream/70 font-medium">
                  {lightboxIndex + 1} / {looks.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

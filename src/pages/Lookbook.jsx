/**
 * Page Lookbook - Galerie visuelle premium v2
 * 
 * Galerie immersive type magazine de mode :
 * - Toutes les 14 images + 3 vidéos en mosaïque bento-grid
 * - Clic sur un item → lightbox plein écran
 * - Vidéos : icône volume pour activer/désactiver le son (muet par défaut)
 * - Hover effects avec zoom et overlay doré
 * - Bannière crème en haut (cohérence avec le shop)
 * - Navigation dans la lightbox (flèches + fermer)
 * 
 * Design : 100% visuel, plus de blanc et doré.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, ChevronLeft, ChevronRight, Play } from "lucide-react";
import AnimatedSection from "../components/ui/AnimatedSection";

export default function Lookbook() {
  /**
   * Données du lookbook — TOUTES les images + TOUTES les vidéos
   * span: taille dans la grille CSS (tall = 2 rows, wide = 2 cols)
   */
  const looks = [
    { type: "image", src: "/assets/images/product-01.jpeg", span: "tall" },
    { type: "image", src: "/assets/images/product-02.jpeg", span: "normal" },
    { type: "video", src: "/assets/videos/WhatsApp Video 2026-03-24 at 01.28.04.mp4", span: "wide" },
    { type: "image", src: "/assets/images/product-03.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/product-04.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/product-05.jpeg", span: "tall" },
    { type: "video", src: "/assets/videos/WhatsApp Video 2026-03-24 at 01.27.56.mp4", span: "wide" },
    { type: "image", src: "/assets/images/product-06.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/product-07.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/product-08.jpeg", span: "tall" },
    { type: "image", src: "/assets/images/product-09.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/product-10.jpeg", span: "wide" },
    { type: "image", src: "/assets/images/product-11.jpeg", span: "normal" },
    { type: "video", src: "/assets/videos/WhatsApp Video 2026-03-24 at 01.27.43.mp4", span: "wide" },
    { type: "image", src: "/assets/images/product-12.jpeg", span: "normal" },
    { type: "image", src: "/assets/images/product-13.jpeg", span: "tall" },
    { type: "image", src: "/assets/images/product-14.jpeg", span: "normal" },
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

  return (
    <>
      {/* ---- Bannière hero lookbook — fond crème ---- */}
      <section className="pt-20 md:pt-24 bg-gradient-to-b from-cream via-cream-soft to-noir-950">
        <div className="w-full px-5 md:px-8 lg:px-12 py-10 md:py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-gold-dark font-semibold">
              Visuels
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-noir-900 leading-[0.95] mt-3 mb-4">
              Lookbook
            </h1>
            <div className="w-12 h-[1.5px] bg-gold mx-auto mb-4" />
            <p className="text-[13px] md:text-sm text-noir-700 max-w-md mx-auto leading-relaxed">
              Photos &amp; vidéos — cliquez pour voir en plein écran
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---- Grille mosaïque bento ---- */}
      <section className="w-full px-3 md:px-5 lg:px-8 pb-20 pt-8">
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

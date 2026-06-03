/**
 * Page Lookbook — Hero + galerie swipeable (glisser ← →)
 * Vidéos : bouton play/pause + tap sur l'écran pour pause/reprendre
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowDown,
} from "lucide-react";

function LookbookSlide({ look, isActive, index, total, muted, onToggleMute }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || look.type !== "video") return;

    if (isActive) {
      video.muted = muted;
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [isActive, look.src, look.type, muted]);

  const togglePlayPause = useCallback(
    (e) => {
      e?.stopPropagation?.();
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        video.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        video.pause();
        setPlaying(false);
      }
    },
    []
  );

  if (look.type === "video") {
    return (
      <div
        className="relative flex-shrink-0 w-full snap-center snap-always h-[min(78vh,720px)] bg-noir-950 cursor-pointer"
        onClick={togglePlayPause}
        role="button"
        tabIndex={0}
        aria-label={playing ? "Mettre en pause" : "Lire la vidéo"}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            togglePlayPause(e);
          }
        }}
      >
        <video
          ref={videoRef}
          src={look.src}
          loop
          playsInline
          muted={muted}
          className="w-full h-full object-contain bg-noir-950"
        />

        {/* Bouton play / pause */}
        <button
          type="button"
          onClick={togglePlayPause}
          className="absolute inset-0 m-auto w-14 h-14 md:w-16 md:h-16 rounded-full bg-noir-900/55 backdrop-blur-sm border border-white/10 text-cream flex items-center justify-center hover:bg-noir-900/75 transition-colors z-10"
          aria-label={playing ? "Pause" : "Lecture"}
        >
          {playing ? (
            <Pause size={26} fill="currentColor" />
          ) : (
            <Play size={26} className="ml-1" fill="currentColor" />
          )}
        </button>

        {/* Son */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-noir-900/70 backdrop-blur-sm text-cream/80 hover:text-cream flex items-center justify-center"
          aria-label={muted ? "Activer le son" : "Couper le son"}
        >
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
          <span className="px-4 py-1.5 rounded-full bg-noir-900/60 backdrop-blur-sm text-[10px] uppercase tracking-[0.15em] text-cream/70 font-medium">
            {index + 1} / {total}
          </span>
          <span className="text-[9px] uppercase tracking-[0.12em] text-cream/45">
            {playing ? "Tapez pour pause" : "Tapez pour lire"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0 w-full snap-center snap-always h-[min(78vh,720px)] bg-noir-950">
      <img
        src={look.src}
        alt={`Look ${index + 1}`}
        className="w-full h-full object-contain bg-noir-950"
        draggable={false}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-noir-900/60 backdrop-blur-sm">
        <span className="text-[10px] uppercase tracking-[0.15em] text-cream/70 font-medium">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}

export default function Lookbook() {
  const [looks, setLooks] = useState([]);
  const [banner, setBanner] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    fetch("/api/lookbook")
      .then((r) => r.json())
      .then((d) => setLooks(d.items || []))
      .catch(() => setLooks([]));

    fetch("/api/lookbook/banner")
      .then((r) => r.json())
      .then((d) => setBanner(d.banner || null))
      .catch(() => setBanner(null));
  }, []);

  const scrollToIndex = useCallback((idx) => {
    const track = trackRef.current;
    if (!track || looks.length === 0) return;
    const next = Math.max(0, Math.min(idx, looks.length - 1));
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    setActiveIndex(next);
  }, [looks.length]);

  const goNext = useCallback(() => {
    scrollToIndex((activeIndex + 1) % looks.length);
  }, [activeIndex, looks.length, scrollToIndex]);

  const goPrev = useCallback(() => {
    scrollToIndex((activeIndex - 1 + looks.length) % looks.length);
  }, [activeIndex, looks.length, scrollToIndex]);

  const handleTrackScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track?.clientWidth) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    if (idx !== activeIndex && idx >= 0 && idx < looks.length) {
      setActiveIndex(idx);
    }
  }, [activeIndex, looks.length]);

  useEffect(() => {
    if (looks.length === 0) return;
    function handleKey(e) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [looks.length, goNext, goPrev]);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.4 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
  };

  const heroBannerSrc = banner?.src || null;
  const heroBannerType = banner?.type || "video";

  return (
    <>
      {/* Hero */}
      <section className="bg-[#080807] px-3 md:px-5 pt-[72px] md:pt-[84px] pb-4 md:pb-6">
        <div className="relative w-full" style={{ height: "clamp(380px, 58svh, 760px)" }}>
          <div
            className="spin-border-hero absolute inset-0"
            style={{
              borderRadius: 28,
              background:
                "conic-gradient(from 0deg, transparent 60%, rgba(197,165,90,0.3) 72%, rgba(255,215,100,0.88) 80%, rgba(197,165,90,0.3) 88%, transparent 100%)",
              boxShadow: "0 0 32px rgba(197,165,90,0.18), 0 0 8px rgba(197,165,90,0.1)",
            }}
          />
          <div
            className="absolute overflow-hidden flex items-center justify-center"
            style={{ inset: "3px", borderRadius: 24 }}
          >
            {heroBannerSrc && heroBannerType === "video" && (
              <video
                src={heroBannerSrc}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover scale-[1.04]"
              />
            )}
            {heroBannerSrc && heroBannerType === "image" && (
              <img
                src={heroBannerSrc}
                alt="Lookbook"
                className="absolute inset-0 w-full h-full object-cover scale-[1.04]"
              />
            )}
            {!heroBannerSrc && (
              <div className="absolute inset-0 bg-gradient-to-br from-noir-950 via-[#1a150a] to-noir-950" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-noir-950/55 via-noir-950/30 to-noir-950/80 pointer-events-none" />
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="relative z-10 text-center px-6 sm:px-10 max-w-2xl mx-auto"
            >
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-5">
                <div className="w-8 h-px bg-gold/50" />
                <span className="text-[10px] uppercase tracking-[0.42em] text-gold/85 font-medium">
                  Collection visuelle
                </span>
                <div className="w-8 h-px bg-gold/50" />
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="font-serif font-medium leading-[1.0] tracking-tight text-white text-[3rem] sm:text-6xl md:text-7xl"
              >
                Lookbook
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-[12px] md:text-[13px] uppercase tracking-[0.28em] text-white/40 font-light mt-5"
              >
                Glissez pour parcourir
              </motion.p>
            </motion.div>
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

      {/* Galerie swipe */}
      <section className="bg-[#080807] pb-24">
        <div className="flex items-center gap-5 px-4 md:px-8 py-5">
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold/50 font-medium whitespace-nowrap">
            {looks.length > 0 ? `${activeIndex + 1} / ${looks.length}` : "0 visuel"}
          </span>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        {looks.length === 0 ? (
          <p className="text-center text-white/30 text-sm py-20">Aucun média pour le moment</p>
        ) : (
          <div className="relative">
            {/* Piste horizontale — scroll / swipe natif */}
            <div
              ref={trackRef}
              onScroll={handleTrackScroll}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth touch-pan-x"
            >
              {looks.map((look, i) => (
                <LookbookSlide
                  key={look.id ?? i}
                  look={look}
                  index={i}
                  total={looks.length}
                  isActive={activeIndex === i}
                  muted={muted}
                  onToggleMute={() => setMuted((m) => !m)}
                />
              ))}
            </div>

            {/* Flèches navigation */}
            {looks.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-noir-900/65 backdrop-blur-sm text-cream/80 hover:text-cream flex items-center justify-center border border-white/10"
                  aria-label="Précédent"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-noir-900/65 backdrop-blur-sm text-cream/80 hover:text-cream flex items-center justify-center border border-white/10"
                  aria-label="Suivant"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Points indicateurs */}
            {looks.length > 1 && (
              <div className="flex justify-center gap-2 mt-5 px-4">
                {looks.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? "w-6 bg-gold" : "w-1.5 bg-white/25 hover:bg-white/40"
                    }`}
                    aria-label={`Aller au visuel ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

/**
 * BrandStatement — Citation de marque (compacte sur accueil, bande sombre ailleurs)
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BrandStatement({ lightBackground = false, variant = "auto" }) {
  const isCompact = variant === "compact";
  const isDark = !isCompact && (variant === "dark" || (!lightBackground && variant === "auto"));

  if (isCompact) {
    return (
      <section className="px-4 sm:px-6 pb-10 md:pb-12 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, transition: { duration: 0.25 } }}
          className="brand-statement-card relative max-w-md mx-auto"
        >
          {/* Contour doré animé */}
          <div className="brand-statement-card-border spin-border-slow" aria-hidden />

          <div className="brand-statement-card-inner relative z-10 text-center px-5 py-6 sm:px-6 sm:py-7">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-block text-gold/80 text-[8px] mb-3 tracking-[0.35em]"
            >
              ✦
            </motion.span>

            <motion.blockquote
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="font-serif text-[1.05rem] sm:text-xl leading-snug text-[#faf8f4] tracking-tight"
            >
              "L'art d'offrir, c'est rendre{" "}
              <em className="not-italic text-gold">inoubliable</em> un instant."
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="mt-3 text-[9px] uppercase tracking-[0.24em] text-white/40 font-medium"
            >
              Rassoul Shop · Dakar
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.45 }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 mt-4 px-5 py-2 text-[9px] uppercase tracking-[0.2em] font-bold text-[#0a0a0a] bg-gold rounded-full hover:bg-[#F3CF5C] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(215,161,43,0.35)]"
              >
                Découvrir
                <span className="text-[7px]">→</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden ${
        isDark ? "py-16 md:py-24 px-5 lg:px-10 home-brand-dark" : "py-20 md:py-28 px-5 lg:px-10"
      }`}
    >
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(215,161,43,0.18) 0%, transparent 70%)",
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex-1 h-px max-w-16 ${isDark ? "bg-gold/40" : "bg-gold/35"}`} />
          <span className="text-gold/80 text-[9px]">✦</span>
          <div className={`flex-1 h-px max-w-16 ${isDark ? "bg-gold/40" : "bg-gold/35"}`} />
        </div>

        <blockquote
          className={`font-serif text-2xl sm:text-3xl md:text-4xl leading-[1.28] tracking-tight ${
            isDark ? "text-[#FFF8EE]" : lightBackground ? "text-[#0a0a0a]" : "text-white"
          }`}
        >
          "L'art d'offrir, c'est l'art de rendre{" "}
          <em className="not-italic text-gold">inoubliable</em> un instant."
        </blockquote>

        <p
          className={`mt-5 text-[10px] uppercase tracking-[0.28em] font-semibold ${
            isDark ? "text-white/45" : lightBackground ? "text-neutral-400" : "text-white/45"
          }`}
        >
          — Rassoul Shop, Dakar
        </p>

        <Link
          to="/shop"
          className={`inline-flex items-center gap-2 mt-8 px-7 py-3 text-[10px] uppercase tracking-[0.22em] font-bold transition-all duration-300 ${
            isDark
              ? "bg-gold text-[#0a0a0a] rounded-full hover:bg-[#F3CF5C] hover:shadow-[0_8px_28px_rgba(215,161,43,0.35)]"
              : "text-gold/80 hover:text-gold border border-gold/30 rounded-full hover:bg-gold/[0.06]"
          }`}
        >
          Découvrir la boutique
          <span className="text-[8px]">→</span>
        </Link>
      </motion.div>
    </section>
  );
}

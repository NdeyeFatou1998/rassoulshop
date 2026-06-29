/**
 * BrandStatement — Citation de marque (clair ou bande noire premium)
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BrandStatement({ lightBackground = false, variant = "auto" }) {
  const isDark = variant === "dark" || (!lightBackground && variant === "auto");

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

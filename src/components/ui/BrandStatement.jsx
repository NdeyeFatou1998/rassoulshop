/**
 * BrandStatement — Section citation de marque premium
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BrandStatement() {
  return (
    <section className="py-20 md:py-28 px-5 lg:px-10 relative overflow-hidden" style={{ background: "transparent" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Séparateur doré */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-12 h-px bg-gold/35" />
          <span className="text-gold/70 text-[9px]">✦</span>
          <div className="w-12 h-px bg-gold/35" />
        </div>

        {/* Citation principale */}
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] text-white leading-[1.3] tracking-tight">
          "L'art d'offrir, c'est l'art de rendre{" "}
          <em className="not-italic text-gold">inoubliable</em>{" "}
          un instant."
        </blockquote>

        {/* Attribution */}
        <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-white/45 font-medium">
          — Rassoul Shop, Dakar
        </p>

        {/* CTA */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 mt-10 text-[10px] uppercase tracking-[0.22em] text-gold/80 hover:text-gold transition-colors duration-300 font-semibold"
        >
          Découvrir la boutique
          <span className="text-[8px]">→</span>
        </Link>
      </motion.div>
    </section>
  );
}



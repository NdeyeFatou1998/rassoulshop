/**
 * Page About - Présentation de la Maison Rassoul
 * 
 * Design minimaliste et premium :
 * - Grande image de marque avec overlay texte
 * - Valeurs de la maison en icônes (pas de paragraphes)
 * - Section statistiques/chiffres clés
 * - Vidéo immersive de la marque
 * 
 * Principe : montrer plutôt qu'expliquer, zéro blabla.
 */

import { motion } from "framer-motion";
import { Gem, Truck, Shield, Heart } from "lucide-react";
import AnimatedSection from "../components/ui/AnimatedSection";

export default function About() {
  /* Valeurs de la maison en format icône + label */
  const values = [
    { icon: Gem, label: "Premium", desc: "Qualité supérieure" },
    { icon: Truck, label: "Livraison", desc: "Rapide et soignée" },
    { icon: Shield, label: "Confiance", desc: "Paiement sécurisé" },
    { icon: Heart, label: "Service", desc: "Client privilégié" },
  ];

  /* Statistiques clés de la marque */
  const stats = [
    { value: "500+", label: "Clients" },
    { value: "98%", label: "Satisfaction" },
    { value: "48h", label: "Livraison" },
    { value: "2026", label: "Depuis" },
  ];

  return (
    <>
      {/* ---- Hero section About ---- */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        {/* Image de fond premium */}
        <img
          src="/assets/images/WhatsApp Image 2026-03-24 at 01.27.08.jpeg"
          alt="Maison Rassoul"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/50 to-noir-900/20" />

        {/* Texte overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pb-16 md:pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
                Notre identité
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream leading-[0.9]">
              Maison Rassoul
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ---- Valeurs de la maison en grille d'icônes ---- */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl bg-noir-800 border border-white/[0.06] p-6 md:p-8 text-center hover:border-gold/20 transition-all duration-300 group">
                  {/* Icône avec fond doré subtil */}
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                    <Icon size={22} className="text-gold" />
                  </div>
                  {/* Label principal */}
                  <h3 className="font-serif text-lg text-cream mb-1">{item.label}</h3>
                  {/* Description courte */}
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* ---- Statistiques clés ---- */}
      <section className="w-full px-4 md:px-8 lg:px-12 pb-16 md:pb-24">
        <AnimatedSection>
          <div className="rounded-2xl bg-gradient-to-br from-noir-800 to-noir-700 border border-white/[0.06] p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  {/* Chiffre en grand avec gradient doré */}
                  <div className="text-3xl md:text-4xl font-serif font-semibold text-gradient-gold mb-2">
                    {stat.value}
                  </div>
                  {/* Label discret */}
                  <span className="text-xs uppercase tracking-[0.15em] text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ---- Vidéo immersive de la marque ---- */}
      <section className="w-full px-4 md:px-8 lg:px-12 pb-16 md:pb-24">
        <AnimatedSection>
          <div className="rounded-2xl overflow-hidden aspect-video border border-white/[0.06]">
            <video
              src="/assets/videos/WhatsApp Video 2026-03-24 at 01.27.56.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}

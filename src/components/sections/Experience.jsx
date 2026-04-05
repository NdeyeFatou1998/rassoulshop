/**
 * Composant Experience - Section immersive vidéo + texte
 * 
 * Layout split-screen premium :
 * - Vidéo à gauche (ou plein écran sur mobile)
 * - Texte minimaliste à droite avec fond sombre
 * - Icônes de features au lieu de listes textuelles
 * - Animation au scroll
 * - Design noir profond avec accent doré
 */

import { Smartphone, Zap, Eye } from "lucide-react";
import AnimatedSection from "../ui/AnimatedSection";

export default function Experience() {
  /* Features avec icônes - pas de longs textes */
  const features = [
    { icon: Zap, label: "Achat rapide" },
    { icon: Eye, label: "Visuels immersifs" },
    { icon: Smartphone, label: "Mobile premium" },
  ];

  return (
    <section className="w-full px-3 md:px-5 lg:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
        {/* ---- Image immersive (remplace la vidéo) ---- */}
        <AnimatedSection direction="left">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-auto md:h-full min-h-[400px]">
            <img
              src="/assets/images/WhatsApp Image 2026-03-24 at 01.27.15.jpeg"
              alt="Expérience Rassoul Shop"
              className="w-full h-full object-cover"
            />
            {/* Overlay léger */}
            <div className="absolute inset-0 bg-noir-900/10" />
          </div>
        </AnimatedSection>

        {/* ---- Contenu texte minimaliste ---- */}
        <AnimatedSection direction="right" className="flex">
          <div className="flex-1 rounded-2xl bg-noir-800 border border-white/[0.06] p-8 md:p-12 flex flex-col justify-center">
            {/* Kicker */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-gold" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
                Expérience
              </span>
            </div>

            {/* Titre */}
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-cream leading-tight mb-6">
              Précis. Immersif.
            </h2>

            {/* Features en icônes - compact et visuel */}
            <div className="space-y-5">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <span className="text-sm text-cream/70">{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

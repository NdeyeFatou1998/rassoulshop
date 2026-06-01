/**
 * Composant Experience — Section "Pourquoi Rassoul"
 * 
 * Design luxe :
 * - Image à gauche avec overlay subtil
 * - Texte à droite avec arguments de vente
 * - Icônes premium pour chaque feature
 * - Adapté au positionnement boutique cadeau
 */

import { Gift, Truck, Shield, Sparkles } from "lucide-react";
import AnimatedSection from "../ui/AnimatedSection";

export default function Experience() {
  /* Arguments de vente pour une boutique cadeau */
  const features = [
    { icon: Gift, label: "Emballage cadeau offert", desc: "Chaque commande est soigneusement emballée" },
    { icon: Truck, label: "Livraison soignée", desc: "Rapide et sécurisée partout au Sénégal" },
    { icon: Shield, label: "Qualité garantie", desc: "Produits sélectionnés et vérifiés" },
    { icon: Sparkles, label: "Personnalisation", desc: "Gravure et broderie sur demande" },
  ];

  return (
    <section className="bg-noir-950 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <AnimatedSection direction="up">
          <div className="py-4 md:py-0 text-center md:text-left">
            {/* Kicker */}
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-medium">
              Pourquoi nous choisir
            </span>
            {/* Titre */}
            <h2 className="font-serif text-3xl md:text-4xl text-cream mt-3 mb-3 leading-tight">
              L'art d'offrir,<br />réinventé.
            </h2>
            <p className="text-sm text-cream/40 leading-relaxed mb-8 max-w-md">
              Chez Rassoul, chaque cadeau est une expérience. De la sélection à la livraison, nous prenons soin de chaque détail.
            </p>

            {/* Features */}
            <div className="space-y-5">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/[0.07] border border-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={17} strokeWidth={1.5} className="text-gold/70" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cream/80">{feature.label}</p>
                      <p className="text-xs text-cream/35 mt-0.5">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

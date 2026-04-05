/**
 * Composant Editorial - Section éditorial visuel
 * 
 * Grille asymétrique de 3 images grand format avec texte overlay :
 * - Layout créatif asymétrique (1 grande + 2 petites empilées)
 * - Images LOCALES du dossier assets/images
 * - Full-width : padding minimal, pas de max-w restrictif
 * - Overlay text minimal au hover
 * - Animations d'entrée au scroll
 * - Design type magazine de mode
 * - Zéro blabla, impact visuel maximum
 */

import AnimatedSection from "../ui/AnimatedSection";

export default function Editorial() {
  /* Données des cartes éditoriales avec images locales */
  const cards = [
    {
      image: "/assets/images/product-04.jpeg",
      label: "Éditorial",
      tag: "Signature",
    },
    {
      image: "/assets/images/product-05.jpeg",
      label: "Direction",
      tag: "Luxe",
    },
    {
      image: "/assets/images/product-10.jpeg",
      label: "Capsule",
      tag: "Exclusive",
    },
  ];

  return (
    <section className="w-full px-3 md:px-5 lg:px-8 py-12 md:py-20">
      {/* Layout asymétrique : 1 grande image à gauche + 2 empilées à droite */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 md:gap-3 auto-rows-[200px] md:auto-rows-[280px]">
        {/* Grande image (occupe 3 colonnes + 2 rangées) */}
        <AnimatedSection delay={0} className="md:col-span-3 md:row-span-2">
          <div className="group relative rounded-2xl overflow-hidden w-full h-full cursor-pointer border border-white/[0.03] hover:border-gold/15 transition-all duration-500">
            <img
              src={cards[0].image}
              alt={cards[0].label}
              loading="lazy"
              className="w-full h-full object-cover img-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-7">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-gold/80 font-semibold">
                {cards[0].tag}
              </span>
              <h3 className="font-serif text-xl md:text-3xl text-cream mt-1">
                {cards[0].label}
              </h3>
            </div>
          </div>
        </AnimatedSection>

        {/* 2 images empilées à droite (chacune 2 colonnes, 1 rangée) */}
        {cards.slice(1).map((card, i) => (
          <AnimatedSection key={i} delay={(i + 1) * 0.12} className="md:col-span-2">
            <div className="group relative rounded-2xl overflow-hidden w-full h-full cursor-pointer border border-white/[0.03] hover:border-gold/15 transition-all duration-500">
              <img
                src={card.image}
                alt={card.label}
                loading="lazy"
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gold/80 font-semibold">
                  {card.tag}
                </span>
                <h3 className="font-serif text-base md:text-xl text-cream mt-0.5">
                  {card.label}
                </h3>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

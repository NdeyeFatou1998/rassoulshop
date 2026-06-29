/**
 * Page Home — Accueil premium blanc doré + accents noirs
 * Inspiration e-commerce luxe (grille aérée, titres noirs, bandes contrastées)
 */

import Hero from "../components/sections/Hero";
import FilterableProductGrid from "../components/sections/FilterableProductGrid";
import MarqueeStrip from "../components/ui/MarqueeStrip";
import BrandStatement from "../components/ui/BrandStatement";

export default function Home() {
  return (
    <div className="home-premium">
      <Hero
        variant="premium"
        imageSrc="/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"
        title="L'art d'offrir"
        subtitle="Offrez plus qu'un cadeau, offrez une émotion !"
      />

      <MarqueeStrip variant="dark" />

      <FilterableProductGrid
        limit={60}
        showPromoCards={false}
        lightBackground
        premium
        showPageHeader
      />

      <BrandStatement variant="dark" />
    </div>
  );
}

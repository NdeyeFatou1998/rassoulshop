/**
 * Page Home — Accueil Rassoul Shop
 *
 * Composition :
 * - Hero plein écran (image + titre + CTAs)
 * - Corps de page en blanc doré (produits, bandeau, citation)
 */

import Hero from "../components/sections/Hero";
import FilterableProductGrid from "../components/sections/FilterableProductGrid";
import MarqueeStrip from "../components/ui/MarqueeStrip";
import BrandStatement from "../components/ui/BrandStatement";

const HOME_BG = "linear-gradient(180deg, #FFFCF5 0%, #F8F0E0 45%, #F3E8D2 100%)";

export default function Home() {
  return (
    <>
      <Hero
        imageSrc="/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"
        title="L'art d'offrir"
        subtitle="Offrez plus qu'un cadeau, offrez une émotion !"
      />

      <div style={{ background: HOME_BG }}>
        <MarqueeStrip lightBackground />
        <FilterableProductGrid limit={60} showPromoCards={false} lightBackground />
        <BrandStatement lightBackground />
      </div>
    </>
  );
}

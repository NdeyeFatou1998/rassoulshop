/**
 * Page Home — Accueil premium blanc doré + accents noirs
 * Inspiration e-commerce luxe (grille aérée, titres noirs, bandes contrastées)
 */

import { useState, useEffect } from "react";
import Hero from "../components/sections/Hero";
import FilterableProductGrid from "../components/sections/FilterableProductGrid";
import MarqueeStrip from "../components/ui/MarqueeStrip";
import BrandStatement from "../components/ui/BrandStatement";
import { fetchHomeBanner } from "../services/api";
import { DEFAULT_HOME_BANNER } from "../constants/home";

export default function Home() {
  const [heroImage, setHeroImage] = useState(DEFAULT_HOME_BANNER);

  useEffect(() => {
    fetchHomeBanner().then((banner) => {
      if (banner?.src) setHeroImage(banner.src);
    });
  }, []);

  return (
    <div className="home-premium">
      <Hero
        variant="premium"
        imageSrc={heroImage}
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

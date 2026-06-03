/**
 * Page Home — Accueil Rassoul Shop
 *
 * Composition :
 * - Hero plein écran (image + titre + CTAs)
 * - FilterableProductGrid — tous les produits + filtre par catégorie
 */

import Hero from "../components/sections/Hero";
import FilterableProductGrid from "../components/sections/FilterableProductGrid";
import MarqueeStrip from "../components/ui/MarqueeStrip";
import BrandStatement from "../components/ui/BrandStatement";

export default function Home() {
  return (
    <>
      {/* ---- Hero encadré avec spinning border ---- */}
      <Hero
        imageSrc="/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"
        title="Cadeaux d'exception"
        subtitle="Peluches, montres, bijoux et coffrets premium — Dakar, Sénégal."
      />

      {/* ---- Bande défilante marketing ---- */}
      <MarqueeStrip />

      {/* ---- Grille produits filtrables (avec filtres catégories) ---- */}
      <FilterableProductGrid limit={60} showPromoCards={false} />

      {/* ---- Citation de marque premium ---- */}
      <BrandStatement />
    </>
  );
}

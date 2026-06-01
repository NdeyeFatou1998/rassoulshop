/**
 * Page Home — Accueil Rassoul Shop
 *
 * Composition :
 * - Hero plein écran (image + titre + CTAs)
 * - FilterableProductGrid — tous les produits + filtre par catégorie
 * - Experience — section "Pourquoi nous choisir"
 */

import Hero from "../components/sections/Hero";
import Experience from "../components/sections/Experience";
import FilterableProductGrid from "../components/sections/FilterableProductGrid";
import CategoryCircles from "../components/ui/CategoryCircles";
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

      {/* ---- Catégories créées par l'admin (avec images) ---- */}
      <CategoryCircles />

      {/* ---- Grille produits filtrables (avec cards promo inline) ---- */}
      <FilterableProductGrid limit={60} />

      {/* ---- Citation de marque premium ---- */}
      <BrandStatement />

      {/* ---- Section pourquoi nous choisir ---- */}
      <Experience />
    </>
  );
}

/**
 * Page Home - Page d'accueil Rassoul Shop
 * 
 * Compose les sections principales du site :
 * 1. Hero plein écran avec PHOTO de fond (plus de vidéo)
 * 2. Section éditorial visuel (images locales)
 * 3. Grille produits sélection (8 produits)
 * 4. Section expérience immersive image + features
 * 
 * Design : focus visuel, minimum de texte, impact immédiat.
 */

import Hero from "../components/sections/Hero";
import ProductGrid from "../components/sections/ProductGrid";
import Experience from "../components/sections/Experience";
import PromoBanner from "../components/ui/PromoBanner";
import CategoryCircles from "../components/ui/CategoryCircles";

export default function Home() {
  return (
    <>
      {/* Bannière promotions défilante avec minuteur (masquée si aucune promo) */}
      <PromoBanner />

      {/* Section héro plein écran avec photo de fond */}
      <Hero
        imageSrc="/assets/images/WhatsApp Image 2026-03-24 at 01.27.57.jpeg"
        title="Silhouette premium"
        subtitle="Design dense, visuel, immersif."
      />

      {/* Catégories boutique — cercles horizontaux (défilement) */}
      <CategoryCircles />

      {/* Grille de 8 produits sélectionnés */}
      <ProductGrid limit={8} showTitle={true} />

      {/* Section expérience — image + features icônes */}
      <Experience />
    </>
  );
}

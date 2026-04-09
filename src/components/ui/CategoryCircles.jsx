/**
 * CategoryCircles — Bandeau de catégories en “circle UI” (Home)
 *
 * Objectif UI/UX :
 * - Proposer 6 catégories en accès rapide juste après le Hero.
 * - Style premium discret : cercles, bordure subtile dorée, fond sombre.
 * - Défilement horizontal automatique (marquee) + pause au survol.
 *
 * Comportement :
 * - Chaque cercle est un lien vers /shop?category=<slug>.
 */

import { Link } from "react-router-dom";
import { Shirt, Watch, Sparkles, Footprints, ShoppingBag, ToyBrick } from "lucide-react";

const CATEGORIES = [
  { label: "Habillements", slug: "habillements", Icon: Shirt },
  { label: "Accessoires", slug: "accessoires", Icon: Watch },
  { label: "Peluches", slug: "peluches", Icon: ToyBrick },
  { label: "Chaussures", slug: "chaussures", Icon: Footprints },
  { label: "Sacs", slug: "sacs", Icon: ShoppingBag },
  { label: "Parfums", slug: "parfums", Icon: Sparkles },
];

function CategoryItem({ label, slug, Icon }) {
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(slug)}`}
      className="group inline-flex flex-col items-center justify-center mx-4 md:mx-6"
    >
      <div className="relative w-[68px] h-[68px] md:w-[78px] md:h-[78px] rounded-full overflow-hidden bg-gradient-to-br from-gold via-gold-light to-gold border border-gold/40 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_55%)]" />
        <div className="absolute inset-0 opacity-60 mix-blend-overlay bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.22)_38%,transparent_58%,transparent_100%)]" />

        <Icon
          size={20}
          className="relative z-10 text-noir-950/90 group-hover:text-noir-950 transition-colors"
        />
      </div>
      <span className="mt-2 text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-gold/80 group-hover:text-gold transition-colors">
        {label}
      </span>
    </Link>
  );
}

export default function CategoryCircles() {
  return (
    <section className="w-full px-3 md:px-5 lg:px-8 pt-4 md:pt-6">
      <div className="overflow-hidden border-y border-white/[0.04] bg-[#070707]">
        <div className="marquee-track flex whitespace-nowrap py-5">
          {CATEGORIES.map((c) => (
            <CategoryItem key={`a-${c.slug}`} {...c} />
          ))}
          {CATEGORIES.map((c) => (
            <CategoryItem key={`b-${c.slug}`} {...c} />
          ))}
          {CATEGORIES.map((c) => (
            <CategoryItem key={`c-${c.slug}`} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

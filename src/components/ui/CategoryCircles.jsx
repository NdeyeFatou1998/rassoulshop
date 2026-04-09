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
      <div className="w-[68px] h-[68px] md:w-[78px] md:h-[78px] rounded-full bg-noir-900/80 border border-gold/15 group-hover:border-gold/35 transition-colors flex items-center justify-center">
        <Icon size={20} className="text-gold/80 group-hover:text-gold transition-colors" />
      </div>
      <span className="mt-2 text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-cream/55 group-hover:text-cream/80 transition-colors">
        {label}
      </span>
    </Link>
  );
}

export default function CategoryCircles() {
  return (
    <section className="w-full px-3 md:px-5 lg:px-8 pt-10 md:pt-12">
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

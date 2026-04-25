/**
 * CategoryCircles — Bandeau de catégories (Home + Shop)
 *
 * Design premium sur fond blanc :
 * - Fond blanc avec bordure grise discrète
 * - Grands cercles crème avec icônes, bordure gold au hover
 * - Labels lisibles en gris sombre
 * - Scroll horizontal fluide mobile, row centrée desktop
 */

import { Link } from "react-router-dom";
import { Heart, Watch, Gem, Gift, ShoppingBag, Pen } from "lucide-react";

/* Catégories réelles du shop cadeau */
const CATEGORIES = [
  { label: "Peluches",    slug: "peluches",     Icon: Heart },
  { label: "Montres",     slug: "montres",       Icon: Watch },
  { label: "Bijoux",      slug: "bijoux",        Icon: Gem },
  { label: "Sets Cadeau", slug: "sets-cadeau",   Icon: Gift },
  { label: "Sacs",        slug: "sacs",          Icon: ShoppingBag },
  { label: "Accessoires", slug: "accessoires",   Icon: Pen },
];

function CategoryItem({ label, slug, Icon }) {
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(slug)}`}
      className="group flex-shrink-0 flex flex-col items-center gap-3"
    >
      {/* Cercle dark avec bordure gold au hover */}
      <div className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-full bg-[#111110] border border-white/[0.08] flex items-center justify-center transition-all duration-400 group-hover:border-gold/50 group-hover:bg-gold/[0.07] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(197,165,90,0.15)]">
        <Icon
          size={22}
          strokeWidth={1.5}
          className="text-white/50 transition-colors duration-400 group-hover:text-gold"
        />
      </div>
      {/* Label blanc → gold au hover */}
      <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-white/40 group-hover:text-gold transition-colors duration-300 whitespace-nowrap">
        {label}
      </span>
    </Link>
  );
}

export default function CategoryCircles() {
  return (
    <section className="bg-[#080807] border-y border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 md:py-10">
        <div className="flex items-center gap-8 md:gap-10 overflow-x-auto no-scrollbar md:justify-center">
          {CATEGORIES.map((c) => (
            <CategoryItem key={c.slug} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

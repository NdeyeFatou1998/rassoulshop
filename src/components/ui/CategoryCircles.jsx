/**
 * CategoryCircles — Catégories admin avec images (page d'accueil)
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCategoryImageUrl } from "../../utils/categoryImage";

export default function CategoryCircles() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories?active=true")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d.categoriesFull) ? d.categoriesFull : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[#080807] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10 md:py-12">
          <div className="h-4 w-32 shimmer rounded-full mx-auto mb-8" />
          <div className="flex gap-4 overflow-hidden justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shimmer" />
                <div className="h-2 w-16 shimmer rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="bg-[#080807] border-y border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10 md:py-12">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold/70 font-semibold mb-2">
            Explorer
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-cream">Nos catégories</h2>
        </div>

        <div className="flex items-start gap-5 md:gap-8 overflow-x-auto no-scrollbar md:justify-center pb-1">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="group flex-shrink-0 flex flex-col items-center gap-3 w-[88px] md:w-[104px]"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111110] transition-all duration-400 group-hover:border-gold/40 group-hover:shadow-[0_0_20px_rgba(215,161,43,0.15)] group-hover:scale-[1.03]">
                  <img
                    src={getCategoryImageUrl(cat.image_url)}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryImageUrl(null);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-white/45 group-hover:text-gold transition-colors duration-300 text-center leading-snug line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

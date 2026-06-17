/**
 * SearchOverlay — Recherche globale produits + coffrets
 * Ouvert via l'icône loupe dans la navbar
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingCart, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../services/api";

const GOLD = "#C8A84B";
const GOLD_LIGHT = "#F0D060";

/* Chargement unique au premier ouverture */
let cachedProducts = null;
let cachedGiftBoxes = null;

async function loadAll() {
  const [products, giftBoxesRes] = await Promise.all([
    cachedProducts ? Promise.resolve(cachedProducts) : fetchProducts({ limit: 200 }),
    cachedGiftBoxes
      ? Promise.resolve(cachedGiftBoxes)
      : fetch("/api/gift-boxes").then(r => r.json()).then(d => (d.giftBoxes || []).filter(b => b.active && Number(b.stock) > 0)),
  ]);
  cachedProducts = products || [];
  cachedGiftBoxes = Array.isArray(cachedGiftBoxes) ? cachedGiftBoxes : (cachedGiftBoxes || []);
  return { products: cachedProducts, giftBoxes: Array.isArray(cachedGiftBoxes) ? cachedGiftBoxes : [] };
}

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [allGiftBoxes, setAllGiftBoxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  /* Charger les données à l'ouverture */
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 120);
    if (allProducts.length === 0) {
      setLoading(true);
      loadAll().then(({ products, giftBoxes }) => {
        setAllProducts(products);
        setAllGiftBoxes(giftBoxes);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [open]);

  /* Fermer sur Escape */
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Filtrage */
  const q = query.trim().toLowerCase();
  const filteredProducts = q.length >= 1
    ? allProducts.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      ).slice(0, 8)
    : allProducts.slice(0, 6);

  const filteredGiftBoxes = q.length >= 1
    ? allGiftBoxes.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
      ).slice(0, 4)
    : allGiftBoxes.slice(0, 3);

  const hasResults = filteredProducts.length > 0 || filteredGiftBoxes.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(8,6,2,0.88)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-[61] max-h-[85vh] overflow-y-auto"
            style={{
              background: "linear-gradient(180deg, #1c160e 0%, #131108 100%)",
              borderBottom: "1px solid rgba(197,165,90,0.30)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            {/* Barre de recherche */}
            <div className="max-w-3xl mx-auto px-4 py-5">
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(197,165,90,0.35)" }}
              >
                <Search size={18} style={{ color: GOLD, flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher un produit, un coffret, une catégorie…"
                  className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-white/35"
                  style={{ color: "#f0ead8" }}
                />
                {query && (
                  <button onClick={() => setQuery("")} className="transition-opacity hover:opacity-70">
                    <X size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="ml-1 p-1 rounded-lg transition-colors"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Résultats */}
            <div className="max-w-3xl mx-auto px-4 pb-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${GOLD} transparent transparent transparent` }} />
                  <span className="ml-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Chargement…</span>
                </div>
              ) : !hasResults && q.length > 0 ? (
                <p className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Aucun résultat pour "<span style={{ color: GOLD }}>{query}</span>"
                </p>
              ) : (
                <div className="space-y-6">

                  {/* Produits */}
                  {filteredProducts.length > 0 && (
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color: GOLD }}>
                        Produits · {filteredProducts.length}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredProducts.map(p => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={onClose}
                            className="group flex gap-3 rounded-xl p-2.5 transition-all duration-200"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(197,165,90,0.15)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(197,165,90,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={p.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold truncate" style={{ color: "#D4BA78" }}>{p.title}</p>
                              <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>{p.category}</p>
                              <p className="text-[11px] font-bold mt-1" style={{ color: "#f0ead8" }}>
                                {(p.promo_active && p.promo_price ? p.promo_price : p.price)?.toLocaleString("fr-FR")}
                                <span className="text-[8px] ml-0.5" style={{ color: "rgba(240,234,216,0.55)" }}>FCFA</span>
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coffrets */}
                  {filteredGiftBoxes.length > 0 && (
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color: GOLD }}>
                        Coffrets · {filteredGiftBoxes.length}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredGiftBoxes.map(b => (
                          <Link
                            key={b.id}
                            to={`/gift-boxes/${b.id}`}
                            onClick={onClose}
                            className="group flex gap-3 rounded-xl p-2.5 transition-all duration-200"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(197,165,90,0.15)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(197,165,90,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "#2a2416" }}>
                              {b.image
                                ? <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                                : <Gift size={20} style={{ color: GOLD }} />
                              }
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold truncate" style={{ color: "#D4BA78" }}>{b.name}</p>
                              <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>Coffret</p>
                              <p className="text-[11px] font-bold mt-1" style={{ color: "#f0ead8" }}>
                                {(b.price || 0).toLocaleString("fr-FR")}
                                <span className="text-[8px] ml-0.5" style={{ color: "rgba(240,234,216,0.55)" }}>FCFA</span>
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Voir tout */}
                  {q && (
                    <div className="flex gap-3 pt-2">
                      <Link
                        to={`/shop?q=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold px-4 py-2 rounded-full transition-all"
                        style={{ background: "rgba(197,165,90,0.12)", color: GOLD, border: "1px solid rgba(197,165,90,0.30)" }}
                      >
                        Tous les produits <ArrowRight size={12} />
                      </Link>
                      <Link
                        to="/gift-boxes"
                        onClick={onClose}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold px-4 py-2 rounded-full transition-all"
                        style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.10)" }}
                      >
                        Tous les coffrets <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

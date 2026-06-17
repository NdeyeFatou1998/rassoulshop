/**
 * Page ProductDetail — Fiche produit premium
 *
 * - Grande image encadrée (cadre doré + glow + zoom léger)
 * - Colonne d'infos collante sur desktop
 * - Prix soigné (dégradé or), promo, variantes, quantité + CTA
 * - Rangée de garanties (livraison, paiement, emballage)
 * - Animation fly-to-cart conservée + produits similaires
 */

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, Minus, Plus, ShoppingCart, ArrowLeft, Check,
  Truck, ShieldCheck, Gift,
} from "lucide-react";
import { fetchProducts, fetchProductById } from "../services/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ui/ProductCard";

const GOLD = "#D7A12B";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [added, setAdded] = useState(false);
  const { addToCart, flyTargetRef } = useCart();
  const imgRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setAdded(false);
    setSelectedVariants({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    Promise.all([fetchProductById(id), fetchProducts({})])
      .then(([detail, products]) => {
        const found = detail?.product || null;
        setProduct(found);
        if (found) {
          const sameCategory = products.filter(
            (p) => p.category === found.category && p.id !== found.id
          );
          setSimilar(
            sameCategory.length > 0
              ? sameCategory
              : products.filter((p) => p.id !== found.id).slice(0, 4)
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!product) return;

    if (imgRef.current && flyTargetRef.current) {
      const imgRect = imgRef.current.getBoundingClientRect();
      const cartRect = flyTargetRef.current.getBoundingClientRect();
      const flyEl = document.createElement("div");
      flyEl.style.cssText = `
        position: fixed;
        top: ${imgRect.top + imgRect.height * 0.3}px;
        left: ${imgRect.left + imgRect.width * 0.3}px;
        width: ${Math.min(imgRect.width * 0.4, 120)}px;
        height: ${Math.min(imgRect.width * 0.4, 120)}px;
        border-radius: 50%;
        overflow: hidden;
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 8px 32px rgba(201,169,110,0.5);
        transition: all 0.65s cubic-bezier(0.32, 0, 0.07, 1);
      `;
      const flyImg = document.createElement("img");
      flyImg.src =
        product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg";
      flyImg.style.cssText = "width:100%;height:100%;object-fit:cover;";
      flyEl.appendChild(flyImg);
      document.body.appendChild(flyEl);
      flyEl.offsetHeight;
      flyEl.style.top = `${cartRect.top + cartRect.height / 2 - 16}px`;
      flyEl.style.left = `${cartRect.left + cartRect.width / 2 - 16}px`;
      flyEl.style.width = "32px";
      flyEl.style.height = "32px";
      flyEl.style.opacity = "0";
      setTimeout(() => flyEl.remove(), 700);
    }

    const hasPromo = product.promo_active && product.promo_price;
    const basePrice = hasPromo ? product.promo_price : product.price;
    const variantsExtra = Object.values(selectedVariants).reduce(
      (acc, v) => acc + (v?.price_modifier || 0),
      0
    );
    const unitPrice = (Number(basePrice) || 0) + variantsExtra;
    addToCart({ ...product, _cartUnitPrice: unitPrice }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  /* ---- Loader ---- */
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-16">
        <div className="h-4 w-24 shimmer rounded-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          <div className="aspect-[4/5] rounded-3xl shimmer" />
          <div className="space-y-4 py-6">
            <div className="h-3 w-24 shimmer rounded-full" />
            <div className="h-9 w-3/4 shimmer rounded-full" />
            <div className="h-6 w-44 shimmer rounded-full" />
            <div className="h-3 w-full shimmer rounded-full mt-6" />
            <div className="h-3 w-5/6 shimmer rounded-full" />
            <div className="h-14 w-full shimmer rounded-full mt-8" />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShoppingCart size={40} className="text-white/15" />
        <p className="text-white/60 text-sm">Produit introuvable</p>
        <Link to="/shop" className="text-gold text-sm underline hover:text-gold-light transition-colors">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const hasPromo = product.promo_active && product.promo_price;
  const basePrice = hasPromo ? product.promo_price : product.price;
  const variantsExtra = Object.values(selectedVariants).reduce(
    (acc, v) => acc + (v?.price_modifier || 0),
    0
  );
  const finalPrice = (Number(basePrice) || 0) + variantsExtra;
  const showRating = product.rating && Number(product.rating) > 0;

  return (
    <div className="relative overflow-hidden">
      {/* Halo doré décoratif en haut */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full opacity-[0.10] blur-[120px]"
        style={{ background: "radial-gradient(circle, #D7A12B 0%, transparent 70%)" }}
      />

      <section className="relative max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-white/55 hover:text-cream text-[11px] uppercase tracking-[0.18em] mb-7 md:mb-10 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Boutique</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 lg:gap-20 items-start">
          {/* ---- Image encadrée ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative md:sticky md:top-28"
          >
            {/* Cadre doré dégradé */}
            <div
              className="relative rounded-[28px] p-[1.5px]"
              style={{
                background:
                  "linear-gradient(150deg, rgba(200,168,75,0.7) 0%, rgba(200,168,75,0.12) 40%, rgba(200,168,75,0.12) 60%, rgba(200,168,75,0.6) 100%)",
                boxShadow: "0 24px 60px -24px rgba(0,0,0,0.85)",
              }}
            >
              <div
                ref={imgRef}
                className="group relative rounded-[26px] overflow-hidden aspect-[4/5] bg-[#161310]"
              >
                <img
                  src={product.image || "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.badge && (
                    <span
                      className="px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] font-bold rounded-full shadow-lg"
                      style={{ background: GOLD, color: "#0c0a07" }}
                    >
                      {product.badge}
                    </span>
                  )}
                  {product.is_vip && (
                    <span
                      className="px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] font-bold rounded-full backdrop-blur-sm"
                      style={{ background: "rgba(0,0,0,0.55)", color: GOLD, border: `1px solid ${GOLD}` }}
                    >
                      ★ VIP
                    </span>
                  )}
                </div>
                {hasPromo && (
                  <span className="absolute top-4 right-4 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white shadow-lg">
                    -{Math.round((1 - product.promo_price / product.price) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* ---- Infos ---- */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col">
            {/* Catégorie */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: GOLD }} />
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-semibold" style={{ color: GOLD }}>
                {product.category_name || product.category}
              </span>
            </motion.div>

            {/* Titre */}
            <motion.h1
              variants={fadeUp}
              className="font-serif text-3xl md:text-4xl lg:text-[2.9rem] text-white leading-[1.12] mb-4"
            >
              {product.title}
            </motion.h1>

            {/* Note */}
            {showRating && (
              <motion.div variants={fadeUp} className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.rating) ? "text-gold fill-gold" : "text-white/15"}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-white/55">{product.rating}</span>
              </motion.div>
            )}

            {/* Prix */}
            <motion.div variants={fadeUp} className="flex items-baseline flex-wrap gap-3 mb-6">
              <p className="text-3xl md:text-4xl font-bold text-gradient-gold leading-none">
                {finalPrice.toLocaleString("fr-FR")}
                <span className="text-base font-semibold text-white/45 ml-1.5">FCFA</span>
              </p>
              {(hasPromo || variantsExtra > 0) && (
                <span className="text-sm text-white/40 line-through">
                  {Number(product.price).toLocaleString("fr-FR")} FCFA
                </span>
              )}
            </motion.div>

            {/* Description */}
            {product.description && (
              <motion.p variants={fadeUp} className="text-[14px] md:text-[15px] text-white/70 leading-relaxed mb-7 max-w-lg">
                {product.description}
              </motion.p>
            )}

            {/* Variantes */}
            {product.variant_types && product.variant_types.length > 0 && (
              <motion.div variants={fadeUp} className="space-y-5 mb-7">
                {product.variant_types.map((type) => (
                  <div key={type.id}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/65 font-semibold">
                        {type.name}
                      </span>
                      {selectedVariants[type.id] && (
                        <span className="text-[10px] text-gold font-medium">
                          — {selectedVariants[type.id].name}
                          {selectedVariants[type.id].price_modifier > 0 && (
                            <span className="text-white/30 ml-1">
                              +{selectedVariants[type.id].price_modifier.toLocaleString("fr-FR")} FCFA
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {type.options.map((opt) => {
                        const isSelected = selectedVariants[type.id]?.id === opt.id;
                        return opt.image ? (
                          <button
                            key={opt.id}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [type.id]: isSelected
                                  ? undefined
                                  : { id: opt.id, name: opt.name, price_modifier: opt.price_modifier },
                              }))
                            }
                            className="flex flex-col items-center gap-1.5 group"
                          >
                            <div
                              className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                isSelected
                                  ? "border-gold scale-105 shadow-[0_0_12px_rgba(215,161,43,0.4)]"
                                  : "border-white/10 group-hover:border-white/30"
                              }`}
                            >
                              <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <Check size={14} className="text-white drop-shadow" strokeWidth={3} />
                                </div>
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-medium transition-colors duration-200 ${
                                isSelected ? "text-gold" : "text-white/40 group-hover:text-white/70"
                              }`}
                            >
                              {opt.name}
                            </span>
                          </button>
                        ) : (
                          <button
                            key={opt.id}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [type.id]: isSelected
                                  ? undefined
                                  : { id: opt.id, name: opt.name, price_modifier: opt.price_modifier },
                              }))
                            }
                            className={`px-4 py-2 rounded-full text-[11px] font-medium border transition-all duration-200 ${
                              isSelected
                                ? "border-gold bg-gold/10 text-gold shadow-[0_0_10px_rgba(215,161,43,0.2)]"
                                : "border-white/15 text-white/65 hover:border-white/40 hover:text-white/90"
                            }`}
                          >
                            {opt.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="h-px bg-white/[0.08] mb-6" />

            {/* Quantité + Ajouter */}
            <motion.div variants={fadeUp} className="flex items-stretch gap-3 mb-7">
              <div className="flex items-center rounded-full border border-white/[0.15] bg-white/[0.03]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-cream/55 hover:text-cream active:scale-90 transition-all"
                  aria-label="Diminuer"
                >
                  <Minus size={15} />
                </button>
                <motion.span
                  key={quantity}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="w-9 text-center text-sm font-semibold text-cream"
                >
                  {quantity}
                </motion.span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-cream/55 hover:text-cream active:scale-90 transition-all"
                  aria-label="Augmenter"
                >
                  <Plus size={15} />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-[11px] md:text-[12px] uppercase tracking-[0.18em] font-bold transition-all duration-300 ${
                  added
                    ? "bg-green-500 text-white shadow-[0_0_24px_rgba(34,197,94,0.35)]"
                    : "text-noir-900 shadow-[0_8px_24px_-6px_rgba(200,168,75,0.6)] hover:shadow-[0_10px_30px_-6px_rgba(200,168,75,0.8)]"
                }`}
                style={added ? undefined : { background: "linear-gradient(100deg, #D7A12B 0%, #FCE9A8 50%, #E0A92A 100%)" }}
              >
                {added ? <Check size={16} strokeWidth={3} /> : <ShoppingCart size={16} />}
                {added ? "Ajouté au panier" : "Ajouter au panier"}
              </motion.button>
            </motion.div>

            {/* Garanties */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2.5">
              {[
                { icon: Truck, label: "Livraison soignée" },
                { icon: ShieldCheck, label: "Paiement sécurisé" },
                { icon: Gift, label: "Emballage offert" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-2 py-3.5"
                >
                  <Icon size={18} style={{ color: GOLD }} strokeWidth={1.6} />
                  <span className="text-[9.5px] md:text-[10px] uppercase tracking-[0.1em] text-white/60 leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <section className="relative max-w-6xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
          <div className="flex items-center gap-3 mb-7 md:mb-9">
            <div className="w-8 h-px" style={{ background: GOLD }} />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-semibold" style={{ color: GOLD }}>
              Vous aimerez aussi
            </span>
          </div>
          <div className="product-grid">
            {similar.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

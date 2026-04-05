/**
 * Page ProductDetail - Fiche produit complète v2
 * 
 * Design premium avec :
 * - Loader shimmer pendant le chargement
 * - Animations staggered (image → infos → CTA)
 * - Grande image avec badge + overlay subtil
 * - Compteur quantité avec animations
 * - Bouton ajouter avec glow + feedback "Ajouté ✓"
 * - Animation fly-to-cart améliorée (bulle ronde)
 * - Section produits similaires
 * - Layout mobile optimisé (image pleine largeur)
 */

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, Check, Truck, Shield } from "lucide-react";
import { fetchProducts } from "../services/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ui/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart, flyTargetRef } = useCart();
  const imgRef = useRef(null);

  /* Charger le produit et les produits similaires */
  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setAdded(false);
    fetchProducts({}).then((products) => {
      const found = products.find((p) => p.id === Number(id));
      setProduct(found || null);
      if (found) {
        const sameCategory = products.filter(
          (p) => p.category === found.category && p.id !== found.id
        );
        setSimilar(sameCategory.length > 0 ? sameCategory : products.filter((p) => p.id !== found.id).slice(0, 4));
      }
      setLoading(false);
    });
  }, [id]);

  /** Animation fly-to-cart améliorée : bulle ronde qui vole */
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
      flyImg.src = product.image;
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

    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  /* Variants pour les animations staggered */
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  /* ---- Loader shimmer ---- */
  if (loading) {
    return (
      <section className="w-full px-4 md:px-8 lg:px-12 pt-24 md:pt-32 pb-16">
        <div className="h-4 w-20 shimmer rounded-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="aspect-[3/4] rounded-2xl shimmer" />
          <div className="space-y-4 py-8">
            <div className="h-3 w-20 shimmer rounded-full" />
            <div className="h-8 w-3/4 shimmer rounded-full" />
            <div className="h-4 w-32 shimmer rounded-full" />
            <div className="h-6 w-40 shimmer rounded-full" />
            <div className="h-3 w-full shimmer rounded-full mt-6" />
            <div className="h-3 w-4/5 shimmer rounded-full" />
            <div className="h-12 w-48 shimmer rounded-full mt-8" />
          </div>
        </div>
      </section>
    );
  }

  /* Produit introuvable */
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShoppingBag size={40} className="text-muted/20" />
        <p className="text-muted text-sm">Produit introuvable</p>
        <Link to="/shop" className="text-gold text-sm underline hover:text-gold-light transition-colors">Retour à la boutique</Link>
      </div>
    );
  }

  return (
    <>
      {/* ---- Détail produit ---- */}
      <section className="w-full px-4 md:px-8 lg:px-12 pt-24 md:pt-32 pb-12 md:pb-16">
        {/* Breadcrumb retour */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-muted hover:text-cream text-xs uppercase tracking-[0.1em] mb-6 md:mb-8 transition-colors btn-press"
          >
            <ArrowLeft size={14} />
            <span>Boutique</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 lg:gap-16">
          {/* ---- Image produit ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div
              ref={imgRef}
              className="rounded-2xl overflow-hidden aspect-[3/4] bg-noir-800 border border-white/[0.05]"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badge en overlay */}
            {product.badge && (
              <span className="absolute top-3 left-3 md:top-4 md:left-4 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] font-bold bg-gold text-noir-900 rounded-full shadow-[0_2px_12px_rgba(201,169,110,0.3)]">
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* ---- Infos produit avec stagger ---- */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center py-2 md:py-4"
          >
            {/* Catégorie */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-6 md:w-8 h-px bg-gold" />
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
                {product.category}
              </span>
            </motion.div>

            {/* Titre */}
            <motion.h1 variants={fadeUp} className="font-serif text-2xl md:text-4xl lg:text-5xl text-cream leading-tight mb-3 md:mb-4">
              {product.title}
            </motion.h1>

            {/* Note étoiles */}
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.round(product.rating) ? "text-gold fill-gold" : "text-muted/20"}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted">{product.rating}</span>
            </motion.div>

            {/* Prix en FCFA — gradient doré animé */}
            <motion.p variants={fadeUp} className="text-2xl md:text-3xl font-bold text-gradient-gold mb-5 md:mb-6">
              {product.price.toLocaleString("fr-FR")} <span className="text-sm font-normal text-muted">FCFA</span>
            </motion.p>

            {/* Description */}
            <motion.p variants={fadeUp} className="text-[13px] text-cream/50 leading-relaxed mb-6 md:mb-8 max-w-lg">
              {product.description}
            </motion.p>

            {/* Séparateur fin */}
            <motion.div variants={fadeUp} className="h-px bg-white/[0.06] mb-5 md:mb-6" />

            {/* ---- Compteur quantité + Bouton Ajouter ---- */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-6">
              {/* Compteur */}
              <div className="flex items-center border border-white/[0.08] rounded-full self-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-cream/50 hover:text-cream active:scale-90 transition-all"
                >
                  <Minus size={14} />
                </button>
                <motion.span
                  key={quantity}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="w-10 text-center text-sm font-semibold text-cream"
                >
                  {quantity}
                </motion.span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-cream/50 hover:text-cream active:scale-90 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Bouton Ajouter avec glow */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-8 md:px-10 py-3.5 rounded-full text-[11px] uppercase tracking-[0.18em] font-bold transition-all duration-400 btn-press ${
                  added
                    ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    : "bg-gold text-noir-900 glow-gold glow-gold-hover"
                }`}
              >
                {added ? <Check size={15} strokeWidth={3} /> : <ShoppingBag size={15} />}
                {added ? "Ajouté" : "Ajouter au panier"}
              </motion.button>
            </motion.div>

            {/* Badges de confiance */}
            <motion.div variants={fadeUp} className="flex items-center gap-5 text-[10px] text-muted/60">
              <span className="flex items-center gap-1.5"><Truck size={12} /> Livraison rapide</span>
              <span className="flex items-center gap-1.5"><Shield size={12} /> Paiement sécurisé</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---- Produits similaires ---- */}
      {similar.length > 0 && (
        <section className="w-full px-4 md:px-8 lg:px-12 pb-16 md:pb-20">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-8 h-px bg-gold" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
              Vous aimerez aussi
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
            {similar.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

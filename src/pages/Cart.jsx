/**
 * Page Cart - Panier d'achat premium v2
 * 
 * Design amélioré :
 * - Animations staggered sur les articles
 * - Compteur animé (scale bounce sur le chiffre)
 * - Suppression avec slide-out à gauche
 * - Résumé sticky avec glow sur le bouton acheter
 * - Badges de confiance (livraison, paiement)
 * - Layout mobile optimisé (résumé en bas)
 * - Panier vide avec illustration animée
 */

import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck, Shield, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 pt-24 md:pt-32 pb-32">
      {/* Breadcrumb retour */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-muted hover:text-cream text-xs uppercase tracking-[0.1em] mb-6 md:mb-8 transition-colors btn-press"
        >
          <ArrowLeft size={14} />
          <span>Continuer mes achats</span>
        </Link>
      </motion.div>

      {/* Titre animé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 md:w-8 h-px bg-gold" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
            Mon panier
          </span>
        </div>
        <h1 className="font-serif text-2xl md:text-4xl text-cream mb-8 md:mb-10">
          Panier <span className="text-muted font-normal text-lg md:text-2xl">({cartCount})</span>
        </h1>
      </motion.div>

      {/* ---- Panier vide ---- */}
      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-16 md:py-24 gap-5"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBag size={44} className="text-muted/20" />
          </motion.div>
          <p className="text-muted text-sm">Votre panier est vide</p>
          <Link
            to="/shop"
            className="px-7 py-3 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold bg-gold text-noir-900 rounded-full glow-gold glow-gold-hover transition-all duration-400 btn-press"
          >
            Découvrir la collection
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* ---- Liste des articles ---- */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -80, transition: { duration: 0.3 } }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 md:gap-5 p-3 md:p-4 rounded-2xl bg-noir-800 border border-white/[0.04] hover:border-gold/10 transition-all duration-300"
                >
                  {/* Image miniature cliquable */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="flex-shrink-0 w-[72px] h-[90px] md:w-24 md:h-[120px] rounded-xl overflow-hidden bg-noir-700"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Infos article */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    <div>
                      {/* Catégorie micro-label */}
                      <p className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] text-gold/50 font-medium mb-0.5">
                        {item.product.category}
                      </p>
                      {/* Titre */}
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-serif text-[13px] md:text-sm text-cream hover:text-gold transition-colors line-clamp-1"
                      >
                        {item.product.title}
                      </Link>
                      {/* Prix unitaire */}
                      <p className="text-[11px] text-muted mt-0.5">
                        {item.product.price.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>

                    {/* Compteur + sous-total */}
                    <div className="flex items-center justify-between mt-2">
                      {/* Compteur +/- */}
                      <div className="flex items-center border border-white/[0.06] rounded-full">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-cream/40 hover:text-cream active:scale-90 transition-all"
                        >
                          <Minus size={11} />
                        </button>
                        <motion.span
                          key={item.quantity}
                          initial={{ scale: 1.4 }}
                          animate={{ scale: 1 }}
                          className="w-7 md:w-8 text-center text-[11px] font-semibold text-cream"
                        >
                          {item.quantity}
                        </motion.span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-cream/40 hover:text-cream active:scale-90 transition-all"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Sous-total ligne */}
                      <span className="text-[12px] md:text-sm font-bold text-cream">
                        {(item.product.price * item.quantity).toLocaleString("fr-FR")} <span className="text-[8px] md:text-[9px] text-muted font-normal">FCFA</span>
                      </span>
                    </div>
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="flex-shrink-0 self-start p-1.5 md:p-2 text-muted/30 hover:text-red-400 active:scale-90 transition-all"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ---- Résumé commande (sidebar) ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 rounded-2xl bg-noir-800 border border-white/[0.04] p-5 md:p-7">
              <h3 className="font-serif text-base md:text-lg text-cream mb-5">Résumé</h3>

              {/* Lignes de détail */}
              <div className="space-y-2.5 mb-5 pb-5 border-b border-white/[0.05]">
                <div className="flex justify-between text-[12px] md:text-sm">
                  <span className="text-muted">Sous-total</span>
                  <span className="text-cream">{cartTotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-[12px] md:text-sm">
                  <span className="text-muted">Livraison</span>
                  <span className="text-gold text-[10px] uppercase tracking-wider font-semibold">Gratuite</span>
                </div>
              </div>

              {/* Total avec gradient doré */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[12px] md:text-sm font-semibold text-cream">Total</span>
                <span className="text-lg md:text-xl font-serif font-bold text-gradient-gold">
                  {cartTotal.toLocaleString("fr-FR")} FCFA
                </span>
              </div>

              {/* Bouton acheter avec glow */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-full bg-gold text-noir-900 text-[11px] uppercase tracking-[0.2em] font-bold glow-gold glow-gold-hover transition-all duration-400 btn-press"
              >
                Acheter maintenant
              </motion.button>

              {/* Vider le panier */}
              <button
                onClick={clearCart}
                className="w-full mt-2.5 py-2.5 rounded-full border border-white/[0.06] text-muted/60 text-[10px] uppercase tracking-[0.15em] hover:border-red-400/20 hover:text-red-400 transition-all duration-300 btn-press"
              >
                Vider le panier
              </button>

              {/* Badges de confiance */}
              <div className="mt-5 pt-4 border-t border-white/[0.04] space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-muted/50">
                  <Truck size={12} /> <span>Livraison rapide sous 48h</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted/50">
                  <Shield size={12} /> <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted/50">
                  <CreditCard size={12} /> <span>Plusieurs moyens de paiement</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

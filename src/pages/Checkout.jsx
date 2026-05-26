/**
 * Page Checkout — Passer une commande
 *
 * Affiche :
 * - Bannière "Vous paierez à la livraison"
 * - Formulaire client : prénom, nom, email (optionnel), téléphone, adresse
 * - Résumé du panier à droite
 * - Bouton "Confirmer la commande"
 * - Écran de succès après envoi
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Truck, Phone, MapPin, User, Mail, CheckCircle, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductUnitPrice } from "../utils/pricing";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  /* Champs du formulaire */
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderReference, setOrderReference] = useState(null);

  /* Helpers */
  function field(key) {
    return {
      value: form[key],
      onChange: e => setForm(f => ({ ...f, [key]: e.target.value }))
    };
  }

  /* Soumission */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (cart.length === 0) { setError("Votre panier est vide."); return; }

    /* Construction des items à envoyer */
    const items = cart.map(({ product, quantity }) => {
      const unitPrice = getProductUnitPrice(product);
      return {
        id: product.id,
        title: product.title,
        price: unitPrice,
        unit_price: unitPrice,
        promo_active: product.promo_active,
        promo_price: product.promo_price,
        quantity,
        image: product.image || null,
      };
    });

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_first_name: form.firstName,
          customer_last_name:  form.lastName,
          customer_email:      form.email || null,
          customer_phone:      form.phone,
          delivery_address:    form.address,
          notes:               form.notes || null,
          items,
          total: cartTotal,
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || "Erreur lors de la commande."); return; }

      /* Succès */
      setOrderReference(
        data.order_reference ||
          data.order?.reference ||
          data.order?.order_reference ||
          null
      );
      clearCart();
      setSuccess(true);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- Écran succès ---- */
  if (success) {
    return (
      <section className="min-h-screen w-full flex flex-col items-center justify-center px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5 text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center"
          >
            <CheckCircle size={40} className="text-emerald-400" />
          </motion.div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold mb-2">Commande reçue</p>
            <h1 className="font-serif text-2xl md:text-3xl text-cream mb-3">Merci pour votre commande !</h1>
            {orderReference && (
              <p className="text-sm text-white/40 mb-2">
                Référence commande :{" "}
                <span className="text-gold font-semibold font-mono tracking-wider">{orderReference}</span>
              </p>
            )}
            <p className="text-sm text-white/40 leading-relaxed">
              Un email de confirmation avec votre facture PDF vous a été envoyé si vous avez renseigné votre adresse email.<br />
              <span className="text-gold/70">Paiement à la livraison.</span>
            </p>
          </div>

          <Link
            to="/shop"
            className="mt-3 px-8 py-3 rounded-full bg-gold text-noir-900 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gold/90 transition-all"
          >
            Continuer mes achats
          </Link>
        </motion.div>
      </section>
    );
  }

  /* ---- Formulaire ---- */
  const inputCls = "w-full px-4 py-3 bg-noir-800 border border-white/[0.07] rounded-xl text-cream text-sm placeholder-white/25 focus:border-gold/50 focus:outline-none transition-colors";
  const labelCls = "block text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-1.5";

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 pt-24 pb-32">

      {/* Retour */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-white/35 hover:text-cream text-xs uppercase tracking-[0.1em] mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Retour au panier
        </Link>
      </motion.div>

      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-px bg-gold" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">Commander</span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-cream">Finaliser ma commande</h1>
      </motion.div>

      {/* ── Bannière paiement à la livraison ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-3 p-4 rounded-2xl bg-gold/[0.08] border border-gold/20 mb-8"
      >
        <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
          <Truck size={18} className="text-gold" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">Vous paierez à la livraison</p>
          <p className="text-[11px] text-white/40 mt-0.5">Aucun paiement en ligne requis — règlement en espèces à la réception</p>
        </div>
      </motion.div>

      {/* Layout 2 colonnes */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* ── Formulaire client ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2 space-y-5"
          >
            <h2 className="font-serif text-lg text-cream">Vos informations</h2>

            {/* Prénom + Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  <span className="inline-flex items-center gap-1.5"><User size={10} />Prénom *</span>
                </label>
                <input {...field("firstName")} required placeholder="Aminata" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>
                  <span className="inline-flex items-center gap-1.5"><User size={10} />Nom *</span>
                </label>
                <input {...field("lastName")} required placeholder="Diallo" className={inputCls} />
              </div>
            </div>

            {/* Email (optionnel) */}
            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1.5"><Mail size={10} />Email <span className="text-white/25 normal-case tracking-normal font-normal">(optionnel)</span></span>
              </label>
              <input {...field("email")} type="email" placeholder="aminata@exemple.com" className={inputCls} />
            </div>

            {/* Téléphone */}
            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1.5"><Phone size={10} />Numéro de téléphone *</span>
              </label>
              <input {...field("phone")} required type="tel" placeholder="+221 77 000 00 00" className={inputCls} />
            </div>

            {/* Adresse */}
            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1.5"><MapPin size={10} />Adresse de livraison *</span>
              </label>
              <textarea
                {...field("address")}
                required
                rows={3}
                placeholder="Rue, quartier, ville…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Notes (optionnel) */}
            <div>
              <label className={labelCls}>Notes <span className="text-white/25 normal-case tracking-normal font-normal">(optionnel)</span></label>
              <textarea
                {...field("notes")}
                rows={2}
                placeholder="Instructions particulières pour la livraison…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">{error}</div>
            )}
          </motion.div>

          {/* ── Résumé commande ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 rounded-2xl bg-noir-800 border border-white/[0.04] p-5 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag size={15} className="text-gold/60" />
                <h3 className="font-serif text-base text-cream">Résumé</h3>
              </div>

              {/* Articles */}
              <div className="space-y-3 mb-5 pb-4 border-b border-white/[0.05] max-h-52 overflow-y-auto">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-noir-700 flex-shrink-0">
                      {product.image
                        ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-white/5" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-cream truncate">{product.title}</p>
                      <p className="text-[10px] text-white/35">×{quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-cream flex-shrink-0">
                      {(getProductUnitPrice(product) * quantity).toLocaleString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Sous-total</span>
                  <span className="text-cream">{cartTotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Livraison</span>
                  <span className="text-gold text-[10px] uppercase tracking-wider font-semibold">Gratuite</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-white/[0.05]">
                  <span className="text-sm text-cream">Total</span>
                  <span className="text-lg font-serif text-gold">{cartTotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>

              {/* Bouton commander */}
              <motion.button
                type="submit"
                disabled={submitting || cart.length === 0}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-full bg-gold text-noir-900 text-[11px] uppercase tracking-[0.2em] font-bold
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gold/90 transition-all duration-300"
              >
                {submitting ? "Envoi en cours…" : "Commander maintenant"}
              </motion.button>

              <p className="text-center text-[10px] text-white/25 mt-3">
                Paiement à la livraison · Livraison gratuite
              </p>
            </div>
          </motion.div>
        </div>
      </form>
    </section>
  );
}

/**
 * Page Checkout — Passer une commande (thème premium clair)
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Phone, MapPin, User, Mail, CheckCircle, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductUnitPrice } from "../utils/pricing";

const inputCls =
  "w-full px-4 py-3 premium-input rounded-xl text-sm text-[#0a0a0a] placeholder-neutral-400 focus:border-[#D7A12B]/60 focus:outline-none transition-colors";
const labelCls =
  "block text-[10px] uppercase tracking-[0.18em] text-neutral-600 font-semibold mb-1.5";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderReference, setOrderReference] = useState(null);

  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [success]);

  function field(key) {
    return {
      value: form[key],
      onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (cart.length === 0) {
      setError("Votre panier est vide.");
      return;
    }

    const items = cart.map(({ product, quantity, personalization }) => {
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
        ...(personalization ? { personalization: String(personalization).trim() } : {}),
      };
    });

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_first_name: form.firstName,
          customer_last_name: form.lastName,
          customer_email: form.email || null,
          customer_phone: form.phone,
          delivery_address: form.address,
          notes: form.notes || null,
          items,
          total: cartTotal,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Erreur lors de la commande.");
        return;
      }

      setOrderReference(
        data.order_reference ||
          data.order?.reference ||
          data.order?.order_reference ||
          null
      );
      clearCart();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      setSuccess(true);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="w-full flex flex-col items-center px-4 pt-24 md:pt-28 pb-16 md:pb-20">
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
            <CheckCircle size={40} className="text-emerald-600" />
          </motion.div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D7A12B] font-semibold mb-2">
              Commande reçue
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-3">
              Merci pour votre commande !
            </h1>
            {orderReference && (
              <p className="text-sm text-neutral-500 mb-2">
                Référence commande :{" "}
                <span className="text-[#D7A12B] font-semibold font-mono tracking-wider">
                  {orderReference}
                </span>
              </p>
            )}
            <p className="text-sm text-neutral-500 leading-relaxed">
              Un email de confirmation avec votre facture PDF vous a été envoyé si vous avez
              renseigné votre adresse email.
              <br />
              <span className="text-[#D7A12B] font-medium">Paiement à la livraison.</span>
            </p>
          </div>

          <Link
            to="/shop"
            className="mt-3 px-8 py-3 rounded-full bg-[#D7A12B] text-[#0a0a0a] text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#E8B945] transition-all"
          >
            Continuer mes achats
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 pt-24 pb-32">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#0a0a0a] text-xs uppercase tracking-[0.1em] mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Retour au panier
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-px bg-[#D7A12B]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D7A12B] font-semibold">
            Commander
          </span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Finaliser ma commande</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-3 p-4 rounded-2xl bg-[#D7A12B]/10 border border-[#D7A12B]/25 mb-8"
      >
        <div className="w-9 h-9 rounded-full bg-[#D7A12B]/20 flex items-center justify-center flex-shrink-0">
          <Truck size={18} className="text-[#D7A12B]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0a0a0a]">Vous paierez à la livraison</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Aucun paiement en ligne requis — règlement en espèces à la réception
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2 space-y-5"
          >
            <h2 className="font-serif text-lg text-[#0a0a0a]">Vos informations</h2>

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

            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={10} />Email{" "}
                  <span className="text-neutral-400 normal-case tracking-normal font-normal">(optionnel)</span>
                </span>
              </label>
              <input {...field("email")} type="email" placeholder="aminata@exemple.com" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1.5"><Phone size={10} />Numéro de téléphone *</span>
              </label>
              <input {...field("phone")} required type="tel" placeholder="+221 77 000 00 00" className={inputCls} />
            </div>

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

            <div>
              <label className={labelCls}>
                Notes{" "}
                <span className="text-neutral-400 normal-case tracking-normal font-normal">(optionnel)</span>
              </label>
              <textarea
                {...field("notes")}
                rows={2}
                placeholder="Instructions particulières pour la livraison…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 rounded-2xl premium-card border border-black/[0.08] p-5 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag size={15} className="text-[#D7A12B]" />
                <h3 className="font-serif text-base text-[#0a0a0a]">Résumé</h3>
              </div>

              <div className="space-y-3 mb-5 pb-4 border-b border-black/[0.08] max-h-52 overflow-y-auto">
                {cart.map(({ product, quantity, personalization, lineKey }) => (
                  <div key={lineKey || product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-black/[0.06]">
                      <img
                        src={
                          product.image ||
                          "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#0a0a0a] font-medium truncate">{product.title}</p>
                      {personalization && (
                        <p className="text-[10px] text-[#D7A12B] mt-0.5 line-clamp-2">
                          Personnalisation : « {personalization} »
                        </p>
                      )}
                      <p className="text-[10px] text-neutral-500">×{quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#0a0a0a] flex-shrink-0">
                      {(getProductUnitPrice(product) * quantity).toLocaleString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Sous-total</span>
                  <span className="text-[#0a0a0a]">{cartTotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Livraison</span>
                  <span className="text-[#D7A12B] text-[10px] uppercase tracking-wider font-semibold">
                    Gratuite
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-black/[0.08]">
                  <span className="text-sm text-[#0a0a0a]">Total</span>
                  <span className="text-lg font-serif text-[#D7A12B]">
                    {cartTotal.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting || cart.length === 0}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-full bg-[#D7A12B] text-[#0a0a0a] text-[11px] uppercase tracking-[0.2em] font-bold
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-[#E8B945] transition-all duration-300"
              >
                {submitting ? "Envoi en cours…" : "Commander maintenant"}
              </motion.button>

              <p className="text-center text-[10px] text-neutral-400 mt-3">
                Paiement à la livraison · Livraison gratuite
              </p>
            </div>
          </motion.div>
        </div>
      </form>
    </section>
  );
}

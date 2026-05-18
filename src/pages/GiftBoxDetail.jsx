/**
 * GiftBoxDetail — /gift-boxes/:id
 * Page détail d'un coffret cadeau : personnalisation + ajout au panier
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, Package, Crown, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function GiftBoxDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [box, setBox]             = useState(null);
  const [boxProducts, setBoxProducts] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  /* Choix du client */
  const [boxType, setBoxType]         = useState("simple");
  const [vipProductId, setVipProductId] = useState(null);
  const [replacements, setReplacements] = useState({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        /* Box détail */
        const res = await fetch(`/api/gift-boxes/${id}`);
        const data = await res.json();
        setBox(data.giftBox || null);

        /* Produits VIP (catégorie Boîtes) */
        const resCats = await fetch("/api/categories?active=true");
        const dataCats = await resCats.json();
        const boitesCat = (dataCats.categoriesFull || []).find(c => c.slug === "boites");
        if (boitesCat) {
          const resProd = await fetch("/api/products");
          const dataProd = await resProd.json();
          setBoxProducts(
            (dataProd.products || []).filter(p => p.category_id === boitesCat.id && p.active)
          );
        }
      } catch (err) {
        console.error("Erreur chargement gift box:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  /** Prix total selon les choix */
  function calcPrice() {
    if (!box) return 0;
    let total = box.price;
    if (boxType === "vip" && vipProductId) {
      const vip = boxProducts.find(p => p.id === vipProductId);
      if (vip) total += Math.round(vip.price * 1.25);
    }
    if (box.is_customizable && box.items) {
      for (const item of box.items) {
        if (item.is_replaceable && replacements[item.item_id]) {
          const rp = item.replacements?.find(r => r.product_id === replacements[item.item_id]);
          if (rp) total += (rp.price - item.price) * item.quantity;
        }
      }
    }
    return total;
  }

  /** Ajout au panier */
  function handleAdd() {
    if (!box) return;
    const finalPrice = calcPrice();
    let desc = boxType === "vip" && vipProductId
      ? `Boîte VIP: ${boxProducts.find(p => p.id === vipProductId)?.title}`
      : "Boîte simple (offerte)";
    if (box.is_customizable && box.items) {
      for (const item of box.items) {
        if (item.is_replaceable && replacements[item.item_id]) {
          const rp = item.replacements?.find(r => r.product_id === replacements[item.item_id]);
          if (rp) desc += ` | ${item.title} → ${rp.title}`;
        }
      }
    }
    addToCart({ id: `giftbox-${box.id}-${Date.now()}`, title: `🎁 ${box.name}`, price: finalPrice, image: box.image, description: desc, isGiftBox: true }, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  const fmt = n => (n || 0).toLocaleString("fr-FR");

  /* ---- Loading ---- */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Gift size={32} className="text-gold/50 animate-pulse" />
    </div>
  );

  /* ---- Not found ---- */
  if (!box) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Gift size={40} className="text-white/10" />
      <p className="text-white/30 text-sm">Coffret introuvable</p>
      <Link to="/gift-boxes" className="text-gold text-sm hover:underline">← Retour aux coffrets</Link>
    </div>
  );

  const finalPrice = calcPrice();

  return (
    <div className="min-h-screen bg-[#080807]">
      <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-20 md:pt-24 pb-24">

        {/* Retour */}
        <Link to="/gift-boxes" className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors mb-8">
          <ArrowLeft size={13} /> Tous les coffrets
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* ---- Image ---- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-80 lg:w-96 flex-shrink-0"
          >
            <div className="rounded-2xl overflow-hidden aspect-square bg-[#141412] border border-white/[0.07]">
              {box.image
                ? <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Gift size={56} className="text-gold/20" /></div>
              }
            </div>
          </motion.div>

          {/* ---- Détails + options ---- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex-1 space-y-6"
          >
            {/* En-tête */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-gold/70 font-semibold mb-2">Coffret cadeau</p>
              <div className="flex items-start gap-3 flex-wrap">
                <h1 className="font-serif text-2xl md:text-3xl text-white leading-tight">{box.name}</h1>
                {box.is_customizable && (
                  <span className="text-[8px] uppercase tracking-wider bg-gold/15 text-gold px-2 py-1 rounded-full border border-gold/20 self-center">
                    Personnalisable
                  </span>
                )}
              </div>
              {box.description && <p className="text-sm text-white/40 mt-2 leading-relaxed">{box.description}</p>}
            </div>

            {/* Composition */}
            {box.items?.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-2.5">Composition</p>
                <div className="flex flex-wrap gap-2">
                  {box.items.map(item => (
                    <span key={item.item_id}
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${
                        item.is_replaceable
                          ? "bg-gold/10 text-gold border-gold/20"
                          : "bg-white/[0.04] text-white/45 border-white/[0.07]"
                      }`}>
                      <Package size={9} />
                      {item.title}{item.quantity > 1 && <span className="ml-0.5 text-gold/70">×{item.quantity}</span>}
                      {item.is_replaceable && <span className="ml-0.5 text-gold/50">↔</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personnalisation articles */}
            {box.is_customizable && box.items?.some(i => i.is_replaceable) && (
              <div className="rounded-xl border border-gold/10 bg-white/[0.02] p-4 space-y-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gold/60 font-semibold">✨ Personnaliser</p>
                {box.items.filter(i => i.is_replaceable).map(item => (
                  <div key={item.item_id}>
                    <p className="text-xs text-white/60 mb-2">
                      Remplacer <span className="text-gold">{item.title}</span> par :
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => { const r = { ...replacements }; delete r[item.item_id]; setReplacements(r); }}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          !replacements[item.item_id] ? "bg-gold/15 border-gold/30 text-gold" : "border-white/[0.08] text-white/40 hover:border-gold/20"
                        }`}
                      >
                        Garder {item.title}
                      </button>
                      {item.replacements?.map(rp => (
                        <button key={rp.product_id}
                          onClick={() => setReplacements(prev => ({ ...prev, [item.item_id]: rp.product_id }))}
                          className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                            replacements[item.item_id] === rp.product_id ? "bg-gold/15 border-gold/30 text-gold" : "border-white/[0.08] text-white/40 hover:border-gold/20"
                          }`}
                        >
                          {rp.title} ({fmt(rp.price)} FCFA)
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Choix emballage */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-3">📦 Emballage</p>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Simple */}
                <button onClick={() => setBoxType("simple")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    boxType === "simple" ? "bg-gold/10 border-gold/30" : "border-white/[0.07] hover:border-gold/15"
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={14} className={boxType === "simple" ? "text-gold" : "text-white/30"} />
                    <span className={`text-xs font-semibold ${boxType === "simple" ? "text-gold" : "text-white/70"}`}>Boîte simple</span>
                  </div>
                  <p className="text-[10px] text-white/30">Emballage standard</p>
                  <p className="text-[10px] text-gold mt-0.5 font-semibold">Gratuit</p>
                </button>
                {/* VIP */}
                <button onClick={() => setBoxType("vip")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    boxType === "vip" ? "bg-gold/10 border-gold/30" : "border-white/[0.07] hover:border-gold/15"
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={14} className={boxType === "vip" ? "text-gold" : "text-white/30"} />
                    <span className={`text-xs font-semibold ${boxType === "vip" ? "text-gold" : "text-white/70"}`}>Boîte VIP</span>
                  </div>
                  <p className="text-[10px] text-white/30">Emballage premium</p>
                  <p className="text-[10px] text-white/25 mt-0.5">+25% sur la boîte</p>
                </button>
              </div>
              {/* Sélection produit VIP */}
              {boxType === "vip" && boxProducts.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {boxProducts.map(bp => {
                    const sel = vipProductId === bp.id;
                    return (
                      <button key={bp.id} onClick={() => setVipProductId(bp.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                          sel ? "bg-gold/10 border-gold/30" : "border-white/[0.07] hover:border-gold/15"
                        }`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${sel ? "border-gold bg-gold/20" : "border-white/20"}`}>
                          {sel && <div className="w-2 h-2 rounded-full bg-gold" />}
                        </div>
                        {bp.image && <img src={bp.image} alt={bp.title} className="w-8 h-8 rounded object-cover" />}
                        <div className="flex-1 text-left">
                          <p className="text-xs text-white/80">{bp.title}</p>
                          <p className="text-[10px] text-gold">{fmt(Math.round(bp.price * 1.25))} FCFA</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Prix + Panier */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 mb-1">Prix total</p>
                <p className="text-2xl font-serif text-gold">{fmt(finalPrice)} <span className="text-sm font-sans text-white/30">FCFA</span></p>
                {finalPrice !== box.price && (
                  <p className="text-[10px] text-white/25 line-through mt-0.5">{fmt(box.price)} FCFA de base</p>
                )}
              </div>
              <button
                onClick={handleAdd}
                disabled={boxType === "vip" && !vipProductId && boxProducts.length > 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider
                            transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                  justAdded ? "bg-green-500 text-white" : "bg-gold text-noir-950 hover:bg-gold/85"
                }`}
              >
                {justAdded ? <><Check size={15} /> Ajouté</> : <><ShoppingCart size={15} /> Ajouter</>}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * GiftBoxDetail — /gift-boxes/:id
 *
 * UX :
 *  1. Header : image coffret + nom + prix de base
 *  2. "Ce coffret contient" : grille de cards produits avec image
 *     - badge doré "Remplaçable" sur les articles échangeables
 *     - clic sur une card remplaçable → ouvre un panel de choix en dessous
 *  3. Emballage : 2 cards Simple / VIP
 *  4. Récap prix + bouton Ajouter au panier
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Package, Crown, ShoppingCart, ArrowLeft, Check, ArrowRight, RefreshCw } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function GiftBoxDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [box, setBox]               = useState(null);
  const [boxProducts, setBoxProducts] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [justAdded, setJustAdded]   = useState(false);

  /* item_id de la card ouverte pour afficher ses options */
  const [openItem, setOpenItem] = useState(null);

  /* Choix du client */
  const [boxType, setBoxType]           = useState("simple");
  const [vipProductId, setVipProductId] = useState(null);
  const [replacements, setReplacements] = useState({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res  = await fetch(`/api/gift-boxes/${id}`);
        const data = await res.json();
        setBox(data.success === false ? null : data);

        const resCats  = await fetch("/api/categories?active=true");
        const dataCats = await resCats.json();
        const boitesCat = (dataCats.categoriesFull || []).find(c => c.slug === "boites");
        if (boitesCat) {
          const resProd  = await fetch("/api/products");
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

  function calcPrice() {
    if (!box) return 0;
    let total = box.price;
    if (boxType === "vip" && vipProductId) {
      const vip = boxProducts.find(p => p.id === vipProductId);
      if (vip) total += Math.round(vip.price * 1.25);
    }
    if (box.items) {
      for (const item of box.items) {
        if (item.is_replaceable && replacements[item.item_id]) {
          const rp = item.replacements?.find(r => r.product_id === replacements[item.item_id]);
          if (rp) total += (rp.price - item.price) * item.quantity;
        }
      }
    }
    return total;
  }

  function handleAdd() {
    if (!box) return;
    const finalPrice = calcPrice();
    let desc = boxType === "vip" && vipProductId
      ? `Boîte VIP: ${boxProducts.find(p => p.id === vipProductId)?.title}`
      : "Boîte simple (offerte)";
    if (box.items) {
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Gift size={32} className="text-gold/50 animate-pulse" />
    </div>
  );

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
      <div className="max-w-4xl mx-auto px-5 lg:px-10 pt-20 md:pt-24 pb-28">

        {/* ── Retour ── */}
        <Link to="/gift-boxes"
          className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors mb-8">
          <ArrowLeft size={13} /> Tous les coffrets
        </Link>

        {/* ── Titre coffret ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="flex flex-col sm:flex-row gap-6 items-start mb-10">
            {/* Image */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#141412]">
              {box.image
                ? <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Gift size={36} className="text-gold/20" /></div>
              }
            </div>
            {/* Infos */}
            <div className="flex-1">
              <p className="text-[9px] uppercase tracking-[0.28em] text-gold/60 mb-2">Coffret cadeau</p>
              <h1 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-2">{box.name}</h1>
              {box.description && <p className="text-sm text-white/40 leading-relaxed">{box.description}</p>}
              <p className="mt-3 text-xl font-semibold text-gold">{fmt(box.price)} <span className="text-xs font-normal text-white/25">FCFA de base</span></p>
            </div>
          </div>
        </motion.div>

        {/* ── Section 1 : Composition ── */}
        {box.items?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35 font-semibold mb-4">
              Ce coffret contient
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {box.items.map((item, i) => {
                const isOpen     = openItem === item.item_id;
                /* article actuellement sélectionné pour ce slot */
                const chosenId   = replacements[item.item_id];
                const chosenRp   = item.replacements?.find(r => r.product_id === chosenId);
                /* ce qu'on affiche dans la card : remplacement choisi ou article original */
                const displayImg = chosenRp?.image || item.image;
                const displayName = chosenRp?.title || item.title;

                return (
                  <motion.div key={item.item_id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}>

                    {/* Card produit */}
                    <div
                      onClick={() => item.is_replaceable && setOpenItem(isOpen ? null : item.item_id)}
                      className={`relative flex flex-col rounded-xl overflow-hidden border transition-all duration-300 ${
                        item.is_replaceable
                          ? "cursor-pointer hover:border-gold/30 hover:shadow-[0_0_16px_rgba(197,165,90,0.07)]"
                          : "cursor-default"
                      } ${
                        isOpen ? "border-gold/40 shadow-[0_0_20px_rgba(197,165,90,0.10)]" : "border-white/[0.07]"
                      } bg-[#0f0f0e]`}
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-[#141412]">
                        {displayImg
                          ? <img src={displayImg} alt={displayName} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Package size={24} className="text-white/10" /></div>
                        }
                        {/* Badge Remplaçable */}
                        {item.is_replaceable && (
                          <span className="absolute top-1.5 left-1.5 flex items-center gap-1 text-[7px] uppercase tracking-wide font-bold bg-gold text-[#0a0a09] px-1.5 py-[2px] rounded-full">
                            <RefreshCw size={7} /> Remplaçable
                          </span>
                        )}
                        {/* Badge "modifié" si remplacement choisi */}
                        {chosenRp && (
                          <span className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </span>
                        )}
                      </div>
                      {/* Infos */}
                      <div className="px-2.5 pt-2 pb-2.5">
                        <p className="text-[11px] font-medium text-white/80 leading-snug line-clamp-2">{displayName}</p>
                        {item.quantity > 1 && (
                          <p className="text-[9px] text-gold/60 mt-0.5">×{item.quantity}</p>
                        )}
                        {item.is_replaceable && (
                          <p className={`text-[9px] mt-1 flex items-center gap-0.5 transition-colors ${isOpen ? "text-gold" : "text-white/30"}`}>
                            {isOpen ? "Fermer" : "Changer"} <ArrowRight size={8} className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Panel options de remplacement */}
                    <AnimatePresence>
                      {isOpen && item.is_replaceable && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 rounded-xl border border-gold/15 bg-[#111110] p-3 space-y-2">
                            <p className="text-[9px] uppercase tracking-wider text-gold/50 font-semibold mb-2">
                              Choisir un remplacement
                            </p>

                            {/* Garder l'original */}
                            <button
                              onClick={() => { setReplacements(prev => { const r = { ...prev }; delete r[item.item_id]; return r; }); setOpenItem(null); }}
                              className={`w-full flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${
                                !chosenId ? "border-gold/30 bg-gold/10" : "border-white/[0.06] hover:border-gold/20"
                              }`}
                            >
                              {item.image
                                ? <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                                : <div className="w-8 h-8 rounded-lg bg-[#1a1a18] flex items-center justify-center"><Package size={12} className="text-white/20" /></div>
                              }
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-medium text-white/80 truncate">{item.title}</p>
                                <p className="text-[9px] text-white/30">{fmt(item.price)} FCFA · Original</p>
                              </div>
                              {!chosenId && <Check size={12} className="text-gold flex-shrink-0" />}
                            </button>

                            {/* Options de remplacement */}
                            {item.replacements?.map(rp => {
                              const sel = chosenId === rp.product_id;
                              return (
                                <button key={rp.product_id}
                                  onClick={() => { setReplacements(prev => ({ ...prev, [item.item_id]: rp.product_id })); setOpenItem(null); }}
                                  className={`w-full flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${
                                    sel ? "border-gold/30 bg-gold/10" : "border-white/[0.06] hover:border-gold/20"
                                  }`}
                                >
                                  {rp.image
                                    ? <img src={rp.image} alt={rp.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                                    : <div className="w-8 h-8 rounded-lg bg-[#1a1a18] flex items-center justify-center"><Package size={12} className="text-white/20" /></div>
                                  }
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-medium text-white/80 truncate">{rp.title}</p>
                                    <p className="text-[9px] text-white/30">{fmt(rp.price)} FCFA</p>
                                  </div>
                                  {sel && <Check size={12} className="text-gold flex-shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Section 2 : Emballage ── */}
        <section className="mb-10">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-white/35 font-semibold mb-4">
            Choisir l'emballage
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Simple */}
            <button onClick={() => setBoxType("simple")}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                boxType === "simple" ? "border-gold/35 bg-gold/[0.07]" : "border-white/[0.07] hover:border-gold/20"
              }`}>
              {boxType === "simple" && <Check size={12} className="absolute top-3 right-3 text-gold" />}
              <Package size={20} className={`mb-2 ${boxType === "simple" ? "text-gold" : "text-white/25"}`} />
              <p className={`text-sm font-semibold ${boxType === "simple" ? "text-gold" : "text-white/70"}`}>Boîte simple</p>
              <p className="text-[10px] text-white/30 mt-0.5">Emballage standard</p>
              <p className="text-[11px] text-gold font-semibold mt-2">Gratuit</p>
            </button>

            {/* VIP */}
            <button onClick={() => setBoxType("vip")}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                boxType === "vip" ? "border-gold/35 bg-gold/[0.07]" : "border-white/[0.07] hover:border-gold/20"
              }`}>
              {boxType === "vip" && <Check size={12} className="absolute top-3 right-3 text-gold" />}
              <Crown size={20} className={`mb-2 ${boxType === "vip" ? "text-gold" : "text-white/25"}`} />
              <p className={`text-sm font-semibold ${boxType === "vip" ? "text-gold" : "text-white/70"}`}>Boîte VIP</p>
              <p className="text-[10px] text-white/30 mt-0.5">Emballage premium</p>
              <p className="text-[11px] text-white/25 mt-2">+25% sur la boîte choisie</p>
            </button>
          </div>

          {/* Sélection boîte VIP */}
          <AnimatePresence>
            {boxType === "vip" && boxProducts.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {boxProducts.map(bp => {
                    const sel = vipProductId === bp.id;
                    return (
                      <button key={bp.id} onClick={() => setVipProductId(bp.id)}
                        className={`relative flex flex-col rounded-xl overflow-hidden border transition-all ${
                          sel ? "border-gold/40 bg-gold/[0.07]" : "border-white/[0.07] hover:border-gold/20"
                        } bg-[#0f0f0e]`}>
                        {sel && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center z-10"><Check size={10} className="text-[#0a0a09]" /></div>}
                        <div className="aspect-square overflow-hidden bg-[#141412]">
                          {bp.image
                            ? <img src={bp.image} alt={bp.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Crown size={20} className="text-gold/20" /></div>
                          }
                        </div>
                        <div className="p-2">
                          <p className="text-[10px] font-medium text-white/70 line-clamp-1">{bp.title}</p>
                          <p className="text-[10px] text-gold mt-0.5">{fmt(Math.round(bp.price * 1.25))} FCFA</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Section 3 : Récap + Panier ── */}
        <div className="sticky bottom-4 md:static rounded-2xl border border-white/[0.08] bg-[#0f0f0e]/90 backdrop-blur-md p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 mb-1">Total</p>
            <p className="text-2xl font-serif text-gold leading-none">
              {fmt(finalPrice)}
              <span className="text-xs font-sans text-white/25 ml-1">FCFA</span>
            </p>
            {finalPrice !== box.price && (
              <p className="text-[9px] text-white/20 line-through mt-0.5">{fmt(box.price)} FCFA</p>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={boxType === "vip" && !vipProductId && boxProducts.length > 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider
                        transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 ${
              justAdded ? "bg-green-500 text-white" : "bg-gold text-[#0a0a09] hover:bg-[#d4b472]"
            }`}
          >
            {justAdded
              ? <><Check size={15} /> Ajouté au panier</>
              : <><ShoppingCart size={15} /> Ajouter au panier</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}

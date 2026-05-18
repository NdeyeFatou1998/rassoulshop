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

import { useState, useEffect, useRef } from "react";
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
  const [openItem, setOpenItem]         = useState(null);
  const [connectorLeft, setConnectorLeft] = useState("50%");
  const cardRefs = useRef({});
  const gridRef  = useRef(null);

  /* Choix du client */
  const [boxType, setBoxType]           = useState("simple");
  const [vipProductId, setVipProductId] = useState(null);
  const [replacements, setReplacements] = useState({});
  const [qty, setQty]                   = useState(1);

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
    /* Les prix viennent du JSON PostgreSQL parfois sous forme de string — parseFloat obligatoire */
    let total = parseFloat(box.price) || 0;
    if (boxType === "vip" && vipProductId) {
      const vip = boxProducts.find(p => p.id === vipProductId);
      if (vip) total += Math.round(parseFloat(vip.price) * 1.25);
    }
    if (box.items) {
      for (const item of box.items) {
        if (item.is_replaceable && replacements[item.item_id]) {
          const rp = item.replacements?.find(r => r.product_id === replacements[item.item_id]);
          if (rp) total += (parseFloat(rp.price) - parseFloat(item.price)) * item.quantity;
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
    addToCart({ id: `giftbox-${box.id}-${Date.now()}`, title: `🎁 ${box.name}`, price: finalPrice, image: box.image, description: desc, isGiftBox: true }, qty);
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
      <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-20 md:pt-24 pb-28">

        {/* ── Retour ── */}
        <Link to="/gift-boxes"
          className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors mb-8">
          <ArrowLeft size={13} /> Tous les coffrets
        </Link>

        {/* ══════════════════════════════════════
            LAYOUT PRINCIPAL : image gauche / infos droite
        ══════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* ── Colonne gauche : image ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full lg:w-[400px] flex-shrink-0"
          >
            <div className="rounded-2xl overflow-hidden aspect-square bg-[#141412] border border-white/[0.07] sticky top-24">
              {box.image
                ? <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Gift size={56} className="text-gold/15" /></div>
              }
            </div>
          </motion.div>

          {/* ── Colonne droite : toutes les infos ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="flex-1 min-w-0 space-y-8"
          >
            {/* En-tête */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-2">{box.name}</h1>
              {box.description && (
                <p className="text-sm text-white/40 leading-relaxed">{box.description}</p>
              )}
              <p className="mt-4 text-2xl font-semibold text-gold">
                {fmt(finalPrice * qty)}
                <span className="text-xs font-normal text-white/25 ml-1.5">FCFA</span>
              </p>
            </div>

            {/* ── Composition ── */}
            {box.items?.length > 0 && (
              <div>
                <h2 className="text-[9px] uppercase tracking-[0.22em] text-white/30 font-semibold mb-3">
                  Ce coffret contient
                </h2>
                {/* Grille : 3 cols mobile → 5 desktop */}
                <div ref={gridRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {box.items.map((item, i) => {
                    const isOpen      = openItem === item.item_id;
                    const chosenId    = replacements[item.item_id];
                    const chosenRp    = item.replacements?.find(r => r.product_id === chosenId);
                    const displayImg  = chosenRp?.image  || item.image;
                    const displayName = chosenRp?.title  || item.title;

                    return (
                      <motion.div key={item.item_id}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                      >
                        {/* Card compacte */}
                        <div
                          ref={(el) => { cardRefs.current[item.item_id] = el; }}
                          onClick={() => {
                            if (!item.is_replaceable) return;
                            const nextOpen = isOpen ? null : item.item_id;
                            setOpenItem(nextOpen);
                            /* Calcul position exacte du centre de la card dans la grille */
                            if (nextOpen && cardRefs.current[item.item_id] && gridRef.current) {
                              const cardRect = cardRefs.current[item.item_id].getBoundingClientRect();
                              const gridRect = gridRef.current.getBoundingClientRect();
                              const center   = cardRect.left + cardRect.width / 2 - gridRect.left;
                              setConnectorLeft(`${center}px`);
                            }
                          }}
                          className={`relative flex flex-col rounded-lg overflow-hidden border transition-all duration-250 ${
                            item.is_replaceable ? "cursor-pointer hover:border-gold/35" : "cursor-default"
                          } ${isOpen ? "border-gold/50 shadow-[0_0_12px_rgba(197,165,90,0.12)]" : "border-white/[0.07]"} bg-[#0f0f0e]`}
                        >
                          <div className="relative aspect-square overflow-hidden bg-[#141412]">
                            {displayImg
                              ? <img src={displayImg} alt={displayName} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-white/10" /></div>
                            }
                            {/* Badge Remp. en haut à gauche */}
                            {item.is_replaceable && (
                              <span className="absolute top-1 left-1 flex items-center gap-0.5 text-[6px] uppercase font-bold bg-gold text-[#0a0a09] px-1.5 py-[2px] rounded-full leading-none">
                                <RefreshCw size={6} /> Remp.
                              </span>
                            )}
                            {/* ×N en haut à droite — gold */}
                            {item.quantity > 1 && (
                              <span className="absolute top-1 right-1 text-[7px] font-bold text-gold bg-gold/20 px-1.5 py-[2px] rounded-full leading-none">
                                ×{item.quantity}
                              </span>
                            )}
                            {/* Checkmark vert si remplacé */}
                            {chosenRp && (
                              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                <Check size={8} className="text-white" />
                              </span>
                            )}
                          </div>
                          <div className="px-1.5 py-1.5">
                            <p className="text-[9px] text-white/65 leading-snug line-clamp-2">{displayName}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ── Panel pleine largeur avec connecteur ── */}
                <AnimatePresence>
                  {openItem !== null && (() => {
                    const item = box.items.find(it => it.item_id === openItem);
                    if (!item) return null;
                    const chosenId   = replacements[openItem];

                    return (
                      <motion.div
                        key={openItem}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="mt-0 relative"
                      >
                        {/* Trait vertical reliant la card au panel — position exacte via DOM ref */}
                        <div className="absolute -top-2 h-2 w-px bg-gold/40" style={{ left: connectorLeft }} />
                        {/* Flèche (notch) pointant vers la card */}
                        <div
                          className="absolute -top-1.5 w-3 h-3 rotate-45 bg-[#111110] border-t border-l border-gold/25"
                          style={{ left: `calc(${connectorLeft} - 6px)` }}
                        />

                        <div className="rounded-xl border border-gold/20 bg-[#111110] p-3">
                          <p className="text-[8px] uppercase tracking-wider text-gold/50 font-semibold mb-3">
                            Remplacer · <span className="text-white/50">{item.title}</span>
                          </p>
                          {/* Choix horizontaux */}
                          <div className="flex gap-2 overflow-x-auto pb-1">

                            {/* Option : garder l'original */}
                            <button
                              onClick={() => { setReplacements(prev => { const r = {...prev}; delete r[item.item_id]; return r; }); setOpenItem(null); }}
                              className={`flex-shrink-0 flex flex-col rounded-lg overflow-hidden border transition-all w-[72px] ${
                                !chosenId ? "border-gold/45 bg-gold/[0.08]" : "border-white/[0.08] hover:border-gold/25"
                              }`}
                            >
                              <div className="relative aspect-square bg-[#1a1a18]">
                                {item.image
                                  ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center"><Package size={12} className="text-white/10" /></div>
                                }
                                {!chosenId && (
                                  <div className="absolute inset-0 flex items-end justify-end p-1">
                                    <Check size={9} className="text-gold" />
                                  </div>
                                )}
                              </div>
                              <div className="p-1 text-center">
                                <p className="text-[7px] text-white/55 line-clamp-2 leading-tight">{item.title}</p>
                                <p className="text-[6px] text-white/25 mt-0.5">{fmt(item.price)} F</p>
                              </div>
                            </button>

                            {/* Alternatives */}
                            {item.replacements?.map(rp => {
                              const sel = chosenId === rp.product_id;
                              return (
                                <button key={rp.product_id}
                                  onClick={() => { setReplacements(prev => ({...prev, [item.item_id]: rp.product_id})); setOpenItem(null); }}
                                  className={`flex-shrink-0 flex flex-col rounded-lg overflow-hidden border transition-all w-[72px] ${
                                    sel ? "border-gold/45 bg-gold/[0.08]" : "border-white/[0.08] hover:border-gold/25"
                                  }`}
                                >
                                  <div className="relative aspect-square bg-[#1a1a18]">
                                    {rp.image
                                      ? <img src={rp.image} alt={rp.title} className="w-full h-full object-cover" />
                                      : <div className="w-full h-full flex items-center justify-center"><Package size={12} className="text-white/10" /></div>
                                    }
                                    {sel && (
                                      <div className="absolute inset-0 flex items-end justify-end p-1">
                                        <Check size={9} className="text-gold" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-1 text-center">
                                    <p className="text-[7px] text-white/55 line-clamp-2 leading-tight">{rp.title}</p>
                                    <p className="text-[6px] text-gold mt-0.5">{fmt(rp.price)} F</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>
            )}

            {/* ── Emballage ── */}
            <div>
              <h2 className="text-[9px] uppercase tracking-[0.22em] text-white/30 font-semibold mb-3">Emballage</h2>
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={() => setBoxType("simple")}
                  className={`relative p-3.5 rounded-xl border text-left transition-all ${
                    boxType === "simple" ? "border-gold/35 bg-gold/[0.07]" : "border-white/[0.07] hover:border-gold/20"
                  }`}>
                  {boxType === "simple" && <Check size={11} className="absolute top-2.5 right-2.5 text-gold" />}
                  <Package size={18} className={`mb-1.5 ${boxType === "simple" ? "text-gold" : "text-white/20"}`} />
                  <p className={`text-xs font-semibold ${boxType === "simple" ? "text-gold" : "text-white/65"}`}>Boîte simple</p>
                  <p className="text-[10px] text-gold font-semibold mt-1">Gratuit</p>
                </button>
                <button onClick={() => setBoxType("vip")}
                  className={`relative p-3.5 rounded-xl border text-left transition-all ${
                    boxType === "vip" ? "border-gold/35 bg-gold/[0.07]" : "border-white/[0.07] hover:border-gold/20"
                  }`}>
                  {boxType === "vip" && <Check size={11} className="absolute top-2.5 right-2.5 text-gold" />}
                  <Crown size={18} className={`mb-1.5 ${boxType === "vip" ? "text-gold" : "text-white/20"}`} />
                  <p className={`text-xs font-semibold ${boxType === "vip" ? "text-gold" : "text-white/65"}`}>Boîte VIP</p>
                  <p className="text-[10px] text-white/25 mt-1">+25% sur la boîte</p>
                </button>
              </div>
              {/* Sélection produit VIP */}
              <AnimatePresence>
                {boxType === "vip" && boxProducts.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {boxProducts.map(bp => {
                        const sel = vipProductId === bp.id;
                        return (
                          <button key={bp.id} onClick={() => setVipProductId(bp.id)}
                            className={`relative flex flex-col rounded-lg overflow-hidden border transition-all bg-[#0f0f0e] ${
                              sel ? "border-gold/40" : "border-white/[0.07] hover:border-gold/20"
                            }`}>
                            {sel && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center z-10"><Check size={8} className="text-[#0a0a09]" /></div>}
                            <div className="aspect-square overflow-hidden bg-[#141412]">
                              {bp.image ? <img src={bp.image} alt={bp.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Crown size={16} className="text-gold/20" /></div>}
                            </div>
                            <div className="p-1.5">
                              <p className="text-[9px] text-white/65 line-clamp-1">{bp.title}</p>
                              <p className="text-[9px] text-gold mt-0.5">{fmt(Math.round(bp.price * 1.25))} FCFA</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Quantité + Panier ── */}
            <div className="flex items-end gap-4 pt-2 border-t border-white/[0.05]">
              {/* Quantité */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/25 mb-2">Quantité</p>
                <div className="flex items-center gap-0 border border-white/[0.1] rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors text-lg font-light">
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white/80">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors text-lg font-light">
                    +
                  </button>
                </div>
              </div>

              {/* Bouton Ajouter */}
              <button
                onClick={handleAdd}
                disabled={boxType === "vip" && !vipProductId && boxProducts.length > 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider
                            transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                  justAdded ? "bg-green-500 text-white" : "bg-gold text-[#0a0a09] hover:bg-[#d4b472]"
                }`}
              >
                {justAdded
                  ? <><Check size={15} /> Ajouté</>
                  : <><ShoppingCart size={15} /> Ajouter au panier — {fmt(finalPrice * qty)} FCFA</>
                }
              </button>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}

/**
 * GiftBoxDetail — /gift-boxes/:id (design premium blanc/noir/or)
 */

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Package, Crown, ShoppingCart, ArrowLeft, Check, RefreshCw } from "lucide-react";
import { useCart } from "../context/CartContext";
import PageHeader from "../components/ui/PageHeader";

const DEFAULT_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#faf7f2"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <rect x="70" y="70" width="660" height="660" rx="48" fill="#ffffff" stroke="#e8dfd0" stroke-width="10"/>
  <path d="M400 245c-42-62-145-42-145 36 0 54 52 89 145 129 93-40 145-75 145-129 0-78-103-98-145-36z" fill="#D7A12B" opacity="0.35"/>
  <text x="400" y="560" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#1a1612" text-anchor="middle">Coffret</text>
  <text x="400" y="604" font-family="Arial, sans-serif" font-size="18" fill="#8a6a42" text-anchor="middle" letter-spacing="2">RASSOUL SHOP</text>
</svg>
`)}`;

export default function GiftBoxDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [box, setBox] = useState(null);
  const [boxProducts, setBoxProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  const [openItem, setOpenItem] = useState(null);
  const [connectorLeft, setConnectorLeft] = useState("50%");
  const cardRefs = useRef({});
  const gridRef = useRef(null);

  const [boxType, setBoxType] = useState("simple");
  const [vipProductId, setVipProductId] = useState(null);
  const [replacements, setReplacements] = useState({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/gift-boxes/${id}`);
        const data = await res.json();
        setBox(data.success === false ? null : data);

        const resCats = await fetch("/api/categories?active=true");
        const dataCats = await resCats.json();
        const boitesCat = (dataCats.categoriesFull || []).find((c) => c.slug === "boites");
        if (boitesCat) {
          const resProd = await fetch("/api/products");
          const dataProd = await resProd.json();
          setBoxProducts(
            (dataProd.products || []).filter(
              (p) => p.category_id === boitesCat.id && p.active && p.is_vip
            )
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
    let total = parseFloat(box.price) || 0;
    if (boxType === "vip" && vipProductId) {
      total = Math.round(total * 1.25);
    }
    return total;
  }

  function handleAdd() {
    if (!box) return;
    const finalPrice = calcPrice();
    let desc =
      boxType === "vip" && vipProductId
        ? `Boîte VIP: ${boxProducts.find((p) => p.id === vipProductId)?.title}`
        : "Boîte simple (offerte)";
    if (box.items) {
      for (const item of box.items) {
        if (item.is_replaceable && replacements[item.item_id]) {
          const rp = item.replacements?.find((r) => r.product_id === replacements[item.item_id]);
          if (rp) desc += ` | ${item.title} → ${rp.title}`;
        }
      }
    }
    addToCart(
      {
        id: `giftbox-${box.id}-${Date.now()}`,
        title: `🎁 ${box.name}`,
        price: finalPrice,
        image: box.image || DEFAULT_IMG,
        description: desc,
        isGiftBox: true,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  const fmt = (n) => (n || 0).toLocaleString("fr-FR");

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Gift size={32} className="text-[#D7A12B] animate-pulse" />
      </div>
    );
  }

  if (!box) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
        <Gift size={40} className="text-neutral-300" />
        <p className="text-neutral-500 text-sm">Coffret introuvable</p>
        <Link to="/gift-boxes" className="text-[#D7A12B] text-sm font-semibold hover:underline">
          ← Retour aux coffrets
        </Link>
      </div>
    );
  }

  const finalPrice = calcPrice();

  return (
    <>
      <PageHeader title={box.name} breadcrumb={`Accueil · Box Cadeau · ${box.name}`} />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 home-products-premium">
        <Link
          to="/gift-boxes"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#0a0a0a] transition-colors mb-8"
        >
          <ArrowLeft size={13} /> Tous les coffrets
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full lg:w-[400px] flex-shrink-0"
          >
            <div className="rounded-2xl overflow-hidden aspect-square bg-neutral-100 border border-black/[0.08] sticky top-24 shadow-sm">
              <img
                src={box.image || DEFAULT_IMG}
                alt={box.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMG;
                }}
              />
            </div>
          </motion.div>

          {/* Infos */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="flex-1 min-w-0 space-y-8"
          >
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] leading-tight mb-2">
                {box.name}
              </h1>
              {box.description && (
                <p className="text-sm text-neutral-500 leading-relaxed">{box.description}</p>
              )}
              <p className="mt-4 text-2xl font-semibold text-[#D7A12B]">
                {fmt(finalPrice * qty)}
                <span className="text-xs font-normal text-neutral-400 ml-1.5">FCFA</span>
              </p>
            </div>

            {/* Composition */}
            {box.items?.length > 0 && (
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#8B6914] font-semibold mb-3">
                  Ce coffret contient
                </h2>
                <div ref={gridRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {box.items.map((item, i) => {
                    const isOpen = openItem === item.item_id;
                    const chosenId = replacements[item.item_id];
                    const chosenRp = item.replacements?.find((r) => r.product_id === chosenId);
                    const displayImg = chosenRp?.image || item.image || DEFAULT_IMG;
                    const displayName = chosenRp?.title || item.title;

                    return (
                      <motion.div
                        key={item.item_id}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                      >
                        <div
                          ref={(el) => {
                            cardRefs.current[item.item_id] = el;
                          }}
                          onClick={() => {
                            if (!item.is_replaceable) return;
                            const nextOpen = isOpen ? null : item.item_id;
                            setOpenItem(nextOpen);
                            if (nextOpen && cardRefs.current[item.item_id] && gridRef.current) {
                              const cardRect = cardRefs.current[item.item_id].getBoundingClientRect();
                              const gridRect = gridRef.current.getBoundingClientRect();
                              const center = cardRect.left + cardRect.width / 2 - gridRect.left;
                              setConnectorLeft(`${center}px`);
                            }
                          }}
                          className={`relative flex flex-col rounded-lg overflow-hidden border transition-all duration-250 bg-white ${
                            item.is_replaceable
                              ? "cursor-pointer hover:border-[#D7A12B]/40"
                              : "cursor-default"
                          } ${
                            isOpen
                              ? "border-[#D7A12B]/50 shadow-[0_4px_20px_rgba(215,161,43,0.12)]"
                              : "border-black/[0.08]"
                          }`}
                        >
                          <div className="relative aspect-square overflow-hidden bg-neutral-100">
                            <img
                              src={displayImg}
                              alt={displayName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_IMG;
                              }}
                            />
                            {item.is_replaceable && (
                              <span className="absolute top-1 left-1 flex items-center gap-0.5 text-[6px] uppercase font-bold bg-[#D7A12B] text-[#0a0a0a] px-1.5 py-[2px] rounded-full leading-none">
                                <RefreshCw size={6} /> Remp.
                              </span>
                            )}
                            {item.quantity > 1 && (
                              <span className="absolute top-1 right-1 text-[7px] font-bold text-[#8B6914] bg-[#D7A12B]/15 px-1.5 py-[2px] rounded-full leading-none">
                                ×{item.quantity}
                              </span>
                            )}
                            {chosenRp && (
                              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                <Check size={8} className="text-white" />
                              </span>
                            )}
                          </div>
                          <div className="px-1.5 py-1.5">
                            <p className="text-[9px] text-[#0a0a0a] leading-snug line-clamp-2 font-medium">
                              {displayName}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {openItem !== null &&
                    (() => {
                      const item = box.items.find((it) => it.item_id === openItem);
                      if (!item) return null;
                      const chosenId = replacements[openItem];

                      return (
                        <motion.div
                          key={openItem}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="mt-0 relative"
                        >
                          <div
                            className="absolute -top-2 h-2 w-px bg-[#D7A12B]/50"
                            style={{ left: connectorLeft }}
                          />
                          <div
                            className="absolute -top-1.5 w-3 h-3 rotate-45 bg-neutral-50 border-t border-l border-[#D7A12B]/30"
                            style={{ left: `calc(${connectorLeft} - 6px)` }}
                          />

                          <div className="rounded-xl border border-[#D7A12B]/25 bg-neutral-50 p-3 mt-1">
                            <p className="text-[9px] uppercase tracking-wider text-[#8B6914] font-semibold mb-3">
                              Remplacer · <span className="text-neutral-600 normal-case">{item.title}</span>
                            </p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplacements((prev) => {
                                    const r = { ...prev };
                                    delete r[item.item_id];
                                    return r;
                                  });
                                  setOpenItem(null);
                                }}
                                className={`flex-shrink-0 flex flex-col rounded-lg overflow-hidden border transition-all w-[72px] bg-white ${
                                  !chosenId
                                    ? "border-[#D7A12B]/45 bg-[#D7A12B]/08"
                                    : "border-black/[0.08] hover:border-[#D7A12B]/30"
                                }`}
                              >
                                <div className="relative aspect-square bg-neutral-100">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package size={12} className="text-neutral-300" />
                                    </div>
                                  )}
                                  {!chosenId && (
                                    <div className="absolute inset-0 flex items-end justify-end p-1">
                                      <Check size={9} className="text-[#D7A12B]" />
                                    </div>
                                  )}
                                </div>
                                <div className="p-1 text-center">
                                  <p className="text-[7px] text-neutral-700 line-clamp-2 leading-tight">
                                    {item.title}
                                  </p>
                                  <p className="text-[6px] text-neutral-400 mt-0.5">{fmt(item.price)} F</p>
                                </div>
                              </button>

                              {item.replacements?.map((rp) => {
                                const sel = chosenId === rp.product_id;
                                return (
                                  <button
                                    key={rp.product_id}
                                    type="button"
                                    onClick={() => {
                                      setReplacements((prev) => ({
                                        ...prev,
                                        [item.item_id]: rp.product_id,
                                      }));
                                      setOpenItem(null);
                                    }}
                                    className={`flex-shrink-0 flex flex-col rounded-lg overflow-hidden border transition-all w-[72px] bg-white ${
                                      sel
                                        ? "border-[#D7A12B]/45 bg-[#D7A12B]/08"
                                        : "border-black/[0.08] hover:border-[#D7A12B]/30"
                                    }`}
                                  >
                                    <div className="relative aspect-square bg-neutral-100">
                                      {rp.image ? (
                                        <img
                                          src={rp.image}
                                          alt={rp.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Package size={12} className="text-neutral-300" />
                                        </div>
                                      )}
                                      {sel && (
                                        <div className="absolute inset-0 flex items-end justify-end p-1">
                                          <Check size={9} className="text-[#D7A12B]" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-1 text-center">
                                      <p className="text-[7px] text-neutral-700 line-clamp-2 leading-tight">
                                        {rp.title}
                                      </p>
                                      <p className="text-[6px] text-[#D7A12B] mt-0.5">{fmt(rp.price)} F</p>
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

            {/* Emballage */}
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#8B6914] font-semibold mb-3">
                Emballage
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setBoxType("simple");
                    setVipProductId(null);
                  }}
                  className={`relative p-3.5 rounded-xl border text-left transition-all bg-white ${
                    boxType === "simple"
                      ? "border-[#D7A12B]/45 bg-[#D7A12B]/08 shadow-sm"
                      : "border-black/[0.08] hover:border-[#D7A12B]/30"
                  }`}
                >
                  {boxType === "simple" && (
                    <Check size={11} className="absolute top-2.5 right-2.5 text-[#D7A12B]" />
                  )}
                  <Package
                    size={18}
                    className={`mb-1.5 ${boxType === "simple" ? "text-[#D7A12B]" : "text-neutral-400"}`}
                  />
                  <p
                    className={`text-xs font-semibold ${
                      boxType === "simple" ? "text-[#8B6914]" : "text-[#0a0a0a]"
                    }`}
                  >
                    Boîte simple
                  </p>
                  <p className="text-[10px] text-[#D7A12B] font-semibold mt-1">Gratuit</p>
                </button>

                <button
                  type="button"
                  onClick={() => setBoxType("vip")}
                  className={`relative p-3.5 rounded-xl border text-left transition-all bg-white ${
                    boxType === "vip"
                      ? "border-[#D7A12B]/45 bg-[#D7A12B]/08 shadow-sm"
                      : "border-black/[0.08] hover:border-[#D7A12B]/30"
                  }`}
                >
                  {boxType === "vip" && vipProductId && (
                    <Check size={11} className="absolute top-2.5 right-2.5 text-[#D7A12B]" />
                  )}
                  <Crown
                    size={18}
                    className={`mb-1.5 ${boxType === "vip" ? "text-[#D7A12B]" : "text-neutral-400"}`}
                  />
                  <p
                    className={`text-xs font-semibold ${
                      boxType === "vip" ? "text-[#8B6914]" : "text-[#0a0a0a]"
                    }`}
                  >
                    Boîte VIP
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1">+25% du prix total</p>
                </button>
              </div>

              <AnimatePresence>
                {boxType === "vip" && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 relative"
                  >
                    <div
                      className="absolute -top-2 h-2 w-px bg-[#D7A12B]/50"
                      style={{ left: "75%" }}
                    />
                    <div
                      className="absolute -top-1.5 w-3 h-3 rotate-45 bg-neutral-50 border-t border-l border-[#D7A12B]/30"
                      style={{ left: "calc(75% - 6px)" }}
                    />

                    <div className="rounded-xl border border-[#D7A12B]/25 bg-neutral-50 p-4">
                      <p className="text-[9px] uppercase tracking-wider text-[#8B6914] font-semibold mb-3">
                        Choisir votre boîte VIP
                        <span className="ml-2 text-neutral-500 normal-case font-normal tracking-normal">
                          · prix coffret +25%
                        </span>
                      </p>

                      {boxProducts.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">
                          Aucune boîte VIP disponible. Créez des produits « Boîtes » marqués VIP dans
                          l&apos;admin Produits.
                        </p>
                      ) : (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {boxProducts.map((bp) => {
                            const sel = vipProductId === bp.id;
                            return (
                              <button
                                key={bp.id}
                                type="button"
                                onClick={() => setVipProductId(sel ? null : bp.id)}
                                className={`flex-shrink-0 flex flex-col rounded-lg overflow-hidden border transition-all w-[80px] bg-white ${
                                  sel
                                    ? "border-[#D7A12B]/45 bg-[#D7A12B]/08 ring-1 ring-[#D7A12B]/20"
                                    : "border-black/[0.08] hover:border-[#D7A12B]/30"
                                }`}
                              >
                                <div className="relative aspect-square bg-neutral-100">
                                  {bp.image ? (
                                    <img
                                      src={bp.image}
                                      alt={bp.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Crown size={14} className="text-[#D7A12B]/40" />
                                    </div>
                                  )}
                                  {sel && (
                                    <div className="absolute inset-0 flex items-end justify-end p-1">
                                      <Check size={9} className="text-[#D7A12B]" />
                                    </div>
                                  )}
                                </div>
                                <div className="p-1.5 text-center">
                                  <p className="text-[8px] text-[#0a0a0a] line-clamp-2 leading-tight font-medium">
                                    {bp.title}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Total + panier */}
            <div className="pt-4 border-t border-black/[0.06]">
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Total</p>
                <p className="text-xl font-semibold text-[#D7A12B]">
                  {fmt(finalPrice * qty)}
                  <span className="text-[10px] font-normal text-neutral-400 ml-1.5">FCFA</span>
                </p>
              </div>

              <div className="flex items-end gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-2">
                    Quantité
                  </p>
                  <div className="flex items-center gap-0 border border-black/[0.10] rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-[#0a0a0a] hover:bg-neutral-50 transition-colors text-lg font-light"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-[#0a0a0a]">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-[#0a0a0a] hover:bg-neutral-50 transition-colors text-lg font-light"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={boxType === "vip" && !vipProductId && boxProducts.length > 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                    justAdded
                      ? "bg-emerald-500 text-white"
                      : "bg-[#D7A12B] text-[#0a0a0a] hover:bg-[#E8B945]"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check size={15} /> Ajouté
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={15} /> Ajouter au panier
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

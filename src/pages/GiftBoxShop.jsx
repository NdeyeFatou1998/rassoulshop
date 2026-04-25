/**
 * Page GiftBoxShop — /gift-boxes
 *
 * Page publique où le client voit les boxes cadeaux disponibles.
 * Pour chaque box :
 * - Boîte simple (gratuite, par défaut)
 * - Boîte VIP : choix parmi les produits de la catégorie "Boîtes" avec +25% sur le prix
 * - Si la box est personnalisable, le client peut remplacer les articles remplaçables
 * - Bouton ajouter au panier
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Package, Check, Crown, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function GiftBoxShop() {
  const [giftBoxes, setGiftBoxes] = useState([]);
  const [boxProducts, setBoxProducts] = useState([]); // produits de la catégorie Boîtes
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  /* État par box : { [boxId]: { boxType: "simple"|"vip", vipProductId, replacements: { [itemId]: replacementProductId } } } */
  const [boxChoices, setBoxChoices] = useState({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Charger les boxes cadeaux actives
        const resBoxes = await fetch("/api/gift-boxes");
        const dataBoxes = await resBoxes.json();
        const activeBoxes = (dataBoxes.giftBoxes || []).filter(b => b.active);
        setGiftBoxes(activeBoxes);

        // Initialiser les choixs par défaut
        const defaults = {};
        activeBoxes.forEach(b => {
          defaults[b.id] = { boxType: "simple", vipProductId: null, replacements: {} };
        });
        setBoxChoices(defaults);

        // Charger les produits de la catégorie "Boîtes"
        const resProducts = await fetch("/api/products");
        const dataProducts = await resProducts.json();
        const allProducts = dataProducts.products || [];

        // Récupérer la catégorie "Boîtes"
        const resCats = await fetch("/api/categories?active=true");
        const dataCats = await resCats.json();
        const boitesCat = (dataCats.categoriesFull || []).find(c => c.slug === "boites");

        if (boitesCat) {
          const vipBoxes = allProducts.filter(p => p.category_id === boitesCat.id && p.active);
          setBoxProducts(vipBoxes);
        }
      } catch (err) {
        console.error("Erreur chargement gift boxes:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /** Mettre à jour le choix pour une box */
  function updateChoice(boxId, field, value) {
    setBoxChoices(prev => ({
      ...prev,
      [boxId]: { ...prev[boxId], [field]: value }
    }));
  }

  /** Calculer le prix total d'une box selon les choix du client */
  function calcBoxPrice(box) {
    const choice = boxChoices[box.id];
    if (!choice) return box.price;

    let total = box.price;

    // Si boîte VIP, ajouter le prix du produit boîte + 25%
    if (choice.boxType === "vip" && choice.vipProductId) {
      const vipProduct = boxProducts.find(p => p.id === choice.vipProductId);
      if (vipProduct) {
        total += Math.round(vipProduct.price * 1.25);
      }
    }

    // Si personnalisable, ajuster le prix selon les remplacements
    if (box.is_customizable && box.items) {
      for (const item of box.items) {
        if (item.is_replaceable && choice.replacements[item.item_id]) {
          const replacementProduct = item.replacements?.find(r => r.product_id === choice.replacements[item.item_id]);
          if (replacementProduct) {
            // Remplacer le prix de l'article original par celui du remplacement
            total += (replacementProduct.price - item.price) * item.quantity;
          }
        }
      }
    }

    return total;
  }

  /** Ajouter la box au panier */
  function handleAddToCart(box) {
    const choice = boxChoices[box.id];
    const finalPrice = calcBoxPrice(box);

    // Construire la description des options
    let description = "";
    if (choice?.boxType === "vip" && choice.vipProductId) {
      const vipProduct = boxProducts.find(p => p.id === choice.vipProductId);
      if (vipProduct) description += `Boîte VIP: ${vipProduct.title} (+${fmtPrice(Math.round(vipProduct.price * 1.25))})`;
    } else {
      description += "Boîte simple (offerte)";
    }

    // Ajouter les remplacements dans la description
    if (box.is_customizable && box.items) {
      for (const item of box.items) {
        if (item.is_replaceable && choice?.replacements[item.item_id]) {
          const replacementProduct = item.replacements?.find(r => r.product_id === choice.replacements[item.item_id]);
          if (replacementProduct) {
            description += ` | ${item.title} → ${replacementProduct.title}`;
          }
        }
      }
    }

    // Créer un "produit" virtuel pour le panier
    const cartItem = {
      id: `giftbox-${box.id}-${Date.now()}`,
      title: `🎁 ${box.name}`,
      price: finalPrice,
      image: box.image,
      description: description,
      isGiftBox: true
    };

    addToCart(cartItem, 1);
  }

  /** Formater un prix en FCFA */
  function fmtPrice(n) {
    return (n || 0).toLocaleString("fr-FR") + " FCFA";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Gift size={32} className="mx-auto mb-3 text-gold animate-pulse" />
          <p className="text-muted text-sm">Chargement des boxes cadeaux...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ---- Header ---- */}
      <section className="pt-24 md:pt-28 pb-6 w-full px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-px bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
              Cadeaux
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-cream leading-tight mb-2">
            Boxes Cadeaux
          </h1>
          <p className="text-sm text-muted max-w-lg">
            Offrez un cadeau unique. Choisissez une box, personnalisez-la si vous le souhaitez,
            et sélectionnez votre emballage.
          </p>
        </motion.div>
      </section>

      {/* ---- Liste des boxes ---- */}
      {giftBoxes.length === 0 ? (
        <div className="text-center py-20">
          <Gift size={48} className="mx-auto mb-4 text-muted/30" />
          <p className="text-muted">Aucune box cadeau disponible pour le moment</p>
        </div>
      ) : (
        <div className="px-4 md:px-8 lg:px-12 pb-20 space-y-8">
          {giftBoxes.map((box) => {
            const choice = boxChoices[box.id] || { boxType: "simple", vipProductId: null, replacements: {} };
            const finalPrice = calcBoxPrice(box);

            return (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-noir-800/50 border border-gold/10 rounded-2xl overflow-hidden"
              >
                <div className="md:flex">
                  {/* Image de la box */}
                  <div className="md:w-80 h-56 md:h-auto flex-shrink-0">
                    {box.image ? (
                      <img
                        src={box.image}
                        alt={box.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-noir-900 flex items-center justify-center">
                        <Gift size={48} className="text-gold/20" />
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 p-6 md:p-8 space-y-5">
                    {/* Titre + badges */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-serif text-2xl text-cream">{box.name}</h2>
                        {box.is_customizable && (
                          <span className="text-[10px] uppercase tracking-wider bg-gold/15 text-gold px-2 py-0.5 rounded-full border border-gold/20">
                            Personnalisable
                          </span>
                        )}
                      </div>
                      {box.description && (
                        <p className="text-sm text-muted">{box.description}</p>
                      )}
                    </div>

                    {/* Articles de la box */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gold/60 mb-2">
                        Composition de la box
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {box.items?.map((item) => (
                          <span
                            key={item.item_id}
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full ${
                              item.is_replaceable
                                ? "bg-gold/10 text-gold border border-gold/20"
                                : "bg-noir-900 text-muted"
                            }`}
                          >
                            <Package size={10} />
                            {item.title}
                            {item.quantity > 1 && <span className="text-gold ml-0.5">x{item.quantity}</span>}
                            {item.is_replaceable && <span className="ml-0.5">↔</span>}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ---- Personnalisation (si box personnalisable) ---- */}
                    {box.is_customizable && box.items?.some(i => i.is_replaceable) && (
                      <div className="border border-gold/10 rounded-xl p-4 bg-noir-900/50">
                        <p className="text-xs uppercase tracking-wider text-gold/70 mb-3">
                          ✨ Personnalisez votre box
                        </p>
                        <div className="space-y-3">
                          {box.items.filter(i => i.is_replaceable).map((item) => (
                            <div key={item.item_id}>
                              <p className="text-sm text-cream mb-1.5">
                                Remplacer <span className="text-gold">{item.title}</span> par :
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {/* Option : garder l'article original */}
                                <button
                                  onClick={() => {
                                    const newReplacements = { ...choice.replacements };
                                    delete newReplacements[item.item_id];
                                    updateChoice(box.id, "replacements", newReplacements);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                                    !choice.replacements[item.item_id]
                                      ? "bg-gold/15 border-gold/30 text-gold"
                                      : "bg-noir-900 border-gold/10 text-muted hover:border-gold/20"
                                  }`}
                                >
                                  Garder {item.title}
                                </button>
                                {/* Options de remplacement */}
                                {item.replacements?.map((rp) => (
                                  <button
                                    key={rp.product_id}
                                    onClick={() => {
                                      updateChoice(box.id, "replacements", {
                                        ...choice.replacements,
                                        [item.item_id]: rp.product_id
                                      });
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                                      choice.replacements[item.item_id] === rp.product_id
                                        ? "bg-gold/15 border-gold/30 text-gold"
                                        : "bg-noir-900 border-gold/10 text-muted hover:border-gold/20"
                                    }`}
                                  >
                                    {rp.title} ({fmtPrice(rp.price)})
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ---- Choix boîte : Simple ou VIP ---- */}
                    <div className="border border-gold/10 rounded-xl p-4 bg-noir-900/50">
                      <p className="text-xs uppercase tracking-wider text-gold/70 mb-3">
                        📦 Choisissez votre emballage
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Boîte simple */}
                        <button
                          onClick={() => updateChoice(box.id, "boxType", "simple")}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            choice.boxType === "simple"
                              ? "bg-gold/10 border-gold/30"
                              : "bg-noir-900 border-gold/10 hover:border-gold/20"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Package size={16} className={choice.boxType === "simple" ? "text-gold" : "text-muted"} />
                            <span className={`text-sm font-semibold ${choice.boxType === "simple" ? "text-gold" : "text-cream"}`}>
                              Boîte simple
                            </span>
                          </div>
                          <p className="text-xs text-muted">Emballage standard inclus</p>
                          <p className="text-xs text-gold mt-1 font-semibold">Gratuit</p>
                        </button>

                        {/* Boîte VIP */}
                        <button
                          onClick={() => updateChoice(box.id, "boxType", "vip")}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            choice.boxType === "vip"
                              ? "bg-gold/10 border-gold/30"
                              : "bg-noir-900 border-gold/10 hover:border-gold/20"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Crown size={16} className={choice.boxType === "vip" ? "text-gold" : "text-muted"} />
                            <span className={`text-sm font-semibold ${choice.boxType === "vip" ? "text-gold" : "text-cream"}`}>
                              Boîte VIP
                            </span>
                          </div>
                          <p className="text-xs text-muted">Emballage premium (+25% sur le prix de la boîte)</p>
                        </button>
                      </div>

                      {/* Sélection boîte VIP */}
                      {choice.boxType === "vip" && (
                        <div className="mt-3">
                          {boxProducts.length === 0 ? (
                            <p className="text-xs text-muted py-2">
                              Aucune boîte VIP disponible pour le moment
                            </p>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase tracking-wider text-gold/50 mb-1">
                                Choisissez votre boîte VIP :
                              </p>
                              {boxProducts.map((bp) => {
                                const vipPrice = Math.round(bp.price * 1.25);
                                const selected = choice.vipProductId === bp.id;
                                return (
                                  <button
                                    key={bp.id}
                                    onClick={() => updateChoice(box.id, "vipProductId", bp.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                      selected
                                        ? "bg-gold/10 border-gold/30"
                                        : "bg-noir-900 border-gold/10 hover:border-gold/20"
                                    }`}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                      selected ? "border-gold" : "border-muted/30"
                                    }`}>
                                      {selected && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                                    </div>
                                    {bp.image ? (
                                      <img src={bp.image} alt={bp.title} className="w-10 h-10 rounded object-cover" />
                                    ) : (
                                      <div className="w-10 h-10 rounded bg-noir-800 flex items-center justify-center">
                                        <Crown size={14} className="text-gold/40" />
                                      </div>
                                    )}
                                    <div className="flex-1 text-left">
                                      <p className="text-sm text-cream">{bp.title}</p>
                                      <p className="text-xs text-muted">
                                        {fmtPrice(bp.price)} + 25% = <span className="text-gold">{fmtPrice(vipPrice)}</span>
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ---- Prix total + Ajouter au panier ---- */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gold/50">Prix total</p>
                        <p className="text-2xl font-serif text-gold">{fmtPrice(finalPrice)}</p>
                        {finalPrice !== box.price && (
                          <p className="text-xs text-muted line-through">{fmtPrice(box.price)} base</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(box)}
                        disabled={choice.boxType === "vip" && !choice.vipProductId && boxProducts.length > 0}
                        className="flex items-center gap-2 px-6 py-3 bg-gold text-noir-900 font-semibold text-sm uppercase tracking-wider rounded-xl hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <ShoppingCart size={16} />
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

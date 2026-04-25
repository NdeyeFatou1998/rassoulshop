/**
 * Page Admin Box Cadeau — /admin/gift-boxes
 *
 * CRUD complet des boxes cadeaux avec :
 * - Liste des boxes avec leurs articles
 * - Modal de création/édition avec sélection des articles (checkboxes)
 * - Box personnalisable : l'admin coche les articles remplaçables
 *   et pour chaque article remplaçable, choisit les produits de remplacement
 * - Upload d'image pour la box
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Gift, Package, Check, ArrowRight } from "lucide-react";

export default function AdminGiftBoxes() {
  const [giftBoxes, setGiftBoxes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBox, setEditingBox] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* État du formulaire box avec personnalisation */
  const emptyForm = {
    name: "", description: "", price: "", image: "", active: true,
    is_customizable: false,
    selectedItems: [] // { product_id, quantity, is_replaceable, replacements: [product_id] }
  };
  const [form, setForm] = useState(emptyForm);

  /* Charger les boxes et les produits */
  async function loadGiftBoxes() {
    setLoading(true);
    try {
      const res = await fetch("/api/gift-boxes");
      const data = await res.json();
      setGiftBoxes(data.giftBoxes || []);
    } catch (err) {
      console.error("Erreur chargement boxes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    }
  }

  useEffect(() => { loadGiftBoxes(); loadProducts(); }, []);

  /** Ouvrir modal pour créer une box */
  function handleNew() {
    setEditingBox(null);
    setForm({ ...emptyForm, selectedItems: [] });
    setError("");
    setShowModal(true);
  }

  /** Ouvrir modal pour éditer une box */
  function handleEdit(box) {
    setEditingBox(box);
    setForm({
      name: box.name || "",
      description: box.description || "",
      price: String(box.price || ""),
      image: box.image || "",
      active: box.active,
      is_customizable: box.is_customizable || false,
      selectedItems: (box.items || []).map(item => ({
        product_id: item.product_id,
        quantity: item.quantity || 1,
        is_replaceable: item.is_replaceable || false,
        replacements: (item.replacements || []).map(r => r.product_id)
      }))
    });
    setError("");
    setShowModal(true);
  }

  /** Fermer le modal */
  function closeModal() {
    setShowModal(false);
    setEditingBox(null);
    setForm({ ...emptyForm, selectedItems: [] });
    setError("");
  }

  /** Toggle un produit dans la sélection */
  function toggleProduct(productId) {
    const exists = form.selectedItems.find(i => i.product_id === productId);
    if (exists) {
      setForm({
        ...form,
        selectedItems: form.selectedItems.filter(i => i.product_id !== productId)
      });
    } else {
      setForm({
        ...form,
        selectedItems: [...form.selectedItems, {
          product_id: productId, quantity: 1, is_replaceable: false, replacements: []
        }]
      });
    }
  }

  /** Changer la quantité d'un article sélectionné */
  function updateQuantity(productId, quantity) {
    setForm({
      ...form,
      selectedItems: form.selectedItems.map(i =>
        i.product_id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    });
  }

  /** Toggle is_replaceable sur un article */
  function toggleReplaceable(productId) {
    setForm({
      ...form,
      selectedItems: form.selectedItems.map(i =>
        i.product_id === productId
          ? { ...i, is_replaceable: !i.is_replaceable, replacements: !i.is_replaceable ? [] : i.replacements }
          : i
      )
    });
  }

  /** Toggle un produit de remplacement pour un article remplaçable */
  function toggleReplacement(productId, replacementProductId) {
    setForm({
      ...form,
      selectedItems: form.selectedItems.map(i => {
        if (i.product_id !== productId) return i;
        const has = i.replacements.includes(replacementProductId);
        return {
          ...i,
          replacements: has
            ? i.replacements.filter(id => id !== replacementProductId)
            : [...i.replacements, replacementProductId]
        };
      })
    });
  }

  /** Vérifier si un produit est sélectionné */
  function isSelected(productId) {
    return form.selectedItems.some(i => i.product_id === productId);
  }

  /** Sauvegarder la box (créer ou modifier) */
  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("rassoul_admin_token");

      if (editingBox) {
        // --- MODIFIER ---
        // 1. Mettre à jour les infos de la box
        const payload = {
          name: form.name,
          description: form.description || null,
          price: parseInt(form.price, 10) || 0,
          image: form.image || null,
          active: form.active,
          is_customizable: form.is_customizable
        };

        const res = await fetch(`/api/gift-boxes/${editingBox.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!data.success) {
          setError(data.message || "Erreur lors de la modification");
          return;
        }

        // 2. Synchroniser les articles
        const existingItems = editingBox.items || [];
        const existingProductIds = existingItems.map(i => i.product_id);
        const selectedProductIds = form.selectedItems.map(i => i.product_id);

        // Retirer les articles qui ne sont plus sélectionnés
        for (const item of existingItems) {
          if (!selectedProductIds.includes(item.product_id)) {
            await fetch(`/api/gift-boxes/${editingBox.id}/items/${item.item_id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        }

        // Ajouter les nouveaux articles
        for (const selItem of form.selectedItems) {
          if (!existingProductIds.includes(selItem.product_id)) {
            await fetch(`/api/gift-boxes/${editingBox.id}/items`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                product_id: selItem.product_id,
                quantity: selItem.quantity,
                is_replaceable: selItem.is_replaceable,
                replacements: selItem.replacements
              })
            });
          } else {
            // Mettre à jour is_replaceable et replacements pour les articles existants
            const existingItem = existingItems.find(i => i.product_id === selItem.product_id);
            if (existingItem) {
              await fetch(`/api/gift-boxes/${editingBox.id}/items/${existingItem.item_id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  is_replaceable: selItem.is_replaceable,
                  replacements: selItem.replacements
                })
              });
            }
          }
        }

      } else {
        // --- CRÉER ---
        const payload = {
          name: form.name,
          description: form.description || null,
          price: parseInt(form.price, 10) || 0,
          image: form.image || null,
          active: form.active,
          is_customizable: form.is_customizable,
          items: form.selectedItems
        };

        const res = await fetch("/api/gift-boxes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!data.success) {
          setError(data.message || "Erreur lors de la création");
          return;
        }
      }

      closeModal();
      await loadGiftBoxes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  /** Supprimer une box */
  async function handleDelete(box) {
    if (!confirm(`Supprimer la box "${box.name}" ?`)) return;
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      await fetch(`/api/gift-boxes/${box.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadGiftBoxes();
    } catch (err) {
      alert(err.message);
    }
  }

  /** Upload image pour la box */
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, image: data.imageUrl });
      } else {
        alert(data.message || "Erreur lors de l'upload");
      }
    } catch (err) {
      alert("Erreur lors de l'upload de l'image");
    }
  }

  /** Formater un prix en FCFA */
  function fmtPrice(n) {
    return (n || 0).toLocaleString("fr-FR") + " FCFA";
  }

  /** Somme des prix des articles sélectionnés (pour info) */
  const itemsTotal = form.selectedItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.product_id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  /** Produits actifs (pas déjà sélectionnés) disponibles pour remplacement */
  const activeProducts = products.filter(p => p.active);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#f5f0e8] mb-2">
            🎁 Box Cadeau
          </h1>
          <p className="text-sm text-[#888]">
            Créer des boxes cadeaux composées d'articles
          </p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-[#C5A55A] text-[#0a0a0a] font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-[#D4B56E] transition-all duration-300"
        >
          + Nouvelle Box
        </button>
      </div>

      {/* Liste des boxes */}
      {loading ? (
        <div className="text-center py-12 text-[#888]">Chargement...</div>
      ) : giftBoxes.length === 0 ? (
        <div className="text-center py-16 text-[#555]">
          <Gift size={40} className="mx-auto mb-3 opacity-50" />
          <p>Aucune box cadeau pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {giftBoxes.map((box) => (
            <motion.div
              key={box.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#141414] border rounded-xl p-5 transition-colors ${
                box.active
                  ? "border-[#C5A55A]/20 hover:border-[#C5A55A]/40"
                  : "border-[#333]/50 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Image */}
                {box.image ? (
                  <img
                    src={box.image}
                    alt={box.name}
                    className="w-20 h-20 rounded-lg object-cover border border-[#333]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-[#222] flex items-center justify-center border border-[#333]">
                    <Gift size={24} className="text-[#555]" />
                  </div>
                )}

                {/* Infos */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#f5f0e8] text-lg">{box.name}</h3>
                    {box.is_customizable && (
                      <span className="text-[10px] uppercase tracking-wider bg-[#C5A55A]/20 text-[#C5A55A] px-2 py-0.5 rounded">
                        Personnalisable
                      </span>
                    )}
                    {!box.active && (
                      <span className="text-[10px] uppercase tracking-wider bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        Inactif
                      </span>
                    )}
                  </div>
                  {box.description && (
                    <p className="text-sm text-[#888] mb-2">{box.description}</p>
                  )}
                  <p className="text-[#C5A55A] font-semibold text-lg">{fmtPrice(box.price)}</p>

                  {/* Articles de la box */}
                  {box.items?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {box.items.map((item) => (
                        <span
                          key={item.item_id}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            item.is_replaceable
                              ? "bg-[#C5A55A]/15 text-[#C5A55A] border border-[#C5A55A]/30"
                              : "bg-[#222] text-[#888]"
                          }`}
                        >
                          <Package size={10} />
                          {item.title}
                          {item.quantity > 1 && <span className="text-[#C5A55A]">x{item.quantity}</span>}
                          {item.is_replaceable && <span className="ml-1">↔</span>}
                        </span>
                      ))}
                    </div>
                  )}
                  {(!box.items || box.items.length === 0) && (
                    <p className="mt-2 text-xs text-[#555]">Aucun article dans cette box</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(box)}
                    className="px-3 py-1.5 bg-[#C5A55A]/20 text-[#C5A55A] text-sm rounded-lg hover:bg-[#C5A55A]/30 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(box)}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ---- Modal Créer/Modifier Box avec personnalisation ---- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141414] border border-[#C5A55A]/20 rounded-2xl p-6 w-full max-w-2xl my-8"
          >
            <h2 className="font-serif text-xl text-[#f5f0e8] mb-6">
              {editingBox ? "Modifier la box" : "Nouvelle box cadeau"}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Nom + Prix en ligne */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                    Nom de la box *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Ex : Box Prestige"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                    Prix du box (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                    placeholder="Prix défini par l'admin"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="Description de la box cadeau"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Image de la box
                </label>
                <div className="flex items-center gap-4">
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Aperçu"
                      className="w-16 h-16 rounded-lg object-cover border border-[#333]"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-[#888] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C5A55A] file:text-[#0a0a0a] hover:file:bg-[#D4B56E] file:cursor-pointer"
                    />
                    <p className="text-[10px] text-[#555] mt-1">JPEG, PNG, GIF, WebP — Max 5MB</p>
                  </div>
                </div>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="mt-2 text-xs text-red-400 hover:text-red-300"
                  >
                    Supprimer l'image
                  </button>
                )}
              </div>

              {/* ---- Sélection des articles ---- */}
              <div className="border border-[#333] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-wider text-[#C5A55A]/70">
                    Choisir les articles de la box
                  </label>
                  <span className="text-xs text-[#888]">
                    {form.selectedItems.length} article{form.selectedItems.length !== 1 ? "s" : ""} sélectionné{form.selectedItems.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Info prix total des articles vs prix du box */}
                {form.selectedItems.length > 0 && (
                  <div className="mb-3 p-3 bg-[#1a1a1a] rounded-lg text-xs">
                    <div className="flex justify-between text-[#888]">
                      <span>Valeur totale des articles :</span>
                      <span>{fmtPrice(itemsTotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#C5A55A] font-semibold mt-1">
                      <span>Prix du box :</span>
                      <span>{fmtPrice(parseInt(form.price) || 0)}</span>
                    </div>
                  </div>
                )}

                {products.length === 0 ? (
                  <p className="text-sm text-[#555] py-4 text-center">
                    Aucun produit disponible. Créez d'abord des produits.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {activeProducts.map((product) => {
                      const selected = isSelected(product.id);
                      const selItem = form.selectedItems.find(i => i.product_id === product.id);
                      return (
                        <div key={product.id}>
                          {/* Ligne produit principal */}
                          <div
                            onClick={() => toggleProduct(product.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                              selected
                                ? "bg-[#C5A55A]/10 border-[#C5A55A]/40"
                                : "bg-[#1a1a1a] border-[#333] hover:border-[#555]"
                            }`}
                          >
                            {/* Checkbox custom */}
                            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                              selected ? "bg-[#C5A55A] border-[#C5A55A]" : "border-[#555]"
                            }`}>
                              {selected && <Check size={14} className="text-[#0a0a0a]" />}
                            </div>

                            {/* Image produit */}
                            {product.image ? (
                              <img src={product.image} alt={product.title} className="w-10 h-10 rounded object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-[#222] flex items-center justify-center">
                                <Package size={14} className="text-[#555]" />
                              </div>
                            )}

                            {/* Infos produit */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#f5f0e8] truncate">{product.title}</p>
                              <p className="text-xs text-[#888]">{fmtPrice(product.price)}</p>
                            </div>

                            {/* Quantité + Remplaçable (si sélectionné) */}
                            {selected && (
                              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                {/* Quantité */}
                                <div className="flex items-center gap-1">
                                  <button type="button" onClick={() => updateQuantity(product.id, (selItem?.quantity || 1) - 1)}
                                    className="w-7 h-7 bg-[#333] text-[#f5f0e8] rounded text-sm hover:bg-[#444]">-</button>
                                  <span className="text-sm text-[#f5f0e8] w-6 text-center">{selItem?.quantity || 1}</span>
                                  <button type="button" onClick={() => updateQuantity(product.id, (selItem?.quantity || 1) + 1)}
                                    className="w-7 h-7 bg-[#333] text-[#f5f0e8] rounded text-sm hover:bg-[#444]">+</button>
                                </div>

                                {/* Checkbox remplaçable (visible si box personnalisable) */}
                                {form.is_customizable && (
                                  <button
                                    type="button"
                                    onClick={() => toggleReplaceable(product.id)}
                                    className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                                      selItem?.is_replaceable
                                        ? "bg-[#C5A55A] text-[#0a0a0a]"
                                        : "bg-[#333] text-[#888] hover:bg-[#444]"
                                    }`}
                                    title="Cet article peut être remplacé par le client"
                                  >
                                    ↔ Remplaçable
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* ---- Sous-section : produits de remplacement ---- */}
                          {selected && selItem?.is_replaceable && form.is_customizable && (
                            <div className="ml-8 mt-1 mb-2 border-l-2 border-[#C5A55A]/30 pl-3">
                              <p className="text-[10px] uppercase tracking-wider text-[#C5A55A]/60 mb-2">
                                <ArrowRight size={10} className="inline mr-1" />
                                Produits pouvant remplacer "{product.title}"
                              </p>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {activeProducts
                                  .filter(p => p.id !== product.id)
                                  .map((rp) => {
                                    const isReplacement = selItem.replacements.includes(rp.id);
                                    return (
                                      <div
                                        key={rp.id}
                                        onClick={() => toggleReplacement(product.id, rp.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-colors text-xs ${
                                          isReplacement
                                            ? "bg-[#C5A55A]/10 border-[#C5A55A]/30"
                                            : "bg-[#1a1a1a] border-[#333] hover:border-[#555]"
                                        }`}
                                      >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                          isReplacement ? "bg-[#C5A55A] border-[#C5A55A]" : "border-[#555]"
                                        }`}>
                                          {isReplacement && <Check size={10} className="text-[#0a0a0a]" />}
                                        </div>
                                        {rp.image ? (
                                          <img src={rp.image} alt={rp.title} className="w-7 h-7 rounded object-cover" />
                                        ) : (
                                          <div className="w-7 h-7 rounded bg-[#222] flex items-center justify-center">
                                            <Package size={10} className="text-[#555]" />
                                          </div>
                                        )}
                                        <span className="text-[#f5f0e8] truncate flex-1">{rp.title}</span>
                                        <span className="text-[#888]">{fmtPrice(rp.price)}</span>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Box personnalisable + Statut en ligne */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                    Box personnalisable
                  </label>
                  <select
                    value={form.is_customizable ? "true" : "false"}
                    onChange={(e) => setForm({ ...form, is_customizable: e.target.value === "true" })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] focus:border-[#C5A55A] focus:outline-none transition-colors"
                  >
                    <option value="false">Non</option>
                    <option value="true">Oui — le client peut remplacer des articles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                    Statut
                  </label>
                  <select
                    value={form.active ? "true" : "false"}
                    onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] focus:border-[#C5A55A] focus:outline-none transition-colors"
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 bg-[#333] text-[#f5f0e8] font-semibold text-sm rounded-lg hover:bg-[#444] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-[#C5A55A] text-[#0a0a0a] font-semibold text-sm rounded-lg hover:bg-[#D4B56E] disabled:opacity-50 transition-colors"
                >
                  {saving ? "Enregistrement..." : editingBox ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

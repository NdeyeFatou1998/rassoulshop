/**
 * Page Admin Produits — /admin/products
 *
 * CRUD complet des produits avec :
 * - Liste paginée avec recherche/filtre
 * - Modal de création/édition (titre, desc, prix, promo, stock, catégorie, badge)
 * - Gestion des variantes
 * - Activation promo avec minuteur (date de fin)
 * - Indicateur stock bas / rupture
 */

import { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, Search, X, Tag, Clock, AlertTriangle, Save
} from "lucide-react";
import {
  fetchAdminProducts, createProduct, updateProduct, deleteProduct,
  addVariant, deleteVariant
} from "../../services/adminApi";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* État du formulaire produit */
  const emptyForm = {
    title: "", description: "", price: "", promoPrice: "", promoActive: false,
    promoEndsAt: "", category: "", stock: "0", badge: "", rating: "0", image: "",
  };
  const [form, setForm] = useState(emptyForm);

  /* État variantes */
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantImage, setNewVariantImage] = useState("");

  /** Charger les produits */
  async function loadProducts() {
    setLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  /** Ouvrir modal pour créer un nouveau produit */
  function handleNew() {
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  }

  /** Ouvrir modal pour éditer un produit existant */
  function handleEdit(product) {
    setEditingProduct(product);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: String(product.price || ""),
      promoPrice: product.promoPrice ? String(product.promoPrice) : "",
      promoActive: !!product.promoActive,
      promoEndsAt: product.promoEndsAt ? product.promoEndsAt.slice(0, 16) : "",
      category: product.category || "",
      stock: String(product.stock ?? 0),
      badge: product.badge || "",
      rating: String(product.rating || 0),
      image: product.image || "",
    });
    setError("");
    setShowModal(true);
  }

  /** Sauvegarder (créer ou modifier) */
  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        price: parseInt(form.price, 10) || 0,
        promoPrice: form.promoPrice ? parseInt(form.promoPrice, 10) : null,
        stock: parseInt(form.stock, 10) || 0,
        rating: parseFloat(form.rating) || 0,
        promoEndsAt: form.promoEndsAt || null,
        badge: form.badge || null,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setShowModal(false);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  /** Supprimer un produit */
  async function handleDelete(product) {
    if (!confirm(`Supprimer "${product.title}" ?`)) return;
    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  }

  /** Ajouter une variante au produit en cours d'édition */
  async function handleAddVariant() {
    if (!newVariantName.trim() || !editingProduct) return;
    try {
      await addVariant(editingProduct.id, { name: newVariantName, image: newVariantImage });
      setNewVariantName("");
      setNewVariantImage("");
      /* Recharger le produit pour voir la variante ajoutée */
      await loadProducts();
      const updated = products.find((p) => p.id === editingProduct.id);
      if (updated) setEditingProduct(updated);
    } catch (err) {
      alert(err.message);
    }
  }

  /** Supprimer une variante */
  async function handleDeleteVariant(vid) {
    try {
      await deleteVariant(vid);
      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  }

  /** Produits filtrés par recherche */
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  /** Formater un prix en FCFA */
  function fmtPrice(n) {
    return (n || 0).toLocaleString("fr-FR") + " FCFA";
  }

  return (
    <div className="space-y-6">
      {/* ---- Header avec recherche + bouton ajouter ---- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] placeholder-[#555] text-sm focus:border-[#C5A55A] focus:outline-none"
          />
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] transition-colors"
        >
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      {/* ---- Liste des produits ---- */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#141414] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#555]">
          <Package size={40} className="mx-auto mb-3 opacity-50" />
          <p>Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
          {/* En-tête tableau */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#222] text-xs text-[#888] uppercase tracking-wider">
            <div className="col-span-4">Produit</div>
            <div className="col-span-2">Prix</div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-2">Catégorie</div>
            <div className="col-span-1">Promo</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Lignes produits */}
          <div className="divide-y divide-[#222]">
            {filtered.map((product) => (
              <div key={product.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-3 items-center hover:bg-[#1a1a1a] transition-colors">
                {/* Nom + image */}
                <div className="col-span-4 flex items-center gap-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-10 h-10 rounded-lg object-cover bg-[#222]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#222] flex items-center justify-center">
                      <Tag size={14} className="text-[#555]" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-[#f5f0e8] font-medium line-clamp-1">{product.title}</p>
                    {product.badge && (
                      <span className="text-[10px] text-[#C5A55A] uppercase">{product.badge}</span>
                    )}
                  </div>
                </div>

                {/* Prix */}
                <div className="col-span-2">
                  <p className="text-sm text-[#f5f0e8]">{fmtPrice(product.price)}</p>
                  {product.promoActive && product.promoPrice && (
                    <p className="text-xs text-emerald-400">{fmtPrice(product.promoPrice)}</p>
                  )}
                </div>

                {/* Stock */}
                <div className="col-span-1">
                  <span className={`text-sm font-medium ${
                    product.stock === 0
                      ? "text-red-400"
                      : product.stock <= 2
                        ? "text-orange-400"
                        : "text-[#f5f0e8]"
                  }`}>
                    {product.stock}
                    {product.stock === 0 && <AlertTriangle size={12} className="inline ml-1" />}
                  </span>
                </div>

                {/* Catégorie */}
                <div className="col-span-2">
                  <span className="text-xs px-2 py-1 bg-[#222] rounded-full text-[#888]">
                    {product.category}
                  </span>
                </div>

                {/* Promo */}
                <div className="col-span-1">
                  {product.promoActive ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <Clock size={12} /> Oui
                    </span>
                  ) : (
                    <span className="text-xs text-[#555]">Non</span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-lg hover:bg-[#222] text-[#888] hover:text-[#C5A55A] transition-colors"
                    title="Modifier"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Modal Création/Édition ---- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-8 md:pt-20 px-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-2xl mb-8">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
              <h2 className="text-lg font-medium text-[#f5f0e8]">
                {editingProduct ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-[#f5f0e8]">
                <X size={20} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Titre */}
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Titre *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Image (URL ou chemin)</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/assets/images/..."
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                />
              </div>

              {/* Prix + Stock en ligne */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Prix (FCFA) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                    className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    min="0"
                    className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Note</label>
                  <input
                    type="number"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Catégorie + Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="sets, robes, vestes..."
                    className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Badge</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="Nouveau, Best-seller..."
                    className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Section Promo */}
              <div className="border border-[#222] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.promoActive}
                    onChange={(e) => setForm({ ...form, promoActive: e.target.checked })}
                    className="w-4 h-4 accent-[#C5A55A]"
                  />
                  <label className="text-sm text-[#f5f0e8]">Activer la promotion</label>
                </div>
                {form.promoActive && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Prix promo (FCFA)</label>
                      <input
                        type="number"
                        value={form.promoPrice}
                        onChange={(e) => setForm({ ...form, promoPrice: e.target.value })}
                        min="0"
                        className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Fin de la promo</label>
                      <input
                        type="datetime-local"
                        value={form.promoEndsAt}
                        onChange={(e) => setForm({ ...form, promoEndsAt: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section Variantes (uniquement en édition) */}
              {editingProduct && (
                <div className="border border-[#222] rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-medium text-[#f5f0e8]">Variantes</h3>

                  {/* Liste des variantes existantes */}
                  {editingProduct.variants?.length > 0 && (
                    <div className="space-y-2">
                      {editingProduct.variants.map((v) => (
                        <div key={v.id} className="flex items-center justify-between bg-[#1a1a1a] px-3 py-2 rounded-lg">
                          <span className="text-sm text-[#f5f0e8]">{v.name}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(v.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ajouter une variante */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVariantName}
                      onChange={(e) => setNewVariantName(e.target.value)}
                      placeholder="Nom de la variante"
                      className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3 py-2 bg-[#222] text-[#C5A55A] rounded-lg text-sm hover:bg-[#333] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Boutons action */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm text-[#888] hover:text-[#f5f0e8] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] disabled:opacity-50 transition-colors"
                >
                  <Save size={16} />
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

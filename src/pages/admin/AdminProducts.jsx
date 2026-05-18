/**
 * Page Admin Produits — /admin/products
 *
 * Layout 2 colonnes :
 * ┌────────────────┬────────────────────────────────────────────────┐
 * │ Recherche      │ Champs inline du produit sélectionné           │
 * │ + Nouveau      │ (titre, desc, image, prix, stock, promo…)      │
 * │ Liste produits │ ─────────────────────────────────────────────  │
 * │                │ Section Variantes :                            │
 * │                │   Couleur: [Rouge✕] [Vert✕] [+ Ajouter]       │
 * │                │   Taille:  [S✕] [M✕] [+ Ajouter]              │
 * └────────────────┴────────────────────────────────────────────────┘
 */

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, Search, X, Tag, AlertTriangle, Save,
  ChevronRight, Image as ImageIcon, Check, Pencil
} from "lucide-react";

export default function AdminProducts() {
  const token = localStorage.getItem("rassoul_admin_token");

  /* ---- Données ---- */
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");

  /* ---- Produit sélectionné / nouveau ---- */
  const [selected, setSelected]   = useState(null); /* product objet ou "new" */
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [saved, setSaved]         = useState(false);   /* feedback succès */
  const [successMsg, setSuccessMsg] = useState("");    /* toast succès */

  /* ---- Formulaire produit ---- */
  const emptyForm = {
    title:"", description:"", price:"", promoPrice:"", promoActive:false,
    promoEndsAt:"", category_id:"", category:"", stock:"0", badge:"", rating:"0", image:"", active:true,
    is_vip: false,
  };
  const [form, setForm] = useState(emptyForm);

  /* ---- Variantes ---- */
  const [variantTypes, setVariantTypes]   = useState([]); /* types globaux */
  const [byType, setByType]               = useState([]); /* options du produit groupées */
  const [selTypeId, setSelTypeId]         = useState("");  /* dropdown type sélectionné */
  const [newOptName, setNewOptName]       = useState("");
  const [newOptImage, setNewOptImage]     = useState("");
  const [uploadingImg, setUploadingImg]   = useState(false);
  const [editingOpt, setEditingOpt]       = useState(null);  /* {id, name} option en cours d'édition */
  const [editOptName, setEditOptName]     = useState("");

  /* ---- Chargements ---- */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?limit=500&admin=true", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setProducts(data.products || []);
    } finally { setLoading(false); }
  }, [token]);

  async function loadCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categoriesFull || []);
  }

  async function loadVariantTypes() {
    const res = await fetch("/api/variant-types", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setVariantTypes(data.variant_types || []);
  }

  async function loadByType(productId) {
    const res = await fetch(`/api/products/${productId}/variant-options`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setByType(data.by_type || []);
  }

  useEffect(() => { loadProducts(); loadCategories(); loadVariantTypes(); }, []);

  /* ---- Sélectionner un produit : re-fetch complet depuis l'API puis charger form ---- */
  async function selectProduct(p) {
    setSelected(p);
    setError("");
    setSelTypeId("");
    setNewOptName("");
    setNewOptImage("");
    /* Re-fetch pour avoir TOUS les champs (promo, active, etc.) */
    try {
      const res = await fetch(`/api/products/${p.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const full = data.product || p;
      setSelected(full);
      setForm({
        title: full.title || "",
        description: full.description || "",
        price: String(full.price || ""),
        promoPrice: full.promo_price ? String(full.promo_price) : "",
        promoActive: !!full.promo_active,
        promoEndsAt: full.promo_ends_at ? full.promo_ends_at.slice(0, 16) : "",
        category_id: full.category_id ? String(full.category_id) : "",
        category: full.category || full.category_slug || "",
        stock: String(full.stock ?? 0),
        badge: full.badge || "",
        rating: String(full.rating || 0),
        image: full.image || "",
        active: full.active !== false,
        is_vip: !!full.is_vip,
      });
      loadByType(full.id);
    } catch {
      /* fallback sur les données de la liste */
      setForm({
        title: p.title || "",
        description: p.description || "",
        price: String(p.price || ""),
        promoPrice: p.promo_price ? String(p.promo_price) : "",
        promoActive: !!p.promo_active,
        promoEndsAt: p.promo_ends_at ? p.promo_ends_at.slice(0, 16) : "",
        category_id: p.category_id ? String(p.category_id) : "",
        category: p.category || p.category_slug || "",
        stock: String(p.stock ?? 0),
        badge: p.badge || "",
        rating: String(p.rating || 0),
        image: p.image || "",
        active: p.active !== false,
        is_vip: !!p.is_vip,
      });
      loadByType(p.id);
    }
  }

  function selectNew() {
    setSelected("new");
    setForm(emptyForm);
    setError("");
    setByType([]);
    setSelTypeId("");
    setNewOptName("");
    setNewOptImage("");
  }

  /* ---- Sauvegarder produit ---- */
  async function handleSave(e) {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description || null,
        price: parseInt(form.price) || 0,
        promo_price: form.promoPrice ? parseInt(form.promoPrice) : null,
        promo_active: form.promoActive, promo_ends_at: form.promoEndsAt || null,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        category: form.category,
        active: form.active !== undefined ? form.active : true,
        stock: parseInt(form.stock) || 0,
        badge: form.badge || null, rating: parseFloat(form.rating) || 0,
        image: form.image || null,
        is_vip: form.category === "boites" ? form.is_vip : false,
      };
      const isNew = selected === "new";
      const url = isNew ? "/api/products" : `/api/products/${selected.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || "Erreur"); return; }
      await loadProducts();
      /* Feedback succès */
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (isNew) {
        /* Sur mobile : retour à la liste après création */
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setSuccessMsg(`"${data.product?.title || 'Produit'}" créé avec succès !`);
          setTimeout(() => setSuccessMsg(""), 3000);
          setSelected(null);
        } else if (data.product) {
          selectProduct(data.product);
        }
      }
    } catch (err) { setError(err.message);
    } finally { setSaving(false); }
  }

  /* ---- Supprimer produit ---- */
  async function handleDelete(p) {
    if (!confirm(`Supprimer "${p.title}" ?`)) return;
    await fetch(`/api/products/${p.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setSelected(null);
    loadProducts();
  }

  /* ---- Upload image produit ---- */
  async function uploadProductImage(file) {
    const fd = new FormData(); fd.append("image", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (data.success) setForm(f => ({ ...f, image: data.imageUrl }));
  }

  /* ---- Catégorie dropdown ---- */
  function handleCatSelect(e) {
    const id = e.target.value;
    const cat = categories.find(c => String(c.id) === id);
    setForm(f => ({ ...f, category_id: id, category: cat ? cat.slug : "" }));
  }

  /* ---- Ajouter option variante ---- */
  async function handleAddOption() {
    if (!newOptName.trim() || !selTypeId || selected === "new" || !selected) return;
    await fetch(`/api/products/${selected.id}/variant-options`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ variant_type_id: parseInt(selTypeId), name: newOptName.trim(), image: newOptImage || null, price_modifier: 0 })
    });
    setNewOptName(""); setNewOptImage("");
    loadByType(selected.id);
  }

  /* ---- Supprimer option variante ---- */
  async function handleDeleteOption(oid) {
    await fetch(`/api/products/variant-options/${oid}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (selected && selected !== "new") loadByType(selected.id);
  }

  /* ---- Modifier le nom d'une option variante ---- */
  async function handleSaveOpt(oid) {
    if (!editOptName.trim()) return;
    await fetch(`/api/products/variant-options/${oid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editOptName.trim() })
    });
    setEditingOpt(null);
    if (selected && selected !== "new") loadByType(selected.id);
  }

  /* ---- Upload image option ---- */
  async function uploadOptImage(file) {
    setUploadingImg(true);
    const fd = new FormData(); fd.append("image", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      setNewOptImage(data.imageUrl || "");
    } finally { setUploadingImg(false); }
  }

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );
  const fmtP = n => (n || 0).toLocaleString("fr-FR") + " FCFA";
  const catName = slug => categories.find(c => c.slug === slug)?.name || slug;

  /* ================================================================
     JSX — Layout 2 colonnes
     ================================================================ */
  /* Sur mobile : liste visible si rien sélectionné, formulaire visible si sélectionné */
  const showList = !selected;
  const showForm = !!selected;

  return (
    <div className="md:flex md:gap-5 md:h-[calc(100vh-8rem)] md:min-h-0">

      {/* ---- COLONNE GAUCHE : liste produits (cachée sur mobile quand formulaire ouvert) ---- */}
      <div className={`${
        showList ? 'flex' : 'hidden md:flex'
      } flex-col w-full md:w-72 md:flex-shrink-0 bg-[#111] rounded-xl border border-[#222] overflow-hidden min-h-[60vh] md:min-h-0 md:h-auto`}>
        {/* Toast succès création (mobile) */}
        {successMsg && (
          <div className="mx-3 mt-3 px-3 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs">
            ✓ {successMsg}
          </div>
        )}
        <div className="p-3 border-b border-[#222] space-y-2">
          <button
            onClick={selectNew}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${selected === "new" ? "bg-[#C5A55A] text-[#0a0a0a]" : "bg-[#C5A55A]/10 text-[#C5A55A] hover:bg-[#C5A55A]/20"}`}
          >
            <Plus size={15} /> Nouveau produit
          </button>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-xs text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#1a1a1a]">
          {loading ? Array.from({length:6}).map((_,i) => <div key={i} className="h-14 mx-2 my-1 bg-[#141414] rounded-lg animate-pulse" />) :
          filtered.map(p => (
            <div
              key={p.id}
              className={`flex items-center gap-2 px-2.5 py-2 transition-colors ${
                selected !== "new" && selected?.id === p.id ? "bg-[#C5A55A]/10" : "hover:bg-[#1a1a1a]"
              }`}
            >
              {/* Image */}
              {p.image
                ? <img src={p.image} alt="" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                : <div className="w-8 h-8 rounded-md bg-[#222] flex items-center justify-center flex-shrink-0"><Tag size={11} className="text-[#555]" /></div>
              }

              {/* Infos — clic pour modifier */}
              <button
                type="button"
                onClick={() => selectProduct(p)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="text-xs font-medium text-[#f5f0e8] truncate leading-tight">{p.title}</p>
                <p className={`text-[10px] leading-tight mt-0.5 ${
                  p.stock === 0 ? "text-red-400" : p.stock <= 2 ? "text-orange-400" : "text-[#555]"
                }`}>
                  {fmtP(p.price)}
                  {p.stock === 0 && <AlertTriangle size={9} className="inline ml-1" />}
                </p>
              </button>

              {/* Boutons action */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  title="Modifier"
                  onClick={() => selectProduct(p)}
                  className="p-1.5 rounded-md text-[#555] hover:text-[#C5A55A] hover:bg-[#C5A55A]/10 transition-colors"
                >
                  <Pencil size={12} />
                </button>
                <button
                  type="button"
                  title="Supprimer"
                  onClick={() => handleDelete(p)}
                  className="p-1.5 rounded-md text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- COLONNE DROITE : formulaire (cachée sur mobile si rien sélectionné) ---- */}
      <div className={`${
        showForm ? 'block' : 'hidden md:block'
      } flex-1 min-w-0 overflow-y-auto`}>
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-[#444]">
            <Tag size={36} className="mb-3 text-[#333]" />
            <p className="text-sm">Sélectionnez un produit ou créez-en un nouveau</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5 pb-10 pt-1">
            {/* Bouton retour mobile */}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="md:hidden flex items-center gap-1.5 text-xs text-[#888] hover:text-[#f5f0e8] mb-3 transition-colors"
            >
              ← Retour à la liste
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 justify-between sticky top-0 bg-[#0a0a0a] py-2 z-10 min-w-0">
              <h2 className="text-sm font-semibold text-[#f5f0e8] truncate min-w-0 flex-1">
                {selected === "new" ? "Nouveau produit" : selected.title}
              </h2>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {selected !== "new" && (
                  <button type="button" onClick={() => handleDelete(selected)}
                    className="p-2 text-[#555] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
                <button type="submit" disabled={saving}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                    saved ? 'bg-emerald-500 text-white' : 'bg-[#C5A55A] text-[#0a0a0a] hover:bg-[#d4b472]'
                  }`}>
                  <Save size={13} />
                  <span className="hidden sm:inline">{saving ? "Enregistrement…" : saved ? "✓ Sauvegardé" : "Enregistrer"}</span>
                  <span className="sm:hidden">{saving ? "…" : saved ? "✓" : "OK"}</span>
                </button>
              </div>
            </div>

            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

            {/* ---- Titre + Active ---- */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Titre *</label>
                <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required
                  className="w-full px-3 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none" />
              </div>
              <div className="flex-shrink-0 pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} className="w-4 h-4 accent-[#C5A55A]" />
                  <span className="text-xs text-[#888] uppercase tracking-wider">Visible</span>
                </label>
              </div>
            </div>

            {/* ---- Description ---- */}
            <div>
              <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} rows={3}
                className="w-full px-3 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none resize-none" />
            </div>

            {/* ---- Image ---- */}
            <div>
              <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Image</label>
              <div className="flex items-center gap-3">
                {form.image
                  ? <img src={form.image} alt="" className="w-16 h-16 rounded-lg object-cover border border-[#333]" />
                  : <div className="w-16 h-16 rounded-lg bg-[#141414] border border-[#222] flex items-center justify-center"><ImageIcon size={18} className="text-[#444]" /></div>
                }
                <div className="flex-1">
                  <input type="file" accept="image/*"
                    onChange={e => e.target.files[0] && uploadProductImage(e.target.files[0])}
                    className="w-full text-sm text-[#888] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C5A55A] file:text-[#0a0a0a] hover:file:bg-[#d4b472] file:cursor-pointer" />
                  {form.image && <button type="button" onClick={()=>setForm(f=>({...f,image:""}))} className="mt-1 text-xs text-red-400">Supprimer</button>}
                </div>
              </div>
            </div>

            {/* ---- Prix / Stock / Note ---- */}
            <div className="grid grid-cols-3 gap-3">
              {[["Prix (FCFA) *","number","price","0"],["Stock","number","stock","0"],["Note","number","rating","0"]].map(([lbl,type,key,min]) => (
                <div key={key}>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">{lbl}</label>
                  <input type={type} value={form[key]} min={min} max={key==="rating"?"5":undefined} step={key==="rating"?"0.1":undefined}
                    onChange={e => setForm(f=>({...f,[key]:e.target.value}))}
                    required={key==="price"}
                    className="w-full px-3 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none" />
                </div>
              ))}
            </div>

            {/* ---- Catégorie + Badge ---- */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Catégorie</label>
                <select value={form.category_id} onChange={handleCatSelect}
                  className="w-full px-3 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none">
                  <option value="">— Choisir —</option>
                  {categories.filter(c=>c.active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {/* Checkbox VIP — visible uniquement si catégorie = boites */}
                {form.category === "boites" && (
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_vip}
                      onChange={e => setForm(f => ({...f, is_vip: e.target.checked}))}
                      className="w-4 h-4 accent-[#C5A55A]"
                    />
                    <span className="text-xs text-[#C5A55A] font-semibold uppercase tracking-wider">Boîte VIP</span>
                  </label>
                )}
              </div>
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Badge</label>
                <input value={form.badge} onChange={e=>setForm(f=>({...f,badge:e.target.value}))} placeholder="Nouveau, Best-seller…"
                  className="w-full px-3 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none" />
              </div>
            </div>

            {/* ---- Promo ---- */}
            <div className="border border-[#222] rounded-xl p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.promoActive} onChange={e=>setForm(f=>({...f,promoActive:e.target.checked}))} className="w-4 h-4 accent-[#C5A55A]" />
                <span className="text-sm text-[#f5f0e8]">Activer la promotion</span>
              </label>
              {form.promoActive && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Prix promo (FCFA)</label>
                    <input type="number" value={form.promoPrice} min="0" onChange={e=>setForm(f=>({...f,promoPrice:e.target.value}))}
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Fin de la promo</label>
                    <input type="datetime-local" value={form.promoEndsAt} onChange={e=>setForm(f=>({...f,promoEndsAt:e.target.value}))}
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none" />
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================
                SECTION VARIANTES — dropdown compact (produit existant seulement)
                ================================================================ */}
            {selected !== "new" && (
              <div className="border border-[#222] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider">Variantes</h3>

                {variantTypes.length === 0 ? (
                  <p className="text-xs text-[#444] italic">
                    Aucun type défini — créez-en dans l'onglet <span className="text-[#C5A55A]">Variantes</span>.
                  </p>
                ) : (
                  <>
                    {/* Formulaire compact : dropdown type + nom + prix + bouton */}
                    <div className="flex gap-2 flex-wrap items-center">
                      <select value={selTypeId} onChange={e=>setSelTypeId(e.target.value)}
                        className="px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-xs text-[#f5f0e8] focus:border-[#C5A55A] focus:outline-none">
                        <option value="">— Type —</option>
                        {variantTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <input value={newOptName} onChange={e=>setNewOptName(e.target.value)}
                        onKeyDown={e=>e.key==="Enter" && handleAddOption()}
                        placeholder="Nom (Rouge, XL…)"
                        className="flex-1 min-w-[120px] px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-xs text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none" />
                      {/* Photo option */}
                      <label className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#C5A55A] transition-colors flex-shrink-0" title="Photo (optionnel)">
                        {uploadingImg ? <div className="w-3.5 h-3.5 border border-[#C5A55A] border-t-transparent rounded-full animate-spin" />
                          : newOptImage ? <img src={newOptImage} alt="" className="w-full h-full object-cover" />
                          : <ImageIcon size={13} className="text-[#444]" />}
                        <input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files[0]&&uploadOptImage(e.target.files[0])} />
                      </label>
                      <button type="button" onClick={handleAddOption} disabled={!newOptName.trim()||!selTypeId}
                        className="flex items-center gap-1 px-3 py-2 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-[#d4b472] transition-colors flex-shrink-0">
                        <Plus size={12} /> Ajouter
                      </button>
                    </div>

                    {/* Liste compacte des options groupées par type */}
                    {byType.filter(bt => bt.options.length > 0).length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {byType.filter(bt => bt.options.length > 0).map(bt => (
                          <div key={bt.type_id} className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-[#C5A55A] uppercase tracking-wider font-semibold w-20 flex-shrink-0">{bt.type_name}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {bt.options.map(opt => (
                                editingOpt?.id === opt.id ? (
                                  /* ---- Mode édition inline ---- */
                                  <span key={opt.id} className="flex items-center gap-1 bg-[#1a1a1a] border border-[#C5A55A]/40 rounded-md overflow-hidden">
                                    {opt.image && <img src={opt.image} alt="" className="w-6 h-6 object-cover flex-shrink-0" />}
                                    <input
                                      value={editOptName}
                                      onChange={e => setEditOptName(e.target.value)}
                                      onKeyDown={e => { if (e.key==="Enter") handleSaveOpt(opt.id); if (e.key==="Escape") setEditingOpt(null); }}
                                      autoFocus
                                      className="w-24 px-2 py-1 bg-transparent text-xs text-[#f5f0e8] outline-none" />
                                    <button type="button" onClick={()=>handleSaveOpt(opt.id)}
                                      className="px-1.5 text-[#C5A55A] hover:text-white"><Check size={11} /></button>
                                    <button type="button" onClick={()=>setEditingOpt(null)}
                                      className="pr-1.5 text-[#555] hover:text-white"><X size={10} /></button>
                                  </span>
                                ) : (
                                  /* ---- Mode affichage ---- */
                                  <span key={opt.id} className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-2 py-0.5 text-xs text-[#f5f0e8] group">
                                    {opt.image && <img src={opt.image} alt="" className="w-4 h-4 rounded object-cover" />}
                                    {opt.name}
                                    <button type="button"
                                      onClick={()=>{ setEditingOpt(opt); setEditOptName(opt.name); }}
                                      className="text-[#444] hover:text-[#C5A55A] opacity-0 group-hover:opacity-100 transition-all">
                                      <Pencil size={9} />
                                    </button>
                                    <button type="button" onClick={()=>handleDeleteOption(opt.id)}
                                      className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                      <X size={10} />
                                    </button>
                                  </span>
                                )
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

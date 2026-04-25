/**
 * Page Admin Lookbook — /admin/lookbook
 *
 * Deux sections dans la même page :
 *
 * ① Bannière Hero
 *    - Aperçu de la photo/vidéo actuelle
 *    - Bouton pour uploader un nouveau fichier (image ou vidéo)
 *
 * ② Médias du Lookbook (CRUD complet)
 *    - Grille de tous les items
 *    - Ajout : upload fichier + choix du span
 *    - Édition : modifier span et légende
 *    - Suppression avec confirmation
 */

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Upload, Image, Film, Save, LayoutGrid } from "lucide-react";
import {
  fetchLookbook,
  createLookbookItem,
  updateLookbookItem,
  deleteLookbookItem,
  fetchLookbookBanner,
  updateLookbookBanner,
} from "../../services/adminApi";

/* Options de span disponibles */
const SPAN_OPTIONS = [
  { value: "normal", label: "Normal (1×1)" },
  { value: "tall",   label: "Haut (1×2 lignes)" },
  { value: "wide",   label: "Large (2×1 colonnes)" },
];

export default function AdminLookbook() {
  const token = localStorage.getItem("rassoul_admin_token");

  /* ---- État bannière ---- */
  const [banner, setBanner]               = useState(null);
  const [bannerFile, setBannerFile]       = useState(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerError, setBannerError]     = useState("");

  /* ---- État items ---- */
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---- Modal ajout/édition item ---- */
  const [showModal, setShowModal]     = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [file, setFile]               = useState(null);
  const [span, setSpan]               = useState("normal");
  const [caption, setCaption]         = useState("");
  const [saving, setSaving]           = useState(false);
  const [modalError, setModalError]   = useState("");

  /* ---- Chargement initial ---- */
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [bannerData, itemsData] = await Promise.all([
        fetchLookbookBanner(),
        fetchLookbook(),
      ]);
      setBanner(bannerData.banner || null);
      setItems(itemsData.items || itemsData || []);
    } catch (err) {
      console.error("Erreur chargement lookbook:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================================================================
   * BANNIÈRE
   * ============================================================== */

  /** Upload d'un nouveau fichier bannière */
  async function handleBannerUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBannerFile(f);
    setBannerError("");
    setBannerUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      await updateLookbookBanner(fd);
      await loadAll();
      setBannerFile(null);
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerUploading(false);
    }
  }

  /* ================================================================
   * ITEMS — Modal
   * ============================================================== */

  function openNew() {
    setEditingItem(null);
    setFile(null);
    setSpan("normal");
    setCaption("");
    setModalError("");
    setShowModal(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setFile(null);
    setSpan(item.span || "normal");
    setCaption(item.caption || "");
    setModalError("");
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setModalError("");
    setSaving(true);
    try {
      if (editingItem) {
        /* Modifier span, caption */
        await updateLookbookItem(editingItem.id, { span, caption });
      } else {
        /* Créer : fichier obligatoire */
        if (!file) { setModalError("Veuillez sélectionner un fichier"); setSaving(false); return; }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("span", span);
        fd.append("caption", caption);
        fd.append("display_order", String(items.length));
        await createLookbookItem(fd);
      }
      setShowModal(false);
      await loadAll();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!confirm("Supprimer ce média du lookbook ?")) return;
    try {
      await deleteLookbookItem(item.id);
      await loadAll();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ================================================================
   * JSX
   * ============================================================== */
  return (
    <div className="space-y-8">

      {/* ============================================================
          SECTION 1 — BANNIÈRE HERO
          ============================================================ */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
        {/* Header section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <div>
            <h2 className="text-[#f5f0e8] font-semibold">Bannière Hero</h2>
            <p className="text-xs text-[#666] mt-0.5">
              Photo ou vidéo affichée en fond sur la page Lookbook publique
            </p>
          </div>
          <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
            bannerUploading
              ? "bg-[#333] text-[#888] cursor-not-allowed"
              : "bg-[#C5A55A] text-[#0a0a0a] hover:bg-[#D4B56E]"
          }`}>
            <Upload size={14} />
            {bannerUploading ? "Envoi..." : banner ? "Changer" : "Uploader"}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleBannerUpload}
              disabled={bannerUploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Aperçu bannière */}
        <div className="p-6">
          {bannerError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {bannerError}
            </div>
          )}

          {banner?.src ? (
            <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a]"
              style={{ height: "220px" }}>
              {banner.type === "video" ? (
                <video
                  src={banner.src}
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={banner.src}
                  alt="Bannière lookbook"
                  className="w-full h-full object-cover"
                />
              )}
              {/* Badge type */}
              <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[10px] text-white uppercase tracking-wider">
                {banner.type === "video" ? <Film size={10} /> : <Image size={10} />}
                {banner.type}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[160px] rounded-xl border-2 border-dashed border-[#2a2a2a] text-[#555]">
              <Image size={32} className="mb-2 opacity-40" />
              <p className="text-sm">Aucune bannière — uploadez une image ou vidéo</p>
            </div>
          )}

          {bannerFile && !bannerUploading && (
            <p className="mt-2 text-xs text-[#C5A55A]">Fichier sélectionné : {bannerFile.name}</p>
          )}
        </div>
      </div>

      {/* ============================================================
          SECTION 2 — MÉDIAS DU LOOKBOOK
          ============================================================ */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
        {/* Header section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <div>
            <h2 className="text-[#f5f0e8] font-semibold">
              Médias du Lookbook
              <span className="ml-2 text-xs text-[#555] font-normal">{items.length} élément(s)</span>
            </h2>
            <p className="text-xs text-[#666] mt-0.5">
              Photos et vidéos affichées dans la galerie mosaïque
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] transition-colors"
          >
            <Plus size={14} />
            Ajouter un média
          </button>
        </div>

        {/* Grille des médias */}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-[#1a1a1a] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#555]">
              <LayoutGrid size={40} className="mb-3 opacity-30" />
              <p className="text-sm">Aucun média dans le lookbook</p>
              <p className="text-xs mt-1 text-[#444]">Ajoutez des images ou des vidéos</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative group bg-[#1a1a1a] border border-[#222] rounded-xl overflow-hidden"
                >
                  {/* Aperçu */}
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      className="w-full aspect-square object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.caption || `Look ${item.id}`}
                      className="w-full aspect-square object-cover"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[9px] text-white">
                      {item.type === "video" ? <Film size={9} /> : <Image size={9} />}
                      {item.type}
                    </span>
                    <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[9px] text-[#C5A55A]">
                      {item.span}
                    </span>
                  </div>

                  {/* Actions hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2.5 bg-[#C5A55A] rounded-full text-[#0a0a0a] hover:bg-[#D4B56E] transition-colors"
                      title="Modifier"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Caption */}
                  {item.caption && (
                    <div className="px-2 py-1.5 bg-[#111]">
                      <p className="text-[10px] text-[#777] line-clamp-1">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          MODAL — Ajouter / Modifier un item
          ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center px-4">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
              <h3 className="text-[#f5f0e8] font-semibold">
                {editingItem ? "Modifier le média" : "Ajouter un média"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#555] hover:text-[#f5f0e8] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {modalError}
                </div>
              )}

              {/* Upload — uniquement pour nouveau */}
              {!editingItem && (
                <div>
                  <label className="block text-[10px] text-[#888] uppercase tracking-wider mb-2">
                    Fichier *
                  </label>
                  <label className="flex flex-col items-center gap-2 p-6 bg-[#1a1a1a] border-2 border-dashed border-[#333] rounded-xl cursor-pointer hover:border-[#C5A55A] transition-colors">
                    <Upload size={22} className="text-[#555]" />
                    <span className="text-sm text-[#777]">
                      {file ? file.name : "Cliquer pour sélectionner (image ou vidéo)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setFile(e.target.files[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Span */}
              <div>
                <label className="block text-[10px] text-[#888] uppercase tracking-wider mb-2">
                  Taille dans la grille
                </label>
                <select
                  value={span}
                  onChange={(e) => setSpan(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                >
                  {SPAN_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Légende */}
              <div>
                <label className="block text-[10px] text-[#888] uppercase tracking-wider mb-2">
                  Légende (optionnel)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Description du média..."
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-[#777] hover:text-[#f5f0e8] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] disabled:opacity-50 transition-colors"
                >
                  <Save size={14} />
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

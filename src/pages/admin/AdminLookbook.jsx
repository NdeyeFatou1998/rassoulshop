/**
 * Page Admin Lookbook — /admin/lookbook
 *
 * CRUD des médias du lookbook (images et vidéos) :
 * - Grille visuelle des médias existants
 * - Upload de nouveaux médias (image ou vidéo)
 * - Modification du caption et de l'ordre
 * - Suppression avec confirmation
 */

import { useState, useEffect } from "react";
import {
  Plus, Trash2, Edit2, X, Upload, Image, Film, Save, GripVertical
} from "lucide-react";
import {
  fetchLookbook, createLookbookItem, updateLookbookItem, deleteLookbookItem
} from "../../services/adminApi";

export default function AdminLookbook() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* État du formulaire upload */
  const [file, setFile] = useState(null);
  const [type, setType] = useState("image");
  const [caption, setCaption] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  /** Charger les médias lookbook */
  async function loadItems() {
    setLoading(true);
    try {
      const data = await fetchLookbook();
      setItems(data || []);
    } catch (err) {
      console.error("Erreur chargement lookbook:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  /** Ouvrir modal pour ajouter un nouveau média */
  function handleNew() {
    setEditingItem(null);
    setFile(null);
    setType("image");
    setCaption("");
    setSortOrder(items.length);
    setError("");
    setShowModal(true);
  }

  /** Ouvrir modal pour éditer un média existant */
  function handleEdit(item) {
    setEditingItem(item);
    setFile(null);
    setType(item.type || "image");
    setCaption(item.caption || "");
    setSortOrder(item.sortOrder || 0);
    setError("");
    setShowModal(true);
  }

  /** Sauvegarder (upload nouveau ou modifier existant) */
  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingItem) {
        /* Modification : caption, sortOrder, type */
        await updateLookbookItem(editingItem.id, { caption, sortOrder, type });
      } else {
        /* Création : upload fichier obligatoire */
        if (!file) {
          setError("Veuillez sélectionner un fichier");
          setSaving(false);
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("caption", caption);
        formData.append("sortOrder", String(sortOrder));
        await createLookbookItem(formData);
      }

      setShowModal(false);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  /** Supprimer un média */
  async function handleDelete(item) {
    if (!confirm("Supprimer ce média du lookbook ?")) return;
    try {
      await deleteLookbookItem(item.id);
      await loadItems();
    } catch (err) {
      alert(err.message);
    }
  }

  /** Construire l'URL complète pour les médias uploadés */
  function getMediaUrl(src) {
    /* Les URLs /uploads sont proxifiées par Vite vers le backend */
    return src;
  }

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#888]">{items.length} média(s)</p>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E0C055] transition-colors"
        >
          <Plus size={16} />
          Ajouter un média
        </button>
      </div>

      {/* ---- Grille des médias ---- */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#141414] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-[#555]">
          <Image size={40} className="mx-auto mb-3 opacity-50" />
          <p>Aucun média dans le lookbook</p>
          <p className="text-xs mt-1">Ajoutez des images ou vidéos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group bg-[#141414] border border-[#222] rounded-xl overflow-hidden"
            >
              {/* Aperçu du média */}
              {item.type === "video" ? (
                <video
                  src={getMediaUrl(item.src)}
                  className="w-full aspect-square object-cover"
                  muted
                />
              ) : (
                <img
                  src={getMediaUrl(item.src)}
                  alt={item.caption || "Lookbook"}
                  className="w-full aspect-square object-cover"
                />
              )}

              {/* Badge type */}
              <div className="absolute top-2 left-2">
                <span className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[10px] text-white">
                  {item.type === "video" ? <Film size={10} /> : <Image size={10} />}
                  {item.type}
                </span>
              </div>

              {/* Overlay actions au hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-[#D4AF37] rounded-full text-[#0a0a0a] hover:bg-[#E0C055]"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Caption en bas */}
              {item.caption && (
                <div className="px-3 py-2">
                  <p className="text-xs text-[#888] line-clamp-1">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---- Modal Upload/Édition ---- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
              <h2 className="text-lg font-medium text-[#f5f0e8]">
                {editingItem ? "Modifier le média" : "Ajouter un média"}
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

              {/* Upload fichier (uniquement pour nouveau) */}
              {!editingItem && (
                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-2">Fichier *</label>
                  <label className="flex flex-col items-center gap-2 p-6 bg-[#1a1a1a] border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#D4AF37] transition-colors">
                    <Upload size={24} className="text-[#555]" />
                    <span className="text-sm text-[#888]">
                      {file ? file.name : "Cliquer pour sélectionner"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        setFile(f);
                        /* Auto-détecter le type */
                        if (f?.type.startsWith("video")) setType("video");
                        else setType("image");
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Type */}
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="image">Image</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Légende</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Description du média..."
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Ordre */}
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Ordre d'affichage</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                  min="0"
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm text-[#888] hover:text-[#f5f0e8]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E0C055] disabled:opacity-50"
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

/**
 * Page Admin À Propos — /admin/about
 *
 * CRUD des sections de la page "À Propos de Rassoul Shop" :
 * - Liste des sections avec titre, description et images
 * - Création/édition de sections
 * - Upload d'images associées à chaque section
 * - Suppression de sections et d'images
 */

import { useState, useEffect } from "react";
import {
  Plus, Trash2, Edit2, X, Upload, Image, Save, FileText
} from "lucide-react";
import {
  fetchAbout, createAboutSection, updateAboutSection,
  deleteAboutSection, addAboutImage, deleteAboutImage
} from "../../services/adminApi";

export default function AdminAbout() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* État du formulaire section */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  /** Charger les sections */
  async function loadSections() {
    setLoading(true);
    try {
      const data = await fetchAbout();
      setSections(data || []);
    } catch (err) {
      console.error("Erreur chargement about:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSections(); }, []);

  /** Ouvrir modal pour créer une nouvelle section */
  function handleNew() {
    setEditingSection(null);
    setTitle("");
    setDescription("");
    setSortOrder(sections.length);
    setError("");
    setShowModal(true);
  }

  /** Ouvrir modal pour éditer une section existante */
  function handleEdit(section) {
    setEditingSection(section);
    setTitle(section.title || "");
    setDescription(section.description || "");
    setSortOrder(section.sortOrder || 0);
    setError("");
    setShowModal(true);
  }

  /** Sauvegarder (créer ou modifier) */
  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingSection) {
        await updateAboutSection(editingSection.id, { title, description, sortOrder });
      } else {
        await createAboutSection({ title, description, sortOrder });
      }
      setShowModal(false);
      await loadSections();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  /** Supprimer une section */
  async function handleDelete(section) {
    if (!confirm(`Supprimer la section "${section.title}" ?`)) return;
    try {
      await deleteAboutSection(section.id);
      await loadSections();
    } catch (err) {
      alert(err.message);
    }
  }

  /** Upload d'une image pour une section */
  async function handleImageUpload(sectionId, file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await addAboutImage(sectionId, formData);
      await loadSections();
    } catch (err) {
      alert(err.message);
    }
  }

  /** Supprimer une image */
  async function handleDeleteImage(imgId) {
    if (!confirm("Supprimer cette image ?")) return;
    try {
      await deleteAboutImage(imgId);
      await loadSections();
    } catch (err) {
      alert(err.message);
    }
  }

  /** URL complète pour les images uploadées */
  function getImgUrl(src) {
    /* Les URLs /uploads sont proxifiées par Vite vers le backend */
    return src;
  }

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#888]">{sections.length} section(s)</p>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] transition-colors"
        >
          <Plus size={16} />
          Nouvelle section
        </button>
      </div>

      {/* ---- Liste des sections ---- */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-[#141414] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-16 text-[#555]">
          <FileText size={40} className="mx-auto mb-3 opacity-50" />
          <p>Aucune section À Propos</p>
          <p className="text-xs mt-1">Créez des sections pour la page À Propos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden"
            >
              {/* Header de la section */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
                <div>
                  <h3 className="text-sm font-medium text-[#f5f0e8]">{section.title}</h3>
                  <p className="text-xs text-[#555] mt-0.5">Ordre : {section.sortOrder}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(section)}
                    className="p-2 rounded-lg hover:bg-[#222] text-[#888] hover:text-[#C5A55A] transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(section)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-3">
                <p className="text-sm text-[#888] line-clamp-3">
                  {section.description || "Aucune description"}
                </p>
              </div>

              {/* Images de la section */}
              <div className="px-6 py-3 border-t border-[#222]">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Images existantes */}
                  {section.images?.map((img) => (
                    <div key={img.id} className="relative group w-20 h-20">
                      <img
                        src={getImgUrl(img.src)}
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}

                  {/* Bouton ajouter une image */}
                  <label className="w-20 h-20 flex flex-col items-center justify-center bg-[#1a1a1a] border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#C5A55A] transition-colors">
                    <Upload size={16} className="text-[#555]" />
                    <span className="text-[9px] text-[#555] mt-1">Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(section.id, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Modal Création/Édition section ---- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
              <h2 className="text-lg font-medium text-[#f5f0e8]">
                {editingSection ? "Modifier la section" : "Nouvelle section"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-[#f5f0e8]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Titre *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Ordre</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                  min="0"
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                />
              </div>

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
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] disabled:opacity-50"
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

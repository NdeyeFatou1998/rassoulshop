/**
 * Page AdminCategories - Gestion des Catégories
 *
 * Création simplifiée : nom + image (+ statut, ordre optionnel)
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EMPTY_FORM = {
  name: "",
  image_url: "",
  display_order: "",
  active: true,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(Array.isArray(data.categoriesFull) ? data.categoriesFull : []);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(category = null) {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        image_url: category.image_url || "",
        display_order:
          category.display_order != null && category.display_order !== 0
            ? String(category.display_order)
            : "",
        active: category.active,
      });
    } else {
      setEditingCategory(null);
      setFormData(EMPTY_FORM);
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setFormData(EMPTY_FORM);
  }

  async function uploadCategoryImage(file) {
    if (!file) return;
    setUploadingImg(true);
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload?folder=categories", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload échoué");
      }
      setFormData((prev) => ({ ...prev, image_url: data.imageUrl }));
    } catch (error) {
      console.error("Erreur upload image catégorie:", error);
      alert(error.message || "Erreur lors de l'upload de l'image");
    } finally {
      setUploadingImg(false);
    }
  }

  function buildPayload() {
    const payload = {
      name: formData.name.trim(),
      image_url: formData.image_url?.trim() || null,
      active: formData.active,
    };

    if (formData.display_order !== "") {
      payload.display_order = parseInt(formData.display_order, 10) || 0;
    }

    return payload;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("rassoul_admin_token");
      const payload = buildPayload();

      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!data.success) {
          alert(data.message || "Erreur lors de la création");
          return;
        }
      }

      closeModal();
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Erreur lors de l'opération");
    }
  }

  async function toggleCategory(id) {
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      await fetch(`/api/categories/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors du toggle:", error);
    }
  }

  async function deleteCategory(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;

    try {
      const token = localStorage.getItem("rassoul_admin_token");
      await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#f5f0e8] mb-2">
            Catégories
          </h1>
          <p className="text-sm text-[#888]">
            Gérer les catégories de produits
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-[#D7A12B] text-[#0a0a0a] font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-[#E8B945] transition-all duration-300"
        >
          + Nouvelle Catégorie
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#888]">Chargement...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-[#888]">
          Aucune catégorie pour le moment
        </div>
      ) : (
        <div className="grid gap-3">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#141414] border rounded-xl p-5 transition-colors ${
                category.active
                  ? "border-[#D7A12B]/20 hover:border-[#D7A12B]/40"
                  : "border-[#333]/50 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#333] flex-shrink-0">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#555]">
                        Sans image
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#f5f0e8] text-lg">
                        {category.name}
                      </h3>
                      {!category.active && (
                        <span className="text-[10px] uppercase tracking-wider bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                          Inactif
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      category.active
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : "bg-[#333] text-[#888] hover:bg-[#444]"
                    }`}
                  >
                    {category.active ? "Actif" : "Inactif"}
                  </button>
                  <button
                    onClick={() => openModal(category)}
                    className="px-3 py-1.5 bg-[#D7A12B]/20 text-[#D7A12B] text-sm rounded-lg hover:bg-[#D7A12B]/30 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141414] border border-[#D7A12B]/20 rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="font-serif text-xl text-[#f5f0e8] mb-6">
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D7A12B]/70 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex : Peluches"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#D7A12B] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D7A12B]/70 mb-2">
                  Image
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#333] flex-shrink-0">
                    {formData.image_url ? (
                      <img
                        src={formData.image_url}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#555] text-center px-2">
                        Aucune image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImg}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadCategoryImage(file);
                        e.target.value = "";
                      }}
                      className="block w-full text-xs text-[#888] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#D7A12B]/20 file:text-[#D7A12B] hover:file:bg-[#D7A12B]/30"
                    />
                    {uploadingImg && (
                      <p className="text-xs text-[#D7A12B]">Upload en cours…</p>
                    )}
                    {formData.image_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Supprimer l'image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D7A12B]/70 mb-2">
                  Ordre d'affichage <span className="text-[#555] normal-case tracking-normal">(optionnel)</span>
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  min={0}
                  placeholder="Laisser vide pour tri automatique"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#D7A12B] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D7A12B]/70 mb-2">
                  Statut
                </label>
                <select
                  value={formData.active ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] focus:border-[#D7A12B] focus:outline-none transition-colors"
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
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
                  className="flex-1 py-3 bg-[#D7A12B] text-[#0a0a0a] font-semibold text-sm rounded-lg hover:bg-[#E8B945] transition-colors"
                >
                  {editingCategory ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

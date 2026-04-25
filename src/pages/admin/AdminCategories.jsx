/**
 * Page AdminCategories - Gestion des Catégories
 * 
 * Permet aux admins de :
 * - Lister les catégories (avec statut actif/inactif)
 * - Créer une catégorie (nom, slug auto, description, ordre d'affichage)
 * - Modifier une catégorie
 * - Supprimer une catégorie
 * - Activer/désactiver une catégorie
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    display_order: 0,
    active: true
  });

  // Charger la liste des catégories
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

  // Ouvrir le modal pour créer ou modifier
  function openModal(category = null) {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image_url: category.image_url || "",
        display_order: category.display_order || 0,
        active: category.active
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        display_order: 0,
        active: true
      });
    }
    setShowModal(true);
  }

  // Fermer le modal
  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      display_order: 0,
      active: true
    });
  }

  // Générer le slug automatiquement à partir du nom
  function handleNameChange(value) {
    const slug = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    setFormData({
      ...formData,
      name: value,
      slug: editingCategory ? formData.slug : slug
    });
  }

  // Soumettre le formulaire
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("rassoul_admin_token");

      if (editingCategory) {
        // Modifier
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Créer
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
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

  // Toggle actif/inactif
  async function toggleCategory(id) {
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      await fetch(`/api/categories/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors du toggle:", error);
    }
  }

  // Supprimer une catégorie
  async function deleteCategory(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;

    try {
      const token = localStorage.getItem("rassoul_admin_token");
      await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
    }
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
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
          className="px-4 py-2 bg-[#C5A55A] text-[#0a0a0a] font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-[#D4B56E] transition-all duration-300"
        >
          + Nouvelle Catégorie
        </button>
      </div>

      {/* Liste des catégories */}
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
                  ? "border-[#C5A55A]/20 hover:border-[#C5A55A]/40"
                  : "border-[#333]/50 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Indicateur ordre */}
                  <span className="text-xs text-[#555] font-mono w-6 text-center">
                    {category.display_order}
                  </span>
                  
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
                    <div className="mt-1 space-y-0.5 text-sm text-[#888]">
                      <p>Slug: <span className="font-mono text-[#C5A55A]/70">{category.slug}</span></p>
                      {category.description && <p>{category.description}</p>}
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
                    className="px-3 py-1.5 bg-[#C5A55A]/20 text-[#C5A55A] text-sm rounded-lg hover:bg-[#C5A55A]/30 transition-colors"
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

      {/* Modal Créer/Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141414] border border-[#C5A55A]/20 rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="font-serif text-xl text-[#f5f0e8] mb-6">
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="Ex : Robes"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="auto-généré depuis le nom"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] font-mono placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Description courte de la catégorie"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min={0}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] focus:border-[#C5A55A] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.active ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })}
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
                  className="flex-1 py-3 bg-[#C5A55A] text-[#0a0a0a] font-semibold text-sm rounded-lg hover:bg-[#D4B56E] transition-colors"
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

/**
 * Page AdminAssistants - Gestion des Assistants
 * 
 * Permet aux admins de :
 * - Créer des assistants (prénom, nom, email, téléphone)
 * - Le password est généré automatiquement
 * - Lister tous les assistants
 * - Modifier un assistant (infos + réinitialiser mot de passe)
 * - Supprimer un assistant
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminAssistants() {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  });

  // Charger la liste des assistants
  useEffect(() => {
    fetchAssistants();
  }, []);

  async function fetchAssistants() {
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      const response = await fetch("/api/assistants", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAssistants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des assistants:", error);
    } finally {
      setLoading(false);
    }
  }

  // Ouvrir le modal pour créer ou modifier
  function openModal(assistant = null) {
    if (assistant) {
      setEditingAssistant(assistant);
      setFormData({
        first_name: assistant.first_name,
        last_name: assistant.last_name,
        email: assistant.email,
        phone: assistant.phone || ""
      });
    } else {
      setEditingAssistant(null);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: ""
      });
    }
    setGeneratedPassword("");
    setResetPassword("");
    setShowModal(true);
  }

  // Fermer le modal
  function closeModal() {
    setShowModal(false);
    setEditingAssistant(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: ""
    });
    setGeneratedPassword("");
    setResetPassword("");
  }

  // Soumettre le formulaire (créer ou modifier)
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      
      if (editingAssistant) {
        // Modifier un assistant
        await fetch(`/api/assistants/${editingAssistant.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        closeModal();
      } else {
        // Créer un assistant
        const response = await fetch("/api/assistants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (data.success) {
          // Afficher le mot de passe généré dans le modal (ne pas fermer)
          setGeneratedPassword(data.password || "");
          fetchAssistants();
        } else {
          alert(data.message || "Erreur lors de la création");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Erreur lors de l'opération");
    }
  }

  // Réinitialiser le mot de passe d'un assistant
  async function handleResetPassword() {
    if (!confirm("Réinitialiser le mot de passe de cet assistant ? Un nouveau mot de passe sera généré.")) return;
    
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      const response = await fetch(`/api/assistants/${editingAssistant.id}/reset-password`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setResetPassword(data.password || "");
      } else {
        alert(data.message || "Erreur lors de la réinitialisation");
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
      alert("Erreur lors de la réinitialisation");
    }
  }

  // Supprimer un assistant
  async function deleteAssistant(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet assistant ?")) return;
    
    try {
      const token = localStorage.getItem("rassoul_admin_token");
      await fetch(`/api/assistants/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAssistants();
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
            Assistants
          </h1>
          <p className="text-sm text-[#888]">
            Gérer les assistants de la boutique
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-[#C5A55A] text-[#0a0a0a] font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-[#D4B56E] transition-all duration-300"
        >
          + Nouvel Assistant
        </button>
      </div>

      {/* Liste des assistants */}
      {loading ? (
        <div className="text-center py-12 text-[#888]">Chargement...</div>
      ) : assistants.length === 0 ? (
        <div className="text-center py-12 text-[#888]">
          Aucun assistant pour le moment
        </div>
      ) : (
        <div className="grid gap-4">
          {assistants.map((assistant) => (
            <motion.div
              key={assistant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141414] border border-[#C5A55A]/20 rounded-xl p-5 hover:border-[#C5A55A]/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[#f5f0e8] text-lg">
                    {assistant.first_name} {assistant.last_name}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-[#888]">
                    <p>Email: {assistant.email}</p>
                    {assistant.phone && <p>Tél: {assistant.phone}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(assistant)}
                    className="px-3 py-1.5 bg-[#C5A55A]/20 text-[#C5A55A] text-sm rounded-lg hover:bg-[#C5A55A]/30 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteAssistant(assistant.id)}
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
              {editingAssistant ? "Modifier l'assistant" : "Nouvel assistant"}
            </h2>

            {/* Mot de passe affiché après création */}
            {generatedPassword && !editingAssistant && (
              <div className="mb-6 p-4 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-lg">
                <p className="text-sm text-[#C5A55A] font-semibold mb-2">
                  ✅ Assistant créé ! Mot de passe généré :
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[#f5f0e8] font-mono text-xl flex-1 break-all">{generatedPassword}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPassword);
                      alert("Mot de passe copié !");
                    }}
                    className="px-3 py-2 bg-[#C5A55A] text-[#0a0a0a] text-xs font-bold rounded hover:bg-[#D4B56E] transition-colors whitespace-nowrap"
                  >
                    Copier
                  </button>
                </div>
                <p className="text-xs text-red-400 mt-2 font-medium">
                  ⚠️ Sauvegardez ce mot de passe maintenant, il ne sera plus affiché ensuite.
                </p>
              </div>
            )}

            {/* Mot de passe affiché après reset */}
            {resetPassword && editingAssistant && (
              <div className="mb-6 p-4 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-lg">
                <p className="text-sm text-[#C5A55A] font-semibold mb-2">
                  ✅ Nouveau mot de passe généré :
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[#f5f0e8] font-mono text-xl flex-1 break-all">{resetPassword}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(resetPassword);
                      alert("Mot de passe copié !");
                    }}
                    className="px-3 py-2 bg-[#C5A55A] text-[#0a0a0a] text-xs font-bold rounded hover:bg-[#D4B56E] transition-colors whitespace-nowrap"
                  >
                    Copier
                  </button>
                </div>
                <p className="text-xs text-red-400 mt-2 font-medium">
                  ⚠️ Sauvegardez ce mot de passe maintenant, il ne sera plus affiché ensuite.
                </p>
              </div>
            )}

            {/* Bouton réinitialiser mot de passe (mode modification uniquement) */}
            {editingAssistant && !resetPassword && (
              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full mb-4 py-2.5 bg-orange-500/20 text-orange-400 text-sm font-medium rounded-lg hover:bg-orange-500/30 transition-colors border border-orange-500/30"
              >
                🔑 Réinitialiser le mot de passe
              </button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 bg-[#333] text-[#f5f0e8] font-semibold text-sm rounded-lg hover:bg-[#444] transition-colors"
                >
                  {generatedPassword || resetPassword ? "Fermer" : "Annuler"}
                </button>
                {!generatedPassword && !resetPassword && (
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#C5A55A] text-[#0a0a0a] font-semibold text-sm rounded-lg hover:bg-[#D4B56E] transition-colors"
                  >
                    {editingAssistant ? "Modifier" : "Créer"}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

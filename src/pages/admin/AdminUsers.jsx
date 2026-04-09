/**
 * Page Admin Utilisateurs — /admin/users
 *
 * CRUD des admins et assistants :
 * - Liste des utilisateurs avec rôle
 * - Création d'un nouvel admin ou assistant (mot de passe auto-généré)
 * - Modification (prénom, nom, email, rôle)
 * - Suppression avec confirmation
 * - Affichage du mot de passe généré une seule fois
 */

import { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, X, Save, Users, Shield, UserCheck, Copy, Check
} from "lucide-react";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* Mot de passe généré après création (affiché une seule fois) */
  const [generatedPwd, setGeneratedPwd] = useState("");
  const [copied, setCopied] = useState(false);

  /* État du formulaire */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("assistant");

  /** Charger les utilisateurs */
  async function loadUsers() {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  /** Ouvrir modal pour créer un nouvel utilisateur */
  function handleNew() {
    setEditingUser(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("assistant");
    setError("");
    setGeneratedPwd("");
    setShowModal(true);
  }

  /** Ouvrir modal pour éditer un utilisateur existant */
  function handleEdit(user) {
    setEditingUser(user);
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setRole(user.role || "assistant");
    setError("");
    setGeneratedPwd("");
    setShowModal(true);
  }

  /** Sauvegarder (créer ou modifier) */
  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingUser) {
        await updateUser(editingUser.id, { firstName, lastName, email, role });
        setShowModal(false);
      } else {
        const result = await createUser({ firstName, lastName, email, role });
        /* Afficher le mot de passe généré */
        if (result.generatedPassword) {
          setGeneratedPwd(result.generatedPassword);
        } else {
          setShowModal(false);
        }
      }
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  /** Supprimer un utilisateur */
  async function handleDelete(user) {
    if (user.id === currentUser?.id) {
      alert("Impossible de supprimer votre propre compte");
      return;
    }
    if (!confirm(`Supprimer "${user.firstName} ${user.lastName}" ?`)) return;
    try {
      await deleteUser(user.id);
      await loadUsers();
    } catch (err) {
      alert(err.message);
    }
  }

  /** Copier le mot de passe dans le presse-papier */
  function handleCopy() {
    navigator.clipboard.writeText(generatedPwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#888]">{users.length} utilisateur(s)</p>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E0C055] transition-colors"
        >
          <Plus size={16} />
          Nouvel utilisateur
        </button>
      </div>

      {/* ---- Liste des utilisateurs ---- */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#141414] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-[#555]">
          <Users size={40} className="mx-auto mb-3 opacity-50" />
          <p>Aucun utilisateur</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden divide-y divide-[#222]">
          {users.map((user) => (
            <div
              key={user.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
            >
              {/* Info utilisateur */}
              <div className="flex items-center gap-4">
                {/* Avatar initiales */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.role === "admin"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "bg-blue-500/20 text-blue-400"
                }`}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f5f0e8]">
                    {user.firstName} {user.lastName}
                    {user.id === currentUser?.id && (
                      <span className="text-[10px] text-[#555] ml-2">(vous)</span>
                    )}
                  </p>
                  <p className="text-xs text-[#888]">{user.email}</p>
                </div>
              </div>

              {/* Rôle + actions */}
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                  user.role === "admin"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "bg-blue-500/20 text-blue-400"
                }`}>
                  {user.role === "admin" ? <Shield size={10} /> : <UserCheck size={10} />}
                  {user.role === "admin" ? "Admin" : "Assistant"}
                </span>

                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 rounded-lg hover:bg-[#222] text-[#888] hover:text-[#D4AF37] transition-colors"
                  title="Modifier"
                >
                  <Edit2 size={16} />
                </button>

                {user.id !== currentUser?.id && (
                  <button
                    onClick={() => handleDelete(user)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Modal Création/Édition ---- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
              <h2 className="text-lg font-medium text-[#f5f0e8]">
                {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-[#f5f0e8]">
                <X size={20} />
              </button>
            </div>

            {/* Affichage du mot de passe généré (uniquement après création) */}
            {generatedPwd ? (
              <div className="px-6 py-5 space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-sm text-emerald-400 mb-2">
                    Utilisateur créé avec succès ! Voici le mot de passe généré :
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-[#1a1a1a] rounded text-[#f5f0e8] text-sm font-mono">
                      {generatedPwd}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-[#222] rounded-lg hover:bg-[#333] transition-colors"
                      title="Copier"
                    >
                      {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-[#888]" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#888] mt-2">
                    ⚠️ Ce mot de passe ne sera plus affiché. Notez-le maintenant.
                  </p>
                </div>
                <button
                  onClick={() => { setShowModal(false); setGeneratedPwd(""); }}
                  className="w-full py-2.5 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E0C055]"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Prénom *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Nom *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Rôle</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="assistant">Assistant</option>
                  </select>
                </div>

                {!editingUser && (
                  <p className="text-xs text-[#888] bg-[#1a1a1a] p-3 rounded-lg">
                    💡 Un mot de passe sera généré automatiquement et affiché une seule fois après la création.
                  </p>
                )}

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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

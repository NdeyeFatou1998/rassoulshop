/**
 * Page Admin Utilisateurs — /admin/users
 *
 * Onglets Administrateurs / Assistants (admin principal masqué).
 * Bouton Ajouter par onglet, création avec email de bienvenue.
 */

import { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, X, Save, Users, Shield, UserCheck, Copy, Check, Mail
} from "lucide-react";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  { id: "admin", label: "Administrateurs", icon: Shield },
  { id: "assistant", label: "Assistants", icon: UserCheck },
];

function UserRow({ user, currentUser, onEdit, onDelete }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
          user.role === "admin"
            ? "bg-[#C5A55A]/20 text-[#C5A55A]"
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

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(user)}
          className="p-2 rounded-lg hover:bg-[#222] text-[#888] hover:text-[#C5A55A] transition-colors"
          title="Modifier"
        >
          <Edit2 size={16} />
        </button>

        {user.id !== currentUser?.id && (
          <button
            onClick={() => onDelete(user)}
            className="p-2 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function UserList({ users, currentUser, onEdit, onDelete, emptyLabel }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-[#555]">
        <Users size={36} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden divide-y divide-[#222]">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          currentUser={currentUser}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("admin");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [generatedPwd, setGeneratedPwd] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [createRole, setCreateRole] = useState("admin");

  const admins = users.filter((u) => u.role === "admin" && !u.isEnvAdmin);
  const assistants = users.filter((u) => u.role === "assistant");
  const tabUsers = activeTab === "admin" ? admins : assistants;

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

  function handleNew(role) {
    setEditingUser(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setCreateRole(role);
    setError("");
    setGeneratedPwd("");
    setEmailSent(false);
    setShowModal(true);
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setCreateRole(user.role);
    setError("");
    setGeneratedPwd("");
    setEmailSent(false);
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingUser) {
        await updateUser(editingUser.id, { firstName, lastName, email });
        setShowModal(false);
      } else {
        const result = await createUser({
          firstName,
          lastName,
          email,
          role: createRole,
        });
        if (result.generatedPassword) {
          setGeneratedPwd(result.generatedPassword);
          setEmailSent(Boolean(result.emailSent));
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

  function handleCopy() {
    navigator.clipboard.writeText(generatedPwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function closeSuccessModal() {
    setShowModal(false);
    setGeneratedPwd("");
    setEmailSent(false);
  }

  const modalTitle = editingUser
    ? `Modifier ${editingUser.role === "admin" ? "l'administrateur" : "l'assistant"}`
    : createRole === "admin"
      ? "Nouvel administrateur"
      : "Nouvel assistant";

  const successLabel = createRole === "admin" ? "Administrateur créé" : "Assistant créé";

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex gap-1 p-1 bg-[#141414] border border-[#222] rounded-xl w-full sm:w-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = tab.id === "admin" ? admins.length : assistants.length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? tab.id === "admin"
                    ? "bg-[#C5A55A]/15 text-[#C5A55A]"
                    : "bg-blue-500/15 text-blue-400"
                  : "text-[#888] hover:text-[#f5f0e8]"
              }`}
            >
              <Icon size={16} />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-black/20" : "bg-[#222]"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* En-tête de l'onglet actif + Ajouter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#888]">
          {activeTab === "admin"
            ? `${admins.length} administrateur(s)`
            : `${assistants.length} assistant(s)`}
        </p>
        <button
          type="button"
          onClick={() => handleNew(activeTab)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] transition-colors"
        >
          <Plus size={16} />
          {activeTab === "admin" ? "Ajouter un administrateur" : "Ajouter un assistant"}
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#141414] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <UserList
          users={tabUsers}
          currentUser={currentUser}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyLabel={
            activeTab === "admin"
              ? "Aucun administrateur pour le moment"
              : "Aucun assistant pour le moment"
          }
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
              <h2 className="text-lg font-medium text-[#f5f0e8]">{modalTitle}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-[#f5f0e8]">
                <X size={20} />
              </button>
            </div>

            {generatedPwd ? (
              <div className="px-6 py-5 space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-sm text-emerald-400 mb-2">{successLabel} avec succès !</p>
                  {emailSent ? (
                    <p className="text-xs text-[#888] flex items-start gap-2 mb-3">
                      <Mail size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Un email avec le mot de passe et le lien de connexion admin a été envoyé à{" "}
                        <strong className="text-[#f5f0e8]">{email}</strong>.
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-400/90 mb-3">
                      L&apos;email n&apos;a pas pu être envoyé. Copiez le mot de passe ci-dessous et transmettez-le manuellement.
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-[#1a1a1a] rounded text-[#f5f0e8] text-sm font-mono">
                      {generatedPwd}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-2 bg-[#222] rounded-lg hover:bg-[#333] transition-colors"
                      title="Copier"
                    >
                      {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-[#888]" />}
                    </button>
                  </div>
                  {!emailSent && (
                    <p className="text-xs text-[#888] mt-2">
                      Ce mot de passe ne sera plus affiché. Notez-le maintenant.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeSuccessModal}
                  className="w-full py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E]"
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
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">Nom *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
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
                    className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
                  />
                </div>

                {!editingUser && (
                  <p className="text-xs text-[#888] bg-[#1a1a1a] p-3 rounded-lg">
                    Un mot de passe sera généré automatiquement et envoyé par email avec le lien vers la page de connexion admin.
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? "Enregistrement..." : editingUser ? "Enregistrer" : "Créer"}
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

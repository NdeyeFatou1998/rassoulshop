/**
 * Page Admin Paramètres — /admin/settings
 *
 * Permet à l'utilisateur connecté de :
 * - Voir ses informations de profil
 * - Changer son mot de passe
 */

import { useState } from "react";
import { Lock, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../services/adminApi";

export default function AdminSettings() {
  const { user } = useAuth();

  /* État du formulaire de changement de mot de passe */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /** Soumettre le changement de mot de passe */
  async function handleChangePassword(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    /* Vérification côté client */
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit faire au moins 6 caractères");
      return;
    }

    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Mot de passe modifié avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* ---- Profil ---- */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <h2 className="text-sm font-medium text-[#f5f0e8] mb-4">Profil</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#888] uppercase tracking-wider">Nom</span>
            <span className="text-sm text-[#f5f0e8]">{user?.firstName} {user?.lastName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#888] uppercase tracking-wider">Email</span>
            <span className="text-sm text-[#f5f0e8]">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#888] uppercase tracking-wider">Rôle</span>
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              user?.role === "admin"
                ? "bg-[#C5A55A]/20 text-[#C5A55A]"
                : "bg-blue-500/20 text-blue-400"
            }`}>
              {user?.role === "admin" ? "Administrateur" : "Assistant"}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Changement de mot de passe ---- */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-[#C5A55A]" />
          <h2 className="text-sm font-medium text-[#f5f0e8]">Changer le mot de passe</h2>
        </div>

        {/* Messages de succès / erreur */}
        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400 text-sm">
            <Check size={16} />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] disabled:opacity-50 transition-colors"
          >
            {saving ? "Modification..." : "Modifier le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}

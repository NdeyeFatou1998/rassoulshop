/**
 * Page Admin Paramètres — /admin/settings
 *
 * Permet à l'utilisateur connecté de :
 * - Voir ses informations de profil
 * - Configurer le seuil de stock faible
 * - Changer son mot de passe
 */

import { useState, useEffect } from "react";
import { Lock, Check, AlertCircle, Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { changePassword, fetchShopSettings, updateLowStockThreshold } from "../../services/adminApi";

export default function AdminSettings() {
  const { user } = useAuth();

  /* État du formulaire de changement de mot de passe */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Gestion stock */
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [stockSaving, setStockSaving] = useState(false);
  const [stockError, setStockError] = useState("");
  const [stockSuccess, setStockSuccess] = useState("");
  const [stockLoading, setStockLoading] = useState(true);

  useEffect(() => {
    fetchShopSettings()
      .then((data) => {
        if (data.lowStockThreshold != null) {
          setLowStockThreshold(String(data.lowStockThreshold));
        }
      })
      .catch((err) => setStockError(err.message || "Impossible de charger les paramètres"))
      .finally(() => setStockLoading(false));
  }, []);

  async function handleSaveStockSettings(e) {
    e.preventDefault();
    setStockError("");
    setStockSuccess("");

    const value = parseInt(lowStockThreshold, 10);
    if (!Number.isFinite(value) || value < 1 || value > 9999) {
      setStockError("Entrez un nombre entre 1 et 9999");
      return;
    }

    setStockSaving(true);
    try {
      const data = await updateLowStockThreshold(value);
      setLowStockThreshold(String(data.lowStockThreshold ?? value));
      setStockSuccess("Seuil stock faible enregistré");
    } catch (err) {
      setStockError(err.message);
    } finally {
      setStockSaving(false);
    }
  }

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

      {/* ---- Gestion stock ---- */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-[#C5A55A]" />
          <h2 className="text-sm font-medium text-[#f5f0e8]">Gestion du stock</h2>
        </div>

        <p className="text-xs text-[#888] leading-relaxed mb-4">
          Définissez le stock minimal qui déclenche l&apos;alerte « Stock faible » dans l&apos;admin et le dashboard.
          Les produits et box cadeaux à <strong className="text-[#f5f0e8] font-normal">stock 0</strong> ne sont
          plus visibles sur le site public (boutique, coffrets, box cadeau).
        </p>

        {stockSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400 text-sm">
            <Check size={16} />
            {stockSuccess}
          </div>
        )}
        {stockError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            {stockError}
          </div>
        )}

        <form onSubmit={handleSaveStockSettings} className="space-y-4">
          <div>
            <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">
              Seuil stock faible (unités)
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              disabled={stockLoading}
              required
              className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none disabled:opacity-50"
            />
            <p className="text-[10px] text-[#555] mt-1.5">
              Exemple : avec 5, un produit à 3 unités affiche « Stock faible », à 0 il disparaît du site.
            </p>
          </div>

          <button
            type="submit"
            disabled={stockSaving || stockLoading}
            className="w-full py-2.5 bg-[#C5A55A] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#D4B56E] disabled:opacity-50 transition-colors"
          >
            {stockSaving ? "Enregistrement..." : "Enregistrer le seuil"}
          </button>
        </form>
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

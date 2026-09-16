/**
 * Page Admin Livraison — /admin/delivery
 * Prix de livraison appliqué au checkout, à la facture et aux emails.
 */

import { useState, useEffect } from "react";
import { Truck, Check, AlertCircle } from "lucide-react";
import { fetchShopSettings, updateDeliveryPrice } from "../../services/adminApi";

export default function AdminDelivery() {
  const [price, setPrice] = useState("2000");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchShopSettings()
      .then((data) => {
        if (data.deliveryPrice != null) setPrice(String(data.deliveryPrice));
      })
      .catch((err) => setError(err.message || "Impossible de charger le prix"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const value = parseInt(price, 10);
    if (!Number.isFinite(value) || value < 0 || value > 10_000_000) {
      setError("Entrez un prix entre 0 et 10 000 000 FCFA");
      return;
    }

    setSaving(true);
    try {
      const data = await updateDeliveryPrice(value);
      setPrice(String(data.deliveryPrice ?? value));
      setSuccess("Prix de livraison enregistré");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#0a0a0a]">Livraison</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Ce montant est ajouté au total au moment de la commande (panier, checkout, facture, emails).
        </p>
      </div>

      <div className="admin-card border border-black/[0.08] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck size={16} className="text-[#D7A12B]" />
          <h3 className="text-sm font-medium text-[#0a0a0a]">Prix de livraison</h3>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-600 text-sm">
            <Check size={16} />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-1">
              Frais de livraison (FCFA)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              required
              className="w-full px-3 py-2.5 bg-neutral-50 border border-black/[0.12] rounded-lg text-[#0a0a0a] text-sm focus:border-[#D7A12B] focus:outline-none disabled:opacity-50"
            />
            <p className="text-[10px] text-neutral-400 mt-1.5">
              Par défaut : 2 000 FCFA. Mettez 0 pour ne pas facturer la livraison.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving || loading}
            className="w-full py-2.5 bg-[#D7A12B] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E8B945] disabled:opacity-50 transition-colors"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}

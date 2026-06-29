/**
 * Page Admin Bannière — /admin/banner
 * Gestion de la photo hero affichée en haut de la page d'accueil.
 */

import { useState, useEffect } from "react";
import { Upload, Image, Home } from "lucide-react";
import { fetchHomeBanner, updateHomeBanner } from "../../services/adminApi";

export default function AdminBanner() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBanner();
  }, []);

  async function loadBanner() {
    setLoading(true);
    try {
      const data = await fetchHomeBanner();
      setBanner(data.banner || null);
    } catch (err) {
      console.error("Erreur chargement bannière:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await updateHomeBanner(fd);
      await loadBanner();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#f5f0e8]">Bannière accueil</h2>
        <p className="text-sm text-[#666] mt-1">
          Photo affichée dans la bannière en haut de la page d&apos;accueil publique.
        </p>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D7A12B]/10 flex items-center justify-center">
              <Home size={18} className="text-[#D7A12B]" />
            </div>
            <div>
              <h3 className="text-[#f5f0e8] font-medium">Image hero</h3>
              <p className="text-xs text-[#666]">Format recommandé : paysage, min. 1200×800 px</p>
            </div>
          </div>
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
              uploading
                ? "bg-[#333] text-[#888] cursor-not-allowed"
                : "bg-[#D7A12B] text-[#0a0a0a] hover:bg-[#E8B945]"
            }`}
          >
            <Upload size={14} />
            {uploading ? "Envoi..." : banner?.src ? "Changer" : "Uploader"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="h-[220px] rounded-xl bg-[#1a1a1a] animate-pulse" />
          ) : banner?.src ? (
            <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a]" style={{ height: "220px" }}>
              <img
                src={banner.src}
                alt="Bannière accueil"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[10px] text-white uppercase tracking-wider">
                <Image size={10} />
                Bannière active
              </span>
            </div>
          ) : (
            <div className="h-[220px] rounded-xl border border-dashed border-[#333] flex flex-col items-center justify-center text-[#555] gap-2">
              <Image size={32} strokeWidth={1.2} />
              <p className="text-sm">Aucune bannière personnalisée</p>
              <p className="text-xs text-[#444]">L&apos;image par défaut du site sera affichée</p>
            </div>
          )}

          {banner?.updated_at && (
            <p className="text-xs text-[#555] mt-4">
              Dernière mise à jour :{" "}
              {new Date(banner.updated_at).toLocaleString("fr-FR")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

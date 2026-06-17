/**
 * AdminVariants — CRUD des types de variantes GLOBAUX
 *
 * Les types (Couleur, Taille, Matière…) sont globaux et disponibles
 * pour tous les produits. L'admin les gère ici.
 *
 * Les options spécifiques à chaque produit (Rouge, Vert, S, M…)
 * sont gérées directement dans l'onglet Produits.
 */

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Check, Pencil, Layers } from "lucide-react";

export default function AdminVariants() {
  const [types, setTypes]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [newName, setNewName]       = useState("");
  const [adding, setAdding]         = useState(false);
  const [editId, setEditId]         = useState(null);
  const [editName, setEditName]     = useState("");
  const token = localStorage.getItem("rassoul_admin_token");

  useEffect(() => { fetchTypes(); }, []);

  async function fetchTypes() {
    setLoading(true);
    try {
      const res = await fetch("/api/variant-types", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTypes(data.variant_types || []);
    } finally { setLoading(false); }
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    const res = await fetch("/api/variant-types", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newName.trim() })
    });
    const data = await res.json();
    if (!data.success) { alert(data.message); return; }
    setNewName(""); setAdding(false);
    fetchTypes();
  }

  async function handleRename(id) {
    if (!editName.trim()) return;
    await fetch(`/api/variant-types/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editName.trim() })
    });
    setEditId(null); setEditName("");
    fetchTypes();
  }

  async function handleDelete(id, name) {
    if (!confirm(`Supprimer le type "${name}" ? Toutes les options produits liées seront supprimées.`)) return;
    await fetch(`/api/variant-types/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    fetchTypes();
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#f5f0e8]">Types de variantes globaux</h2>
          <p className="text-xs text-[#555] mt-0.5">
            Ces types (Couleur, Taille…) sont disponibles pour tous les produits.
            Les options (Rouge, XL…) se configurent dans l'onglet <span className="text-[#D7A12B]">Produits</span>.
          </p>
        </div>
        <button
          onClick={() => { setAdding(true); setNewName(""); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D7A12B] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E8B945] transition-colors flex-shrink-0"
        >
          <Plus size={15} />
          Nouveau type
        </button>
      </div>

      {/* Form ajout */}
      {adding && (
        <div className="flex gap-2 p-3 bg-[#111] border border-[#D7A12B]/25 rounded-xl">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="ex: Couleur, Taille, Matière, Parfum…"
            autoFocus
            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-[#f5f0e8] placeholder-[#555] focus:border-[#D7A12B] focus:outline-none"
          />
          <button onClick={handleAdd} className="px-4 py-2 bg-[#D7A12B] text-[#0a0a0a] rounded-lg text-sm font-semibold">
            Créer
          </button>
          <button onClick={() => setAdding(false)} className="px-3 py-2 text-[#555] hover:text-[#f5f0e8]">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-14 bg-[#141414] rounded-xl animate-pulse" />)}
        </div>
      ) : types.length === 0 ? (
        <div className="text-center py-16 bg-[#111] rounded-xl border border-[#222] text-[#444]">
          <Layers size={28} className="mx-auto mb-2 text-[#333]" />
          <p className="text-sm">Aucun type de variante.</p>
          <p className="text-xs text-[#555] mt-1">Créez vos premiers types : Couleur, Taille…</p>
        </div>
      ) : (
        <div className="space-y-2">
          {types.map(t => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3 bg-[#111] border border-[#222] rounded-xl group">
              {editId === t.id ? (
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleRename(t.id); if (e.key === "Escape") setEditId(null); }}
                    autoFocus
                    className="flex-1 px-2 py-1 bg-[#1a1a1a] border border-[#D7A12B]/40 rounded text-sm text-[#f5f0e8] focus:outline-none"
                  />
                  <button onClick={() => handleRename(t.id)} className="text-[#D7A12B]"><Check size={15} /></button>
                  <button onClick={() => setEditId(null)} className="text-[#555]"><X size={15} /></button>
                </div>
              ) : (
                <span className="text-sm font-medium text-[#f5f0e8]">{t.name}</span>
              )}
              {editId !== t.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditId(t.id); setEditName(t.name); }}
                    className="p-1.5 text-[#555] hover:text-[#D7A12B] rounded-lg hover:bg-[#D7A12B]/10 transition-all"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-1.5 text-[#555] hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

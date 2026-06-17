/**
 * Page Suivi — journal des actions (admins uniquement)
 */

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Search, ScrollText, Shield, UserCheck, ShoppingBag, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchAuditLogs } from "../../services/adminApi";

const ROLE_STYLES = {
  Administrateur: "bg-[#D7A12B]/20 text-[#D7A12B]",
  Assistant: "bg-blue-500/20 text-blue-400",
  "Client (boutique)": "bg-emerald-500/20 text-emerald-400",
  Système: "bg-[#333] text-[#888]",
};

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AdminSuivi() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actorType, setActorType] = useState("");

  if (user?.role === "assistant") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function load() {
    setLoading(true);
    try {
      const params = { limit: 300 };
      if (search.trim()) params.search = search.trim();
      if (actorType) params.actorType = actorType;
      const data = await fetchAuditLogs(params);
      setLogs(data.logs || []);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error("Erreur chargement suivi:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [actorType]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-[#888] flex items-center gap-2">
            <ScrollText size={16} className="text-[#D7A12B]" />
            {total} action(s) enregistrée(s)
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 text-sm text-[#888] hover:text-[#f5f0e8] border border-[#333] rounded-lg hover:border-[#555]"
        >
          <RefreshCw size={14} />
          Actualiser
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom, email, action…)"
            className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-[#333] rounded-lg text-sm text-[#f5f0e8] placeholder-[#555] focus:border-[#D7A12B] focus:outline-none"
          />
        </form>
        <select
          value={actorType}
          onChange={(e) => setActorType(e.target.value)}
          className="px-3 py-2.5 bg-[#141414] border border-[#333] rounded-lg text-sm text-[#f5f0e8] focus:border-[#D7A12B] focus:outline-none"
        >
          <option value="">Tous les profils</option>
          <option value="admin">Administrateurs</option>
          <option value="assistant">Assistants</option>
          <option value="client">Clients</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#141414] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 text-[#555]">
          <ScrollText size={40} className="mx-auto mb-3 opacity-40" />
          <p>Aucune action enregistrée pour le moment</p>
          <p className="text-xs mt-2 text-[#444]">
            Les actions apparaîtront ici après connexion, commandes, produits, etc.
          </p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden divide-y divide-[#222]">
          {logs.map((log) => {
            const roleCls = ROLE_STYLES[log.actorRole] || "bg-[#222] text-[#888]";
            const isStaff = log.actorType === "admin" || log.actorType === "assistant";
            return (
              <div
                key={log.id}
                className="px-4 sm:px-6 py-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${roleCls}`}>
                      {log.actorType === "client" ? (
                        <ShoppingBag size={16} />
                      ) : log.actorType === "assistant" ? (
                        <UserCheck size={16} />
                      ) : (
                        <Shield size={16} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#f5f0e8] leading-snug">
                        {log.summary}
                      </p>
                      <p className="text-xs text-[#D7A12B]/90 mt-1">{log.actionLabel}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${roleCls}`}>
                          {log.actorRole}
                        </span>
                        <span className="text-xs text-[#888]">
                          {isStaff ? log.actorName : log.actorName}
                          {log.actorEmail ? ` · ${log.actorEmail}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <time
                    dateTime={log.createdAt}
                    className="text-xs text-[#666] whitespace-nowrap sm:text-right shrink-0 font-mono"
                  >
                    {formatDateTime(log.createdAt)}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

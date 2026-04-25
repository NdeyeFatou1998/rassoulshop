/**
 * Page Admin Commandes — /admin/orders
 *
 * Gestion des commandes avec :
 * - Liste filtrable par statut
 * - Détail de chaque commande (articles, client, total)
 * - Mise à jour du statut (pending → confirmed → shipped → delivered / cancelled)
 * - Suppression avec confirmation
 */

import { useState, useEffect } from "react";
import {
  Search, Eye, Trash2, X, ChevronDown, Clock,
  CheckCircle, Truck, Package, XCircle, Filter
} from "lucide-react";
import { fetchOrders, updateOrderStatus, deleteOrder } from "../../services/adminApi";

/** Labels et couleurs pour chaque statut de commande */
const STATUS_CONFIG = {
  pending:   { label: "En attente",  icon: Clock,       cls: "bg-amber-500/20 text-amber-400",   border: "border-amber-500/30" },
  confirmed: { label: "Confirmée",   icon: CheckCircle, cls: "bg-blue-500/20 text-blue-400",     border: "border-blue-500/30" },
  shipped:   { label: "Expédiée",    icon: Truck,       cls: "bg-purple-500/20 text-purple-400", border: "border-purple-500/30" },
  delivered: { label: "Livrée",      icon: Package,     cls: "bg-emerald-500/20 text-emerald-400", border: "border-emerald-500/30" },
  cancelled: { label: "Annulée",     icon: XCircle,     cls: "bg-red-500/20 text-red-400",       border: "border-red-500/30" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");

  /** Charger les commandes */
  async function loadOrders() {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const data = await fetchOrders(params);
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Erreur chargement commandes:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, [filterStatus]);

  /** Modifier le statut d'une commande */
  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      /* Mettre à jour la commande sélectionnée si elle est ouverte */
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message);
    }
  }

  /** Supprimer une commande */
  async function handleDelete(orderId) {
    if (!confirm("Supprimer cette commande ?")) return;
    try {
      await deleteOrder(orderId);
      setSelectedOrder(null);
      await loadOrders();
    } catch (err) {
      alert(err.message);
    }
  }

  /** Formater un montant en FCFA */
  function fmtPrice(n) {
    return (n || 0).toLocaleString("fr-FR") + " FCFA";
  }

  /** Formater une date */
  function fmtDate(d) {
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  /** Filtrer par recherche */
  const filtered = orders.filter((o) =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.customerPhone.includes(search) ||
    String(o.id).includes(search)
  );

  return (
    <div className="space-y-6">
      {/* ---- Header avec filtre et recherche ---- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Recherche */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Rechercher par nom, tél, n°..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] placeholder-[#555] text-sm focus:border-[#C5A55A] focus:outline-none"
          />
        </div>

        {/* Filtre par statut */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#555]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] text-sm focus:border-[#C5A55A] focus:outline-none"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ---- Liste des commandes ---- */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#141414] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#555]">
          <Package size={40} className="mx-auto mb-3 opacity-50" />
          <p>Aucune commande</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden divide-y divide-[#222]">
          {filtered.map((order) => {
            const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StIcon = st.icon;
            return (
              <div
                key={order.id}
                className="px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-[#1a1a1a] transition-colors"
              >
                {/* Info commande */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-[#f5f0e8]">
                      #{order.id} — {order.customerName}
                    </p>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${st.cls}`}>
                      <StIcon size={10} />
                      {st.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#555] mt-1">
                    {order.customerPhone} · {order.items.length} article(s) · {fmtDate(order.createdAt)}
                  </p>
                </div>

                {/* Prix + actions */}
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-[#C5A55A]">{fmtPrice(order.total)}</p>

                  {/* Sélecteur de statut rapide */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-lg bg-transparent border ${st.border} ${st.cls.split(" ")[1]} focus:outline-none`}
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                      <option key={key} value={key} className="bg-[#141414] text-[#f5f0e8]">
                        {val.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 rounded-lg hover:bg-[#222] text-[#888] hover:text-[#C5A55A] transition-colors"
                    title="Détails"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Modal détail commande ---- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
              <h2 className="text-lg font-medium text-[#f5f0e8]">
                Commande #{selectedOrder.id}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-[#555] hover:text-[#f5f0e8]">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Client */}
              <div className="space-y-2">
                <h3 className="text-xs text-[#888] uppercase tracking-wider">Client</h3>
                <p className="text-sm text-[#f5f0e8]">{selectedOrder.customerName}</p>
                <p className="text-sm text-[#888]">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && (
                  <p className="text-sm text-[#888]">{selectedOrder.customerEmail}</p>
                )}
              </div>

              {/* Articles */}
              <div className="space-y-2">
                <h3 className="text-xs text-[#888] uppercase tracking-wider">Articles</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#1a1a1a] px-3 py-2 rounded-lg">
                      <div>
                        <p className="text-sm text-[#f5f0e8]">{item.title || `Produit #${item.productId}`}</p>
                        <p className="text-xs text-[#555]">Qté : {item.quantity}</p>
                      </div>
                      <p className="text-sm text-[#C5A55A]">
                        {fmtPrice((item.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total + date */}
              <div className="flex items-center justify-between pt-3 border-t border-[#222]">
                <div>
                  <p className="text-xs text-[#888]">Date : {fmtDate(selectedOrder.createdAt)}</p>
                </div>
                <p className="text-lg font-bold text-[#C5A55A]">{fmtPrice(selectedOrder.total)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

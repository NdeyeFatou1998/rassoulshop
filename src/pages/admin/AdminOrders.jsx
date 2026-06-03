/**
 * Page Admin Commandes — /admin/orders
 */

import { useState, useEffect, useRef } from "react";
import {
  Search, Eye, Trash2, X, Clock, CheckCircle, Truck,
  Package, XCircle, Filter, Download, ImageIcon, Maximize2, FileText, RotateCcw,
} from "lucide-react";
import html2canvas from "html2canvas";
import { fetchOrders, updateOrderStatus, deleteOrder } from "../../services/adminApi";
import { normalizeOrder } from "../../utils/normalizeOrder";
import OrderInvoicePreview from "../../components/admin/OrderInvoicePreview";

const STATUS_CONFIG = {
  pending:   { label: "En attente",  icon: Clock,       cls: "bg-amber-500/20 text-amber-400",   border: "border-amber-500/30" },
  confirmed: { label: "Confirmée",   icon: CheckCircle, cls: "bg-blue-500/20 text-blue-400",     border: "border-blue-500/30" },
  shipped:   { label: "Expédiée",    icon: Truck,       cls: "bg-purple-500/20 text-purple-400", border: "border-purple-500/30" },
  delivered: { label: "Livrée",      icon: Package,     cls: "bg-emerald-500/20 text-emerald-400", border: "border-emerald-500/30" },
  cancelled: { label: "Annulée",     icon: XCircle,     cls: "bg-red-500/20 text-red-400",       border: "border-red-500/30" },
  refunded:  { label: "Remboursée",  icon: RotateCcw,   cls: "bg-rose-500/20 text-rose-400",     border: "border-rose-500/30" },
};

function itemImageSrc(image) {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/${image.replace(/^\//, "")}`;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceFullscreen, setInvoiceFullscreen] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    setInvoiceFullscreen(false);
  }, [selectedOrder?.id]);

  /** Attendre le chargement des images avant capture PNG */
  async function waitForInvoiceImages(el) {
    const imgs = el.querySelectorAll("img");
    await Promise.all(
      [...imgs].map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else {
              img.onload = resolve;
              img.onerror = resolve;
            }
          })
      )
    );
  }

  async function loadOrders() {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const data = await fetchOrders(params);
      setOrders((data.orders || []).map(normalizeOrder));
    } catch (err) {
      console.error("Erreur chargement commandes:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, [filterStatus]);

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message);
    }
  }

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

  async function downloadInvoice() {
    if (!invoiceRef.current || !selectedOrder) return;
    setInvoiceLoading(true);
    try {
      await waitForInvoiceImages(invoiceRef.current);
      await new Promise((r) => setTimeout(r, 200));
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedOrder.reference}-facture.png`;
      a.click();
    } catch (err) {
      console.error("Erreur export facture:", err);
      alert("Impossible d'exporter la facture. Réessayez.");
    } finally {
      setInvoiceLoading(false);
    }
  }

  function fmtPrice(n) {
    return (n || 0).toLocaleString("fr-FR") + " FCFA";
  }

  function fmtDate(d) {
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  const q = search.trim().toLowerCase();
  const filtered = orders.filter((o) => {
    if (!q) return true;
    return (
      o.reference?.toLowerCase().includes(q) ||
      o.customerFirstName?.toLowerCase().includes(q) ||
      o.customerLastName?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.includes(search.trim()) ||
      String(o.id).includes(search.trim())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Référence, prénom, nom, tél..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-[#f5f0e8] placeholder-[#555] text-sm focus:border-[#C5A55A] focus:outline-none"
          />
        </div>
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
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-[#C5A55A] bg-[#C5A55A]/10 px-2 py-0.5 rounded">
                      {order.reference}
                    </span>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${st.cls}`}>
                      <StIcon size={10} />
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#f5f0e8] mt-1.5">
                    {order.customerFirstName} {order.customerLastName}
                  </p>
                  <p className="text-xs text-[#555] mt-0.5 truncate">
                    {order.customerPhone} · {order.items.length} article(s) · {fmtDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-[#C5A55A]">{fmtPrice(order.total)}</p>
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

      {/* Modal détail */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] shrink-0">
              <div>
                <h2 className="text-lg font-medium text-[#f5f0e8]">{selectedOrder.reference}</h2>
                <p className="text-xs text-[#555] mt-0.5">{fmtDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => {
                  setInvoiceFullscreen(false);
                  setSelectedOrder(null);
                }}
                className="text-[#555] hover:text-[#f5f0e8] p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
              {/* Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#222]">
                  <p className="text-[10px] text-[#888] uppercase tracking-wider mb-1">Client</p>
                  <p className="text-[#f5f0e8] font-medium">
                    {selectedOrder.customerFirstName} {selectedOrder.customerLastName}
                  </p>
                  <p className="text-[#888] text-xs mt-1">{selectedOrder.customerPhone}</p>
                  {selectedOrder.customerEmail && (
                    <p className="text-[#888] text-xs">{selectedOrder.customerEmail}</p>
                  )}
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#222]">
                  <p className="text-[10px] text-[#888] uppercase tracking-wider mb-1">Adresse</p>
                  <p className="text-[#ccc] text-xs leading-relaxed">
                    {selectedOrder.deliveryAddress || "—"}
                  </p>
                </div>
              </div>

              {/* Articles avec images */}
              <div>
                <h3 className="text-xs text-[#888] uppercase tracking-wider mb-2">Articles commandés</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => {
                    const src = itemImageSrc(item.image);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-[#1a1a1a] px-3 py-2.5 rounded-lg border border-[#222]"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#222] border border-[#333] shrink-0">
                          {src ? (
                            <img
                              src={src}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#444]">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#f5f0e8] font-medium truncate">{item.title}</p>
                          <p className="text-xs text-[#555]">Qté : {item.quantity}</p>
                        </div>
                        <p className="text-sm text-[#C5A55A] font-semibold shrink-0">
                          {fmtPrice((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Miniature facture — clic pour plein écran */}
              <div>
                <h3 className="text-xs text-[#888] uppercase tracking-wider mb-2">Facture</h3>
                <button
                  type="button"
                  onClick={() => setInvoiceFullscreen(true)}
                  className="w-full max-w-[220px] text-left rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden hover:border-[#C5A55A]/50 hover:bg-[#1f1f1f] transition-all group"
                >
                  <div className="h-[88px] overflow-hidden relative bg-white">
                    <div
                      className="absolute top-0 left-0 origin-top-left pointer-events-none"
                      style={{ transform: "scale(0.26)", width: 400 }}
                    >
                      <OrderInvoicePreview
                        order={selectedOrder}
                        fmtPrice={fmtPrice}
                        fmtDate={fmtDate}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/55 flex items-center justify-center text-[#C5A55A]">
                      <Maximize2 size={13} />
                    </div>
                  </div>
                  <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-t border-[#222]">
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#888] flex items-center gap-1">
                        <FileText size={11} />
                        Aperçu
                      </p>
                      <p className="text-xs font-mono text-[#C5A55A] truncate">{selectedOrder.reference}</p>
                    </div>
                    <p className="text-[10px] text-[#888] group-hover:text-[#C5A55A] shrink-0">
                      Ouvrir →
                    </p>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#222]">
                <p className="text-xs text-[#888]">Total commande</p>
                <p className="text-xl font-bold text-[#C5A55A]">{fmtPrice(selectedOrder.total)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plein écran facture */}
      {selectedOrder && invoiceFullscreen && (
        <div
          className="fixed inset-0 z-[70] bg-black/92 flex flex-col"
          onClick={() => setInvoiceFullscreen(false)}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInvoiceFullscreen(false)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
            <p className="text-sm font-mono text-[#C5A55A]">{selectedOrder.reference}</p>
            <button
              type="button"
              onClick={downloadInvoice}
              disabled={invoiceLoading}
              className="p-2 rounded-lg text-[#C5A55A] hover:bg-[#C5A55A]/15 transition-colors disabled:opacity-50"
              aria-label="Télécharger la facture"
              title="Télécharger PNG"
            >
              <Download size={22} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={invoiceRef} className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden relative">
              {invoiceLoading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded-xl">
                  <span className="text-sm text-white bg-black/70 px-4 py-2 rounded-full">
                    Export en cours…
                  </span>
                </div>
              )}
              <OrderInvoicePreview
                order={selectedOrder}
                fmtPrice={fmtPrice}
                fmtDate={fmtDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

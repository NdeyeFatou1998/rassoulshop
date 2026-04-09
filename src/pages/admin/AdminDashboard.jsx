/**
 * Page Dashboard Admin — /admin/dashboard
 *
 * Vue d'ensemble avec :
 * - Cartes statistiques (commandes, revenus, produits, utilisateurs, stock bas)
 * - Dernières commandes récentes
 * - Design premium noir/doré cohérent avec le reste de l'admin
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, DollarSign, Package, Users,
  AlertTriangle, XCircle, Clock, TrendingUp
} from "lucide-react";
import { fetchDashboardStats, fetchOrders } from "../../services/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Charger les statistiques et commandes récentes au montage */
  useEffect(() => {
    async function load() {
      try {
        const [statsData, ordersData] = await Promise.all([
          fetchDashboardStats(),
          fetchOrders({ limit: 5 }),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.orders || []);
      } catch (err) {
        console.error("Erreur chargement dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* Skeleton loader pendant le chargement */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-[#141414] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-[#141414] rounded-xl animate-pulse" />
      </div>
    );
  }

  /** Formater un montant en FCFA */
  function formatPrice(amount) {
    return (amount || 0).toLocaleString("fr-FR") + " FCFA";
  }

  /** Cartes statistiques à afficher */
  const statCards = [
    {
      label: "Commandes",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Revenus",
      value: formatPrice(stats?.totalRevenue),
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Produits",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-[#D4AF37]",
      bg: "bg-[#D4AF37]/10",
    },
    {
      label: "Utilisateurs",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "En attente",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Stock bas",
      value: stats?.lowStock || 0,
      icon: AlertTriangle,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      label: "Rupture stock",
      value: stats?.outOfStock || 0,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  /** Labels de statut commande */
  const statusLabels = {
    pending: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
    confirmed: { label: "Confirmée", cls: "bg-blue-500/20 text-blue-400" },
    shipped: { label: "Expédiée", cls: "bg-purple-500/20 text-purple-400" },
    delivered: { label: "Livrée", cls: "bg-emerald-500/20 text-emerald-400" },
    cancelled: { label: "Annulée", cls: "bg-red-500/20 text-red-400" },
  };

  return (
    <div className="space-y-6">
      {/* ---- Cartes statistiques ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-[#141414] border border-[#222] rounded-xl p-4 flex items-start gap-3"
            >
              <div className={`p-2.5 rounded-lg ${card.bg}`}>
                <Icon size={20} className={card.color} />
              </div>
              <div>
                <p className="text-xs text-[#888] uppercase tracking-wider">{card.label}</p>
                <p className="text-xl font-semibold text-[#f5f0e8] mt-1">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Dernières commandes ---- */}
      <div className="bg-[#141414] border border-[#222] rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <h2 className="text-sm font-medium text-[#f5f0e8]">Dernières commandes</h2>
          <Link
            to="/admin/orders"
            className="text-xs text-[#D4AF37] hover:text-[#E0C055] transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-center text-[#555] text-sm">
            Aucune commande pour le moment
          </p>
        ) : (
          <div className="divide-y divide-[#222]">
            {recentOrders.map((order) => {
              const st = statusLabels[order.status] || statusLabels.pending;
              return (
                <div key={order.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#f5f0e8]">
                      #{order.id} — {order.customerName}
                    </p>
                    <p className="text-xs text-[#555] mt-0.5">
                      {order.items.length} article(s) · {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${st.cls}`}>
                      {st.label}
                    </span>
                    <p className="text-sm font-medium text-[#D4AF37] mt-1">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- Accès rapides ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/products"
          className="bg-[#141414] border border-[#222] rounded-xl p-4 text-center hover:border-[#D4AF37]/30 transition-colors"
        >
          <Package size={24} className="mx-auto text-[#D4AF37] mb-2" />
          <p className="text-sm text-[#f5f0e8]">Gérer Produits</p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-[#141414] border border-[#222] rounded-xl p-4 text-center hover:border-[#D4AF37]/30 transition-colors"
        >
          <ShoppingCart size={24} className="mx-auto text-[#D4AF37] mb-2" />
          <p className="text-sm text-[#f5f0e8]">Commandes</p>
        </Link>
        <Link
          to="/admin/lookbook"
          className="bg-[#141414] border border-[#222] rounded-xl p-4 text-center hover:border-[#D4AF37]/30 transition-colors"
        >
          <Package size={24} className="mx-auto text-[#D4AF37] mb-2" />
          <p className="text-sm text-[#f5f0e8]">Lookbook</p>
        </Link>
        <Link
          to="/admin/users"
          className="bg-[#141414] border border-[#222] rounded-xl p-4 text-center hover:border-[#D4AF37]/30 transition-colors"
        >
          <Users size={24} className="mx-auto text-[#D4AF37] mb-2" />
          <p className="text-sm text-[#f5f0e8]">Utilisateurs</p>
        </Link>
      </div>
    </div>
  );
}

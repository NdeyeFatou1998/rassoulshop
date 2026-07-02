/**
 * AdminLayout — Backoffice premium (blanc, noir, or — aligné site public)
 */

import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Package, Image, FileText, ShoppingCart,
  Users, Tags, Gift, LogOut, Menu, X, ChevronRight, Settings, Layers, ScrollText, Clock, PanelTop
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bannière", path: "/admin/banner", icon: PanelTop },
  { label: "Produits", path: "/admin/products", icon: Package },
  { label: "Lookbook", path: "/admin/lookbook", icon: Image },
  { label: "À Propos", path: "/admin/about", icon: FileText },
  { label: "Commandes", path: "/admin/orders", icon: ShoppingCart },
  { label: "Pointage", path: "/admin/pointage", icon: Clock },
  { label: "Utilisateurs", path: "/admin/users", icon: Users, fullAdminOnly: true },
  { label: "Suivi", path: "/admin/suivi", icon: ScrollText, fullAdminOnly: true },
  { label: "Catégories", path: "/admin/categories", icon: Tags },
  { label: "Box Cadeau", path: "/admin/gift-boxes", icon: Gift },
  { label: "Variantes", path: "/admin/variants", icon: Layers },
  { label: "Paramètres", path: "/admin/settings", icon: Settings },
];

function getNavItemsForRole(role) {
  if (role === "admin") return NAV_ITEMS;
  return NAV_ITEMS.filter((item) => !item.fullAdminOnly);
}

export default function AdminLayout() {
  const { user, isAuthenticated, loading, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen admin-premium flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D7A12B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  function handleLogout() {
    logoutUser();
    navigate("/admin/login");
  }

  const navItems = getNavItemsForRole(user?.role);
  const currentPage = navItems.find((item) => location.pathname.startsWith(item.path));
  const pageTitle = currentPage?.label || "Admin";

  return (
    <div className="min-h-screen admin-premium flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-black/[0.08] flex flex-col transform transition-transform duration-300 shadow-sm lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-black/[0.08]">
          <Link to="/admin/dashboard" className="font-serif text-xl text-[#0a0a0a] tracking-wider">
            Rassoul
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-[#0a0a0a]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-black/[0.08]">
          <p className="text-sm text-[#0a0a0a] font-medium truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-[#D7A12B] uppercase tracking-wider mt-0.5 font-semibold">
            {user?.role === "admin"
              ? "Administrateur"
              : user?.role === "sub_admin"
                ? "Compte pointage"
                : "Assistant"}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[#D7A12B]/12 text-[#8B6914] font-semibold"
                    : "text-neutral-500 hover:text-[#0a0a0a] hover:bg-neutral-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-black/[0.08]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-neutral-600 w-full mt-1 transition-colors"
          >
            ← Voir le site
          </a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-16 bg-white border-b border-black/[0.08] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-neutral-500 hover:text-[#0a0a0a]"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-base font-semibold text-[#0a0a0a] truncate px-2">{pageTitle}</h1>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-3 md:p-4 lg:p-8 overflow-y-auto overflow-x-hidden bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

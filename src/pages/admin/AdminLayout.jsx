/**
 * AdminLayout — Layout principal du backoffice admin
 *
 * Structure :
 * - Sidebar gauche (navigation admin, logo, déconnexion)
 * - Zone principale à droite avec header + contenu (Outlet)
 * - Sidebar responsive (toggle sur mobile)
 * - Protection : redirige vers /admin/login si non authentifié
 */

import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Package, Image, FileText, ShoppingCart,
  Users, LogOut, Menu, X, ChevronRight, Settings
} from "lucide-react";

/** Liens de navigation du sidebar admin */
const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Produits", path: "/admin/products", icon: Package },
  { label: "Lookbook", path: "/admin/lookbook", icon: Image },
  { label: "À Propos", path: "/admin/about", icon: FileText },
  { label: "Commandes", path: "/admin/orders", icon: ShoppingCart },
  { label: "Utilisateurs", path: "/admin/users", icon: Users },
  { label: "Paramètres", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, isAuthenticated, loading, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Attendre le chargement de l'auth avant de décider */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C5A55A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* Rediriger si non authentifié */
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  /** Déconnexion */
  function handleLogout() {
    logoutUser();
    navigate("/admin/login");
  }

  /** Titre de la page actuelle */
  const currentPage = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path));
  const pageTitle = currentPage?.label || "Admin";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* ---- Overlay mobile (ferme le sidebar au clic) ---- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ---- Sidebar ---- */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-[#222] flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo + fermeture mobile */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-[#222]">
          <Link to="/admin/dashboard" className="font-serif text-xl text-[#f5f0e8] tracking-wider">
            Rassoul
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#888] hover:text-[#f5f0e8]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Infos utilisateur connecté */}
        <div className="px-6 py-4 border-b border-[#222]">
          <p className="text-sm text-[#f5f0e8] font-medium truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-[#C5A55A] uppercase tracking-wider mt-0.5">
            {user?.role}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[#C5A55A]/10 text-[#C5A55A] font-medium"
                    : "text-[#888] hover:text-[#f5f0e8] hover:bg-[#1a1a1a]"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bouton déconnexion */}
        <div className="px-3 py-4 border-t border-[#222]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
          {/* Lien retour vers le site public */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#555] hover:text-[#888] w-full mt-1 transition-colors"
          >
            ← Voir le site
          </a>
        </div>
      </aside>

      {/* ---- Zone principale ---- */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-[#111] border-b border-[#222] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          {/* Bouton menu mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#888] hover:text-[#f5f0e8]"
          >
            <Menu size={22} />
          </button>

          {/* Titre de la page */}
          <h1 className="text-lg font-medium text-[#f5f0e8]">{pageTitle}</h1>

          {/* Espace pour actions futures */}
          <div className="w-8" />
        </header>

        {/* Contenu des pages admin (via Outlet de React Router) */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

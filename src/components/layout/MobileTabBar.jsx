/**
 * Composant MobileTabBar — Navigation mobile Rassoul Shop
 * 
 * Design luxe discret :
 * - 4 onglets : Accueil, Shop, Coffrets, Lookbook
 * - Glassmorphism, indicateur doré animé
 * - Safe area bottom iPhone
 * - Visible uniquement < 768px
 */

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Gift, Camera } from "lucide-react";

export default function MobileTabBar() {
  const location = useLocation();

  const tabs = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: ShoppingCart, label: "Shop", path: "/shop" },
    { icon: Gift, label: "Coffrets", path: "/gift-boxes" },
    { icon: Camera, label: "Looks", path: "/lookbook" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0e0d0b]/95 backdrop-blur-xl border-t border-white/[0.08] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 px-2 py-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 transition-colors duration-300 ${
                isActive ? "text-gold" : "text-cream/55 active:text-cream/80"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[8px] font-medium tracking-wider uppercase">
                {tab.label}
              </span>
              {/* Point doré sous l'onglet actif */}
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-dot"
                  className="w-1 h-1 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

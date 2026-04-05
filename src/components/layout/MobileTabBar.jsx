/**
 * Composant MobileTabBar - Navigation mobile premium v2
 * 
 * Design raffiné :
 * - Barre fixe en bas avec glassmorphism amélioré
 * - 3 onglets : Accueil, Shop, Looks
 * - Indicateur actif animé (layoutId Framer Motion)
 * - Icônes avec transition de poids au changement d'état
 * - Safe area bottom pour iPhone (notch)
 * - Visible uniquement sous 768px (md breakpoint)
 */

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Camera } from "lucide-react";

export default function MobileTabBar() {
  const location = useLocation();

  /* Configuration des onglets avec icône et route */
  const tabs = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: ShoppingBag, label: "Shop", path: "/shop" },
    { icon: Camera, label: "Looks", path: "/lookbook" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-light border-t border-white/[0.04] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-3 px-3 py-1.5">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 rounded-2xl transition-colors duration-300 ${
                isActive
                  ? "text-gold"
                  : "text-muted/50 active:text-cream/70"
              }`}
            >
              {/* Fond lumineux animé derrière l'onglet actif */}
              {isActive && (
                <motion.div
                  layoutId="tab-glow"
                  className="absolute inset-1 rounded-2xl bg-gold/[0.06]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.5} className="relative z-10" />
              <span className="relative z-10 text-[9px] font-semibold tracking-wider uppercase">
                {tab.label}
              </span>

              {/* Point indicateur doré sous l'onglet actif */}
              {isActive && (
                <motion.div
                  layoutId="tab-dot"
                  className="w-1 h-1 rounded-full bg-gold relative z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

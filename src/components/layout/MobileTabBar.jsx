/**
 * MobileTabBar — Navigation mobile avec dégradé gold/black, textes lisibles
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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gold/[0.20] pb-[env(safe-area-inset-bottom)]"
      style={{
        background: "linear-gradient(to top, #0c0a07 60%, rgba(12,10,7,0.97))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="grid grid-cols-4 px-2 py-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 transition-colors duration-300 ${
                isActive ? "text-gold" : "text-white/70 active:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[8px] font-semibold tracking-wider uppercase ${
                isActive ? "text-gold" : "text-white/70"
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-dot"
                  className="w-4 h-[2px] rounded-full bg-gold mt-0.5"
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

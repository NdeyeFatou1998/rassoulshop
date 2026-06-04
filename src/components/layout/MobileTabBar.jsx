/**
 * MobileTabBar — Navigation mobile lisible, fond gold/dark
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]"
      style={{
        background: "#030303",
        borderTop: "1.5px solid rgba(197,165,90,0.35)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.6)",
      }}
    >
      <div className="grid grid-cols-4 px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center gap-0.5 py-2 transition-all duration-300"
              style={{ color: isActive ? "#C5A55A" : "rgba(240,234,216,0.80)" }}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[9px] font-bold tracking-wider uppercase">
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-dot"
                  className="w-5 h-[2.5px] rounded-full mt-0.5"
                  style={{ background: "#C5A55A" }}
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

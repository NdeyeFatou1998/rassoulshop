/**
 * MobileTabBar — Navigation mobile : Boutique, Coffrets (catégorie), Box Cadeau
 */

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Package, Gift, Camera } from "lucide-react";

const COFFRETS_CATEGORY = "sets-cadeau";

function isTabActive(tab, pathname, category) {
  if (tab.id === "coffrets") {
    return pathname === "/coffrets";
  }
  if (tab.id === "boutique") {
    return pathname === "/shop" && category !== COFFRETS_CATEGORY;
  }
  if (tab.id === "box-cadeau") {
    return pathname === "/gift-boxes" || pathname.startsWith("/gift-boxes/");
  }
  return pathname === tab.path;
}

export default function MobileTabBar() {
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");

  const tabs = [
    { id: "accueil", icon: Home, label: "Accueil", path: "/" },
    { id: "boutique", icon: ShoppingBag, label: "Boutique", path: "/shop" },
    { id: "coffrets", icon: Package, label: "Coffrets", path: "/coffrets" },
    { id: "box-cadeau", icon: Gift, label: "Box Cadeau", path: "/gift-boxes" },
    { id: "looks", icon: Camera, label: "Looks", path: "/lookbook" },
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
      <div className="grid grid-cols-5 px-1 py-1.5">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab, location.pathname, category);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className="relative flex flex-col items-center gap-0.5 py-2 transition-all duration-300"
              style={{ color: isActive ? "#C5A55A" : "rgba(240,234,216,0.80)" }}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[7px] font-bold tracking-wide uppercase leading-tight text-center px-0.5">
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-dot"
                  className="w-4 h-[2.5px] rounded-full mt-0.5"
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

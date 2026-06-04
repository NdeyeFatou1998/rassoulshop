/**
 * Navbar — Logo RSN2 visible, loupe de recherche, sans logo dans le menu mobile
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, ShoppingBag, Search } from "lucide-react";
import { useCart } from "../../context/CartContext";
import SearchOverlay from "../ui/SearchOverlay";

const GOLD = "#C8A84B";

const BRAND_GRADIENT =
  "linear-gradient(100deg, #BF953F 0%, #FCF6BA 38%, #D4AF37 58%, #C8A84B 72%, #FBF5B7 100%)";

const COFFRETS_CATEGORY = "sets-cadeau";

function isNavLinkActive(link, pathname, search) {
  const category = new URLSearchParams(search).get("category");
  if (link.path === "/coffrets") {
    return pathname === "/coffrets";
  }
  if (link.path === "/shop") {
    return pathname === "/shop" && category !== COFFRETS_CATEGORY;
  }
  if (link.path === "/gift-boxes") {
    return pathname === "/gift-boxes" || pathname.startsWith("/gift-boxes/");
  }
  return pathname === link.path;
}

export default function Navbar() {
  const location = useLocation();
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Boutique", path: "/shop" },
    { label: "Coffrets", path: "/coffrets" },
    { label: "Box Cadeau", path: "/gift-boxes" },
    { label: "Lookbook", path: "/lookbook" },
  ];

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={scrolled ? {
          background: "rgba(14,11,6,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(197,165,90,0.22)",
          boxShadow: "0 2px 30px rgba(0,0,0,0.7)",
        } : {
          background: "linear-gradient(to bottom, rgba(8,5,2,0.70) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-10 flex items-center justify-between h-16 md:h-[76px]">

          {/* Gauche : menu mobile + logo + nom de marque */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 shrink-0 justify-start">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 -ml-1 shrink-0 transition-colors"
              style={{ color: "rgba(240,234,216,0.90)" }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 min-w-0 -ml-0.5 md:ml-0"
            >
              <img
                src="/assets/images/RSN2.png"
                alt="Rassoul Shop Sn"
                className="object-contain shrink-0"
                style={{
                  height: "clamp(52px, 8vw, 72px)",
                  width: "auto",
                  filter: "drop-shadow(0 2px 14px rgba(197,165,90,0.6)) brightness(1.08)",
                }}
              />
              <span
                className="font-serif font-extrabold uppercase whitespace-nowrap leading-none tracking-[0.06em] sm:tracking-[0.1em]"
                style={{
                  fontSize: "clamp(0.72rem, 2.8vw, 1.15rem)",
                  background: BRAND_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 0 24px rgba(197,165,90,0.25)",
                }}
              >
                RASSOUL SHOP SN
              </span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(link, location.pathname, location.search);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative text-[11px] uppercase tracking-[0.18em] font-semibold py-2 transition-colors duration-300"
                  style={{ color: isActive ? GOLD : "rgba(240,234,216,0.85)" }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[1.5px]"
                      style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions droite : loupe + panier */}
          <div className="flex items-center gap-1">
            {/* Loupe */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg transition-all duration-300"
              style={{ color: "rgba(240,234,216,0.85)" }}
              onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.background = "rgba(197,165,90,0.10)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,234,216,0.85)"; e.currentTarget.style.background = "transparent"; }}
              aria-label="Rechercher"
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            {/* Panier */}
            <Link
              to="/cart"
              className="relative p-2 -mr-2 transition-colors duration-300"
              style={{ color: "rgba(240,234,216,0.85)" }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(240,234,216,0.85)"}
            >
              <ShoppingCart size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold rounded-full px-1"
                  style={{ background: GOLD, color: "#0c0a07" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Menu mobile — sans logo ni texte marque (évite chevauchement avec la navbar) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "linear-gradient(180deg, #1a1408 0%, #0e0b06 100%)" }}
          >
            {/* Header menu mobile : fermeture uniquement */}
            <div
              className="flex items-center justify-end px-5 h-16"
              style={{ borderBottom: "1px solid rgba(197,165,90,0.15)" }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 transition-colors"
                style={{ color: "rgba(240,234,216,0.60)" }}
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Liens */}
            <div className="flex flex-col px-6 pt-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.06 }}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Link
                    to={link.path}
                    className="block py-5 font-serif text-2xl tracking-wide transition-colors"
                    style={{ color: isNavLinkActive(link, location.pathname, location.search) ? GOLD : "rgba(240,234,216,0.90)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Recherche dans le menu mobile */}
              <motion.button
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + navLinks.length * 0.06 }}
                onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                className="flex items-center gap-3 py-5 font-serif text-2xl tracking-wide transition-colors text-left"
                style={{ color: "rgba(240,234,216,0.90)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Search size={20} strokeWidth={1.5} />
                Rechercher
              </motion.button>
            </div>

            {/* Panier en bas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-auto px-6 pb-10"
            >
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-sm transition-colors"
                style={{ color: "rgba(240,234,216,0.60)" }}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span>Panier {cartCount > 0 && `(${cartCount})`}</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

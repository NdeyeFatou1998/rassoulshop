/**
 * Composant Navbar — Navigation principale Rassoul Shop
 * 
 * Comportement adaptatif :
 * - Sur la page d'accueil (hero sombre) : fond transparent, texte blanc
 * - Après scroll passé le hero (sections claires) : fond blanc, texte noir
 * - Sur toutes les autres pages : fond blanc, texte noir immédiatement
 * 
 * Mobile : hamburger gauche, logo centré, panier droit
 * Desktop : logo gauche, nav centrée, panier droit
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Glassmorphism au scroll */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Ferme le menu mobile à chaque changement de page */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Classes dark — toujours blanc sur fond noir */
  const headerBg = scrolled
    ? "bg-[#0e0d0b]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_30px_rgba(0,0,0,0.5)]"
    : "bg-transparent";

  const logoColor = "text-white hover:text-gold";
  const linkBase  = "text-white/70 hover:text-white";
  const linkActive = "text-white";
  const iconColor  = "text-white/70 hover:text-white";
  const burgerColor = "text-white/75 hover:text-white";

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Boutique", path: "/shop" },
    { label: "Coffrets", path: "/gift-boxes" },
    { label: "Lookbook", path: "/lookbook" },
  ];

  return (
    <>
      {/* ---- Barre de navigation ---- */}
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between h-16 md:h-[72px]">

          {/* Hamburger — mobile gauche */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 -ml-2 transition-colors ${burgerColor}`}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo — centré mobile, gauche desktop */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 font-serif font-bold text-lg md:text-xl tracking-[0.06em] transition-colors duration-300"
          >
            <span className="text-white">RASSOUL</span><span className="text-gold ml-[5px]">SHOP</span>
          </Link>

          {/* Navigation desktop — centrée */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[11px] uppercase tracking-[0.18em] font-medium py-2 transition-colors duration-300 ${
                    isActive ? linkActive : linkBase
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Panier — droit */}
          <Link
            to="/cart"
            className={`relative p-2 -mr-2 transition-colors ${iconColor}`}
          >
            <ShoppingCart size={19} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold bg-gold text-white rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </motion.header>

      {/* ---- Menu mobile — fond noir doré ---- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-noir-950 flex flex-col"
          >
            {/* Header du menu mobile */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06]">
              <span className="font-serif text-xl text-white">
                <span className="text-white">RASSOUL</span><span className="text-gold ml-[5px]">SHOP</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-white/40 hover:text-white transition-colors"
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
                  className="border-b border-white/[0.05]"
                >
                  <Link
                    to={link.path}
                    className={`block py-5 font-serif text-2xl tracking-wide transition-colors ${
                      location.pathname === link.path ? "text-gold" : "text-white/85 active:text-gold"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Panier en bas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-auto px-6 pb-10"
            >
              <Link
                to="/cart"
                className="flex items-center gap-3 text-sm text-white/55 hover:text-gold transition-colors"
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

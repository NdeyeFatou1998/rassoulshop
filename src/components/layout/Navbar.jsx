/**
 * Composant Navbar - Navigation principale premium v2
 * 
 * Design raffiné :
 * - Glassmorphism amélioré avec saturation au scroll
 * - Logo serif avec gradient doré subtil au hover
 * - Indicateur actif animé (layoutId spring)
 * - CTA "Explorer" avec glow doré au hover
 * - Menu mobile plein écran avec lignes décoratives
 * - Animations staggered sur le menu mobile
 * - Masqué sur mobile (remplacé par MobileTabBar)
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Détecte le scroll pour ajuster l'opacité de la navbar */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Ferme le menu mobile lors d'un changement de page */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Liens de navigation avec leur route */
  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Boutique", path: "/shop" },
    { label: "Lookbook", path: "/lookbook" },
  ];

  return (
    <>
      {/* ---- Barre de navigation principale ---- */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-5 md:px-12 lg:px-20 flex items-center justify-between h-14 md:h-[72px]">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-lg md:text-xl font-semibold tracking-wider text-cream hover:text-gradient-gold transition-colors duration-400"
          >
            Rassoul
          </Link>

          {/* Navigation desktop — masquée sur mobile */}
          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-300 py-1 ${
                  location.pathname === link.path
                    ? "text-gold"
                    : "text-muted hover:text-cream"
                }`}
              >
                {link.label}
                {/* Indicateur actif animé : ligne dorée glissante */}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions desktop — CTA avec glow */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/shop"
              className="flex items-center gap-2 px-5 py-2 text-[10px] uppercase tracking-[0.14em] font-bold bg-gold/8 text-gold border border-gold/15 rounded-full hover:bg-gold hover:text-noir-900 glow-gold-hover transition-all duration-400 btn-press"
            >
              <ShoppingBag size={13} />
              Explorer
            </Link>
          </div>

          {/* Bouton hamburger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-cream/60 hover:text-cream transition-colors"
            aria-label="Menu"
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>
        </div>
      </motion.header>

      {/* ---- Menu mobile plein écran ---- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-noir-950/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-1"
          >
            {/* Ligne décorative en haut */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="w-12 h-px bg-gold/30 mb-8"
            />

            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="py-3"
              >
                <Link
                  to={link.path}
                  className={`text-2xl font-serif tracking-wide transition-colors duration-300 ${
                    location.pathname === link.path
                      ? "text-gold"
                      : "text-cream/40 active:text-cream/80"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Ligne décorative en bas */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="w-12 h-px bg-gold/30 mt-8"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

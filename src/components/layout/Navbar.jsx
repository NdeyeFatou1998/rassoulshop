/**
 * Navbar — Logo image RSN2, liens visibles, glassmorphism au scroll
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const headerBg = scrolled
    ? "bg-[#0c0a07]/95 backdrop-blur-xl border-b border-gold/[0.12] shadow-[0_1px_30px_rgba(0,0,0,0.6)]"
    : "bg-gradient-to-b from-black/50 to-transparent";

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Boutique", path: "/shop" },
    { label: "Coffrets", path: "/gift-boxes" },
    { label: "Lookbook", path: "/lookbook" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-10 flex items-center justify-between h-16 md:h-[72px]">

          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -ml-2 text-white/80 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo image — centré mobile, gauche desktop */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center"
          >
            <img
              src="/assets/images/RSN2.png"
              alt="Rassoul Shop Sn"
              className="h-10 md:h-11 w-auto object-contain drop-shadow-[0_2px_8px_rgba(197,165,90,0.5)]"
              style={{ filter: "drop-shadow(0 0 6px rgba(197,165,90,0.4))" }}
            />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[11px] uppercase tracking-[0.18em] font-semibold py-2 transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-white/80 hover:text-white"
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

          {/* Panier */}
          <Link
            to="/cart"
            className="relative p-2 -mr-2 text-white/80 hover:text-white transition-colors"
          >
            <ShoppingCart size={19} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold bg-gold text-[#0c0a07] rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </motion.header>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#0c0a07] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-gold/[0.12]">
              <img
                src="/assets/images/RSN2.png"
                alt="Rassoul Shop Sn"
                className="h-10 w-auto object-contain"
                style={{ filter: "drop-shadow(0 0 6px rgba(197,165,90,0.4))" }}
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col px-6 pt-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.06 }}
                  className="border-b border-white/[0.07]"
                >
                  <Link
                    to={link.path}
                    className={`block py-5 font-serif text-2xl tracking-wide transition-colors ${
                      location.pathname === link.path ? "text-gold" : "text-white/90 active:text-gold"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-auto px-6 pb-10"
            >
              <Link
                to="/cart"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-gold transition-colors"
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

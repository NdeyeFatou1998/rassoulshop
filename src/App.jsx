/**
 * Composant App - Point d'entrée principal de l'application React
 * 
 * Gère le routing entre les pages avec React Router :
 * - /              → Page d'accueil (Home)
 * - /shop          → Boutique complète (Shop)
 * - /lookbook      → Galerie visuelle (Lookbook)
 * - /product/:id   → Fiche détail produit (ProductDetail)
 * - /cart          → Panier d'achat (Cart)
 * - /admin/login   → Connexion admin
 * - /admin/*       → Backoffice admin (dashboard, produits, lookbook, about, commandes, users, settings)
 * 
 * Layout global :
 * - AuthProvider enveloppe tout (état global auth admin)
 * - CartProvider enveloppe tout (état global panier)
 * - Navbar fixe en haut (desktop) avec glassmorphism
 * - FloatingCart : bouton panier flottant avec compteur
 * - MobileTabBar fixe en bas (mobile uniquement)
 * - Footer en bas de chaque page
 * - Scroll to top automatique à chaque changement de page
 */

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MobileTabBar from "./components/layout/MobileTabBar";
import FloatingCart from "./components/ui/FloatingCart";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Lookbook from "./pages/Lookbook";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

/* ---- Pages Admin ---- */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLookbook from "./pages/admin/AdminLookbook";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

/**
 * ScrollToTop - Remet le scroll en haut à chaque navigation
 * Évite de rester au milieu de la page précédente
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * AnimatedRoutes - Wrapper pour animer les transitions entre pages
 * Chaque page entre avec un fade + léger slide-up
 */
function AnimatedRoutes() {
  const location = useLocation();

  /* Variants pour la transition de page */
  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * PublicLayout — Layout du site public (Navbar, Footer, FloatingCart, MobileTabBar)
 * Séparé de l'admin qui a son propre layout
 */
function PublicLayout() {
  return (
    <>
      {/* Navigation principale desktop (glassmorphism) */}
      <Navbar />

      {/* Contenu principal avec transitions animées entre les pages */}
      <main className="min-h-screen pb-20 md:pb-0">
        <AnimatedRoutes />
      </main>

      {/* Pied de page premium */}
      <Footer />

      {/* Panier flottant avec compteur (visible quand articles > 0) */}
      <FloatingCart />

      {/* Navigation mobile fixe en bas (visible < 768px) */}
      <MobileTabBar />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          {/* Reset du scroll à chaque changement de route */}
          <ScrollToTop />

          <Routes>
            {/* ---- Routes Admin (layout séparé, pas de Navbar/Footer) ---- */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="lookbook" element={<AdminLookbook />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ---- Routes publiques (avec Navbar, Footer, etc.) ---- */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

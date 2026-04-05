/**
 * FloatingCart - Bouton panier flottant premium v2
 * 
 * Design amélioré :
 * - Glow doré pulsant en permanence (attire l'attention)
 * - Animation spring physics pour l'apparition
 * - Badge compteur avec bounce quand le nombre change
 * - Clic → navigation vers la page /cart
 * - Position adaptée : au-dessus du MobileTabBar sur mobile
 * - Effet press sur tap mobile
 */

import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const { cartCount, flyTargetRef } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.button
          ref={flyTargetRef}
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={() => navigate("/cart")}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 w-14 h-14 rounded-full bg-gold text-noir-900 flex items-center justify-center glow-pulse hover:scale-110 active:scale-95 transition-transform duration-200"
          aria-label="Voir le panier"
        >
          {/* Icône chariot */}
          <ShoppingBag size={20} strokeWidth={2.2} />

          {/* Badge compteur avec animation bounce à chaque changement */}
          <motion.span
            key={cartCount}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-noir-900 text-gold text-[10px] font-bold flex items-center justify-center border-2 border-gold shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          >
            {cartCount}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

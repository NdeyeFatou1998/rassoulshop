/**
 * CartContext - Gestion globale du panier d'achat
 *
 * Chaque ligne : { lineKey, product, quantity, personalization? }
 */

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getProductUnitPrice } from "../utils/pricing";
import { getCartLineKey, normalizeCartItem } from "../utils/cartLine";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("rassoul_cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeCartItem) : [];
    } catch {
      return [];
    }
  });

  const flyTargetRef = useRef(null);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    localStorage.setItem("rassoul_cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + getProductUnitPrice(item.product) * item.quantity,
    0
  );

  /**
   * @param {object} product
   * @param {number} quantity
   * @param {string|null} personalization — texte client si produit personnalisable
   */
  function addToCart(product, quantity = 1, personalization = null) {
    const perso = product.is_personalizable
      ? String(personalization || "").trim()
      : "";
    const lineKey = getCartLineKey(product.id, perso);

    setCart((prev) => {
      const existing = prev.find((item) => item.lineKey === lineKey);
      if (existing) {
        return prev.map((item) =>
          item.lineKey === lineKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          lineKey,
          product,
          quantity,
          ...(perso ? { personalization: perso } : {}),
        },
      ];
    });

    setBump(true);
    setTimeout(() => setBump(false), 400);
  }

  function removeFromCart(lineKey) {
    setCart((prev) => prev.filter((item) => item.lineKey !== lineKey));
  }

  function updateQuantity(lineKey, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(lineKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.lineKey === lineKey ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        flyTargetRef,
        bump,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

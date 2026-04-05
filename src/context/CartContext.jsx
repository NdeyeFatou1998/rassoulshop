/**
 * CartContext - Gestion globale du panier d'achat
 * 
 * Fournit à toute l'application :
 * - cart[]          : liste des items {product, quantity}
 * - cartCount       : nombre total d'articles
 * - cartTotal       : montant total en FCFA
 * - addToCart(product, qty)  : ajouter un produit
 * - removeFromCart(id)       : retirer un produit
 * - updateQuantity(id, qty)  : modifier la quantité
 * - clearCart()              : vider le panier
 * - flyTarget       : ref du panier flottant pour l'animation fly
 * 
 * Persiste le panier dans localStorage pour ne pas le perdre au refresh.
 */

import { createContext, useContext, useState, useEffect, useRef } from "react";

const CartContext = createContext();

/** Hook raccourci pour accéder au contexte panier */
export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  /* Initialiser le panier depuis localStorage s'il existe */
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("rassoul_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* Ref vers le bouton panier flottant (cible de l'animation fly) */
  const flyTargetRef = useRef(null);

  /* État pour déclencher l'animation "bump" du compteur */
  const [bump, setBump] = useState(false);

  /* Persister le panier dans localStorage à chaque changement */
  useEffect(() => {
    localStorage.setItem("rassoul_cart", JSON.stringify(cart));
  }, [cart]);

  /** Nombre total d'articles dans le panier */
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /** Montant total en FCFA */
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  /**
   * Ajouter un produit au panier
   * Si le produit existe déjà, incrémente la quantité
   */
  function addToCart(product, quantity = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    /* Déclencher l'animation bump sur le compteur */
    setBump(true);
    setTimeout(() => setBump(false), 400);
  }

  /** Retirer un produit du panier par son ID */
  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  /** Modifier la quantité d'un produit (minimum 1) */
  function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }

  /** Vider complètement le panier */
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

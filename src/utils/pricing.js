/** Parse montant (aligné backend orderPricing) */
function parseAmount(value) {
  if (value == null || value === "") return 0;
  if (typeof value === "number" && !Number.isNaN(value)) return Math.round(value);
  const cleaned = String(value).replace(/\s/g, "").replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : Math.round(n);
}

/** Prix unitaire d'une ligne commande */
export function getOrderItemUnitPrice(item) {
  if (!item) return 0;
  if (item.unit_price != null) return parseAmount(item.unit_price);
  if (item.unitPrice != null) return parseAmount(item.unitPrice);
  const hasPromo = item.promo_active && item.promo_price != null;
  if (hasPromo) return parseAmount(item.promo_price);
  return parseAmount(item.price);
}

/** Total commande recalculé depuis les articles */
export function computeOrderTotal(items) {
  return (items || []).reduce((sum, item) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    return sum + getOrderItemUnitPrice(item) * qty;
  }, 0);
}

/**
 * Prix unitaire effectif (promo + variante panier)
 */
export function getProductUnitPrice(product) {
  if (!product) return 0;
  if (product._cartUnitPrice != null) {
    return Number(product._cartUnitPrice) || 0;
  }
  const hasPromo = product.promo_active && product.promo_price != null;
  const base = hasPromo ? product.promo_price : product.price;
  return Number(base) || 0;
}

export function getLineTotal(product, quantity) {
  return getProductUnitPrice(product) * (Number(quantity) || 1);
}

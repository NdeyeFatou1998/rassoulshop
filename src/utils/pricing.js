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

/** Clé unique d'une ligne panier (produit + texte de personnalisation) */
export function getCartLineKey(productId, personalization) {
  const text = String(personalization || "").trim();
  return text ? `${productId}::${text}` : String(productId);
}

export function normalizeCartItem(item) {
  const personalization = item.personalization?.trim() || undefined;
  const lineKey =
    item.lineKey || getCartLineKey(item.product?.id, personalization);
  return { ...item, lineKey, personalization };
}

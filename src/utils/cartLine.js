/** Clé unique d'une ligne panier (produit + personnalisation + variantes) */
export function getCartLineKey(productId, personalization, variants = []) {
  const text = String(personalization || "").trim();
  const variantPart = normalizeVariants(variants)
    .map((v) => `${v.type_id || ""}:${v.id || v.name}`)
    .sort()
    .join("|");
  return [productId, text, variantPart].filter(Boolean).join("::");
}

export function normalizeVariants(variants) {
  if (!Array.isArray(variants)) return [];
  return variants
    .filter((v) => v && (v.name || v.option_name))
    .map((v) => ({
      type_id: v.type_id ?? v.typeId ?? null,
      type: String(v.type || v.type_name || v.typeName || "Variante").trim(),
      id: v.id ?? v.option_id ?? null,
      name: String(v.name || v.option_name || v.optionName || "").trim(),
      price_modifier: Number(v.price_modifier || v.priceModifier || 0) || 0,
    }))
    .filter((v) => v.name);
}

export function formatVariantsLabel(variants) {
  const list = normalizeVariants(variants);
  if (!list.length) return "";
  return list.map((v) => `${v.type} : ${v.name}`).join(" · ");
}

export function normalizeCartItem(item) {
  const personalization = item.personalization?.trim() || undefined;
  const variants = normalizeVariants(item.variants);
  const lineKey =
    item.lineKey ||
    getCartLineKey(item.product?.id, personalization, variants);
  return {
    ...item,
    lineKey,
    personalization,
    ...(variants.length ? { variants } : {}),
  };
}

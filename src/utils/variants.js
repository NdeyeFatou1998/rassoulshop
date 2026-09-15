/**
 * @param {object} product
 * @param {Record<string|number, {id, name, price_modifier}>} selectedVariants
 */
export function buildSelectedVariantsList(product, selectedVariants = {}) {
  const types = product?.variant_types || [];
  return Object.entries(selectedVariants || {})
    .filter(([, v]) => v && v.name)
    .map(([typeId, v]) => {
      const type = types.find((t) => String(t.id) === String(typeId));
      return {
        type_id: Number(typeId) || type?.id || null,
        type: type?.name || "Variante",
        id: v.id,
        name: v.name,
        price_modifier: Number(v.price_modifier) || 0,
      };
    });
}

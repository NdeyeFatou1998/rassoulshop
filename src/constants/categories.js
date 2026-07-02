/** Slugs de catégories réservées au système / hors boutique publique */
export const BOITES_VIP_SLUG = "boites-vip";

/** Catégories masquées du shop public (accueil, filtres) */
export const HIDDEN_SHOP_CATEGORY_SLUGS = [BOITES_VIP_SLUG];

export function isBoitesVipCategory(slug) {
  return slug === BOITES_VIP_SLUG;
}

export function isHiddenShopCategory(slug) {
  return HIDDEN_SHOP_CATEGORY_SLUGS.includes(slug);
}

export function isVipProduct(product) {
  if (!product) return false;
  return (
    product.is_vip === true ||
    product.category === BOITES_VIP_SLUG ||
    product.category_slug === BOITES_VIP_SLUG
  );
}

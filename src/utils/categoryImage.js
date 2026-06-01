/** Placeholder quand une catégorie n'a pas d'image */
export const DEFAULT_CATEGORY_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#faf7f2"/>
  <rect x="40" y="40" width="320" height="320" rx="48" fill="#ffffff" stroke="#e8dfd0" stroke-width="8"/>
  <circle cx="200" cy="170" r="48" fill="#C5A55A" opacity="0.25"/>
  <text x="200" y="280" font-family="Georgia, serif" font-size="22" font-weight="700" fill="#1a1612" text-anchor="middle">Catégorie</text>
</svg>
`)}`;

export function getCategoryImageUrl(imageUrl) {
  return imageUrl && String(imageUrl).trim() ? imageUrl : DEFAULT_CATEGORY_IMG;
}

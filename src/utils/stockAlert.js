/** Seuil stock faible (aligné dashboard admin / backend) */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * @returns {{ level: 'out'|'low', label: string } | null}
 */
export function getStockAlert(stock) {
  const n = Number(stock);
  if (Number.isNaN(n) || n < 0) return null;
  if (n <= 0) return { level: "out", label: "Stock terminé" };
  if (n <= LOW_STOCK_THRESHOLD) return { level: "low", label: "Stock faible" };
  return null;
}

/** Seuil stock faible par défaut (si paramètres non chargés) */
export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

/**
 * @param {number|string} stock
 * @param {number} [threshold=DEFAULT_LOW_STOCK_THRESHOLD]
 * @returns {{ level: 'out'|'low', label: string } | null}
 */
export function getStockAlert(stock, threshold = DEFAULT_LOW_STOCK_THRESHOLD) {
  const n = Number(stock);
  const t = Math.max(1, Number(threshold) || DEFAULT_LOW_STOCK_THRESHOLD);
  if (Number.isNaN(n) || n < 0) return null;
  if (n <= 0) return { level: "out", label: "Stock terminé" };
  if (n <= t) return { level: "low", label: "Stock faible" };
  return null;
}

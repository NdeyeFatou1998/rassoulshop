export const DEFAULT_DELIVERY_PRICE = 2000;

export async function fetchPublicDeliveryPrice() {
  try {
    const res = await fetch("/api/settings/delivery");
    const data = await res.json();
    const n = Number(data.deliveryPrice);
    if (Number.isFinite(n) && n >= 0) return Math.round(n);
  } catch {
    /* fallback défaut */
  }
  return DEFAULT_DELIVERY_PRICE;
}

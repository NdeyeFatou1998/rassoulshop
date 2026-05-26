/**
 * Normalise une commande API (snake_case) pour l'admin UI
 */
export function normalizeOrder(raw) {
  let items = raw.items;
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }
  if (!Array.isArray(items)) items = [];

  const firstName = (raw.customer_first_name || raw.customerFirstName || "").trim();
  const lastName = (raw.customer_last_name || raw.customerLastName || "").trim();
  const fullName =
    raw.customerName?.trim() || `${firstName} ${lastName}`.trim() || "Client";

  return {
    ...raw,
    id: raw.id,
    reference: raw.reference || `CMD-${String(raw.id).padStart(5, "0")}`,
    customerFirstName: firstName,
    customerLastName: lastName,
    customerName: fullName,
    customerPhone: raw.customer_phone || raw.customerPhone || "",
    customerEmail: raw.customer_email || raw.customerEmail || "",
    deliveryAddress: raw.delivery_address || raw.deliveryAddress || "",
    createdAt: raw.created_at || raw.createdAt,
    items,
  };
}

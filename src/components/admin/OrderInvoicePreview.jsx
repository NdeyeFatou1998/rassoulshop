/**
 * Aperçu facture — styles inline pour affichage fiable + export PNG
 */
export default function OrderInvoicePreview({ order, fmtPrice, fmtDate }) {
  const st = {
    pending: "En attente",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#1a1612",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e8dfd0",
        textAlign: "left",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1612",
          color: "#f5f0e8",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.28em", color: "#C5A55A", margin: 0, textTransform: "uppercase" }}>
            Rassoul shop
          </p>
          <h4 style={{ fontSize: 22, margin: "4px 0 0", fontWeight: 700 }}>Facture</h4>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
          <p style={{ margin: 0, fontFamily: "monospace", color: "#C5A55A", fontWeight: 700 }}>
            {order.reference}
          </p>
          <p style={{ margin: "4px 0 0" }}>{fmtDate(order.createdAt)}</p>
          <p style={{ margin: "2px 0 0" }}>{st[order.status] || order.status}</p>
        </div>
      </div>

      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #eee6d8",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          fontSize: 12,
        }}
      >
        <div>
          <p style={{ color: "#888", fontSize: 9, textTransform: "uppercase", margin: "0 0 4px" }}>Client</p>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {order.customerFirstName} {order.customerLastName}
          </p>
          <p style={{ margin: "4px 0 0", color: "#666" }}>{order.customerPhone}</p>
          {order.customerEmail && <p style={{ margin: "2px 0 0", color: "#666" }}>{order.customerEmail}</p>}
        </div>
        <div>
          <p style={{ color: "#888", fontSize: 9, textTransform: "uppercase", margin: "0 0 4px" }}>Livraison</p>
          <p style={{ margin: 0, color: "#444", lineHeight: 1.5 }}>{order.deliveryAddress || "—"}</p>
        </div>
      </div>

      <div style={{ padding: "12px 20px" }}>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee6d8", color: "#888", fontSize: 9, textTransform: "uppercase" }}>
              <th style={{ textAlign: "left", padding: "8px 4px 8px 0", width: 40 }} />
              <th style={{ textAlign: "left", padding: "8px 4px" }}>Article</th>
              <th style={{ textAlign: "center", padding: "8px 4px", width: 40 }}>Qté</th>
              <th style={{ textAlign: "right", padding: "8px 0 8px 4px", width: 90 }}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => {
              const lineTotal = (item.price || 0) * (item.quantity || 1);
              const img = item.image;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f5f0ea" }}>
                  <td style={{ padding: "8px 8px 8px 0", verticalAlign: "middle" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 6,
                        overflow: "hidden",
                        backgroundColor: "#f5f0ea",
                        border: "1px solid #eee6d8",
                      }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          crossOrigin="anonymous"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 8 }}>
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "8px 4px", verticalAlign: "middle", fontWeight: 600 }}>
                    {item.title || `Produit #${item.id || item.productId}`}
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "center", color: "#666", verticalAlign: "middle" }}>
                    {item.quantity || 1}
                  </td>
                  <td style={{ padding: "8px 0 8px 4px", textAlign: "right", fontWeight: 600, verticalAlign: "middle" }}>
                    {fmtPrice(lineTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: "16px 20px",
          backgroundColor: "#faf7f2",
          borderTop: "1px solid #eee6d8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: 10, color: "#888", textTransform: "uppercase" }}>
          Paiement à la livraison
        </p>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 9, color: "#888", textTransform: "uppercase" }}>Total TTC</p>
          <p style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700, color: "#8a6a42" }}>
            {fmtPrice(order.total)}
          </p>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 9, color: "#aaa", padding: "8px 0", margin: 0, borderTop: "1px solid #eee6d8" }}>
        Merci pour votre confiance — rassoulshopsn.com
      </p>
    </div>
  );
}

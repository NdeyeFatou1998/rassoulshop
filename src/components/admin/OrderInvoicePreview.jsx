/**
 * Aperçu facture commande — rendu document premium (capturable en PNG)
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
    <div className="bg-white text-[#1a1612] rounded-xl overflow-hidden shadow-lg border border-[#e8dfd0] text-left">
      {/* En-tête */}
      <div className="bg-[#1a1612] text-[#f5f0e8] px-5 py-4 flex justify-between items-start gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#C5A55A] font-semibold">
            Rassoul shop
          </p>
          <h4 className="font-serif text-xl mt-1">Facture</h4>
        </div>
        <div className="text-right text-xs text-white/70">
          <p className="font-mono text-[#C5A55A] font-semibold">{order.reference}</p>
          <p className="mt-1">{fmtDate(order.createdAt)}</p>
          <p className="mt-0.5">{st[order.status] || order.status}</p>
        </div>
      </div>

      {/* Client */}
      <div className="px-5 py-4 border-b border-[#eee6d8] grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-[#888] uppercase tracking-wider text-[9px] mb-1">Client</p>
          <p className="font-medium">
            {order.customerFirstName} {order.customerLastName}
          </p>
          <p className="text-[#666] mt-0.5">{order.customerPhone}</p>
          {order.customerEmail && (
            <p className="text-[#666]">{order.customerEmail}</p>
          )}
        </div>
        <div>
          <p className="text-[#888] uppercase tracking-wider text-[9px] mb-1">Livraison</p>
          <p className="text-[#444] leading-relaxed">{order.deliveryAddress || "—"}</p>
        </div>
      </div>

      {/* Lignes */}
      <div className="px-5 py-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#eee6d8] text-[#888] text-[9px] uppercase tracking-wider">
              <th className="text-left py-2 font-medium w-10" />
              <th className="text-left py-2 font-medium">Article</th>
              <th className="text-center py-2 font-medium w-12">Qté</th>
              <th className="text-right py-2 font-medium w-24">Montant</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => {
              const lineTotal = (item.price || 0) * (item.quantity || 1);
              const img = item.image;
              return (
                <tr key={i} className="border-b border-[#f5f0ea]">
                  <td className="py-2 pr-2">
                    <div className="w-9 h-9 rounded-md overflow-hidden bg-[#f5f0ea] border border-[#eee6d8]">
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#ccc] text-[8px]">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-2">
                    <p className="font-medium text-[#1a1612]">
                      {item.title || `Produit #${item.id || item.productId}`}
                    </p>
                  </td>
                  <td className="py-2 text-center text-[#666]">{item.quantity || 1}</td>
                  <td className="py-2 text-right font-medium">{fmtPrice(lineTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="px-5 py-4 bg-[#faf7f2] border-t border-[#eee6d8] flex justify-between items-center">
        <p className="text-[10px] text-[#888] uppercase tracking-wider">
          Paiement à la livraison
        </p>
        <div className="text-right">
          <p className="text-[9px] text-[#888] uppercase">Total TTC</p>
          <p className="text-lg font-bold text-[#8a6a42]">{fmtPrice(order.total)}</p>
        </div>
      </div>

      <p className="text-center text-[9px] text-[#aaa] py-2 border-t border-[#eee6d8]">
        Merci pour votre confiance — rassoulshopsn.com
      </p>
    </div>
  );
}

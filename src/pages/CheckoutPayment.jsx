import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function CheckoutPayment() {
  const [params] = useSearchParams();
  const ref = params.get("ref") || params.get("order_id") || "";
  const [state, setState] = useState("loading");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!ref) {
      setState("missing");
      return;
    }
    let cancelled = false;
    fetch(`/api/payments/orange-money/order/${encodeURIComponent(ref)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) {
          setState("error");
          return;
        }
        setOrder(data.order);
        const status = data.order.payment_status;
        if (status === "paid") setState("paid");
        else if (status === "failed") setState("failed");
        else setState("pending");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [ref]);

  return (
    <section className="w-full flex flex-col items-center px-4 pt-24 md:pt-28 pb-16">
      <div className="max-w-sm text-center space-y-4">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto animate-spin text-[#D7A12B]" size={40} />
            <p className="text-sm text-neutral-500">Vérification du paiement…</p>
          </>
        )}
        {state === "paid" && (
          <>
            <CheckCircle size={40} className="mx-auto text-emerald-600" />
            <h1 className="font-serif text-2xl text-[#0a0a0a]">Paiement confirmé</h1>
            <p className="text-sm text-neutral-500">
              Commande {order?.reference} payée par Orange Money.
            </p>
          </>
        )}
        {state === "pending" && (
          <>
            <Loader2 className="mx-auto text-[#D7A12B]" size={40} />
            <h1 className="font-serif text-2xl text-[#0a0a0a]">Paiement en cours</h1>
            <p className="text-sm text-neutral-500">
              Si vous avez payé, le statut sera mis à jour sous peu (commande {ref}).
            </p>
          </>
        )}
        {(state === "failed" || state === "error" || state === "missing") && (
          <>
            <XCircle size={40} className="mx-auto text-red-500" />
            <h1 className="font-serif text-2xl text-[#0a0a0a]">Paiement non confirmé</h1>
            <p className="text-sm text-neutral-500">
              Vous pouvez réessayer ou choisir le paiement à la livraison.
            </p>
          </>
        )}
        <Link
          to="/shop"
          className="inline-block mt-4 px-8 py-3 rounded-full bg-[#D7A12B] text-[#0a0a0a] text-[11px] uppercase tracking-[0.2em] font-bold"
        >
          Retour boutique
        </Link>
      </div>
    </section>
  );
}

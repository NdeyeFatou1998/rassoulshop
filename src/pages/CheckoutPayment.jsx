import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Download, Mail } from "lucide-react";
import { BRAND_LOGO } from "../constants/brand";
import OrangeMoneyLogo from "../components/ui/OrangeMoneyLogo";
import WaveLogo from "../components/ui/WaveLogo";

const PAYMENT_REF_KEY = "rassoul_payment_order_ref";
const OM_REF_KEY = "rassoul_om_order_ref";

function extractOrderRef(...candidates) {
  for (const raw of candidates) {
    const s = String(raw || "").trim();
    if (!s) continue;
    const match = s.match(/\b([A-Fa-f0-9]{8})\b/);
    if (match) return match[1].toUpperCase();
  }
  return "";
}

export default function CheckoutPayment() {
  const { ref: refParam } = useParams();
  const [params] = useSearchParams();
  const storedRef = (() => {
    try {
      return sessionStorage.getItem(PAYMENT_REF_KEY) || sessionStorage.getItem(OM_REF_KEY) || "";
    } catch {
      return "";
    }
  })();

  const ref = extractOrderRef(
    refParam,
    params.get("ref"),
    params.get("order_id"),
    params.get("orderId"),
    params.get("reference"),
    params.get("txnid"),
    params.get("client_reference"),
    storedRef
  );

  const [state, setState] = useState("loading");
  const [order, setOrder] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [invoiceBlob, setInvoiceBlob] = useState(null);
  const [invoiceError, setInvoiceError] = useState("");
  const invoiceUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (invoiceUrlRef.current) URL.revokeObjectURL(invoiceUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!ref) {
      setState("missing");
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20;
    let timer;

    async function check() {
      try {
        const res = await fetch(`/api/payments/order/${encodeURIComponent(ref)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!data.success) {
          setState("error");
          return;
        }
        setOrder(data.order);
        const status = data.order.payment_status;
        if (status === "paid") {
          setState("paid");
          return;
        }
        if (status === "failed") {
          setState("failed");
          return;
        }
        attempts += 1;
        setState("pending");
        if (attempts < maxAttempts) {
          timer = window.setTimeout(check, 3000);
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    check();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [ref]);

  useEffect(() => {
    if (state !== "paid" || !ref) return;
    let cancelled = false;
    setInvoiceError("");
    fetch(`/api/payments/order/${encodeURIComponent(ref)}/invoice`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Impossible de charger la facture");
        }
        const blob = await res.blob();
        return blob.type.includes("pdf")
          ? blob
          : new Blob([await blob.arrayBuffer()], { type: "application/pdf" });
      })
      .then((blob) => {
        if (cancelled) return;
        if (invoiceUrlRef.current) URL.revokeObjectURL(invoiceUrlRef.current);
        const url = URL.createObjectURL(blob);
        invoiceUrlRef.current = url;
        setInvoiceBlob(blob);
        setInvoiceUrl(url);
      })
      .catch((err) => {
        if (!cancelled) setInvoiceError(err.message || "Impossible de charger la facture");
      });
    return () => {
      cancelled = true;
    };
  }, [state, ref]);

  const invoiceDownloadHref = ref
    ? `/api/payments/order/${encodeURIComponent(ref)}/invoice?download=1`
    : "";

  async function handleDownload(e) {
    if (!order?.reference || !invoiceBlob) return;
    const filename = `${order.reference}-facture.pdf`;
    try {
      const file = new File([invoiceBlob], filename, { type: "application/pdf" });
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        e.preventDefault();
        await navigator.share({
          files: [file],
          title: filename,
          text: "Facture Rassoul Shop",
        });
      }
    } catch (err) {
      if (err?.name === "AbortError") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      window.open(invoiceDownloadHref, "_blank", "noopener,noreferrer");
    }
  }

  if (state === "paid") {
    return (
      <section className="w-full flex flex-col items-center px-4 pt-24 md:pt-28 pb-28 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <img src={BRAND_LOGO} alt="Rassoul Shop Sn" className="h-16 w-auto mx-auto mb-5 object-contain" />
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D7A12B] font-semibold mb-2">
              Paiement confirmé
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-3">
              Merci pour votre commande !
            </h1>
            {order?.reference && (
              <p className="text-sm text-neutral-500 mb-3">
                Référence :{" "}
                <span className="text-[#D7A12B] font-semibold font-mono tracking-wider">
                  {order.reference}
                </span>
              </p>
            )}
            <div className="flex justify-center mb-4">
              {order?.payment_method === "wave" ? (
                <WaveLogo className="h-10" />
              ) : (
                <OrangeMoneyLogo className="h-10 w-auto" />
              )}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
              {order?.has_customer_email ? (
                <>
                  <Mail size={14} className="inline mr-1 text-[#D7A12B]" />
                  Votre facture a été envoyée par e-mail. Vous pouvez aussi la consulter
                  et la télécharger ci-dessous avant de fermer cette page.
                </>
              ) : (
                <>
                  Téléchargez votre facture ci-dessous avant de fermer cette page
                  (aucun e-mail n’a été renseigné).
                </>
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden shadow-sm">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-black/[0.08]">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 font-semibold">
                Votre facture
              </p>
              <a
                href={invoiceDownloadHref || undefined}
                download={order?.reference ? `${order.reference}-facture.pdf` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDownload}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D7A12B] text-[#0a0a0a] text-[11px] uppercase tracking-[0.16em] font-bold ${
                  !invoiceBlob && !invoiceDownloadHref ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <Download size={14} />
                Télécharger
              </a>
            </div>
            <div className="bg-neutral-100 min-h-[420px] flex items-center justify-center p-3 md:p-5">
              {!invoiceUrl && !invoiceError && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Loader2 className="animate-spin" size={18} />
                  Chargement de la facture…
                </div>
              )}
              {invoiceError && (
                <p className="text-sm text-red-500 text-center px-4">{invoiceError}</p>
              )}
              {invoiceUrl && (
                <iframe
                  src={`${invoiceUrl}#toolbar=0&navpanes=0`}
                  title={`Facture ${order?.reference || ""}`}
                  className="w-full max-w-[595px] bg-white shadow-lg rounded-md border-0"
                  style={{ height: "min(842px, 75vh)" }}
                />
              )}
            </div>
          </div>

          <div className="md:hidden mt-4">
            <a
              href={invoiceDownloadHref || undefined}
              download={order?.reference ? `${order.reference}-facture.pdf` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#D7A12B] text-[#0a0a0a] text-[12px] uppercase tracking-[0.16em] font-bold"
            >
              <Download size={16} />
              Télécharger / Partager la facture
            </a>
            <p className="text-[11px] text-neutral-500 text-center mt-2 leading-relaxed">
              Sur téléphone, utilisez ce bouton puis « Enregistrer dans Fichiers » ou Partager.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-block px-8 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.2em] font-bold"
            >
              Continuer mes achats
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col items-center px-4 pt-24 md:pt-28 pb-16">
      <div className="max-w-sm text-center space-y-4">
        <img src={BRAND_LOGO} alt="Rassoul Shop Sn" className="h-14 w-auto mx-auto object-contain" />
        {(state === "loading" || state === "pending") && (
          <>
            <Loader2 className="mx-auto animate-spin text-[#D7A12B]" size={40} />
            <h1 className="font-serif text-2xl text-[#0a0a0a]">Confirmation du paiement</h1>
            <p className="text-sm text-neutral-500">
              Merci de patienter, nous vérifions votre paiement
              {ref ? ` (${ref})` : ""}.
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
          to="/checkout"
          className="inline-block mt-4 px-8 py-3 rounded-full bg-[#D7A12B] text-[#0a0a0a] text-[11px] uppercase tracking-[0.2em] font-bold"
        >
          Retour au paiement
        </Link>
      </div>
    </section>
  );
}

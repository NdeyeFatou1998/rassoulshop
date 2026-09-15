/** True si le navigateur ignore souvent l’attribut download (iOS / mobile) */
function prefersNativeShareForDownload() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  return iOS || android;
}

/**
 * Télécharge un Blob.
 * Sur iOS/Android : feuille de partage (« Enregistrer dans Fichiers »)
 * car download ouvre souvent le PDF au lieu de le sauver.
 */
export async function downloadBlobAsFile(blob, filename) {
  const safeName = String(filename || "facture.pdf").endsWith(".pdf")
    ? String(filename || "facture.pdf")
    : `${filename}.pdf`;
  const pdfBlob =
    blob.type && blob.type.includes("pdf")
      ? blob
      : new Blob([blob], { type: "application/pdf" });

  if (prefersNativeShareForDownload()) {
    try {
      const file = new File([pdfBlob], safeName, { type: "application/pdf" });
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: safeName,
          text: "Facture Rassoul Shop",
        });
        return;
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
    }
  }

  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = safeName;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1500);
}

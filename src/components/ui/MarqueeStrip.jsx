/**
 * MarqueeStrip — Bande de textes marketing défilants
 */

const MESSAGES = [
  "Livraison soignée au Sénégal",
  "Emballage cadeau offert",
  "Personnalisation sur demande",
  "Qualité garantie",
  "L'art d'offrir — Rassoul",
  "Coffrets VIP disponibles",
  "Peluches · Montres · Bijoux",
  "Cadeaux uniques & mémorables",
];

export default function MarqueeStrip() {
  const items = [...MESSAGES, ...MESSAGES];

  return (
    <div className="overflow-hidden py-3 select-none" style={{ background: "#1c160e", borderTop: "1px solid rgba(197,165,90,0.20)", borderBottom: "1px solid rgba(197,165,90,0.20)" }}>
      <div className="flex whitespace-nowrap marquee-track">
        {items.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 text-[9px] uppercase tracking-[0.26em] font-semibold px-5" style={{ color: "rgba(212,186,120,0.85)" }}
          >
            {msg}
            <span className="text-[7px]" style={{ color: "#C5A55A" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

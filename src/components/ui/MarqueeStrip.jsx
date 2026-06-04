/**
 * MarqueeStrip — Bande marketing gold luisante, texte prononcé
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
    <div
      className="overflow-hidden py-2 select-none"
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex whitespace-nowrap marquee-track">
        {items.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-3.5"
            style={{ fontSize: "8.5px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}
          >
            {/* Texte avec gradient gold */}
            <span
              style={{
                background: "linear-gradient(90deg, #BF953F 0%, #FCF6BA 40%, #C8A84B 60%, #BF953F 100%)",
                backgroundSize: "300% 100%",
                animation: "goldShine 4s ease-in-out infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {msg}
            </span>
            <span style={{ color: "#C8A84B", fontSize: "6px" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

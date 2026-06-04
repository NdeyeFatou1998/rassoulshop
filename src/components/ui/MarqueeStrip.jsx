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
      className="overflow-hidden py-3.5 select-none"
      style={{
        background: "linear-gradient(90deg, #1a1408 0%, #221a0c 50%, #1a1408 100%)",
        borderTop: "1px solid rgba(197,165,90,0.30)",
        borderBottom: "1px solid rgba(197,165,90,0.30)",
      }}
    >
      <div className="flex whitespace-nowrap marquee-track">
        {items.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-5"
            style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700 }}
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
            <span style={{ color: "#C8A84B", fontSize: "8px" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

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

export default function MarqueeStrip({ lightBackground = false }) {
  const items = [...MESSAGES, ...MESSAGES];

  return (
    <div
      className="overflow-hidden py-2 select-none"
      style={{
        background: lightBackground ? "#fafafa" : "linear-gradient(90deg, #1c1108 0%, #2a1305 50%, #1c1108 100%)",
        borderTop: lightBackground ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(215,161,43,0.14)",
        borderBottom: lightBackground ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(215,161,43,0.14)",
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
                background: "linear-gradient(90deg, #B5811E 0%, #FCE9A8 40%, #D7A12B 60%, #B5811E 100%)",
                backgroundSize: "300% 100%",
                animation: "goldShine 4s ease-in-out infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {msg}
            </span>
            <span style={{ color: "#D7A12B", fontSize: "6px" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

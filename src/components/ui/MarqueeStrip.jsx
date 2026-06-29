/**
 * MarqueeStrip — Bande marketing (clair, sombre ou premium)
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

export default function MarqueeStrip({ lightBackground = false, variant = "auto" }) {
  const isDark = variant === "dark" || (!lightBackground && variant === "auto");
  const items = [...MESSAGES, ...MESSAGES];

  return (
    <div
      className="overflow-hidden py-2.5 select-none"
      style={{
        background: isDark
          ? "linear-gradient(90deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)"
          : "linear-gradient(90deg, #FFF8EE 0%, #F8F0E0 50%, #FFF8EE 100%)",
        borderTop: isDark ? "1px solid rgba(215,161,43,0.28)" : "1px solid rgba(215,161,43,0.22)",
        borderBottom: isDark ? "1px solid rgba(215,161,43,0.28)" : "1px solid rgba(215,161,43,0.22)",
      }}
    >
      <div className="flex whitespace-nowrap marquee-track">
        {items.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-4"
            style={{
              fontSize: isDark ? "9px" : "8.5px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <span
              style={
                isDark
                  ? { color: "#F3CF5C" }
                  : {
                      background: "linear-gradient(90deg, #B5811E 0%, #FCE9A8 40%, #D7A12B 60%, #B5811E 100%)",
                      backgroundSize: "300% 100%",
                      animation: "goldShine 4s ease-in-out infinite",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
              }
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

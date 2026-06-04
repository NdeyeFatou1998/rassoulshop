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
    <div className="bg-[#141210] border-y border-white/[0.08] overflow-hidden py-3 select-none">
      <div className="flex whitespace-nowrap marquee-track">
        {items.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 text-[9px] uppercase tracking-[0.26em] text-white/60 font-medium px-5"
          >
            {msg}
            <span className="text-gold/55 text-[7px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

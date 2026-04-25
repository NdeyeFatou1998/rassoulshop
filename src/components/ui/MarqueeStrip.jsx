/**
 * MarqueeStrip — Bande de textes marketing défilants
 *
 * Design premium minimal :
 * - Fond très sombre avec bordures discrètes
 * - Texte en uppercase + tracking large
 * - Séparateur ✦ doré
 * - Défilement infini (animation CSS marquee existante)
 */

/* Messages marketing de la marque */
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
  /* Dupliquer les messages pour le loop seamless */
  const items = [...MESSAGES, ...MESSAGES];

  return (
    <div className="bg-[#0c0b09] border-y border-white/[0.05] overflow-hidden py-3 select-none">
      <div className="flex whitespace-nowrap marquee-track">
        {items.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 text-[9px] uppercase tracking-[0.26em] text-white/28 font-medium px-5"
          >
            {msg}
            <span className="text-gold/35 text-[7px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

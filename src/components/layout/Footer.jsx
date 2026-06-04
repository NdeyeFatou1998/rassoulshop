/**
 * Footer — Logo RSN2, dégradé gold/black, textes lisibles
 */

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]" style={{ background: "#030303" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-16">

        {/* Ligne décorative dorée */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <span className="text-gold/50 text-[9px]">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
          {/* Logo + accroche */}
          <div className="space-y-4">
            <img
              src="/assets/images/RSN2.png"
              alt="Rassoul Shop Sn"
              className="h-16 w-auto object-contain"
              style={{ filter: "drop-shadow(0 0 8px rgba(197,165,90,0.35))" }}
            />
            <p className="text-[12px] text-white/65 max-w-xs leading-relaxed">
              Boutique cadeau premium au Sénégal.<br />Peluches, montres, bijoux et coffrets sur mesure.
            </p>
            <p className="text-[11px] text-gold/70 font-medium">
              📞 77 913 15 15 / 77 294 80 37
            </p>
          </div>

          {/* Liens */}
          <div className="flex gap-12 md:gap-16">
            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold">
                Boutique
              </span>
              {[
                { label: "Accueil", path: "/" },
                { label: "Boutique", path: "/shop" },
                { label: "Coffrets", path: "/gift-boxes" },
                { label: "Lookbook", path: "/lookbook" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-[12px] text-white/65 hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold">
                Contact
              </span>
              <p className="text-[12px] text-white/65">Dakar, Sénégal</p>
              <p className="text-[12px] text-white/65">Instagram</p>
              <p className="text-[12px] text-white/65">WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-5" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-white/45">
          <span>&copy; {new Date().getFullYear()} Rassoul Shop Sn — Tous droits réservés</span>
          <span className="text-gold/50">Dakar, Sénégal</span>
        </div>
      </div>
    </footer>
  );
}

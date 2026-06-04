/**
 * Composant Footer — Pied de page Rassoul Shop
 * 
 * Design luxe minimal :
 * - Logo + accroche
 * - Liens navigation et contact
 * - Copyright
 */

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0c0b09] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-16">
        {/* ---- Haut : Logo + Liens ---- */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">
          {/* Logo et accroche */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl tracking-[0.06em]">
              <span className="text-white">RASSOUL</span><span className="text-gold ml-[5px]">SHOP</span>
            </h3>
            <p className="text-[12px] text-cream/60 max-w-xs leading-relaxed">
              Boutique cadeau premium au Sénégal. Peluches, montres, bijoux et coffrets sur mesure.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="flex gap-12 md:gap-16">
            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-[0.2em] text-gold/70 font-semibold">
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
                  className="block text-[12px] text-cream/60 hover:text-cream transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-[0.2em] text-gold/70 font-semibold">
                Contact
              </span>
              <p className="text-[12px] text-cream/60">Dakar, Sénégal</p>
              <p className="text-[12px] text-cream/60">Instagram</p>
              <p className="text-[12px] text-cream/60">WhatsApp</p>
            </div>
          </div>
        </div>

        {/* ---- Séparateur ---- */}
        <div className="h-px bg-white/[0.07] mb-5" />

        {/* ---- Copyright ---- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-cream/45">
          <span>&copy; {new Date().getFullYear()} Rassoul Shop — Tous droits réservés</span>
          <span>Dakar, Sénégal</span>
        </div>
      </div>
    </footer>
  );
}

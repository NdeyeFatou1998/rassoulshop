/**
 * Composant Footer - Pied de page premium
 * 
 * Design minimaliste et élégant :
 * - Ligne séparatrice dorée subtile
 * - Logo + liens rapides
 * - Section newsletter (placeholder)
 * - Copyright avec année dynamique
 * - Espacement généreux, typographie fine
 */

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] mt-16 md:mt-24">
      <div className="w-full px-5 md:px-12 lg:px-20 py-10 md:py-14">
        {/* ---- Section supérieure : Logo + Navigation ---- */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-10 mb-10">
          {/* Logo et accroche */}
          <div className="space-y-2.5">
            <h3 className="font-serif text-xl text-cream">Rassoul</h3>
            <div className="gold-line" />
            <p className="text-[12px] text-muted/60 max-w-xs leading-relaxed">
              Maison e-commerce premium.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="flex gap-10 md:gap-14">
            <div className="space-y-2.5">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gold/70 font-semibold">
                Navigation
              </span>
              {[
                { label: "Accueil", path: "/" },
                { label: "Boutique", path: "/shop" },
                { label: "Lookbook", path: "/lookbook" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-[12px] text-muted/50 hover:text-cream transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-2.5">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gold/70 font-semibold">
                Contact
              </span>
              <p className="text-[12px] text-muted/50">contact@rassoulshop.com</p>
              <p className="text-[12px] text-muted/50">Instagram</p>
              <p className="text-[12px] text-muted/50">WhatsApp</p>
            </div>
          </div>
        </div>

        {/* ---- Séparateur fin ---- */}
        <div className="h-px bg-white/[0.04] mb-5" />

        {/* ---- Section copyright ---- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-muted/40">
          <span>&copy; {new Date().getFullYear()} Rassoul Shop</span>
          <span>Maison premium digitale</span>
        </div>
      </div>
    </footer>
  );
}

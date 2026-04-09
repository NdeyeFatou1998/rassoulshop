/**
 * Page de connexion Admin — /admin/login
 *
 * Formulaire email + mot de passe avec design premium noir/doré.
 * Redirige vers /admin/dashboard après connexion réussie.
 * Si déjà connecté, redirige automatiquement.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { loginUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Rediriger si déjà connecté */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  /** Soumettre le formulaire de connexion */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Conteneur principal avec bordure dorée subtile */}
      <div className="w-full max-w-md">
        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#f5f0e8] tracking-wider mb-2">
            Rassoul Shop
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A55A]">
            Administration
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-[#141414] border border-[#C5A55A]/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-medium text-[#f5f0e8] mb-6">
            Connexion
          </h2>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Champ Email */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                placeholder="admin@rassoulshop.com"
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A55A]/70 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] placeholder-[#555] focus:border-[#C5A55A] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C5A55A] text-[#0a0a0a] font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-[#D4B56E] disabled:opacity-50 transition-all duration-300"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        {/* Lien retour site */}
        <p className="text-center mt-6 text-[#555] text-xs">
          <a href="/" className="hover:text-[#C5A55A] transition-colors">
            ← Retour au site
          </a>
        </p>
      </div>
    </div>
  );
}

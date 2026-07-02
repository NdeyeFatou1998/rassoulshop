/**
 * Page de connexion Admin — design premium aligné site public
 */

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BRAND_LOGO } from "../../constants/brand";

export default function AdminLogin() {
  const { loginUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen admin-premium flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D7A12B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

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
    <div className="min-h-screen admin-premium flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={BRAND_LOGO}
            alt="Rassoul Shop Sn"
            className="h-20 w-auto mx-auto mb-4 object-contain"
            style={{ filter: "drop-shadow(0 0 12px rgba(215,161,43,0.35))" }}
          />
          <p className="text-xs uppercase tracking-[0.3em] text-[#8B6914] font-semibold">
            Administration
          </p>
        </div>

        <div className="admin-card p-8">
          <h2 className="text-lg font-semibold text-[#0a0a0a] mb-6">Connexion</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="admin-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-input"
                placeholder="admin@rassoulshop.com"
              />
            </div>

            <div>
              <label className="admin-label">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D7A12B] text-[#0a0a0a] font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-[#E8B945] disabled:opacity-50 transition-all duration-300"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-neutral-400 text-xs">
          <a href="/" className="hover:text-[#D7A12B] transition-colors">
            ← Retour au site
          </a>
        </p>
      </div>
    </div>
  );
}

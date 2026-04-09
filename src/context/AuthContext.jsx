/**
 * AuthContext — Gestion globale de l'authentification admin
 *
 * Fournit à l'application :
 *   - user          : objet utilisateur connecté (ou null)
 *   - token         : JWT stocké en localStorage
 *   - isAuthenticated : booléen rapide
 *   - loginUser(email, pwd) : connexion
 *   - logoutUser()  : déconnexion
 *   - refreshUser() : recharger les infos utilisateur
 *
 * Persiste le token en localStorage sous "rassoul_admin_token".
 */

import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, getMe } from "../services/adminApi";

const AuthContext = createContext();

/** Hook raccourci pour accéder au contexte auth */
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("rassoul_admin_token"));
  const [loading, setLoading] = useState(true);

  /** Au montage, vérifier si un token existe et récupérer les infos user */
  useEffect(() => {
    async function init() {
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch {
          /* Token invalide ou expiré → déconnexion */
          localStorage.removeItem("rassoul_admin_token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    init();
  }, [token]);

  /** Connexion : appelle l'API puis stocke token + user */
  async function loginUser(email, password) {
    const data = await apiLogin(email, password);
    localStorage.setItem("rassoul_admin_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  /** Déconnexion : supprime le token et l'user */
  function logoutUser() {
    localStorage.removeItem("rassoul_admin_token");
    setToken(null);
    setUser(null);
  }

  /** Recharger les infos utilisateur depuis l'API */
  async function refreshUser() {
    if (token) {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch {
        logoutUser();
      }
    }
  }

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        loginUser,
        logoutUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

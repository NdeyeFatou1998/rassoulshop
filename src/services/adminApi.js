/**
 * Service API Admin — Communication authentifiée avec le backend
 *
 * Centralise tous les appels HTTP admin vers l'API REST.
 * Chaque requête inclut automatiquement le token JWT dans les headers.
 *
 * Modules :
 *   - Auth      : login, me, changePassword
 *   - Users     : CRUD admins/assistants
 *   - Products  : CRUD produits + variantes
 *   - Lookbook  : CRUD médias
 *   - About     : CRUD sections + images
 *   - Orders    : liste, détail, update statut, stats
 */

const API_BASE = "/api";

/* ------------------------------------------------------------------ */
/*  Helpers — Requêtes avec token JWT                                  */
/* ------------------------------------------------------------------ */

/** Récupère le token JWT stocké en localStorage */
function getToken() {
  return localStorage.getItem("rassoul_admin_token");
}

/** Headers standard avec Authorization Bearer */
function authHeaders(extra = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/** Headers pour upload multipart (pas de Content-Type, multer gère) */
function authHeadersMultipart() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Requête générique avec gestion d'erreur */
async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Erreur ${response.status}`);
  }
  return data;
}

/* ================================================================== */
/*  AUTH                                                                */
/* ================================================================== */

/** POST /api/auth/login — Connexion admin */
export async function login(email, password) {
  return apiRequest(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/** GET /api/auth/me — Infos utilisateur connecté */
export async function getMe() {
  return apiRequest(`${API_BASE}/auth/me`, {
    headers: authHeaders(),
  });
}

/** PUT /api/auth/change-password — Changer son mot de passe */
export async function changePassword(currentPassword, newPassword) {
  return apiRequest(`${API_BASE}/auth/change-password`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/* ================================================================== */
/*  USERS                                                              */
/* ================================================================== */

/** GET /api/users — Liste des utilisateurs */
export async function fetchUsers() {
  return apiRequest(`${API_BASE}/users`, { headers: authHeaders() });
}

/** POST /api/users — Créer un utilisateur */
export async function createUser(userData) {
  return apiRequest(`${API_BASE}/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  });
}

/** PUT /api/users/:id — Modifier un utilisateur */
export async function updateUser(id, userData) {
  return apiRequest(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  });
}

/** DELETE /api/users/:id — Supprimer un utilisateur */
export async function deleteUser(id) {
  return apiRequest(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/* ================================================================== */
/*  PRODUCTS                                                           */
/* ================================================================== */

/** GET /api/products — Liste des produits */
export async function fetchAdminProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`${API_BASE}/products${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(),
  });
}

/** GET /api/products/:id — Détail d'un produit */
export async function fetchAdminProduct(id) {
  return apiRequest(`${API_BASE}/products/${id}`, {
    headers: authHeaders(),
  });
}

/** POST /api/products — Créer un produit (JSON) */
export async function createProduct(productData) {
  return apiRequest(`${API_BASE}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
}

/** PUT /api/products/:id — Modifier un produit (JSON) */
export async function updateProduct(id, productData) {
  return apiRequest(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
}

/** DELETE /api/products/:id — Supprimer un produit */
export async function deleteProduct(id) {
  return apiRequest(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/** POST /api/products/:id/variants — Ajouter une variante */
export async function addVariant(productId, variantData) {
  return apiRequest(`${API_BASE}/products/${productId}/variants`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(variantData),
  });
}

/** DELETE /api/products/variants/:vid — Supprimer une variante */
export async function deleteVariant(vid) {
  return apiRequest(`${API_BASE}/products/variants/${vid}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/** GET /api/products/promos — Produits en promo */
export async function fetchPromos() {
  return apiRequest(`${API_BASE}/products/promos`);
}

/* ================================================================== */
/*  LOOKBOOK                                                           */
/* ================================================================== */

/** GET /api/lookbook — Liste des médias */
export async function fetchLookbook() {
  return apiRequest(`${API_BASE}/lookbook`);
}

/** POST /api/lookbook — Ajouter un média (FormData avec fichier) */
export async function createLookbookItem(formData) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/lookbook`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Erreur upload");
  return data;
}

/** PUT /api/lookbook/:id — Modifier un média */
export async function updateLookbookItem(id, data) {
  return apiRequest(`${API_BASE}/lookbook/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

/** DELETE /api/lookbook/:id — Supprimer un média */
export async function deleteLookbookItem(id) {
  return apiRequest(`${API_BASE}/lookbook/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/* ================================================================== */
/*  ABOUT                                                              */
/* ================================================================== */

/** GET /api/about — Sections À Propos */
export async function fetchAbout() {
  return apiRequest(`${API_BASE}/about`);
}

/** POST /api/about — Créer une section */
export async function createAboutSection(data) {
  return apiRequest(`${API_BASE}/about`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

/** PUT /api/about/:id — Modifier une section */
export async function updateAboutSection(id, data) {
  return apiRequest(`${API_BASE}/about/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

/** DELETE /api/about/:id — Supprimer une section */
export async function deleteAboutSection(id) {
  return apiRequest(`${API_BASE}/about/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/** POST /api/about/:id/images — Ajouter une image (FormData) */
export async function addAboutImage(sectionId, formData) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/about/${sectionId}/images`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Erreur upload");
  return data;
}

/** DELETE /api/about/images/:imgId — Supprimer une image */
export async function deleteAboutImage(imgId) {
  return apiRequest(`${API_BASE}/about/images/${imgId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/* ================================================================== */
/*  ORDERS                                                             */
/* ================================================================== */

/** GET /api/orders — Liste des commandes */
export async function fetchOrders(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`${API_BASE}/orders${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(),
  });
}

/** GET /api/orders/:id — Détail d'une commande */
export async function fetchOrder(id) {
  return apiRequest(`${API_BASE}/orders/${id}`, {
    headers: authHeaders(),
  });
}

/** PUT /api/orders/:id — Modifier le statut */
export async function updateOrderStatus(id, status) {
  return apiRequest(`${API_BASE}/orders/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
}

/** DELETE /api/orders/:id — Supprimer */
export async function deleteOrder(id) {
  return apiRequest(`${API_BASE}/orders/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/** GET /api/orders/stats/summary — Statistiques */
export async function fetchDashboardStats() {
  return apiRequest(`${API_BASE}/orders/stats/summary`, {
    headers: authHeaders(),
  });
}

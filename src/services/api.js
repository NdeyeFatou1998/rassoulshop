/**
 * Service API - Communication avec le backend Rassoul Shop
 * 
 * Centralise tous les appels HTTP vers l'API REST Express.
 * En développement, les requêtes sont proxifiées via Vite (vite.config.js).
 * En production, utilise l'URL de base configurée.
 * 
 * Fonctions disponibles :
 * - fetchProducts()       → Liste des produits (avec filtres)
 * - fetchProductById(id)  → Détail d'un produit
 * - fetchCategories()     → Liste des catégories
 */

/* URL de base de l'API - en dev, Vite proxy vers localhost:3001 */
const API_BASE = "/api";

/**
 * Récupère la liste des produits depuis l'API
 * @param {Object} options - Options de filtrage
 * @param {string} [options.category] - Filtrer par catégorie
 * @param {number} [options.limit] - Limiter le nombre de résultats
 * @param {string} [options.sort] - Trier (ex: "price", "-rating")
 * @returns {Promise<Array>} Liste des produits
 */
export async function fetchProducts({ category, limit, sort } = {}) {
  try {
    /* Construction dynamique des paramètres de query */
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (limit) params.set("limit", String(limit));
    if (sort) params.set("sort", sort);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`${API_BASE}/products${query}`);

    if (!response.ok) throw new Error("API indisponible");

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.warn("API indisponible:", error.message);
    return [];
  }
}

/**
 * Récupère un produit par son ID
 * @param {number} id - ID du produit
 * @returns {Promise<Object>} Détail du produit
 */
export async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error("Produit introuvable");
    return await response.json();
  } catch (error) {
    console.warn("Erreur récupération produit:", error.message);
    return null;
  }
}

/**
 * Récupère la liste des catégories disponibles
 * @returns {Promise<Array<string>>} Liste des catégories
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/products/categories`);
    if (!response.ok) throw new Error("Catégories indisponibles");
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.warn("Erreur catégories:", error.message);
    return ["peluches", "montres", "bijoux", "sets-cadeau", "sacs", "accessoires"];
  }
}


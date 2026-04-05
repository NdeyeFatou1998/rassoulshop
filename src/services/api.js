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
    console.warn("API indisponible, utilisation des données de secours:", error.message);
    /* Données de secours si le backend est hors ligne */
    return getFallbackProducts();
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
    return ["sets", "robes", "vestes", "collections", "classiques", "casual", "manteaux"];
  }
}

/**
 * Données de secours si le backend est hors ligne
 * Permet au frontend de fonctionner en mode autonome
 */
function getFallbackProducts() {
  return [
    { id: 1, title: "Set Prestige Minimal", description: "Ensemble élégant premium pour sorties et événements.", price: 25000, rating: 4.8, category: "sets", image: "/assets/images/product-01.jpeg", badge: "Nouveau" },
    { id: 2, title: "Robe Signature Gold", description: "Silhouette raffinée et détails couture modernes.", price: 35000, rating: 4.9, category: "robes", image: "/assets/images/product-02.jpeg", badge: "Best-seller" },
    { id: 3, title: "Veste Urban Luxe", description: "Design urbain avec finition haut de gamme.", price: 28000, rating: 4.7, category: "vestes", image: "/assets/images/product-03.jpeg", badge: null },
    { id: 4, title: "Pack Everyday Premium", description: "Pièces polyvalentes pour un look chic quotidien.", price: 22000, rating: 4.6, category: "sets", image: "/assets/images/product-04.jpeg", badge: null },
    { id: 5, title: "Collection Night Edition", description: "Sélection pensée pour les soirées élégantes.", price: 42000, rating: 4.9, category: "collections", image: "/assets/images/product-05.jpeg", badge: "Édition limitée" },
    { id: 6, title: "Classique Intemporel", description: "Style sobre et premium qui traverse les saisons.", price: 18000, rating: 4.5, category: "classiques", image: "/assets/images/product-06.jpeg", badge: null },
    { id: 7, title: "Look Weekend Elite", description: "Confort premium et coupe soignée pour le week-end.", price: 15000, rating: 4.4, category: "casual", image: "/assets/images/product-07.jpeg", badge: null },
    { id: 8, title: "Capsule Rassoul Black", description: "Palette sombre et détails modernes de caractère.", price: 32000, rating: 4.8, category: "collections", image: "/assets/images/product-08.jpeg", badge: "Exclusif" },
  ];
}

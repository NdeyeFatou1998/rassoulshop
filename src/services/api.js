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
    return ["peluches", "montres", "bijoux", "sets-cadeau", "sacs", "accessoires"];
  }
}

/**
 * Données de secours si le backend est hors ligne
 * Permet au frontend de fonctionner en mode autonome
 */
function getFallbackProducts() {
  return [
    { id: 1, title: "Peluche Personnalisee Geante", description: "Peluche geante brodee au prenom de votre choix.", price: 15000, rating: 4.9, category: "peluches", image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.08.jpeg", badge: "Best-seller" },
    { id: 2, title: "Bracelet Couple Grave", description: "Paire de bracelets argentes graves au prenom.", price: 8000, rating: 4.6, category: "bijoux", image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.09.jpeg", badge: null },
    { id: 3, title: "Set Cadeau Beige Premium", description: "Coffret cuir beige complet.", price: 30000, rating: 4.8, category: "sets-cadeau", image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.10.jpeg", badge: "Best-seller" },
    { id: 4, title: "Set Cadeau Vert Elegant", description: "Coffret cuir vert complet.", price: 32000, rating: 4.7, category: "sets-cadeau", image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.11.jpeg", badge: null },
    { id: 5, title: "Set Cadeau Gris Anthracite", description: "Coffret cuir gris fonce.", price: 28000, rating: 4.7, category: "sets-cadeau", image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.12.jpeg", badge: null },
    { id: 6, title: "Peluche Boss Lady Bouquet", description: "Coffret peluche avec bouquet de roses.", price: 25000, rating: 4.8, category: "peluches", image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.15.jpeg", badge: "Exclusif" },
    { id: 7, title: "Montre Automatique Classique", description: "Montres automatiques bracelet cuir premium.", price: 35000, rating: 4.9, category: "montres", image: "/assets/images/WhatsApp Image 2026-03-24 at 01.27.58.jpeg", badge: "Nouveau" },
    { id: 8, title: "Set Montre Bijoux Or", description: "Montre doree avec collier Van Cleef style.", price: 38000, rating: 4.8, category: "montres", image: "/assets/images/WhatsApp Image 2026-03-24 at 01.34.16.jpeg", badge: null },
  ];
}

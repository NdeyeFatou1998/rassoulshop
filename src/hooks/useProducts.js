/**
 * Hook personnalisé useProducts
 * 
 * Gère le chargement des produits depuis l'API avec :
 * - État de chargement (loading)
 * - Gestion d'erreur (error)
 * - Cache des données (products)
 * - Filtrage par catégorie
 * 
 * Usage :
 *   const { products, loading, error } = useProducts({ limit: 8 });
 *   const { products } = useProducts({ category: "robes" });
 */

import { useState, useEffect } from "react";
import { fetchProducts } from "../services/api";

export function useProducts(options = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts(options);
        /* Vérifie que le composant est toujours monté avant de mettre à jour */
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    /* Cleanup : annule la mise à jour si le composant est démonté */
    return () => {
      cancelled = true;
    };
  }, [options.category, options.limit, options.sort]);

  return { products, loading, error };
}

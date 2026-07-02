/**
 * Page Shop — Boutique premium (même design que l'accueil)
 */

import { useSearchParams, Navigate } from "react-router-dom";
import FilterableProductGrid from "../components/sections/FilterableProductGrid";
import { BOITES_VIP_SLUG } from "../constants/categories";

const COFFRETS_CATEGORY = "sets-cadeau";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || null;

  if (initialCategory === COFFRETS_CATEGORY) {
    return <Navigate to="/coffrets" replace />;
  }

  if (initialCategory === BOITES_VIP_SLUG) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <FilterableProductGrid
      limit={100}
      defaultCategory={initialCategory}
      showFilters
      lightBackground
      premium
      showPageHeader
      pageTitle="Boutique"
      pageBreadcrumb="Accueil · Boutique"
      pageSubtitle="Explorez toute notre collection"
      showPromoCards={false}
    />
  );
}

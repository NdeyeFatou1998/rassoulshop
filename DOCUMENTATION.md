# Documentation — Frontend RassoulShop

## Architecture

Le dépôt GitHub contient uniquement le **frontend** (React + Vite).

- `src/` : application React
- `public/assets/` : images et vidéos servis en statique
- `.github/workflows/` : CI/CD GitHub Actions

## CI/CD (GitHub Actions)

### 1) CI — Build

Workflow : `.github/workflows/ci.yml`

Déclenchement :
- `pull_request`
- `push` sur `main`

Étapes :
- checkout du code
- installation via `npm ci`
- build via `npm run build`

Objectif : garantir que le build Vite passe à chaque PR et sur `main`.

## Déploiement (Vercel)

Le déploiement se fait via **l’intégration Git Vercel** (pas via un workflow GitHub Actions Vercel).

Principe :
- Chaque `push` sur la branche `main` déclenche un build Vercel.
- Vercel exécute `npm ci` puis `npm run build`.

## Secrets GitHub requis

À configurer dans GitHub :

`Repository` -> `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

- `VERCEL_TOKEN`
  - Token Vercel (compte qui a accès au projet)
- `VERCEL_ORG_ID`
  - ID de l’organisation/compte Vercel
- `VERCEL_PROJECT_ID`
  - ID du projet Vercel

### Où trouver `VERCEL_ORG_ID` et `VERCEL_PROJECT_ID`

Méthode simple :
- En local, dans le dossier du frontend, lancer :
  - `vercel link`
- Puis regarder le fichier généré : `.vercel/project.json`
  - `orgId`
  - `projectId`

## Notes

- Les assets sont servis depuis `public/assets`, donc ils sont accessibles via des URLs du type :
  - `/assets/images/...`
  - `/assets/videos/...`
- Le backend n’est pas déployé dans ce pipeline. Si tu veux un pipeline full-stack, il faudra ajouter un workflow backend séparé.

## Pages clés

### Home (`src/pages/Home.jsx`)

Sections principales :
- `PromoBanner`
- `Hero`
- `CategoryCircles` (défilement horizontal)
- `ProductGrid` (sélection)
- `Experience`

Note : la section `Editorial` (cards Éditorial/Direction/Capsule) est supprimée de la Home.

### Shop (`src/pages/Shop.jsx`)

La boutique affiche les produits :
- **par catégorie**, une section par catégorie
- chaque section utilise `ShopCategoryCarousel` (carrousel horizontal de `ProductCard`)

Paramètre URL :
- `/shop?category=<cat>` : n’affiche qu’une seule catégorie.

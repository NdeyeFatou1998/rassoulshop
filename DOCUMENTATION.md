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

### 2) CD — Déploiement Vercel

Workflow : `.github/workflows/vercel.yml`

Déclenchement :
- `pull_request` : déploie en **Preview**
- `push` sur `main` : déploie en **Production**

Principe :
- Installation `vercel` CLI
- `vercel pull` pour récupérer la configuration du projet
- `vercel build`
- `vercel deploy --prebuilt`
  - en PR : preview
  - sur `main` : `--prod`

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

# OTP Hora — application web (Next.js)

Interface web **Next.js 15 (App Router)**, **TypeScript strict**, **Tailwind CSS**, **TanStack Query**, **React Hook Form** et **Zod**, conforme à `OTP_HORA_WEB_SPEC.md` à la racine du dépôt parent.

## Prérequis

- Node.js 20+
- npm (ou pnpm / yarn)

## Configuration

1. Copier les variables d’environnement :

   ```bash
   cp .env.example .env.local
   ```

2. Renseigner `NEXT_PUBLIC_API_BASE_URL` (base API **sans** slash final) et, pour la production, `NEXT_PUBLIC_SITE_URL` (URL canonique du site, utilisée pour `sitemap.xml` et `robots.txt`).

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```

## Session et middleware

- Le **jeton d’accès** est stocké dans **sessionStorage** (pas de PIN en clair).
- Un cookie léger **`otp_hora_auth=1`** (non httpOnly) est posé à la connexion pour que le **middleware** puisse rediriger les routes protégées vers `/login` sans exécuter de JavaScript. Il est synchronisé avec la session côté client (voir `src/lib/auth/session.ts`).
- Pour une session **httpOnly** et une sécurité renforcée, prévoir des **Route Handlers** ou un **BFF** (spec §6.5 / §7).

## Alignement API

Les chemins sont centralisés dans `src/lib/api/endpoints.ts`. Les corps de requête réels doivent être validés avec le backend et le client Flutter (`lib/core/network/endpoints.dart`, datasources) lorsque le dépôt mobile est disponible.

## Structure

Projet dans le dossier `web/` pour garder les documents de spec à la racine du dépôt.

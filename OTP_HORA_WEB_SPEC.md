# OTP Hora — Application Web (Next.js)

Document de spécification technique et guide de développement pour la **version web** d’OTP Hora.  
À utiliser comme référence unique pour Cursor, l’équipe et la revue de code.  
**Alignement** : cohérence avec l’app mobile Flutter (identité visuelle, endpoints API, parcours métier décrits dans `PROJECT_SPEC.md`).

---

## 1. Présentation du projet

### 1.1 Description

**Otp Hora (Web)** est l’interface navigateur du produit OTP Hora : authentification par validation utilisateur, gestion de compte, appareils, contacts et liaisons avec des entreprises, en s’appuyant sur le **même backend** que l’application mobile.

### 1.2 Objectifs

- Offrir une expérience **web professionnelle**, **rapide** et **accessible**.
- Reprendre l’**identité visuelle** de l’app mobile (palette, ton, sobriété).
- Respecter les **mêmes règles métier et API** que le client Flutter pour éviter la dette fonctionnelle.
- Préparer une base **scalable** (nouvelles pages, i18n, rôles éventuels).

### 1.3 Cible utilisateur

- Utilisateurs finaux gérant leur compte OTP Hora depuis un navigateur (desktop / tablette / mobile).
- Contextes professionnels : UI sobre, lisible, peu de distractions.

### 1.4 Contraintes

| Domaine | Exigence |
|--------|----------|
| Design | Minimaliste, aligné sur le design system mobile (voir §4). |
| Performance | Core Web Vitals dans le vert sur pages critiques (LCP, CLS, INP). |
| Accessibilité | WCAG 2.1 niveau AA visé (contraste, focus, clavier, labels). |
| Sécurité | HTTPS, pas de secrets en client, tokens gérés proprement (voir §7). |
| Compatibilité | Navigateurs modernes (dernières 2 versions Chrome, Firefox, Safari, Edge). |

---

## 2. Stack technique

| Couche | Choix | Notes |
|--------|--------|------|
| Framework | **Next.js** (recommandé : **15.x** avec **App Router**) | RSC / Server Actions selon besoins ; pas de Pages Router pour le nouveau code. |
| Langage | **TypeScript** (strict : `"strict": true`) | Obligatoire pour tout le code applicatif. |
| Styling | **Tailwind CSS** (v4 ou 3.x selon boilerplate) + **tokens sémantiques** (couleurs dans `tailwind.config`) | Cohérence avec la charte ; éviter le CSS inline sauf cas exceptionnels. |
| Composants UI | **React 19** (si supporté par la version Next choisie) | Préférer composants contrôlés et accessibles. |
| State | **React Server State** (fetch/RSC) + **TanStack Query (React Query)** pour données client/API | Éviter Redux sauf besoin très complexe. |
| Formulaires | **React Hook Form** + **Zod** | Validation typée, partage schémas client/serveur possible. |
| HTTP | **fetch** natif (Next) ou **Axios** (interceptors unifiés) | Une seule couche `lib/api/http-client.ts`. |
| Auth stockage session | **Cookies httpOnly** (idéal via BFF) ou **sessionStorage** pour access token si contrainte pure SPA | Documenter le choix dans le README du repo web. |
| Lint / format | **ESLint** + **Prettier** | Commit hooks optionnels (Husky). |
| Tests | **Vitest** + **Testing Library** | Smoke tests sur flux critiques. |

**Outils complémentaires** : `next/image` pour images ; variables d’environnement via `.env.local` (jamais commité) et `NEXT_PUBLIC_*` uniquement pour ce qui doit être exposé au navigateur.

---

## 3. Architecture du projet

### 3.1 Structure de dossiers (recommandée)

```text
src/
├── app/                          # App Router
│   ├── (marketing)/              # Groupe route publique (landing, légal)
│   ├── (auth)/                   # Login, inscription (layout dédié)
│   ├── (dashboard)/              # Espace connecté
│   ├── layout.tsx
│   ├── page.tsx                  # Home / redirection
│   ├── loading.tsx
│   ├── error.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Primitives (Button, Input, Card, Skeleton)
│   ├── layout/                   # Header, Sidebar, Footer, Shell
│   └── features/                 # Blocs métier par domaine (auth, user, ...)
├── lib/
│   ├── api/                      # Client HTTP, endpoints, erreurs
│   ├── auth/                     # Session, guards, callbacks
│   ├── config/                   # env, constantes
│   └── utils/                    # Helpers purs
├── types/                        # Types & interfaces globaux (API, domain)
├── hooks/                        # Hooks réutilisables
└── styles/                       # Tokens CSS si hors Tailwind
```

### 3.2 Organisation du code

- **Séparation** : UI dans `components/`, logique d’accès données dans `lib/api` + hooks, **pas** d’appels API directs dans les pages sauf prototypes jetables.
- **Feature folders** : sous `components/features/<domaine>/` (ex. `auth`, `user`, `device`).
- **Colocation** : fichiers proches de l’usage (`_components` dans `app/` si petit module uniquement).

### 3.3 Conventions de nommage

| Élément | Convention |
|---------|------------|
| Fichiers composants | `PascalCase.tsx` |
| Utilitaires / hooks | `camelCase.ts` |
| Routes App Router | dossiers `kebab-case` |
| Constantes | `UPPER_SNAKE` dans fichiers dédiés |
| Types / interfaces | `PascalCase` — préfixe `I` optionnel, pas imposé |

### 3.4 Layouts et routing

- Utiliser **layouts imbriqués** : `(auth)/layout.tsx` sans header marketing ; `(dashboard)/layout.tsx` avec navigation compte.
- **Routes dynamiques** : `[id]`, `[...slug]` selon besoins API.
- **Middleware** `middleware.ts` à la racine `src/` ou projet : protection des routes `/dashboard/*`, refresh token si applicable.

---

## 4. UI / UX Design

### 4.1 Charte graphique (alignement mobile)

Référence Flutter : `lib/core/theme/app_colors.dart` et `PROJECT_SPEC.md` (section Design System).

| Token | Hex | Usage |
|-------|-----|--------|
| `background` | `#FFFFFF` | Fond principal |
| `primary` | `#207DE6` | CTA, liens actifs, focus ring |
| `secondary` | `#616161` | Texte secondaire, bordures légères |
| `accent` | `#207DE6` | Équivalent primary pour highlights |

**État sémantique** (à dériver en Tailwind) :

- Succès : vert sobre (ex. `#2E7D32` ou équivalent Tailwind `green-800`).
- Erreur : rouge sobre (ex. `#C62828`).
- Bordures neutres : gris type `neutral-200` / `gray-300` en cohérence avec le secondary.

### 4.2 Typographie

- Police : **Inter** ou **system-ui** (stack proche du rendu mobile si Google Fonts utilisée côté Flutter).
- Hiérarchie claire : une échelle limitée (`text-sm` → `text-3xl` max pour le marketing).
- **Pas** de mélange excessif de graisses ; titres `font-semibold` / `font-bold` réservés aux titres.

### 4.3 Principes UX

- **Responsive** : mobile-first ; grilles fluides ; zones tactiles ≥ 44px.
- **Feedback** : états loading (skeleton), erreurs inline + message global si besoin.
- **Accessibilité** : `aria-*`, ordre de tabulation, contraste texte/fond ≥ 4.5:1 pour corps de texte.
- **Sobriété** : beaucoup d’espace blanc, peu d’ornements, illustrations légères si assets exportés depuis la brand.

---

## 5. Composants et pages

### 5.1 Pages (vue produit V1 — à ajuster selon périmètre MVP)

| Route | Page | Rôle |
|-------|------|------|
| `/` | Home / Landing | Présentation courte, CTA connexion / inscription |
| `/login` | Connexion | Saisie téléphone + étape PIN (ou flux aligné sur l’API réelle) |
| `/register` | Inscription | Parcours multi-étapes comme mobile si backend identique |
| `/dashboard` | Tableau de bord | Résumé compte, raccourcis |
| `/account` | Compte | Profil, modification infos |
| `/settings` | Paramètres | Sécurité, déconnexion, préférences |
| `/devices` | Appareils | Liste / ajout appareil (si exposé par API) |
| `/contacts` | Contacts | Gestion contacts (si exposé) |
| `/enterprise` | Entreprise | Inscription / liaison entreprise si applicable |
| `/legal/terms` | CGU | Texte statique ou CMS plus tard |
| `/legal/privacy` | Confidentialité | Idem |

Les **écrans exacts** doivent être recoupés avec les **routes et flux** documentés dans `PROJECT_SPEC.md` et l’implémentation Flutter existante.

### 5.2 Composants réutilisables (liste cible)

| Composant | Responsabilité |
|-----------|----------------|
| `Button` | Primaire / secondaire / ghost ; états disabled & loading |
| `Input`, `Label` | Champs formulaires accessibles |
| `PinInput` | Saisie code à 6 chiffres (masqué), clavier adapté |
| `Card` | Conteneur surface avec ombre légère |
| `PageHeader` | Titre + description + actions |
| `EmptyState` | Liste vide / pas de données |
| `ErrorBanner` | Erreur réseau ou serveur |
| `Skeleton` | Loading liste / cartes |
| `AppShell` | Layout navigation principale |
| `Logo` | Marque OTP Hora (SVG/PNG optimisé) |

---

## 6. Gestion des API

### 6.1 Base URL

- Variable `NEXT_PUBLIC_API_BASE_URL` (ex. `https://otp-hora.onrender.com`) — **sans** slash final.
- En dev, proxy Next (`rewrites` dans `next.config.ts`) possible pour éviter CORS si backend local.

### 6.2 Endpoints (référence commune avec le mobile)

Préfixe API : aligné sur `lib/core/network/endpoints.dart` :

| Méthode | Chemin | Usage |
|---------|--------|--------|
| GET | `/api/health` | Santé service |
| POST | `/api/users` | Création utilisateur |
| POST | `/api/users/login` | Connexion |
| POST | `/api/users/logout` | Déconnexion |
| GET | `/api/users/:userId` | Détail utilisateur |
| POST | `/api/contacts` | Contacts |
| POST | `/api/devices` | Appareils |
| POST | `/api/recovery` | Récupération |
| POST | `/api/enterprises` | Entreprises |
| POST | `/api/links/confirm` | Confirmation lien |
| POST | `/api/auth/approve/:requestId` | Approuver demande auth |
| POST | `/api/auth/reject/:requestId` | Rejeter demande auth |

*Mettre à jour ce tableau si le backend évolue — une seule source de vérité dans `lib/api/endpoints.ts`.*

### 6.3 Structure des appels

- **Client unique** : `createHttpClient()` avec `baseURL`, timeouts (ex. 15s connect, 45s read si aligné mobile).
- **Headers** : `Content-Type: application/json`, `Accept: application/json`, `Authorization: Bearer <token>` si session.
- **Erreurs** : mapper les réponses JSON (`message`, `error`, `detail`) vers un type `ApiError` affichable.

### 6.4 Loading & erreurs

- **TanStack Query** : `isLoading`, `isError`, `error`, `retry` limité.
- **UI** : skeleton pendant fetch ; toast ou bannière pour erreurs réseau ; messages métier pour 4xx/5xx.

### 6.5 Sécurisation des requêtes

- Toujours **HTTPS** en production.
- Ne **jamais** exposer clés serveur dans `NEXT_PUBLIC_*`.
- Préférer **Route Handlers** ou **Server Actions** pour opérations sensibles si le backend accepte un secret côté serveur Next.

---

## 7. Sécurité

| Sujet | Pratique |
|-------|----------|
| XSS | `dangerouslySetInnerHTML` interdit sauf sanitization (DOMPurify) ; contenu utilisateur échappé par défaut React. |
| CSRF | Cookies `SameSite` ; tokens synchronisés si formulaires server-side. |
| Tokens | Préférer **httpOnly** + **secure** cookies pour session ; sinon stockage mémoire + refresh court. |
| Routes | Middleware vérifiant session avant `/dashboard/*`. |
| Données sensibles | Pas de PIN ou secrets dans `localStorage` en clair ; alignement politique backend. |
| Headers | `Content-Security-Policy` progressif en production. |

---

## 8. Typage (TypeScript)

- **`strict`** activé ; éviter `any` ; utiliser `unknown` + narrowing.
- **DTO** : types `User`, `Session`, `ApiError` dans `types/` ou `types/api/`.
- **Réponses API** : fonctions `parseUser(json: unknown): User` avec validation runtime (**Zod**) aux frontières.
- **Réutilisation** : types partagés exportés depuis un seul module pour éviter les doublons.

---

## 9. SEO et référencement

- **`metadata` export** dans `layout.tsx` / pages (`title`, `description`, `openGraph`).
- **URLs propres** ; pas de contenu critique uniquement en client-only sans fallback.
- **`robots.txt`** et **`sitemap.xml`** pour pages publiques.
- **Performances** : LCP sur image hero optimisée (`next/image`, tailles explicites, formats modernes).
- **Accessibilité** : titres hiérarchisés (`h1` unique par page), liens explicites.

---

## 10. Performance

- **Images** : `next/image`, tailles adaptatives, lazy loading hors above-the-fold.
- **Code splitting** : routes = chunks automatiques ; `dynamic()` pour composants lourds rares.
- **Caching** : politiques `fetch` Next 15 / revalidate selon données.
- **Fonts** : `next/font` pour éviter CLS.
- **Lists** : virtualisation si listes longues (`@tanstack/react-virtual` si besoin).

---

## 11. Bonnes pratiques générales

- **Clean code** : fonctions courtes, early return, noms explicites.
- **Scalabilité** : features découpées ; pas de god-objects.
- **Maintenabilité** : README du package web, scripts `lint`, `typecheck`, `build`.
- **Documentation** : ce fichier + README à la racine du repo Next.

---

## 12. Instructions pour Cursor

### 12.1 Utilisation de ce document

1. Créer le projet Next.js (App Router + TS + Tailwind + ESLint).
2. Configurer **tokens couleurs** Tailwind = §4.
3. Mettre en place **`lib/api`** (client, endpoints, erreurs) = §6.
4. Implémenter **layouts** `(auth)` et `(dashboard)` = §3.
5. Construire **composants UI** de base = §5.2 puis pages §5.1.
6. Brancher **auth** et **middleware** = §7.
7. Ajouter **QueryClientProvider** et premiers appels API = §6.4.
8. Passer une revue **a11y** et **SEO** = §9.

### 12.2 Ordre de développement recommandé

1. Config & design tokens  
2. Client HTTP + types erreurs  
3. Layout shell + navigation  
4. Flux login / session  
5. Dashboard & compte  
6. Pages secondaires (devices, contacts, enterprise) selon priorité produit  
7. Polish SEO, perf, tests smoke  

### 12.3 Références croisées

- **Mobile** : `PROJECT_SPEC.md`, `lib/core/theme/app_colors.dart`, `lib/core/network/endpoints.dart`.
- **API** : toujours valider les chemins et payloads avec la documentation OpenAPI ou le code backend réel avant de figer les types.

---

**Version du document** : 1.0  
**Dernière mise à jour** : à compléter lors des évolutions produit ou API.

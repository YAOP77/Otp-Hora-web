# 💻 Frontend - Nouvelles Fonctionnalités de Sécurité

Ce document décrit les changements apportés à l'interface utilisateur et à l'intégration API.

### 🎨 Logique Développée
1.  **Tunnel d'Inscription (4 Étapes)** :
    *   **Étape 1** : Saisie du nom, prénom et du nouveau champ `username`.
    *   **Étape 2** : Numéro de téléphone international.
    *   **Étape 3** : Définition du PIN avec **confirmation obligatoire** (vérification de correspondance).
    *   **Étape 4** : Configuration des **5 questions de sécurité** obligatoires.
2.  **Gestion des Appareils** :
    *   Nouvelle interface dans le tableau de bord pour visualiser les sessions actives.
    *   Bouton de déconnexion immédiate pour révoquer l'accès d'un appareil à distance.
3.  **Récupération PIN** :
    *   Interface dynamique qui demande les questions de sécurité enregistrées après identification par téléphone.

### 🛠️ Back-Office Administration
1.  **Refonte Complète du Dashboard Admin** :
    *   Interface premium en mode sombre utilisant les variables de design du projet.
    *   **Dashboard Stats** : Vue d'ensemble avec compteurs d'utilisateurs actifs, suspendus et entreprises.
    *   **Gestion des Utilisateurs** : Table de données avec recherche, filtres par statut et actions de modération (bloquer/débloquer/déconnecter).
    *   **Sécurité & Sessions** : Supervision des appareils connectés avec capacité de déconnexion globale par utilisateur.
2.  **Gestion des Accès** :
    *   Page de paramètres dédiée pour l'ajout de nouveaux administrateurs.
    *   **Liste des administrateurs** avec suivi du statut et actions de suspension/réactivation.
    *   Bascule de thème (Clair/Sombre) intégrée directement dans le header administratif.
3.  **Journal d'Activité** :
    *   Visualisation chronologique des événements (connexions, modifications de statut) pour l'audit.

### 🔑 Identité & compte (mises à jour)
1. **Nom d’utilisateur (utilisateur)** :
    * Libellés **« Nom d’utilisateur »** (inscription, compte, i18n FR/EN).
    * **Compte** : modification du nom d’utilisateur avec le nom, prénom et PIN (modal).
    * La **user-key** n’est plus affichée sur les écrans grand public (l’API et la donnée restent disponibles pour d’autres usages).
2. **Portail entreprise** :
    * **Compte** : affichage et modification du **nom d’utilisateur** entreprise.
    * **Clé API** : plus d’affichage sur la page compte (les endpoints `GET/POST …/api-key` restent disponibles côté API).
    * **Inscription** : saisie du nom d’utilisateur entreprise ; message post-inscription centré sur le **nom d’utilisateur** puis la clé API (une fois).
    * **Utilisateurs liés** : colonne **@nom d’utilisateur** à la place de la user-key ; recherche par nom / prénom / nom d’utilisateur.

### 🛠️ Back-Office Administration (mises à jour)
1. **Entreprises** (`/admin/enterprises`) :
    * Liste branchée sur **`GET /api/back-office/enterprises`** (données réelles `enterprise_accounts`).
    * Gestion d’**erreur de chargement**, filtres actifs / suspendus (y compris `deleted_at`), recherche (nom, email, **username**, id).
    * Sous-titre ligne : **@username** si présent.

### 💡 Recommandations
- **Configuration API** : Assurez-vous que `NEXT_PUBLIC_API_BASE_URL` pointe bien vers le backend mis à jour.
- **Accès Admin** : Utilisez `/admin/login` pour accéder à l'interface. Les identifiants par défaut sont `admin@otphora.com` / `admin`.
- **UX** : Les réponses aux questions de sécurité sont automatiquement normalisées (minuscules, sans espaces superflus) pour minimiser les échecs de validation lors de la récupération.
- **Base entreprise** : après ajout du champ `username` sur `enterprise_accounts`, appliquer la migration Prisma correspondante sur PostgreSQL.

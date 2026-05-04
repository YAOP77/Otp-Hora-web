# Nouvelles Intégrations et Spécifications Sécurité - OTP Hora

Voici les points clés à retenir et à intégrer suite à l'analyse de la nouvelle spécification :

### 1. 🆔 Identité et Inscription
*   **Username Personnalisé** : L'utilisateur choisit désormais son propre identifiant (ex: `adama_kante`). Celui-ci doit être unique.
*   **Validation du Mot de Passe** : Double saisie obligatoire à l'inscription pour éviter les erreurs.
*   **Téléphone Figé** : Une fois inscrit, le numéro de téléphone ne peut plus être modifié (Règle stricte : 1 numéro = 1 compte).

### 2. 🛡️ Sécurité et Gestion des Sessions
*   **Gestion des Appareils** : Une interface dédiée permettra de voir tous les appareils connectés (type d'appareil, date) avec une option de déconnexion à distance.
*   **Historique et Notifications** : Suivi des connexions et alertes en cas de nouvelle activité.

### 3. 🔑 Récupération de Compte (Nouveau Flux)
Contrairement à la version précédente qui misait sur l'email, ce document introduit un système basé sur des questions de sécurité :
*   **À l'inscription** : L'utilisateur choisit et répond à **5 questions** (ex: ville de naissance, plat préféré).
*   **En cas d'oubli** : La récupération se fait en répondant correctement à ces questions pour pouvoir définir un nouveau mot de passe.

### 4. ⚙️ Recommandation d'Architecture
Le document souligne l'importance de séparer l'identifiant utilisateur (`username`) de l'identifiant technique (`ID interne/UUID`). Le système utilisera l'ID interne pour les relations en base de données, tandis que l'utilisateur n'interagira qu'avec son `username`.

---

### 🚀 Impact sur le développement
Il faudra mettre à jour le schéma Prisma du backend (`otp-hora-main/prisma/schema.prisma`) pour ajouter :
*   Le champ **`username`** (unique).
*   Une table ou des champs pour les **`security_questions`**.
*   La gestion des **sessions par appareil** plus détaillée.

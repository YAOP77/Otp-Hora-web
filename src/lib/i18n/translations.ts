/**
 * Dictionnaire FR / EN. Clés organisées par namespace.
 * Toute chaîne visible par l'utilisateur DOIT passer par `useI18n().t("key")`
 * pour bénéficier de la bascule FR/EN.
 */
export type Lang = "fr" | "en";

export const translations = {
  fr: {
    // Commun
    "common.loading": "Chargement",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.close": "Fermer",
    "common.continue": "Continuer",
    "common.back": "Retour",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.add": "Ajouter",
    "common.search": "Rechercher",
    "common.all": "Tous",
    "common.active": "Actif",
    "common.inactive": "Inactif",
    "common.today": "Aujourd'hui",
    "common.sevenDays": "7 jours",
    "common.refresh": "Rafraîchir",
    "common.action": "Action",
    "common.status": "Statut",
    "common.date": "Date",
    "common.phone": "Téléphone",
    "common.email": "Email",
    "common.name": "Nom",
    "common.firstname": "Prénom",
    "common.lang.fr": "Français",
    "common.lang.en": "Anglais",
    "common.theme.light": "Mode clair",
    "common.theme.dark": "Mode sombre",

    // Marketing header
    "header.user": "Utilisateur",
    "header.enterprise": "Entreprise",
    "header.createAccount": "Créer son compte",
    "header.signup": "S'inscrire",
    "header.changeLanguage": "Changer la langue",

    // Sub-nav sections
    "subnav.features": "Fonctionnalités",
    "subnav.start": "Commencer",
    "subnav.download": "Télécharger",
    "subnav.about": "À propos de nous",
    "subnav.contact": "Nous contacter",
    "subnav.faq": "FAQ",

    // Hero
    "hero.label": "Plateforme OTP Hora",
    "hero.title":
      "Validez, connectez et pilotez votre compte avec la même exigence que sur mobile",
    "hero.subtitle":
      "Une interface web sobre et accessible pour votre authentification, vos appareils, vos contacts et vos liaisons entreprise.",
    "hero.login": "Se connecter",
    "hero.register": "Créer un compte",
    "hero.scroll": "Défiler",

    // Landing sections
    "landing.features.title.line1": "Tout ce dont vous avez",
    "landing.features.title.line2": "besoin pour vous connecter",
    "landing.features.title.line3": "en toute confiance",
    "landing.features.1.title": "Validation utilisateur",
    "landing.features.1.text":
      "Des demandes d'authentification claires : vous décidez quand approuver ou refuser une action sensible.",
    "landing.features.2.title": "Même sécurité que le mobile",
    "landing.features.2.text":
      "Une expérience web alignée sur l'app Flutter : session, compte et règles métier identiques.",
    "landing.features.3.title": "Contacts et appareils",
    "landing.features.3.text":
      "Centralisez vos moyens de contact et le suivi de vos appareils depuis un espace sobre.",
    "landing.features.4.title": "Liaisons entreprise",
    "landing.features.4.text":
      "Connectez-vous aux organisations partenaires lorsque votre activité le nécessite.",
    "landing.start.title": "Commencer",
    "landing.start.highlight": "maintenant",
    "landing.start.desc":
      "Accédez à votre espace personnel, gérez vos appareils et vos liaisons entreprise en quelques secondes depuis votre navigateur.",
    "landing.start.cta": "Découvrir",
    "landing.download.title": "Téléchargez l'application",
    "landing.download.highlight": "et inscrivez-vous",
    "landing.download.desc":
      "Quatre étapes simples pour rejoindre la plateforme OTP Hora.",
    "landing.pro.title": "Pensé pour un usage professionnel",
    "landing.pro.desc":
      "Sobriété visuelle, lisibilité et parcours clairs — en accord avec la vision produit OTP Hora.",
    "landing.pro.bullet1": "Demandes de liaison contrôlées",
    "landing.pro.bullet2": "Visibilité sur vos autorisations",
    "landing.pro.bullet3": "Interface adaptée au contexte professionnel",
    "landing.pro.bullet4": "Évolutif selon les mises à jour de l'API",
    "landing.pro.users": "utilisateurs compte lié sur Hora",
    "landing.faq.title": "Questions fréquentes",
    "landing.faq.q1": "Qu'est-ce qu'OTP Hora ?",
    "landing.faq.a1":
      "OTP Hora est une plateforme d'authentification et de gestion de compte : vous validez les actions importantes et gérez vos contacts, appareils et liens avec des entreprises partenaires.",
    "landing.faq.q2":
      "Le web utilise-t-il le même backend que l'application mobile ?",
    "landing.faq.a2":
      "Oui. Les endpoints et les règles métier sont alignés sur le client Flutter pour éviter les écarts fonctionnels.",
    "landing.faq.q3": "Comment me connecter ?",
    "landing.faq.a3":
      "Utilisez votre numéro de téléphone et votre code PIN, comme sur l'application, depuis la page Connexion.",
    "landing.faq.q4": "Où trouver les mentions légales ?",
    "landing.faq.a4":
      "Les conditions d'utilisation et la politique de confidentialité sont disponibles en pied de page.",
    "landing.cta.title": "Prêt à utiliser OTP Hora sur le web ?",
    "landing.cta.desc":
      "Connectez-vous ou créez un compte pour accéder au tableau de bord et à vos paramètres.",
    "landing.cta.create": "Créer un compte",
    "landing.cta.signin": "J'ai déjà un compte",

    // Auth
    "auth.welcome": "Bienvenue sur OTP Hora",
    "auth.welcome.sub":
      "Plateforme d'authentification sécurisée — gérez votre compte, vos appareils et vos liaisons en toute confiance.",
    "auth.enterprise.title": "Portail Entreprise",
    "auth.enterprise.sub":
      "Espace réservé aux comptes entreprise — gérez vos liaisons, autorisations et clés API depuis une interface dédiée.",
    "auth.back.home": "Retour à l'accueil",
    "auth.login.title": "Connexion",
    "auth.login.phoneLabel": "Numéro de téléphone",
    "auth.login.pinLabel": "Code PIN (6 chiffres)",
    "auth.login.submit": "Se connecter",
    "auth.login.modify": "Modifier le numéro",
    "auth.login.noAccount": "Pas encore de compte ?",
    "auth.login.createAccount": "Créer un compte",
    "auth.login.enterprise": "Connexion entreprise",
    "auth.login.forgotPin": "PIN oublié",
    "auth.login.verifyEmail": "Vérifier mon email",
    "auth.login.ctx":
      "Connectez-vous à Hora avec votre numéro de téléphone pour accéder à votre espace sécurisé.",
    "auth.login.pinCtx":
      "Saisissez votre code PIN Hora pour confirmer votre identité.",
    "auth.register.title": "Inscription",
    "auth.register.ctx":
      "OTP Hora place votre identité sous votre contrôle. Identifiez votre nom et prénom pour commencer.",
    "auth.register.phoneCtx":
      "Ajoutez votre numéro Hora — il sera associé à votre compte pour valider vos authentifications.",
    "auth.register.pinCtx":
      "Protégez votre compte Hora — choisissez un code PIN sécurisé que vous retiendrez facilement.",
    "auth.register.submit": "Créer mon compte",
    "auth.register.alreadyIn": "Déjà inscrit ?",
    "auth.register.entLink": "Inscription entreprise",
    "auth.register.usernameLabel": "Nom d'utilisateur",
    "auth.enterpriseRegister.alertUsernameLine":
      "Notez votre nom d'utilisateur — il s'affiche dans votre espace et vous identifie :",
    "auth.enterpriseRegister.alertApiKeyLine":
      "Conservez aussi la clé API (affichée une seule fois), réservée aux intégrations techniques :",
    "auth.enterpriseRegister.footer":
      "Choisissez un nom d'utilisateur unique ; une clé API technique sera affichée une seule fois après validation du PIN.",

    // Dashboard nav
    "nav.dashboard": "Tableau de bord",
    "nav.account": "Compte",
    "nav.history": "Historique de connexion",
    "nav.links": "Liaisons & identité",
    "nav.linkedUsers": "Utilisateurs liés",
    "nav.accessHistory": "Historique d'accès",
    "nav.settings": "Paramètres",
    "nav.myAccount": "Mon compte",
    "nav.shortcuts": "Raccourcis OTP Hora",
    "nav.profile": "Profil",
    "nav.errorProfile":
      "Impossible de charger le profil. Vérifiez votre connexion ou réessayez plus tard.",
    "nav.errorEnterprise":
      "Impossible de charger le profil entreprise. Vérifiez votre connexion ou réessayez plus tard.",

    // Account
    "account.title": "Compte",
    "account.subtitle": "Consultez et modifiez les informations de votre profil.",
    "account.info": "Informations du profil",
    "account.editProfile": "Modifier le profil",
    "account.fullName": "Nom complet",
    "account.username": "Nom d'utilisateur",
    "account.recoveryEmail": "Email de récupération",
    "account.recoveryConfigured": "L'email de récupération est enregistré.",
    "account.recoveryDesc":
      "Cet email est utilisé pour récupérer l'accès à votre compte.",
    "account.recoveryMissing":
      "Ajoutez un email de récupération pour sécuriser votre compte.",
    "account.addEmail": "Ajouter un email",
    "account.bandMissingEmail":
      "Veuillez enregistrer un email de récupération pour sécuriser votre compte.",

    // Enterprise dashboard
    "ent.space": "Espace entreprise",
    "ent.profile": "Profil entreprise",
    "ent.modules": "Modules de gestion",
    "ent.account": "Compte entreprise",
    "ent.accountDesc":
      "Consultez et modifiez les informations de votre entreprise.",
    "ent.help": "Besoin d'aide ?",
    "ent.usersSubtitle":
      "Consultez les utilisateurs associés à votre entreprise.",
    "ent.noUsers": "Aucun utilisateur",
    "ent.noUsersDesc": "Aucun utilisateur n'est encore lié à votre entreprise.",
    "ent.linkDate": "Date de liaison",
    "ent.historyTitle": "Historique d'accès",
    "ent.historyDesc": "Consultez les dernières connexions de l'entreprise.",
    "ent.apiKey.show": "Afficher la clé API",
    "ent.apiKey.hide": "Masquer la clé API",
    "ent.apiKey.hint":
      "Réservée aux intégrations (serveur à serveur) — ne la partagez pas publiquement.",

    // Settings
    "settings.title": "Paramètres",
    "settings.userSubtitle":
      "Préférences, sécurité et session sur cet appareil.",
    "settings.entSubtitle":
      "Préférences, sécurité et session de votre entreprise.",
    "settings.general": "Général",
    "settings.language": "Langue",
    "settings.languageDesc":
      "Changez la langue d'affichage de la plateforme (préférence locale).",
    "settings.notifications": "Notifications",
    "settings.faq": "FAQ",
    "settings.faqDesc": "Réponses aux questions courantes sur OTP Hora.",
    "settings.logout": "Se déconnecter",
    "settings.logoutDesc": "Terminez votre session sur cet appareil.",
    "settings.delete": "Supprimer mon compte",
    "settings.deleteEnt": "Supprimer le compte entreprise",
    "settings.deleteDesc": "Action définitive et irréversible.",
    "settings.deleteConfirm": "Supprimer définitivement le compte ?",
    "settings.deleteConfirmDesc":
      "Cette action est irréversible. Vous serez déconnecté après confirmation.",
    "settings.faqTitle": "Questions fréquentes",

    // Liaisons tables
    "links.search.user": "Rechercher par entreprise…",
    "links.search.enterprise": "Rechercher par nom, prénom ou nom d'utilisateur…",
    "links.col.enterprise": "Entreprise",
    "links.col.user": "Utilisateur",
    "links.col.userKey": "user-key",
    "links.col.date": "Date de liaison",
    "links.empty.user.title": "Aucune liaison",
    "links.empty.user.desc": "Aucune entreprise n'est encore liée à votre compte.",
    "links.empty.enterprise.title": "Aucun utilisateur",
    "links.empty.enterprise.desc": "Aucun utilisateur n'est encore lié à votre entreprise.",
    "links.status.pending": "En attente",
    "links.status.approved": "Approuvée",
    "links.status.rejected": "Refusée",
    "links.filter.pending": "En attente",
    "links.filter.approved": "Approuvées",
    "links.filter.rejected": "Refusées",
    "links.title.enterprise": "Historique des liaisons",
    "links.desc.enterprise": "Consultez les utilisateurs associés à votre entreprise.",
    "links.title.user": "Liaisons & identité",
    "links.desc.user": "Entreprises associées à votre compte utilisateur.",

    // Account view
    "account.apiKey": "Clé API",
    "account.userKeyLabel": "user-key",
    "account.copyMessage.userKey": "user-key copiée.",
    "account.copyMessage.apiKey": "api-key copiée.",
    "account.apiKey.notRetrievable":
      "Clé API non récupérable — régénérez-la pour l'afficher.",
    "account.apiKey.regenerate": "Régénérer",
    "account.apiKey.regenerating": "Régénération…",
    "account.show": "Afficher",
    "account.hide": "Masquer",
    "account.copy": "Copier",
    "account.status.active": "Actif",
    "account.status.inactive": "Inactif",

    // Devices / login history
    "devices.title": "Historique de connexion",
    "devices.desc": "Vos connexions récentes et la gestion de vos appareils.",
    "devices.search": "Rechercher par label ou appareil…",
    "devices.empty.title": "Aucune connexion",
    "devices.empty.desc": "Aucune connexion enregistrée.",
    "devices.refresh": "Rafraîchir",

    // History enterprise
    "history.title": "Historique d'accès",
    "history.desc": "Consultez les dernières connexions de l'entreprise.",
    "history.empty.title": "Aucune connexion",
    "history.empty.desc": "Aucune connexion enregistrée pour votre compte.",

    // Toasts
    "toast.profileUpdated": "Profil mis à jour avec succès.",
    "toast.recoverySaved": "Email de récupération enregistré.",
    "toast.infoUpdated": "Informations mises à jour avec succès.",
    "toast.accountDeleted": "Compte supprimé.",

    // Consent (enterprise link)
    "consent.title": "Demande d'authentification",
    "consent.subtitle": "demande à vous authentifier avec Hora.",
    "consent.shield":
      "En autorisant, cette application pourra vérifier votre identité via OTP Hora. Vous pouvez révoquer cette liaison à tout moment depuis votre espace.",
    "consent.approve": "Autoriser",
    "consent.reject": "Refuser",
    "consent.loading": "Chargement de la demande…",
    "consent.invalid": "Lien invalide",
    "consent.invalidDesc":
      "L'identifiant de liaison fourni n'est pas valide. Réessayez depuis l'application partenaire.",
    "consent.close": "Vous pouvez fermer cette fenêtre.",
  },

  en: {
    // Common
    "common.loading": "Loading",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.continue": "Continue",
    "common.back": "Back",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.add": "Add",
    "common.search": "Search",
    "common.all": "All",
    "common.active": "Active",
    "common.inactive": "Inactive",
    "common.today": "Today",
    "common.sevenDays": "7 days",
    "common.refresh": "Refresh",
    "common.action": "Action",
    "common.status": "Status",
    "common.date": "Date",
    "common.phone": "Phone",
    "common.email": "Email",
    "common.name": "Last name",
    "common.firstname": "First name",
    "common.lang.fr": "French",
    "common.lang.en": "English",
    "common.theme.light": "Light mode",
    "common.theme.dark": "Dark mode",

    // Marketing header
    "header.user": "User",
    "header.enterprise": "Enterprise",
    "header.createAccount": "Create account",
    "header.signup": "Sign up",
    "header.changeLanguage": "Change language",

    // Sub-nav sections
    "subnav.features": "Features",
    "subnav.start": "Get started",
    "subnav.download": "Download",
    "subnav.about": "About us",
    "subnav.contact": "Contact us",
    "subnav.faq": "FAQ",

    // Hero
    "hero.label": "OTP Hora Platform",
    "hero.title":
      "Validate, connect and manage your account with the same rigor as on mobile",
    "hero.subtitle":
      "A clean, accessible web interface for your authentication, devices, contacts and enterprise links.",
    "hero.login": "Sign in",
    "hero.register": "Create account",
    "hero.scroll": "Scroll",

    // Landing sections
    "landing.features.title.line1": "Everything you need",
    "landing.features.title.line2": "to sign in",
    "landing.features.title.line3": "with confidence",
    "landing.features.1.title": "User validation",
    "landing.features.1.text":
      "Clear authentication prompts — you decide when to approve or reject a sensitive action.",
    "landing.features.2.title": "Same security as mobile",
    "landing.features.2.text":
      "A web experience aligned with the Flutter app: identical session, account and business rules.",
    "landing.features.3.title": "Contacts and devices",
    "landing.features.3.text":
      "Centralize your contact methods and device tracking from a clean space.",
    "landing.features.4.title": "Enterprise links",
    "landing.features.4.text":
      "Connect to partner organizations when your activity requires it.",
    "landing.start.title": "Get started",
    "landing.start.highlight": "now",
    "landing.start.desc":
      "Access your personal space, manage your devices and enterprise links in seconds from your browser.",
    "landing.start.cta": "Discover",
    "landing.download.title": "Download the app",
    "landing.download.highlight": "and sign up",
    "landing.download.desc":
      "Four simple steps to join the OTP Hora platform.",
    "landing.pro.title": "Built for professional use",
    "landing.pro.desc":
      "Visual clarity, readability and clear paths — aligned with the OTP Hora product vision.",
    "landing.pro.bullet1": "Controlled link requests",
    "landing.pro.bullet2": "Visibility on your permissions",
    "landing.pro.bullet3": "Interface adapted to professional contexts",
    "landing.pro.bullet4": "Evolving with API updates",
    "landing.pro.users": "users with linked Hora accounts",
    "landing.faq.title": "Frequently asked questions",
    "landing.faq.q1": "What is OTP Hora?",
    "landing.faq.a1":
      "OTP Hora is an authentication and account management platform: you approve important actions and manage your contacts, devices and links with partner companies.",
    "landing.faq.q2":
      "Does the web use the same backend as the mobile app?",
    "landing.faq.a2":
      "Yes. Endpoints and business rules are aligned with the Flutter client to avoid functional divergence.",
    "landing.faq.q3": "How do I sign in?",
    "landing.faq.a3":
      "Use your phone number and PIN code, just like on the app, from the Sign In page.",
    "landing.faq.q4": "Where are the legal terms?",
    "landing.faq.a4":
      "Terms of use and privacy policy are available in the page footer.",
    "landing.cta.title": "Ready to use OTP Hora on the web?",
    "landing.cta.desc":
      "Sign in or create an account to access the dashboard and settings.",
    "landing.cta.create": "Create account",
    "landing.cta.signin": "I already have an account",

    // Auth
    "auth.welcome": "Welcome to OTP Hora",
    "auth.welcome.sub":
      "Secure authentication platform — manage your account, devices and links with confidence.",
    "auth.enterprise.title": "Enterprise Portal",
    "auth.enterprise.sub":
      "Reserved for enterprise accounts — manage your links, permissions and API keys from a dedicated interface.",
    "auth.back.home": "Back to home",
    "auth.login.title": "Sign in",
    "auth.login.phoneLabel": "Phone number",
    "auth.login.pinLabel": "PIN code (6 digits)",
    "auth.login.submit": "Sign in",
    "auth.login.modify": "Edit number",
    "auth.login.noAccount": "No account yet?",
    "auth.login.createAccount": "Create account",
    "auth.login.enterprise": "Enterprise sign in",
    "auth.login.forgotPin": "Forgot PIN",
    "auth.login.verifyEmail": "Verify my email",
    "auth.login.ctx":
      "Sign in to Hora with your phone number to access your secure space.",
    "auth.login.pinCtx":
      "Enter your Hora PIN code to confirm your identity.",
    "auth.register.title": "Sign up",
    "auth.register.ctx":
      "OTP Hora puts your identity under your control. Enter your first and last name to get started.",
    "auth.register.phoneCtx":
      "Add your Hora phone number — it will be linked to your account to validate authentications.",
    "auth.register.pinCtx":
      "Protect your Hora account — choose a secure PIN code you'll remember easily.",
    "auth.register.submit": "Create my account",
    "auth.register.alreadyIn": "Already registered?",
    "auth.register.entLink": "Enterprise registration",
    "auth.register.usernameLabel": "Username",
    "auth.enterpriseRegister.alertUsernameLine":
      "Save your username — it appears in your portal and identifies you:",
    "auth.enterpriseRegister.alertApiKeyLine":
      "Also save your API key (shown once), for technical integrations only:",
    "auth.enterpriseRegister.footer":
      "Choose a unique username; a technical API key will be shown once after you confirm your PIN.",

    // Dashboard nav
    "nav.dashboard": "Dashboard",
    "nav.account": "Account",
    "nav.history": "Login history",
    "nav.links": "Links & identity",
    "nav.linkedUsers": "Linked users",
    "nav.accessHistory": "Access history",
    "nav.settings": "Settings",
    "nav.myAccount": "My account",
    "nav.shortcuts": "OTP Hora shortcuts",
    "nav.profile": "Profile",
    "nav.errorProfile":
      "Unable to load profile. Check your connection or try again later.",
    "nav.errorEnterprise":
      "Unable to load enterprise profile. Check your connection or try again later.",

    // Account
    "account.title": "Account",
    "account.subtitle": "View and edit your profile information.",
    "account.info": "Profile information",
    "account.editProfile": "Edit profile",
    "account.fullName": "Full name",
    "account.username": "Username",
    "account.recoveryEmail": "Recovery email",
    "account.recoveryConfigured": "Recovery email is saved.",
    "account.recoveryDesc":
      "This email is used to recover access to your account.",
    "account.recoveryMissing":
      "Add a recovery email to secure your account.",
    "account.addEmail": "Add email",
    "account.bandMissingEmail":
      "Please save a recovery email to secure your account.",

    // Enterprise dashboard
    "ent.space": "Enterprise space",
    "ent.profile": "Enterprise profile",
    "ent.modules": "Management modules",
    "ent.account": "Enterprise account",
    "ent.accountDesc": "View and edit your enterprise information.",
    "ent.help": "Need help?",
    "ent.usersSubtitle": "View users linked to your enterprise.",
    "ent.noUsers": "No users",
    "ent.noUsersDesc": "No users are linked to your enterprise yet.",
    "ent.linkDate": "Link date",
    "ent.historyTitle": "Access history",
    "ent.historyDesc": "View the latest enterprise logins.",
    "ent.apiKey.show": "Show API key",
    "ent.apiKey.hide": "Hide API key",
    "ent.apiKey.hint":
      "For server-to-server integrations only — do not share it publicly.",

    // Settings
    "settings.title": "Settings",
    "settings.userSubtitle":
      "Preferences, security and session on this device.",
    "settings.entSubtitle":
      "Preferences, security and session of your enterprise.",
    "settings.general": "General",
    "settings.language": "Language",
    "settings.languageDesc":
      "Change the platform display language (local preference).",
    "settings.notifications": "Notifications",
    "settings.faq": "FAQ",
    "settings.faqDesc": "Answers to common questions about OTP Hora.",
    "settings.logout": "Sign out",
    "settings.logoutDesc": "End your session on this device.",
    "settings.delete": "Delete my account",
    "settings.deleteEnt": "Delete enterprise account",
    "settings.deleteDesc": "Permanent and irreversible action.",
    "settings.deleteConfirm": "Permanently delete account?",
    "settings.deleteConfirmDesc":
      "This action is irreversible. You will be signed out after confirmation.",
    "settings.faqTitle": "Frequently asked questions",

    // Liaisons tables
    "links.search.user": "Search by company…",
    "links.search.enterprise": "Search by name or username…",
    "links.col.enterprise": "Company",
    "links.col.user": "User",
    "links.col.userKey": "user-key",
    "links.col.date": "Link date",
    "links.empty.user.title": "No links",
    "links.empty.user.desc": "No company is linked to your account yet.",
    "links.empty.enterprise.title": "No users",
    "links.empty.enterprise.desc": "No users are linked to your enterprise yet.",
    "links.status.pending": "Pending",
    "links.status.approved": "Approved",
    "links.status.rejected": "Rejected",
    "links.filter.pending": "Pending",
    "links.filter.approved": "Approved",
    "links.filter.rejected": "Rejected",
    "links.title.enterprise": "Link history",
    "links.desc.enterprise": "View the users linked to your enterprise.",
    "links.title.user": "Links & identity",
    "links.desc.user": "Companies linked to your user account.",

    // Account view
    "account.apiKey": "API key",
    "account.userKeyLabel": "user-key",
    "account.copyMessage.userKey": "user-key copied.",
    "account.copyMessage.apiKey": "api-key copied.",
    "account.apiKey.notRetrievable":
      "API key not retrievable — regenerate it to display it.",
    "account.apiKey.regenerate": "Regenerate",
    "account.apiKey.regenerating": "Regenerating…",
    "account.show": "Show",
    "account.hide": "Hide",
    "account.copy": "Copy",
    "account.status.active": "Active",
    "account.status.inactive": "Inactive",

    // Devices / login history
    "devices.title": "Login history",
    "devices.desc": "Your recent logins and device management.",
    "devices.search": "Search by label or device…",
    "devices.empty.title": "No logins",
    "devices.empty.desc": "No logins recorded.",
    "devices.refresh": "Refresh",

    // History enterprise
    "history.title": "Access history",
    "history.desc": "View the latest enterprise logins.",
    "history.empty.title": "No logins",
    "history.empty.desc": "No logins recorded for your account.",

    // Toasts
    "toast.profileUpdated": "Profile updated successfully.",
    "toast.recoverySaved": "Recovery email saved.",
    "toast.infoUpdated": "Information updated successfully.",
    "toast.accountDeleted": "Account deleted.",

    // Consent
    "consent.title": "Authentication request",
    "consent.subtitle": "is requesting to authenticate you with Hora.",
    "consent.shield":
      "By approving, this application will be able to verify your identity via OTP Hora. You can revoke this link anytime from your space.",
    "consent.approve": "Approve",
    "consent.reject": "Reject",
    "consent.loading": "Loading request…",
    "consent.invalid": "Invalid link",
    "consent.invalidDesc":
      "The link identifier is not valid. Retry from the partner app.",
    "consent.close": "You can close this window.",
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

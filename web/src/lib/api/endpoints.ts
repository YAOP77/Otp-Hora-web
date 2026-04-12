/**
 * Aligné sur la spec web et `lib/core/network/endpoints.dart` (Flutter).
 * Une seule source de vérité pour les chemins API.
 */
export const endpoints = {
  health: "/api/health",
  users: "/api/users",
  usersLogin: "/api/users/login",
  usersSessionUnlock: "/api/users/session/unlock",
  usersRefreshToken: "/api/users/refresh-token",
  usersRecoveryEmail: "/api/users/me/recovery-email",
  usersEmailVerify: "/api/users/email/verify",
  usersLoginHistory: "/api/users/me/login-history",
  usersLogout: "/api/users/logout",
  userById: (userId: string) => `/api/users/${encodeURIComponent(userId)}`,

  enterprisesRegister: "/api/enterprises/register",
  enterprisesLogin: "/api/enterprises/login",
  enterprisesRefreshToken: "/api/enterprises/refresh-token",
  enterprisesSessionUnlock: "/api/enterprises/session/unlock",
  enterprisesRecoveryEmail: "/api/enterprises/me/recovery-email",
  enterprisesEmailVerify: "/api/enterprises/email/verify",
  enterprisesMe: "/api/enterprises/me",
  enterprisesLogout: "/api/enterprises/logout",
  enterprisesDevices: "/api/enterprises/me/devices",
  enterprisesLinkedUsers: "/api/enterprises/me/linked-users",
  enterprisesLoginHistory: "/api/enterprises/me/login-history",

  authRequest: "/api/auth/request",
  authStatus: (requestId: string) =>
    `/api/auth/status/${encodeURIComponent(requestId)}`,
  authApprove: (requestId: string) =>
    `/api/auth/approve/${encodeURIComponent(requestId)}`,
  authReject: (requestId: string) =>
    `/api/auth/reject/${encodeURIComponent(requestId)}`,
  authEvents: (requestId: string) =>
    `/api/auth/events/${encodeURIComponent(requestId)}`,

  usersPinRecoveryRequest: "/api/users/pin-recovery/request",
  usersPinRecoveryConfirm: "/api/users/pin-recovery/confirm",
  enterprisesPinRecoveryRequest: "/api/enterprises/pin-recovery/request",
  enterprisesPinRecoveryConfirm: "/api/enterprises/pin-recovery/confirm",

  links: "/api/links",
  linksConfirm: "/api/links/confirm",

  contacts: "/api/contacts",
  devices: "/api/devices",
} as const;

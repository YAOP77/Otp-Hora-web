import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";
import { tryRefreshUserSession } from "@/lib/auth/user-http";
import {
  extractAccessToken,
  extractRefreshToken,
  extractUserId,
  parseUser,
  unwrapApiData,
  type User,
} from "@/types/api";

export type LoginPayload = {
  phone: string;
  pin: string;
};

export type RegisterPayload = Record<string, unknown>;

function client(getToken: () => string | null) {
  return createHttpClient({ getToken, onUnauthorized: tryRefreshUserSession });
}

export async function login(
  payload: LoginPayload,
  getToken: () => string | null,
): Promise<{
  token: string;
  userId: string;
  refreshToken: string | null;
  raw: unknown;
}> {
  /** Le login ne doit PAS tenter d'auto-refresh sur 401 (loop). */
  const { request } = createHttpClient({ getToken });
  const json = await request<unknown>("POST", endpoints.usersLogin, {
    json: { phone: payload.phone, PIN: payload.pin },
  });
  const token = extractAccessToken(json);
  if (!token) {
    throw new Error("Réponse de connexion sans jeton d’accès.");
  }
  const userId = extractUserId(json, payload.phone);
  if (!userId) {
    throw new Error("Réponse de connexion sans identifiant utilisateur.");
  }
  const refreshToken = extractRefreshToken(json);
  return { token, userId, refreshToken, raw: json };
}

export async function logout(getToken: () => string | null): Promise<void> {
  const token = getToken();
  if (!token) return;
  const { request } = client(getToken);
  try {
    await request<unknown>("POST", endpoints.usersLogout, { json: {} });
  } catch {
    // Déconnexion locale même si l’API échoue
  }
}

export async function refreshUserToken(refresh_token: string): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.usersRefreshToken, { json: { refresh_token } });
}

export async function unlockUserSession(refresh_token: string, pin: string): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.usersSessionUnlock, {
    json: { refresh_token, pin },
  });
}

export async function setUserRecoveryEmail(
  email: string,
  getToken: () => string | null,
): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("PUT", endpoints.usersRecoveryEmail, { json: { email } });
}

export async function verifyUserEmail(token: string): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.usersEmailVerify, { json: { token } });
}

export async function listUserLoginHistory(getToken: () => string | null): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("GET", endpoints.usersLoginHistory);
}

/** GET /api/users/me/user-key — identifiant public utilisateur (ex: "x-th-a1b2c"). */
export async function getUserKey(
  getToken: () => string | null,
): Promise<string | null> {
  const { request } = client(getToken);
  const raw = await request<unknown>("GET", endpoints.usersMeUserKey);
  const data = unwrapApiData<{ user_key?: unknown }>(raw);
  return typeof data?.user_key === "string" ? data.user_key : null;
}

export async function fetchUser(
  userId: string,
  getToken: () => string | null,
  options?: { include_pin_hash?: boolean },
): Promise<User> {
  const { request } = client(getToken);
  const basePath = endpoints.userById(userId);
  const path = options?.include_pin_hash ? `${basePath}?include_pin_hash=true` : basePath;
  const json = await request<unknown>("GET", path);
  return parseUser(unwrapApiData(json));
}

/** Aligné Postman : `[UTILISATEUR] PATCH Update user profile` — `nom`, `prenom`, `username` et/ou `pin` (route protégée). */
export type UpdateUserProfilePayload = {
  nom?: string;
  prenom?: string;
  username?: string;
  pin?: string;
};

export async function updateUserProfile(
  userId: string,
  payload: UpdateUserProfilePayload,
  getToken: () => string | null,
): Promise<User> {
  const body: Record<string, string> = {};
  if (payload.nom !== undefined) body.nom = payload.nom.trim();
  if (payload.prenom !== undefined) body.prenom = payload.prenom.trim();
  if (payload.username !== undefined) body.username = payload.username.trim().toLowerCase();
  if (payload.pin !== undefined && payload.pin.trim().length > 0) {
    body.pin = payload.pin.trim();
  }
  if (Object.keys(body).length === 0) {
    throw new Error("Indiquez au moins une modification.");
  }
  const { request } = client(getToken);
  const json = await request<unknown>("PATCH", endpoints.userById(userId), {
    json: body,
  });
  return parseUser(unwrapApiData(json));
}

export async function registerUser(
  payload: RegisterPayload,
  getToken: () => string | null,
): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("POST", endpoints.users, { json: payload });
}

/** Postman : `[UTILISATEUR] DELETE Delete own account`. */
export async function deleteUserAccount(
  userId: string,
  getToken: () => string | null,
): Promise<void> {
  const { request } = client(getToken);
  await request<unknown>("DELETE", endpoints.userById(userId));
}

export async function fetchPinRecoveryQuestions(phone: string): Promise<any> {
  const { request } = createHttpClient();
  return request<any>("POST", "/users/pin-recovery/questions", { json: { phone } });
}

export async function confirmPinRecovery(payload: {
  user_id: string;
  answers: { question_id: string; answer: string }[];
  pin: string;
  pin_confirmation: string;
}): Promise<any> {
  const { request } = createHttpClient();
  return request<any>("POST", "/users/pin-recovery/confirm", { json: payload });
}

export async function deactivateDevice(
  deviceId: string,
  getToken: () => string | null
): Promise<any> {
  const { request } = client(getToken);
  return request<any>("POST", `/users/me/devices/${deviceId}/deactivate`, { json: {} });
}

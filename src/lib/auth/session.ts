import { AUTH_SESSION_COOKIE } from "@/lib/config/auth-constants";

const TOKEN_KEY = "otp_hora_access_token";
const USER_ID_KEY = "otp_hora_user_id";
const REFRESH_KEY = "otp_hora_refresh_token";

export { AUTH_SESSION_COOKIE };

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(USER_ID_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFRESH_KEY);
}

function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  document.cookie = `${AUTH_SESSION_COOKIE}=1; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0`;
}

export function setSession(
  token: string,
  userId: string,
  refreshToken?: string | null,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_ID_KEY, userId);
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_KEY, refreshToken);
  }
  setAuthCookie();
}

/** Mise à jour après un refresh-token (garde `userId` inchangé). */
export function updateAccessToken(
  token: string,
  refreshToken?: string | null,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_KEY, refreshToken);
  }
  setAuthCookie();
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  clearAuthCookie();
}

export function hasSessionClient(): boolean {
  return Boolean(getAccessToken() && getUserId());
}

/**
 * Vérifie qu'un paramètre `redirect` est une URL RELATIVE interne :
 *  - commence par `/`
 *  - ne commence pas par `//` ou `/\` (évite les open redirects protocol-relative).
 */
export function isSafeRedirectPath(value: string | null | undefined): value is string {
  if (!value) return false;
  if (value.length < 1 || value.length > 500) return false;
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//") || value.startsWith("/\\")) return false;
  return true;
}

import { AUTH_SESSION_COOKIE } from "@/lib/config/auth-constants";

const TOKEN_KEY = "otp_hora_access_token";
const USER_ID_KEY = "otp_hora_user_id";

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

function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  document.cookie = `${AUTH_SESSION_COOKIE}=1; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0`;
}

export function setSession(token: string, userId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_ID_KEY, userId);
  setAuthCookie();
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
  clearAuthCookie();
}

export function hasSessionClient(): boolean {
  return Boolean(getAccessToken() && getUserId());
}

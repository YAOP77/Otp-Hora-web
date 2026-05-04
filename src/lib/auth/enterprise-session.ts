import { AUTH_ENTERPRISE_SESSION_COOKIE } from "@/lib/config/auth-constants";

const ACCESS = "otp_hora_enterprise_access_token";
const REFRESH = "otp_hora_enterprise_refresh_token";
const COMPANY_ID = "otp_hora_enterprise_company_id";

export { AUTH_ENTERPRISE_SESSION_COOKIE };

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function setEnterpriseCookie(): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  document.cookie = `${AUTH_ENTERPRISE_SESSION_COOKIE}=1; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

function clearEnterpriseCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_ENTERPRISE_SESSION_COOKIE}=; path=/; max-age=0`;
}

export function getEnterpriseAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS);
}

export function getEnterpriseRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFRESH);
}

export function getCompanyId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(COMPANY_ID);
}

export function setEnterpriseSession(opts: {
  access_token: string;
  refresh_token?: string;
  company_id?: string;
}): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ACCESS, opts.access_token);
  if (opts.refresh_token) sessionStorage.setItem(REFRESH, opts.refresh_token);
  if (opts.company_id) sessionStorage.setItem(COMPANY_ID, opts.company_id);
  setEnterpriseCookie();
}

export function clearEnterpriseSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACCESS);
  sessionStorage.removeItem(REFRESH);
  sessionStorage.removeItem(COMPANY_ID);
  clearEnterpriseCookie();
}

export function hasEnterpriseSessionClient(): boolean {
  return Boolean(getEnterpriseAccessToken());
}

/** Extraction des jetons depuis les réponses login / register entreprise (doc §3.13–3.14). */
export function extractEnterpriseAuth(raw: unknown): {
  access_token: string;
  refresh_token?: string;
  company_id?: string;
} | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const auth = o.auth;
  if (!auth || typeof auth !== "object") return null;
  const a = auth as Record<string, unknown>;
  const access_token =
    typeof a.access_token === "string"
      ? a.access_token
      : typeof a.accessToken === "string"
        ? a.accessToken
        : null;
  if (!access_token) return null;
  const refresh_token =
    typeof a.refresh_token === "string"
      ? a.refresh_token
      : typeof a.refreshToken === "string"
        ? a.refreshToken
        : undefined;
  const data = o.data;
  let company_id: string | undefined;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.company_id === "string") company_id = d.company_id;
  }
  return { access_token, refresh_token, company_id };
}

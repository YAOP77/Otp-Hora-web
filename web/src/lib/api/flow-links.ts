import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";
import { tryRefreshUserSession } from "@/lib/auth/user-http";

/**
 * Infos publiques d'une liaison OAuth-like (pas d'auth requise).
 * Utilisé par la page /enterprise?link_id=... pour afficher le
 * nom de l'application partenaire et l'état courant de la liaison.
 */
export type FlowLinkPublic = {
  link_id: string;
  enterprise_name: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
};

type ApiEnvelope<T> = { data?: T } | T;

function unwrap<T>(raw: ApiEnvelope<T>): T {
  if (raw && typeof raw === "object" && "data" in (raw as object)) {
    const d = (raw as { data?: T }).data;
    if (d !== undefined) return d;
  }
  return raw as T;
}

/** GET /api/flow/links/:link_id — public, sans token. */
export async function getFlowLinkPublic(linkId: string): Promise<FlowLinkPublic> {
  const { request } = createHttpClient();
  const raw = await request<ApiEnvelope<FlowLinkPublic>>(
    "GET",
    endpoints.flowLinkPublic(linkId),
  );
  return unwrap(raw);
}

/** POST /api/me/links/:link_id/approve — Bearer utilisateur. */
export async function approveFlowLink(
  linkId: string,
  getToken: () => string | null,
): Promise<{ link_id: string; status: "approved" }> {
  const { request } = createHttpClient({ getToken, onUnauthorized: tryRefreshUserSession });
  const raw = await request<ApiEnvelope<{ link_id: string; status: "approved" }>>(
    "POST",
    endpoints.meLinkApprove(linkId),
    { json: {} },
  );
  return unwrap(raw);
}

/** POST /api/me/links/:link_id/reject — Bearer utilisateur. */
export async function rejectFlowLink(
  linkId: string,
  getToken: () => string | null,
): Promise<{ link_id: string; status: "rejected" }> {
  const { request } = createHttpClient({ getToken, onUnauthorized: tryRefreshUserSession });
  const raw = await request<ApiEnvelope<{ link_id: string; status: "rejected" }>>(
    "POST",
    endpoints.meLinkReject(linkId),
    { json: {} },
  );
  return unwrap(raw);
}

/** Valide le format UUID (v1-v5) avant l'appel API pour éviter un 400 serveur. */
export function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export type LinkStatus = "pending" | "approved" | "rejected";

export type UserLinkItem = {
  link_id: string;
  company_id: string;
  nom_entreprise: string;
  status: LinkStatus;
  created_at?: string;
  updated_at?: string;
};

/** GET /api/me/links — historique côté utilisateur, filtrable. */
export async function listUserLinks(
  getToken: () => string | null,
  status?: LinkStatus,
): Promise<UserLinkItem[]> {
  const { request } = createHttpClient({
    getToken,
    onUnauthorized: tryRefreshUserSession,
  });
  const path = status
    ? `${endpoints.meLinks}?status=${encodeURIComponent(status)}`
    : endpoints.meLinks;
  const raw = await request<ApiEnvelope<UserLinkItem[]>>("GET", path);
  const list = unwrap(raw);
  return Array.isArray(list) ? list : [];
}

export type EnterpriseLinkItem = {
  link_id: string;
  user_id: string;
  user?: {
    user_id?: string;
    user_key?: string;
    nom?: string;
    prenom?: string;
  };
  status: LinkStatus;
  created_at?: string;
  updated_at?: string;
};

/** GET /api/enterprises/me/links — historique côté entreprise. */
export async function listEnterpriseLinks(
  getToken: () => string | null,
  status?: LinkStatus,
): Promise<EnterpriseLinkItem[]> {
  const { request } = createHttpClient({ getToken });
  const path = status
    ? `${endpoints.enterprisesLinks}?status=${encodeURIComponent(status)}`
    : endpoints.enterprisesLinks;
  const raw = await request<ApiEnvelope<EnterpriseLinkItem[]>>("GET", path);
  const list = unwrap(raw);
  return Array.isArray(list) ? list : [];
}

import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";

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
  const { request } = createHttpClient({ getToken });
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
  const { request } = createHttpClient({ getToken });
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

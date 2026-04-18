import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";
import { tryRefreshUserSession } from "@/lib/auth/user-http";

export type EnterpriseAuthHeaders = {
  token?: string | null;
  apiKey?: string | null;
};

function enterpriseHeaders(auth: EnterpriseAuthHeaders): HeadersInit | undefined {
  if (!auth.apiKey) return undefined;
  return { "x-api-key": auth.apiKey };
}

export async function requestIdentityLink(
  external_ref: string,
  auth: EnterpriseAuthHeaders,
): Promise<unknown> {
  const { request } = createHttpClient({
    getToken: () => auth.token ?? null,
  });
  return request<unknown>("POST", endpoints.links, {
    headers: enterpriseHeaders(auth),
    json: { external_ref },
  });
}

export async function confirmIdentityLink(
  payload: { link_id: string; user_id: string },
  getUserToken: () => string | null,
): Promise<unknown> {
  const { request } = createHttpClient({
    getToken: getUserToken,
    onUnauthorized: tryRefreshUserSession,
  });
  return request<unknown>("POST", endpoints.linksConfirm, { json: payload });
}


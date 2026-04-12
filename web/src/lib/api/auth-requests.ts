import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";

export type EnterpriseAuthHeaders = {
  token?: string | null;
  apiKey?: string | null;
};

function enterpriseClient(auth: EnterpriseAuthHeaders) {
  return createHttpClient({
    getToken: () => auth.token ?? null,
  });
}

function enterpriseHeaders(auth: EnterpriseAuthHeaders): HeadersInit | undefined {
  if (!auth.apiKey) return undefined;
  return { "x-api-key": auth.apiKey };
}

export async function createAuthRequest(
  link_id: string,
  auth: EnterpriseAuthHeaders,
): Promise<unknown> {
  const { request } = enterpriseClient(auth);
  return request<unknown>("POST", endpoints.authRequest, {
    headers: enterpriseHeaders(auth),
    json: { link_id },
  });
}

export async function getAuthStatus(
  request_id: string,
  auth: EnterpriseAuthHeaders,
): Promise<unknown> {
  const { request } = enterpriseClient(auth);
  return request<unknown>("GET", endpoints.authStatus(request_id), {
    headers: enterpriseHeaders(auth),
  });
}

export async function getAuthEvents(
  request_id: string,
  auth: EnterpriseAuthHeaders,
): Promise<unknown> {
  const { request } = enterpriseClient(auth);
  return request<unknown>("GET", endpoints.authEvents(request_id), {
    headers: enterpriseHeaders(auth),
  });
}

export async function approveAuthRequest(
  request_id: string,
  user_id: string,
  getUserToken: () => string | null,
): Promise<unknown> {
  const { request } = createHttpClient({ getToken: getUserToken });
  return request<unknown>("POST", endpoints.authApprove(request_id), { json: { user_id } });
}

export async function rejectAuthRequest(
  request_id: string,
  user_id: string,
  getUserToken: () => string | null,
): Promise<unknown> {
  const { request } = createHttpClient({ getToken: getUserToken });
  return request<unknown>("POST", endpoints.authReject(request_id), { json: { user_id } });
}


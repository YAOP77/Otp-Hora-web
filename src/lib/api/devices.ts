import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";
import { tryRefreshUserSession } from "@/lib/auth/user-http";

export async function registerUserDevice(
  payload: { device_fingerprint: string; device_name?: string },
  getUserToken: () => string | null,
): Promise<unknown> {
  const { request } = createHttpClient({
    getToken: getUserToken,
    onUnauthorized: tryRefreshUserSession,
  });
  return request<unknown>("POST", endpoints.devices, { json: payload });
}

export async function registerEnterpriseDevice(
  payload: { device_fingerprint: string; device_name?: string },
  getEnterpriseToken: () => string | null,
): Promise<unknown> {
  const { request } = createHttpClient({ getToken: getEnterpriseToken });
  return request<unknown>("POST", endpoints.enterprisesDevices, { json: payload });
}

export async function getEnterpriseDevices(getToken: () => string | null): Promise<unknown> {
  const { request } = createHttpClient({ getToken });
  return request<unknown>("GET", endpoints.enterprisesDevices);
}

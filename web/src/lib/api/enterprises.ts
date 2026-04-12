import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";

function client(getToken: () => string | null) {
  return createHttpClient({ getToken });
}

export type EnterpriseRegisterPayload = Record<string, unknown>;

export async function registerEnterprise(
  payload: EnterpriseRegisterPayload,
): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.enterprisesRegister, { json: payload });
}

export type EnterpriseLoginPayload = {
  phone: string;
  pin: string;
};

export async function loginEnterprise(
  payload: EnterpriseLoginPayload,
): Promise<unknown> {
  const { request } = createHttpClient();
  // Doc: téléphone alias + `pin`
  return request<unknown>("POST", endpoints.enterprisesLogin, {
    json: { phone: payload.phone, pin: payload.pin },
  });
}

export async function refreshEnterpriseToken(refresh_token: string): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.enterprisesRefreshToken, {
    json: { refresh_token },
  });
}

export async function unlockEnterpriseSession(
  refresh_token: string,
  pin: string,
): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.enterprisesSessionUnlock, {
    json: { refresh_token, pin },
  });
}

export async function setEnterpriseRecoveryEmail(
  email: string,
  getToken: () => string | null,
): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("PUT", endpoints.enterprisesRecoveryEmail, { json: { email } });
}

export async function verifyEnterpriseEmail(token: string): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.enterprisesEmailVerify, { json: { token } });
}

export async function fetchEnterpriseMe(getToken: () => string | null): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("GET", endpoints.enterprisesMe);
}

export async function updateEnterpriseMe(
  payload: Record<string, unknown>,
  getToken: () => string | null,
): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("PATCH", endpoints.enterprisesMe, { json: payload });
}

export async function deleteEnterpriseMe(
  pin: string,
  getToken: () => string | null,
): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("DELETE", endpoints.enterprisesMe, { json: { pin } });
}

export async function logoutEnterprise(getToken: () => string | null): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("POST", endpoints.enterprisesLogout, { json: {} });
}

export async function listEnterpriseDevices(getToken: () => string | null): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("GET", endpoints.enterprisesDevices);
}

export async function registerEnterpriseDevice(
  payload: { device_fingerprint: string; device_name?: string },
  getToken: () => string | null,
): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("POST", endpoints.enterprisesDevices, { json: payload });
}

export async function listEnterpriseLinkedUsers(getToken: () => string | null): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("GET", endpoints.enterprisesLinkedUsers);
}

export async function listEnterpriseLoginHistory(getToken: () => string | null): Promise<unknown> {
  const { request } = client(getToken);
  return request<unknown>("GET", endpoints.enterprisesLoginHistory);
}

// Aliases for ease of use in page views
export const getEnterpriseDevices = listEnterpriseDevices;
export const getEnterpriseLinkedUsers = listEnterpriseLinkedUsers;
export const getEnterpriseLoginHistory = listEnterpriseLoginHistory;
export const updateEnterpriseRecoveryEmail = setEnterpriseRecoveryEmail;

export async function setEnterprisePIN(
  payload: { pin: string },
  getToken: () => string | null,
): Promise<unknown> {
  return updateEnterpriseMe(payload, getToken);
}


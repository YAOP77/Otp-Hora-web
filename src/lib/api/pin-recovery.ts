import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";

export async function requestUserPinRecovery(payload: {
  contact?: string;
  phone?: string;
  phone_number?: string;
}): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.usersPinRecoveryRequest, { json: payload });
}

export async function confirmUserPinRecovery(payload: {
  token: string;
  pin: string;
}): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.usersPinRecoveryConfirm, {
    json: { token: payload.token, pin: payload.pin },
  });
}

export async function requestEnterprisePinRecovery(payload: {
  contact?: string;
  phone?: string;
  phone_number?: string;
}): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.enterprisesPinRecoveryRequest, {
    json: payload,
  });
}

export async function confirmEnterprisePinRecovery(payload: {
  token: string;
  pin: string;
}): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.enterprisesPinRecoveryConfirm, {
    json: { token: payload.token, pin: payload.pin },
  });
}


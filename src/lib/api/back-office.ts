import { createHttpClient } from "@/lib/api/http-client";

function client(getToken?: () => string | null) {
  return createHttpClient({ getToken: getToken || (() => null) });
}

export async function loginAdmin(email: string, password: string): Promise<any> {
  const { request } = client();
  return request<any>("POST", "/api/back-office/login", { json: { email, password } });
}

export async function fetchUsers(
  getToken: () => string | null,
  search?: string
): Promise<any> {
  const { request } = client(getToken);
  const url = search
    ? `/api/back-office/users?search=${encodeURIComponent(search)}`
    : "/api/back-office/users";
  return request<any>("GET", url);
}

export async function fetchUserDetails(
  userId: string,
  getToken: () => string | null
): Promise<any> {
  const { request } = client(getToken);
  return request<any>("GET", `/api/back-office/users/${userId}`);
}

export async function changeUserStatus(
  userId: string,
  status: "active" | "suspended" | "blocked",
  getToken: () => string | null
): Promise<any> {
  const { request } = client(getToken);
  return request<any>("PATCH", `/api/back-office/users/${userId}/status`, { json: { status } });
}

export async function deactivateUserDevices(
  userId: string,
  getToken: () => string | null
): Promise<any> {
  const { request } = client(getToken);
  return request<any>("POST", `/api/back-office/users/${userId}/devices/deactivate`, { json: {} });
}

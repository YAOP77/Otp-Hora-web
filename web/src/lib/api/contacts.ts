import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";

export async function createContact(payload: {
  user_id: string;
  phone_number: string;
}): Promise<unknown> {
  const { request } = createHttpClient();
  return request<unknown>("POST", endpoints.contacts, { json: payload });
}


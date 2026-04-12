import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";

export async function healthcheck(): Promise<string> {
  const { request } = createHttpClient();
  return request<string>("GET", endpoints.health, { expect: "text" });
}


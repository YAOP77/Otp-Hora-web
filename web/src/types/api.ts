import { z } from "zod";

const userContactSchema = z
  .object({
    phone_number: z.string().optional(),
    verified_at: z.string().nullable().optional(),
  })
  .passthrough();

/** Schéma tolérant : backend OTP Hora expose souvent `nom` / `prenom` / `user_id` (voir Postman). */
export const userSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().optional(),
    user_id: z.string().optional(),
    phone: z.string().optional(),
    name: z.string().optional(),
    nom: z.string().optional(),
    prenom: z.string().optional(),
    email: z.string().optional(),
    status: z.string().optional(),
    contacts: z.array(userContactSchema).optional(),
    devices: z.array(z.unknown()).optional(),
    linked_accounts_count: z.number().optional(),
    linked_accounts: z.array(z.unknown()).optional(),
  })
  .passthrough();

export type User = z.infer<typeof userSchema>;

export function parseUser(json: unknown): User {
  const r = userSchema.safeParse(json);
  if (r.success) return r.data;
  return typeof json === "object" && json !== null
    ? ({ ...json } as User)
    : {};
}

const loginResponseSchema = z
  .object({
    token: z.string().optional(),
    accessToken: z.string().optional(),
    access_token: z.string().optional(),
    auth: z.any().optional(),
    data: z.any().optional(),
    user: userSchema.optional(),
    userId: z.string().optional(),
  })
  .passthrough();

export type LoginResponseRaw = z.infer<typeof loginResponseSchema>;

export function parseLoginResponse(json: unknown): LoginResponseRaw {
  const r = loginResponseSchema.safeParse(json);
  if (r.success) return r.data;
  return json !== null && typeof json === "object"
    ? (json as LoginResponseRaw)
    : {};
}

/**
 * Réponses login Postman : `auth.access_token`, `auth.refresh_token`, `data.user_id`.
 */
export function extractAccessToken(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  if (typeof o.token === "string") return o.token;
  if (typeof o.accessToken === "string") return o.accessToken;
  if (typeof o.access_token === "string") return o.access_token;

  const auth = o.auth;
  if (auth && typeof auth === "object") {
    const a = auth as Record<string, unknown>;
    if (typeof a.access_token === "string") return a.access_token;
    if (typeof a.accessToken === "string") return a.accessToken;
  }

  const data = o.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.access_token === "string") return d.access_token;
    if (typeof d.accessToken === "string") return d.accessToken;
  }

  return null;
}

export function extractUserId(json: unknown, fallbackPhone?: string): string | null {
  if (!json || typeof json !== "object") return fallbackPhone ?? null;
  const o = json as Record<string, unknown>;
  if (typeof o.userId === "string") return o.userId;

  const data = o.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.user_id === "string") return d.user_id;
    if (typeof d.userId === "string") return d.userId;
  }

  const u = o.user;
  if (u && typeof u === "object") {
    const usr = u as Record<string, unknown>;
    if (typeof usr.id === "string") return usr.id;
    if (typeof usr.userId === "string") return usr.userId;
    if (typeof usr.user_id === "string") return usr.user_id;
  }

  return fallbackPhone ?? null;
}

/** Réponse API enveloppée `{ data: ... }` (Postman / Express). */
export function unwrapApiData<T = unknown>(json: unknown): T {
  if (json && typeof json === "object" && "data" in json) {
    const d = (json as { data: unknown }).data;
    if (d !== undefined) return d as T;
  }
  return json as T;
}

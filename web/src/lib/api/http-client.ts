import { getApiBaseUrl } from "@/lib/config/env";
import { ApiError, extractBackendError } from "@/lib/api/errors";

/**
 * Un seul budget pour tout le `fetch` (TCP + TLS + réponse + lecture du corps).
 * Un « connect » court + « read » long en parallèle sur le même signal annulait
 * la requête à 15 s alors que Render / serveurs froids peuvent dépasser ce délai.
 */
const REQUEST_TIMEOUT_MS = 120_000;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpClientOptions = {
  getToken?: () => string | null;
  /**
   * Appelé quand une réponse 401 est reçue : doit tenter de renouveler le
   * token et renvoyer le nouveau `access_token` (ou `null` si le refresh
   * échoue). Si un token est renvoyé, la requête originale est rejouée
   * UNE seule fois avec le nouveau token.
   */
  onUnauthorized?: () => Promise<string | null>;
};

export type ApiFetchExpect = "json" | "text";

function mergeSignal(a: AbortSignal | undefined, b: AbortSignal): AbortSignal {
  if (!a) return b;
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (a.aborted || b.aborted) {
    controller.abort();
    return controller.signal;
  }
  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });
  return controller.signal;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function messageFromBody(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const o = body as Record<string, unknown>;
  if (typeof o.message === "string") return o.message;
  if (typeof o.error === "string") return o.error;
  if (typeof o.detail === "string") return o.detail;
  const backend = extractBackendError(body);
  if (backend.message) return backend.message;
  return undefined;
}

export function createHttpClient(options: HttpClientOptions = {}) {
  const { getToken, onUnauthorized } = options;

  async function runOnce<T>(
    method: HttpMethod,
    path: string,
    init: (RequestInit & { json?: unknown; expect?: ApiFetchExpect }) | undefined,
    forcedToken: string | null,
  ): Promise<{ ok: true; data: T } | { ok: false; status: number; parsedBody: unknown; contentType: string; shouldParseJson: boolean }> {
    const base = getApiBaseUrl();
    if (!base) {
      throw new ApiError(
        "NEXT_PUBLIC_API_BASE_URL n’est pas défini. Copiez .env.example vers .env.local.",
        { code: "validation" },
      );
    }

    const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = new Headers(init?.headers);
    const expect: ApiFetchExpect = init?.expect ?? "json";
    if (!headers.has("Accept")) {
      headers.set("Accept", expect === "text" ? "text/plain, */*" : "application/json");
    }

    const token = forcedToken ?? getToken?.() ?? null;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let body: BodyInit | undefined =
      init?.body === null ? undefined : (init?.body as BodyInit | undefined);
    if (init?.json !== undefined) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(init.json);
    }

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);
    const signal = mergeSignal(init?.signal ?? undefined, timeoutController.signal);

    try {
      const response = await fetch(url, {
        ...init,
        method,
        headers,
        body,
        signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("Content-Type") ?? "";
      const shouldParseJson =
        expect === "json" &&
        (contentType.includes("application/json") || contentType.includes("+json"));

      const parsedBody = shouldParseJson
        ? await parseJsonSafe(response)
        : await response.text();

      if (!response.ok) {
        return { ok: false, status: response.status, parsedBody, contentType, shouldParseJson };
      }

      return { ok: true, data: parsedBody as T };
    } catch (e) {
      clearTimeout(timeoutId);
      if (e instanceof ApiError) throw e;
      if (e instanceof DOMException && e.name === "AbortError") {
        throw new ApiError("Délai dépassé ou requête annulée.", {
          code: "network",
          cause: e,
        });
      }
      if (e instanceof TypeError) {
        throw new ApiError("Impossible de joindre le serveur (réseau).", {
          code: "network",
          cause: e,
        });
      }
      throw new ApiError("Erreur inattendue.", { code: "parse", cause: e });
    }
  }

  async function request<T>(
    method: HttpMethod,
    path: string,
    init?: RequestInit & { json?: unknown; expect?: ApiFetchExpect },
  ): Promise<T> {
    let result = await runOnce<T>(method, path, init, null);

    if (!result.ok && result.status === 401 && onUnauthorized) {
      const newToken = await onUnauthorized();
      if (newToken) {
        result = await runOnce<T>(method, path, init, newToken);
      }
    }

    if (result.ok) return result.data;

    const { parsedBody, shouldParseJson, status } = result;
    const backend = shouldParseJson ? extractBackendError(parsedBody) : {};
    const msg =
      messageFromBody(shouldParseJson ? parsedBody : undefined) ??
      `Erreur HTTP ${status}`;
    throw new ApiError(msg, {
      code: "http",
      status: backend.status ?? status,
      backendCode: backend.code,
      body: parsedBody,
    });
  }

  return { request };
}

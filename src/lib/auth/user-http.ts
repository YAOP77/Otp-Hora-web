import { endpoints } from "@/lib/api/endpoints";
import { createHttpClient } from "@/lib/api/http-client";
import {
  getRefreshToken,
  updateAccessToken,
} from "@/lib/auth/session";
import { extractAccessToken, extractRefreshToken } from "@/types/api";

/**
 * Intercepteur global des 401 pour les requêtes utilisateur :
 * tente un `POST /users/refresh-token` avec le refresh_token stocké.
 * Renvoie le nouveau access_token (stocké dans la session) ou `null` si
 * le refresh échoue — auquel cas l'appelant devra rediriger vers /login.
 *
 * Déduplication : si plusieurs 401 arrivent en parallèle, une seule
 * requête de refresh est envoyée, les autres attendent son résultat.
 */
let inflightRefresh: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const rt = getRefreshToken();
  if (!rt) return null;
  // Client RAW : pas d'onUnauthorized pour éviter toute récursion infinie.
  const { request } = createHttpClient();
  try {
    const json = await request<unknown>("POST", endpoints.usersRefreshToken, {
      json: { refresh_token: rt },
    });
    const newToken = extractAccessToken(json);
    const newRefresh = extractRefreshToken(json);
    if (!newToken) return null;
    updateAccessToken(newToken, newRefresh);
    return newToken;
  } catch {
    return null;
  }
}

export async function tryRefreshUserSession(): Promise<string | null> {
  if (inflightRefresh) return inflightRefresh;
  inflightRefresh = performRefresh().finally(() => {
    inflightRefresh = null;
  });
  return inflightRefresh;
}

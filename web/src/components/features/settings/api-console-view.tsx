"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { healthcheck } from "@/lib/api/health";
import {
  deleteUserAccount,
  fetchUser,
  listUserLoginHistory,
  logout,
  refreshUserToken,
  registerUser,
  setUserRecoveryEmail,
  unlockUserSession,
  updateUserProfile,
  verifyUserEmail,
} from "@/lib/api/users";
import {
  deleteEnterpriseMe,
  fetchEnterpriseMe,
  listEnterpriseDevices,
  listEnterpriseLinkedUsers,
  listEnterpriseLoginHistory,
  loginEnterprise,
  logoutEnterprise,
  refreshEnterpriseToken,
  registerEnterprise,
  registerEnterpriseDevice,
  setEnterpriseRecoveryEmail,
  unlockEnterpriseSession,
  updateEnterpriseMe,
  verifyEnterpriseEmail,
} from "@/lib/api/enterprises";
import {
  approveAuthRequest,
  createAuthRequest,
  getAuthEvents,
  getAuthStatus,
  rejectAuthRequest,
} from "@/lib/api/auth-requests";
import { createContact } from "@/lib/api/contacts";
import { registerUserDevice } from "@/lib/api/devices";
import { confirmIdentityLink, requestIdentityLink } from "@/lib/api/links";
import {
  confirmEnterprisePinRecovery,
  confirmUserPinRecovery,
  requestEnterprisePinRecovery,
  requestUserPinRecovery,
} from "@/lib/api/pin-recovery";
import { ApiError, isApiError } from "@/lib/api/errors";
import { getAccessToken, getUserId } from "@/lib/auth/session";
import { isApiConfigured } from "@/lib/config/env";
import { useMemo, useState } from "react";

function pretty(v: unknown) {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

type Output = { ok: true; data: unknown } | { ok: false; error: unknown };

export function ApiConsoleView() {
  const [output, setOutput] = useState<Output | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Inputs génériques
  const [userId, setUserId] = useState<string>(() => getUserId() ?? "");
  const [userToken, setUserToken] = useState<string>(() => getAccessToken() ?? "");
  const getUserToken = useMemo(() => () => (userToken.trim() ? userToken.trim() : null), [userToken]);

  const [enterpriseToken, setEnterpriseToken] = useState<string>("");
  const [enterpriseApiKey, setEnterpriseApiKey] = useState<string>("");

  const enterpriseAuth = useMemo(
    () => ({ token: enterpriseToken.trim() || null, apiKey: enterpriseApiKey.trim() || null }),
    [enterpriseToken, enterpriseApiKey],
  );

  const [uuid, setUuid] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [externalRef, setExternalRef] = useState("");
  const [deviceFingerprint, setDeviceFingerprint] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [includePinHash, setIncludePinHash] = useState(false);

  const [jsonBody, setJsonBody] = useState<string>('{}');

  async function run(label: string, fn: () => Promise<unknown>) {
    setOutput(null);
    if (!isApiConfigured()) {
      setOutput({ ok: false, error: new Error("Configurez NEXT_PUBLIC_API_BASE_URL dans .env.local.") });
      return;
    }
    setBusy(label);
    try {
      const data = await fn();
      setOutput({ ok: true, data });
    } catch (e) {
      setOutput({ ok: false, error: e });
    } finally {
      setBusy(null);
    }
  }

  function parseJsonInput(): Record<string, unknown> {
    try {
      const v = JSON.parse(jsonBody) as unknown;
      if (v && typeof v === "object") return v as Record<string, unknown>;
      throw new Error("Le JSON doit être un objet.");
    } catch (e) {
      throw new ApiError("JSON invalide pour le body.", { code: "validation", cause: e });
    }
  }

  function parseUserPatchInput(): { nom?: string; prenom?: string; pin?: string } {
    const raw = parseJsonInput();
    const out: { nom?: string; prenom?: string; pin?: string } = {};
    if (typeof raw.nom === "string") out.nom = raw.nom;
    if (typeof raw.prenom === "string") out.prenom = raw.prenom;
    if (typeof raw.pin === "string") out.pin = raw.pin;
    if (typeof raw.PIN === "string" && out.pin === undefined) out.pin = raw.PIN;
    if (typeof raw.code_pin === "string" && out.pin === undefined) out.pin = raw.code_pin;
    return out;
  }

  const errorForBanner = output && !output.ok ? output.error : null;

  return (
    <div className="space-y-8">
      <ErrorBanner error={errorForBanner} />

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
        <h3 className="text-sm font-semibold text-foreground">Contexte d’auth</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="api-user-id">User ID (pour routes /users/:user_id et confirm)</Label>
            <Input id="api-user-id" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-user-token">Bearer utilisateur</Label>
            <Input
              id="api-user-token"
              value={userToken}
              onChange={(e) => setUserToken(e.target.value)}
              placeholder="access_token"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-ent-token">Bearer entreprise (requireEnterpriseAuth)</Label>
            <Input
              id="api-ent-token"
              value={enterpriseToken}
              onChange={(e) => setEnterpriseToken(e.target.value)}
              placeholder="access_token (company)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-ent-key">x-api-key (alternative requireEnterpriseAuth)</Label>
            <Input
              id="api-ent-key"
              value={enterpriseApiKey}
              onChange={(e) => setEnterpriseApiKey(e.target.value)}
              placeholder="clé API"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
        <h3 className="text-sm font-semibold text-foreground">Inputs rapides</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="api-phone">Téléphone</Label>
            <Input id="api-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-pin">PIN</Label>
            <Input id="api-pin" value={pin} onChange={(e) => setPin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-refresh">refresh_token</Label>
            <Input id="api-refresh" value={refreshToken} onChange={(e) => setRefreshToken(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-email">Email</Label>
            <Input id="api-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-token">Token (email verify / pin confirm)</Label>
            <Input id="api-token" value={token} onChange={(e) => setToken(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-uuid">UUID (request_id/link_id etc.)</Label>
            <Input id="api-uuid" value={uuid} onChange={(e) => setUuid(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-ext-ref">external_ref</Label>
            <Input id="api-ext-ref" value={externalRef} onChange={(e) => setExternalRef(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-fp">device_fingerprint</Label>
            <Input id="api-fp" value={deviceFingerprint} onChange={(e) => setDeviceFingerprint(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="api-dn">device_name (optionnel)</Label>
            <Input id="api-dn" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="api-include-pin-hash" className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                id="api-include-pin-hash"
                type="checkbox"
                checked={includePinHash}
                onChange={(e) => setIncludePinHash(e.target.checked)}
              />
              include_pin_hash=true pour GET /api/users/:user_id
            </label>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="api-json">Body JSON libre (pour PATCH/POST génériques)</Label>
          <textarea
            id="api-json"
            value={jsonBody}
            onChange={(e) => setJsonBody(e.target.value)}
            className="min-h-28 w-full rounded-xl border border-[var(--dash-border)] bg-background px-3 py-2 font-mono text-xs text-foreground"
          />
          <p className="text-xs text-secondary">
            Astuce: pour respecter la doc, évitez d’envoyer des champs interdits (ex. pas d’email sur PATCH /users/:user_id).
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Actions (39 APIs)</h3>

        <div className="flex flex-wrap gap-2">
          <Button loading={busy === "health"} onClick={() => run("health", () => healthcheck())}>
            1. GET /api/health (text)
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            loading={busy === "users-register"}
            onClick={() => run("users-register", () => registerUser(parseJsonInput(), getUserToken))}
          >
            2. POST /api/users
          </Button>
          <Button
            loading={busy === "users-login"}
            onClick={() =>
              run("users-login", async () => {
                const mod = await import("@/lib/api/users");
                return mod.login({ phone, pin }, getAccessToken);
              })
            }
          >
            3. POST /api/users/login
          </Button>
          <Button
            loading={busy === "users-unlock"}
            onClick={() => run("users-unlock", () => unlockUserSession(refreshToken, pin))}
          >
            4. POST /api/users/session/unlock
          </Button>
          <Button
            loading={busy === "users-refresh"}
            onClick={() => run("users-refresh", () => refreshUserToken(refreshToken))}
          >
            5. POST /api/users/refresh-token
          </Button>
          <Button
            loading={busy === "users-recovery-email"}
            onClick={() => run("users-recovery-email", () => setUserRecoveryEmail(email, getUserToken))}
          >
            6. PUT /api/users/me/recovery-email
          </Button>
          <Button
            loading={busy === "users-email-verify"}
            onClick={() => run("users-email-verify", () => verifyUserEmail(token))}
          >
            7. POST /api/users/email/verify
          </Button>
          <Button
            loading={busy === "users-login-history"}
            onClick={() => run("users-login-history", () => listUserLoginHistory(getUserToken))}
          >
            8. GET /api/users/me/login-history
          </Button>
          <Button
            loading={busy === "users-logout"}
            onClick={() => run("users-logout", () => logout(getUserToken))}
          >
            9. POST /api/users/logout
          </Button>
          <Button
            loading={busy === "users-get"}
            onClick={() =>
              run("users-get", () =>
                fetchUser(userId, getUserToken, { include_pin_hash: includePinHash }),
              )
            }
          >
            10. GET /api/users/:user_id
          </Button>
          <Button
            loading={busy === "users-patch"}
            onClick={() =>
              run("users-patch", () => updateUserProfile(userId, parseUserPatchInput(), getUserToken))
            }
          >
            11. PATCH /api/users/:user_id
          </Button>
          <Button
            loading={busy === "users-delete"}
            onClick={() => run("users-delete", () => deleteUserAccount(userId, getUserToken))}
          >
            12. DELETE /api/users/:user_id
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            loading={busy === "ent-register"}
            onClick={() => run("ent-register", () => registerEnterprise(parseJsonInput()))}
          >
            13. POST /api/enterprises/register
          </Button>
          <Button
            loading={busy === "ent-login"}
            onClick={() => run("ent-login", () => loginEnterprise({ phone, pin }))}
          >
            14. POST /api/enterprises/login
          </Button>
          <Button
            loading={busy === "ent-refresh"}
            onClick={() => run("ent-refresh", () => refreshEnterpriseToken(refreshToken))}
          >
            15. POST /api/enterprises/refresh-token
          </Button>
          <Button
            loading={busy === "ent-unlock"}
            onClick={() => run("ent-unlock", () => unlockEnterpriseSession(refreshToken, pin))}
          >
            16. POST /api/enterprises/session/unlock
          </Button>
          <Button
            loading={busy === "ent-recovery-email"}
            onClick={() =>
              run("ent-recovery-email", () => setEnterpriseRecoveryEmail(email, () => enterpriseAuth.token))
            }
          >
            17. PUT /api/enterprises/me/recovery-email
          </Button>
          <Button
            loading={busy === "ent-email-verify"}
            onClick={() => run("ent-email-verify", () => verifyEnterpriseEmail(token))}
          >
            18. POST /api/enterprises/email/verify
          </Button>
          <Button
            loading={busy === "ent-me"}
            onClick={() => run("ent-me", () => fetchEnterpriseMe(() => enterpriseAuth.token))}
          >
            19. GET /api/enterprises/me
          </Button>
          <Button
            loading={busy === "ent-patch"}
            onClick={() => run("ent-patch", () => updateEnterpriseMe(parseJsonInput(), () => enterpriseAuth.token))}
          >
            20. PATCH /api/enterprises/me
          </Button>
          <Button
            loading={busy === "ent-delete"}
            onClick={() => run("ent-delete", () => deleteEnterpriseMe(pin, () => enterpriseAuth.token))}
          >
            21. DELETE /api/enterprises/me
          </Button>
          <Button
            loading={busy === "ent-logout"}
            onClick={() => run("ent-logout", () => logoutEnterprise(() => enterpriseAuth.token))}
          >
            22. POST /api/enterprises/logout
          </Button>
          <Button
            loading={busy === "ent-devices-get"}
            onClick={() => run("ent-devices-get", () => listEnterpriseDevices(() => enterpriseAuth.token))}
          >
            23. GET /api/enterprises/me/devices
          </Button>
          <Button
            loading={busy === "ent-devices-post"}
            onClick={() =>
              run("ent-devices-post", () =>
                registerEnterpriseDevice(
                  { device_fingerprint: deviceFingerprint, device_name: deviceName || undefined },
                  () => enterpriseAuth.token,
                ),
              )
            }
          >
            24. POST /api/enterprises/me/devices
          </Button>
          <Button
            loading={busy === "ent-linked-users"}
            onClick={() => run("ent-linked-users", () => listEnterpriseLinkedUsers(() => enterpriseAuth.token))}
          >
            25. GET /api/enterprises/me/linked-users
          </Button>
          <Button
            loading={busy === "ent-login-history"}
            onClick={() => run("ent-login-history", () => listEnterpriseLoginHistory(() => enterpriseAuth.token))}
          >
            26. GET /api/enterprises/me/login-history
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            loading={busy === "auth-request"}
            onClick={() => run("auth-request", () => createAuthRequest(uuid, enterpriseAuth))}
          >
            27. POST /api/auth/request
          </Button>
          <Button
            loading={busy === "auth-status"}
            onClick={() => run("auth-status", () => getAuthStatus(uuid, enterpriseAuth))}
          >
            28. GET /api/auth/status/:request_id
          </Button>
          <Button
            loading={busy === "auth-approve"}
            onClick={() => run("auth-approve", () => approveAuthRequest(uuid, userId, getUserToken))}
          >
            29. POST /api/auth/approve/:request_id
          </Button>
          <Button
            loading={busy === "auth-reject"}
            onClick={() => run("auth-reject", () => rejectAuthRequest(uuid, userId, getUserToken))}
          >
            30. POST /api/auth/reject/:request_id
          </Button>
          <Button
            loading={busy === "auth-events"}
            onClick={() => run("auth-events", () => getAuthEvents(uuid, enterpriseAuth))}
          >
            31. GET /api/auth/events/:request_id
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            loading={busy === "upr-request"}
            onClick={() => run("upr-request", () => requestUserPinRecovery({ phone }))}
          >
            32. POST /api/users/pin-recovery/request
          </Button>
          <Button
            loading={busy === "upr-confirm"}
            onClick={() => run("upr-confirm", () => confirmUserPinRecovery({ token, pin }))}
          >
            33. POST /api/users/pin-recovery/confirm
          </Button>
          <Button
            loading={busy === "epr-request"}
            onClick={() => run("epr-request", () => requestEnterprisePinRecovery({ phone }))}
          >
            34. POST /api/enterprises/pin-recovery/request
          </Button>
          <Button
            loading={busy === "epr-confirm"}
            onClick={() => run("epr-confirm", () => confirmEnterprisePinRecovery({ token, pin }))}
          >
            35. POST /api/enterprises/pin-recovery/confirm
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            loading={busy === "links"}
            onClick={() => run("links", () => requestIdentityLink(externalRef, enterpriseAuth))}
          >
            36. POST /api/links
          </Button>
          <Button
            loading={busy === "links-confirm"}
            onClick={() => run("links-confirm", () => confirmIdentityLink({ link_id: uuid, user_id: userId }, getUserToken))}
          >
            37. POST /api/links/confirm
          </Button>
          <Button
            loading={busy === "contacts"}
            onClick={() => run("contacts", () => createContact({ user_id: userId, phone_number: phone }))}
          >
            38. POST /api/contacts
          </Button>
          <Button
            loading={busy === "devices"}
            onClick={() =>
              run("devices", () =>
                registerUserDevice(
                  { device_fingerprint: deviceFingerprint, device_name: deviceName || undefined },
                  getUserToken,
                ),
              )
            }
          >
            39. POST /api/devices
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
        <h3 className="text-sm font-semibold text-foreground">Sortie</h3>
        {output ? (
          <pre className="mt-3 overflow-auto rounded-xl border border-[var(--dash-border)] bg-background p-3 text-xs text-foreground">
            {output.ok
              ? pretty(output.data)
              : (() => {
                  const e = output.error;
                  if (isApiError(e)) {
                    return pretty({
                      type: "ApiError",
                      message: e.message,
                      code: e.code,
                      status: e.status,
                      backendCode: e.backendCode,
                      body: e.body,
                    });
                  }
                  if (e instanceof Error) return pretty({ type: e.name, message: e.message });
                  return pretty(e);
                })()}
          </pre>
        ) : (
          <p className="mt-2 text-sm text-secondary">Lancez une action pour afficher la réponse.</p>
        )}
      </section>
    </div>
  );
}


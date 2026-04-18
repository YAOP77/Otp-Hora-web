"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/ui/pin-input";
import {
  approveFlowLink,
  getFlowLinkPublic,
  isValidUuid,
  rejectFlowLink,
  type FlowLinkPublic,
} from "@/lib/api/flow-links";
import { isApiError } from "@/lib/api/errors";
import { login } from "@/lib/api/users";
import {
  clearSession,
  getAccessToken,
  hasSessionClient,
  setSession,
} from "@/lib/auth/session";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SVGProps } from "react";

function IconCheck(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IconX(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden {...p}>
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  );
}
function IconShield(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconSpinner(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

type ConsentStep =
  | "loading"
  | "invalid-id"
  | "error"
  | "status-approved"
  | "status-rejected"
  | "need-login"
  | "confirm"
  | "approving"
  | "rejecting"
  | "approved-success"
  | "rejected-success";

export function EnterpriseConsentView({ linkId }: { linkId: string }) {
  const validId = useMemo(() => isValidUuid(linkId), [linkId]);

  const [step, setStep] = useState<ConsentStep>(validId ? "loading" : "invalid-id");
  const [link, setLink] = useState<FlowLinkPublic | null>(null);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [actionError, setActionError] = useState<unknown>(null);

  // Login inline state
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState<unknown>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  /** Détermine l'étape suivante en fonction du statut de la liaison + session. */
  const resolveNextStep = useCallback((l: FlowLinkPublic): ConsentStep => {
    if (l.status === "approved") return "status-approved";
    if (l.status === "rejected") return "status-rejected";
    return hasSessionClient() ? "confirm" : "need-login";
  }, []);

  // Chargement initial
  useEffect(() => {
    if (!validId) return;
    let cancelled = false;
    (async () => {
      try {
        const l = await getFlowLinkPublic(linkId);
        if (cancelled) return;
        setLink(l);
        setStep(resolveNextStep(l));
      } catch (e) {
        if (cancelled) return;
        setLoadError(e);
        setStep("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [linkId, validId, resolveNextStep]);

  async function onLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    if (!/^[+\d\s()-]{8,20}$/.test(phone)) {
      setLoginError(new Error("Numéro de téléphone invalide (format E.164)."));
      return;
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setLoginError(new Error("Le code PIN doit contenir 4 à 6 chiffres."));
      return;
    }
    setLoginLoading(true);
    try {
      const res = await login({ phone: phone.trim(), pin }, getAccessToken);
      setSession(res.token, res.userId);
      setPin(""); // jamais conserver le PIN
      if (link) setStep(resolveNextStep(link));
    } catch (err) {
      setLoginError(err);
      setPin("");
    } finally {
      setLoginLoading(false);
    }
  }

  async function onApprove() {
    setActionError(null);
    setStep("approving");
    try {
      await approveFlowLink(linkId, getAccessToken);
      setStep("approved-success");
    } catch (err) {
      if (isApiError(err) && err.status === 401) {
        clearSession();
        setActionError(new Error("Session expirée — veuillez vous reconnecter."));
        setStep("need-login");
        return;
      }
      setActionError(err);
      setStep("confirm");
    }
  }

  async function onReject() {
    setActionError(null);
    setStep("rejecting");
    try {
      await rejectFlowLink(linkId, getAccessToken);
      setStep("rejected-success");
    } catch (err) {
      if (isApiError(err) && err.status === 401) {
        clearSession();
        setActionError(new Error("Session expirée — veuillez vous reconnecter."));
        setStep("need-login");
        return;
      }
      setActionError(err);
      setStep("confirm");
    }
  }

  const entName = link?.enterprise_name ?? "l'application";

  return (
    <div className="fixed inset-0 z-[120] flex min-h-screen items-center justify-center overflow-y-auto bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Image
            src="/assets/image%20app/Hora-Logo.png"
            alt="OTP Hora"
            width={194}
            height={154}
            priority
            className="h-9 w-auto"
          />
          <span className="text-base font-semibold tracking-tight text-foreground">
            OTP Hora
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
          {step === "loading" ? (
            <LoadingState label="Chargement de la demande…" />
          ) : null}

          {step === "invalid-id" ? (
            <ResultState
              tone="error"
              icon={<IconX className="size-7" />}
              title="Lien invalide"
              description="L'identifiant de liaison fourni n'est pas valide. Réessayez depuis l'application partenaire."
            />
          ) : null}

          {step === "error" ? (
            <div className="space-y-4">
              <ResultState
                tone="error"
                icon={<IconX className="size-7" />}
                title="Impossible de charger la demande"
                description="Vérifiez votre connexion ou réessayez plus tard."
              />
              <ErrorBanner error={loadError} />
            </div>
          ) : null}

          {step === "status-approved" ? (
            <ResultState
              tone="success"
              icon={<IconCheck className="size-7" />}
              title={`Vous avez déjà autorisé ${entName}`}
              description="Vous pouvez fermer cette fenêtre et revenir sur l'application."
            />
          ) : null}

          {step === "status-rejected" ? (
            <ResultState
              tone="neutral"
              icon={<IconX className="size-7" />}
              title={`Vous avez refusé la demande de ${entName}`}
              description="Vous pouvez fermer cette fenêtre."
            />
          ) : null}

          {step === "approved-success" ? (
            <ResultState
              tone="success"
              icon={<IconCheck className="size-7" />}
              title="Liaison autorisée"
              description={`${entName} peut désormais vous authentifier via OTP Hora. Vous pouvez fermer cette fenêtre et revenir sur l'application.`}
            />
          ) : null}

          {step === "rejected-success" ? (
            <ResultState
              tone="neutral"
              icon={<IconX className="size-7" />}
              title="Liaison refusée"
              description="La demande a été rejetée. Vous pouvez fermer cette fenêtre."
            />
          ) : null}

          {step === "need-login" ? (
            <>
              <HeaderBlock
                entName={entName}
                subtitle="Connectez-vous à votre compte Hora pour continuer."
              />
              <form className="mt-6 space-y-3" onSubmit={onLoginSubmit} noValidate>
                <ErrorBanner error={loginError ?? actionError} />
                <div>
                  <Label htmlFor="consent-phone" className="text-[11px]">
                    Numéro de téléphone
                  </Label>
                  <Input
                    id="consent-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="h-10 text-sm"
                    disabled={loginLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="consent-pin-0" className="text-[11px]">
                    Code PIN (4 à 6 chiffres)
                  </Label>
                  <div className="mt-1.5 flex justify-center">
                    <PinInput
                      value={pin}
                      onChange={setPin}
                      disabled={loginLoading}
                      length={6}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="h-10 w-full bg-[#0B3A6E] text-xs hover:bg-[#0B3A6E]/90"
                  loading={loginLoading}
                >
                  Se connecter
                </Button>
              </form>
            </>
          ) : null}

          {step === "confirm" || step === "approving" || step === "rejecting" ? (
            <>
              <HeaderBlock
                entName={entName}
                subtitle="demande à vous authentifier avec Hora."
              />

              <div className="mt-5 rounded-lg border border-border/70 bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-secondary dark:bg-zinc-900/40">
                <div className="flex items-start gap-2">
                  <IconShield className="mt-0.5 size-3.5 shrink-0 text-[#0B3A6E] dark:text-[#7dafe6]" />
                  <span>
                    En autorisant, {entName} pourra vérifier votre identité via
                    OTP Hora. Vous pouvez révoquer cette liaison à tout moment
                    depuis votre espace.
                  </span>
                </div>
              </div>

              {actionError ? (
                <div className="mt-3">
                  <ErrorBanner error={actionError} />
                </div>
              ) : null}

              <div className="mt-6 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 text-xs"
                  onClick={onReject}
                  loading={step === "rejecting"}
                  disabled={step === "approving"}
                >
                  Refuser
                </Button>
                <Button
                  type="button"
                  className="h-10 bg-[#0B3A6E] text-xs hover:bg-[#0B3A6E]/90"
                  onClick={onApprove}
                  loading={step === "approving"}
                  disabled={step === "rejecting"}
                >
                  Autoriser
                </Button>
              </div>
            </>
          ) : null}
        </div>

        <p className="mt-6 text-center text-[11px] text-secondary">
          Sécurisé par OTP Hora · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function HeaderBlock({
  entName,
  subtitle,
}: {
  entName: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
        Demande d&apos;authentification
      </p>
      <h1 className="mt-2 text-xl font-extrabold tracking-tight text-foreground">
        <span className="text-[#0B3A6E] dark:text-[#7dafe6]">{entName}</span>
      </h1>
      <p className="mt-1.5 text-sm text-secondary">{subtitle}</p>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <IconSpinner className="size-6 animate-spin text-[#0B3A6E] dark:text-[#7dafe6]" />
      <p className="text-sm text-secondary">{label}</p>
    </div>
  );
}

function ResultState({
  tone,
  icon,
  title,
  description,
}: {
  tone: "success" | "error" | "neutral";
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const palette =
    tone === "success"
      ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
      : tone === "error"
        ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
        : "bg-neutral-100 text-neutral-700 dark:bg-zinc-800 dark:text-zinc-300";

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span
        className={`inline-flex size-14 items-center justify-center rounded-full ${palette}`}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

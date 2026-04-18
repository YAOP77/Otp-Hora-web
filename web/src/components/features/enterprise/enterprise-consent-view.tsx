"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { isApiError } from "@/lib/api/errors";
import {
  approveFlowLink,
  getFlowLinkPublic,
  isValidUuid,
  rejectFlowLink,
  type FlowLinkPublic,
} from "@/lib/api/flow-links";
import {
  clearSession,
  getAccessToken,
  hasSessionClient,
} from "@/lib/auth/session";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { SVGProps } from "react";

/* ─── Icons ─────────────────────────────────────────────────── */
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
  | "confirm"
  | "approving"
  | "rejecting"
  | "approved-success"
  | "rejected-success";

function buildLoginRedirect(): string {
  if (typeof window === "undefined") return "/login";
  const here = `${window.location.pathname}${window.location.search}`;
  const url = new URL("/login", window.location.origin);
  url.searchParams.set("redirect", here);
  return `${url.pathname}${url.search}`;
}

export function EnterpriseConsentView({ linkId }: { linkId: string }) {
  const router = useRouter();
  const validId = useMemo(() => isValidUuid(linkId), [linkId]);

  const [step, setStep] = useState<ConsentStep>(validId ? "loading" : "invalid-id");
  const [link, setLink] = useState<FlowLinkPublic | null>(null);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [actionError, setActionError] = useState<unknown>(null);

  // Chargement + garde d'auth
  useEffect(() => {
    if (!validId) return;

    // Si pas de session, rediriger vers /login en préservant l'URL courante.
    if (!hasSessionClient()) {
      router.replace(buildLoginRedirect());
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const l = await getFlowLinkPublic(linkId);
        if (cancelled) return;
        setLink(l);
        if (l.status === "approved") setStep("status-approved");
        else if (l.status === "rejected") setStep("status-rejected");
        else setStep("confirm");
      } catch (e) {
        if (cancelled) return;
        setLoadError(e);
        setStep("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [linkId, validId, router]);

  function handleAuthLost() {
    clearSession();
    router.replace(buildLoginRedirect());
  }

  function messageForError(e: unknown): string | null {
    if (!isApiError(e)) return null;
    if (e.status === 404) {
      return "Cette demande de liaison ne vous est pas destinée ou a expiré. Contactez la personne qui vous a envoyé ce lien.";
    }
    if (e.status === 409) {
      return "Cette demande de liaison a déjà été traitée.";
    }
    return null;
  }

  async function onApprove() {
    setActionError(null);
    setStep("approving");
    try {
      await approveFlowLink(linkId, getAccessToken);
      setStep("approved-success");
    } catch (err) {
      if (isApiError(err) && err.status === 401) {
        handleAuthLost();
        return;
      }
      const msg = messageForError(err);
      setActionError(msg ? new Error(msg) : err);
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
        handleAuthLost();
        return;
      }
      const msg = messageForError(err);
      setActionError(msg ? new Error(msg) : err);
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

          {step === "confirm" || step === "approving" || step === "rejecting" ? (
            <>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Demande d&apos;authentification
                </p>
                <h1 className="mt-2 text-xl font-extrabold tracking-tight text-foreground">
                  <span className="text-[#0B3A6E] dark:text-[#7dafe6]">
                    {entName}
                  </span>
                </h1>
                <p className="mt-1.5 text-sm text-secondary">
                  demande à vous authentifier avec Hora.
                </p>
              </div>

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

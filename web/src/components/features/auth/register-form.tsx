"use client";

import { HoraBadge } from "@/components/features/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/ui/pin-input";
import { isApiError } from "@/lib/api/errors";
import { registerUserDevice } from "@/lib/api/devices";
import { registerUser } from "@/lib/api/users";
import { getDeviceRegistrationPayload } from "@/lib/auth/device-context";
import { getAccessToken, setSession } from "@/lib/auth/session";
import { isApiConfigured } from "@/lib/config/env";
import { extractAccessToken, extractUserId } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { SVGProps } from "react";

function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="m12 5 7 7-7 7" />
      <path d="M5 12h14" />
    </svg>
  );
}
function IconBuilding(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </svg>
  );
}

const nameSchema = z.object({
  nom: z.string().min(1, "Indiquez votre nom").max(120),
  prenom: z.string().min(1, "Indiquez votre prénom").max(120),
});

const pinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, "PIN : 4 à 6 chiffres"),
});

type NameValues = z.infer<typeof nameSchema>;
type PinValues = z.infer<typeof pinSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [nameData, setNameData] = useState({ nom: "", prenom: "" });
  const [error, setError] = useState<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nameForm = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { nom: "", prenom: "" },
  });

  const pinForm = useForm<PinValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "" },
  });

  const pinValue = pinForm.watch("pin");

  function onNameSubmit(values: NameValues) {
    setError(null);
    setNameData({ nom: values.nom.trim(), prenom: values.prenom.trim() });
    setStep(2);
    pinForm.reset({ pin: "" });
  }

  async function onPinSubmit(values: PinValues) {
    setError(null);
    if (!isApiConfigured()) {
      setError(
        new Error(
          "Configurez NEXT_PUBLIC_API_BASE_URL dans .env.local (voir .env.example).",
        ),
      );
      return;
    }
    try {
      const raw = await registerUser(
        { nom: nameData.nom, prenom: nameData.prenom, pin: values.pin },
        getAccessToken,
      );
      const token = extractAccessToken(raw);
      const userId = extractUserId(raw);
      if (token && userId) {
        setSession(token, userId);
        void registerUserDevice(
          getDeviceRegistrationPayload("user"),
          getAccessToken,
        ).catch(() => {});
        router.replace("/dashboard");
        router.refresh();
        return;
      }
      router.push("/login");
    } catch (e) {
      setError(e);
      if (isApiError(e) && e.status === 409) {
        nameForm.setError("nom", {
          message: "Compte ou conflit — voir le message serveur.",
        });
        setStep(1);
      }
    }
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <ErrorBanner error={error} />

      {step === 1 ? (
        <div key="step-name" className="auth-slide-enter">
          <p className="mb-6 text-[11px] leading-relaxed text-secondary">
            OTP <HoraBadge /> place votre identité sous votre contrôle.
            Identifiez votre nom et prénom pour commencer.
          </p>

          <form
            className="space-y-2.5"
            onSubmit={nameForm.handleSubmit(onNameSubmit)}
            noValidate
          >
            <div>
              <Label htmlFor="reg-nom" className="text-[11px]">
                Nom
              </Label>
              <Input
                id="reg-nom"
                autoComplete="family-name"
                placeholder="Thomas"
                className="h-9 text-xs"
                {...nameForm.register("nom")}
              />
              {nameForm.formState.errors.nom ? (
                <p className="mt-0.5 text-[11px] text-error" role="alert">
                  {nameForm.formState.errors.nom.message}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="reg-prenom" className="text-[11px]">
                Prénom
              </Label>
              <Input
                id="reg-prenom"
                autoComplete="given-name"
                placeholder="Jean"
                className="h-9 text-xs"
                {...nameForm.register("prenom")}
              />
              {nameForm.formState.errors.prenom ? (
                <p className="mt-0.5 text-[11px] text-error" role="alert">
                  {nameForm.formState.errors.prenom.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-9 w-full gap-2 text-xs"
              loading={nameForm.formState.isSubmitting}
            >
              Continuer
              <IconArrowRight className="size-3.5" />
            </Button>
          </form>
        </div>
      ) : (
        <div key="step-pin" className="auth-slide-enter">
          <p className="mb-6 text-[11px] leading-relaxed text-secondary">
            Protégez votre compte <HoraBadge /> — choisissez un code PIN
            sécurisé que vous retiendrez facilement.
          </p>

          <form
            className="space-y-3"
            onSubmit={pinForm.handleSubmit(onPinSubmit)}
            noValidate
          >
            <p className="text-center text-xs text-secondary">
              Code PIN pour{" "}
              <span className="font-semibold text-foreground">
                {nameData.prenom} {nameData.nom}
              </span>
            </p>
            <div>
              <div className="flex justify-center">
                <PinInput
                  value={pinValue}
                  onChange={(v) =>
                    pinForm.setValue("pin", v, { shouldValidate: true })
                  }
                  disabled={pinForm.formState.isSubmitting}
                />
              </div>
              {pinForm.formState.errors.pin ? (
                <p className="mt-0.5 text-center text-[11px] text-error" role="alert">
                  {pinForm.formState.errors.pin.message}
                </p>
              ) : null}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="h-9 text-xs"
                onClick={() => {
                  setStep(1);
                  setError(null);
                }}
              >
                Modifier
              </Button>
              <Button
                type="submit"
                className="h-9 gap-2 text-xs"
                loading={pinForm.formState.isSubmitting}
              >
                Créer mon compte
                <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <p className="text-center text-xs text-secondary">
        Déjà inscrit ?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
      </p>

      <div className="flex justify-center">
        <Link
          href="/portail-entreprise/inscription"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3.5 py-1.5 text-[11px] font-medium text-secondary transition-all duration-300 hover:-translate-y-px hover:border-primary/40 hover:text-primary"
        >
          <IconBuilding className="size-3.5" />
          Inscription entreprise
        </Link>
      </div>
    </div>
  );
}

"use client";

import { HoraBadge } from "@/components/features/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/ui/pin-input";
import { isApiError } from "@/lib/api/errors";
import { registerUserDevice } from "@/lib/api/devices";
import { login } from "@/lib/api/users";
import { getDeviceRegistrationPayload } from "@/lib/auth/device-context";
import { getAccessToken, setSession } from "@/lib/auth/session";
import { isApiConfigured } from "@/lib/config/env";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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

const phoneSchema = z.object({
  phone: z
    .string()
    .min(8, "Numéro trop court")
    .max(20, "Numéro trop long")
    .regex(/^[\d+\s()-]+$/, "Caractères non valides"),
});

const pinSchema = z.object({
  pin: z.string().regex(/^\d{6}$/, "Le code doit contenir 6 chiffres"),
});

type PhoneValues = z.infer<typeof phoneSchema>;
type PinValues = z.infer<typeof pinSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [submitError, setSubmitError] = useState<unknown>(null);

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const pinForm = useForm<PinValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "" },
  });

  const pinValue = pinForm.watch("pin");

  async function onPhoneSubmit(values: PhoneValues) {
    setSubmitError(null);
    setPhone(values.phone.trim());
    setStep(2);
    pinForm.reset({ pin: "" });
  }

  async function onPinSubmit(values: PinValues) {
    setSubmitError(null);
    if (!isApiConfigured()) {
      setSubmitError(
        new Error(
          "Configurez NEXT_PUBLIC_API_BASE_URL dans .env.local (voir .env.example).",
        ),
      );
      return;
    }
    try {
      const result = await login(
        { phone: phone.trim(), pin: values.pin },
        getAccessToken,
      );
      setSession(result.token, result.userId);
      void registerUserDevice(
        getDeviceRegistrationPayload("user"),
        getAccessToken,
      ).catch(() => {});
      router.replace(from.startsWith("/") ? from : "/dashboard");
      router.refresh();
    } catch (e) {
      setSubmitError(e);
      if (isApiError(e) && e.status === 401) {
        pinForm.reset({ pin: "" });
      }
    }
  }

  return (
    <div className="space-y-4">
      <ErrorBanner error={submitError} />

      {step === 1 ? (
        <div key="step-phone" className="auth-slide-enter">
          <p className="mb-6 text-[11px] leading-relaxed text-secondary">
            Connectez-vous à <HoraBadge /> avec votre numéro de téléphone
            pour accéder à votre espace sécurisé.
          </p>

          <form
            className="space-y-2.5"
            onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
            noValidate
          >
            <div>
              <Label htmlFor="phone" className="text-[11px]">
                Numéro de téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+33 6 12 34 56 78"
                className="h-9 text-xs"
                aria-invalid={Boolean(phoneForm.formState.errors.phone)}
                {...phoneForm.register("phone")}
              />
              {phoneForm.formState.errors.phone ? (
                <p className="mt-0.5 text-[11px] text-error" role="alert">
                  {phoneForm.formState.errors.phone.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-9 w-full gap-2 text-xs"
              loading={phoneForm.formState.isSubmitting}
            >
              Continuer
              <IconArrowRight className="size-3.5" />
            </Button>
          </form>
        </div>
      ) : (
        <div key="step-pin" className="auth-slide-enter">
          <p className="mb-6 text-[11px] leading-relaxed text-secondary">
            Saisissez votre code PIN <HoraBadge /> pour confirmer
            votre identité.
          </p>

          <form
            className="space-y-3"
            onSubmit={pinForm.handleSubmit(onPinSubmit)}
            noValidate
          >
            <p className="text-center text-xs text-secondary">
              Code PIN pour{" "}
              <span className="font-semibold text-foreground">{phone}</span>
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
                  setSubmitError(null);
                }}
              >
                Modifier
              </Button>
              <Button
                type="submit"
                className="h-9 gap-2 text-xs"
                loading={pinForm.formState.isSubmitting}
              >
                Se connecter
                <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <p className="text-center text-xs text-secondary">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
      <p className="text-center text-[11px] text-secondary">
        <Link href="/portail-entreprise/login" className="text-primary underline-offset-4 hover:underline">
          Connexion entreprise
        </Link>
        {" · "}
        <Link href="/pin-recovery" className="text-primary underline-offset-4 hover:underline">
          PIN oublié
        </Link>
        {" · "}
        <Link href="/verify-email" className="text-primary underline-offset-4 hover:underline">
          Vérifier mon email
        </Link>
      </p>
    </div>
  );
}

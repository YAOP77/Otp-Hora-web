"use client";

import { HoraBadge } from "@/components/features/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { PinInput } from "@/components/ui/pin-input";
import { registerEnterpriseDevice } from "@/lib/api/devices";
import { loginEnterprise } from "@/lib/api/enterprises";
import { extractEnterpriseAuth } from "@/lib/auth/enterprise-auth";
import { getDeviceRegistrationPayload } from "@/lib/auth/device-context";
import {
  getEnterpriseAccessToken,
  setEnterpriseSession,
} from "@/lib/auth/enterprise-session";
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
  phone: z.string().min(5, "Numéro requis"),
});

const pinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, "PIN : 4 à 6 chiffres"),
});

type PhoneValues = z.infer<typeof phoneSchema>;
type PinValues = z.infer<typeof pinSchema>;

export function EnterpriseLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/portail-entreprise";

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<unknown>(null);

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const pinForm = useForm<PinValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "" },
  });

  const pinValue = pinForm.watch("pin");

  function onPhoneSubmit(values: PhoneValues) {
    setError(null);
    setPhone(values.phone.trim());
    setStep(2);
    pinForm.reset({ pin: "" });
  }

  async function onPinSubmit(values: PinValues) {
    setError(null);
    if (!isApiConfigured()) {
      setError(new Error("Configurez NEXT_PUBLIC_API_BASE_URL dans .env.local."));
      return;
    }
    try {
      const raw = await loginEnterprise({
        phone: phone.trim(),
        pin: values.pin,
      });
      const auth = extractEnterpriseAuth(raw);
      if (!auth) {
        setError(new Error("Réponse sans jeton d'accès entreprise."));
        return;
      }
      setEnterpriseSession(auth);
      void registerEnterpriseDevice(
        getDeviceRegistrationPayload("enterprise"),
        getEnterpriseAccessToken,
      ).catch(() => {});
      router.replace(from.startsWith("/") ? from : "/portail-entreprise");
      router.refresh();
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="space-y-4">
      <ErrorBanner error={error} />

      {step === 1 ? (
        <div key="step-phone" className="auth-slide-enter">
          <p className="mb-6 text-[11px] leading-relaxed text-secondary">
            Accédez à votre espace <HoraBadge /> entreprise avec
            votre numéro de téléphone dédié.
          </p>

          <form
            className="space-y-2.5"
            onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
            noValidate
          >
            <div>
              <Label htmlFor="ent-phone" className="text-[11px]">
                Téléphone (E.164)
              </Label>
              <PhoneInput
                id="ent-phone"
                value={phoneForm.watch("phone") ?? ""}
                onChange={(e164) =>
                  phoneForm.setValue("phone", e164, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                aria-invalid={Boolean(phoneForm.formState.errors.phone)}
                placeholder="01 23 45 67 89"
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
            Saisissez votre code PIN <HoraBadge /> pour accéder
            au portail entreprise.
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
                Connexion entreprise
                <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <p className="text-center text-[11px] text-secondary">
        <Link
          href="/portail-entreprise/inscription"
          className="text-primary underline-offset-4 hover:underline"
        >
          Créer un compte entreprise
        </Link>
        {" · "}
        <Link
          href="/pin-recovery"
          className="text-primary underline-offset-4 hover:underline"
        >
          PIN oublié
        </Link>
      </p>
      <p className="text-center text-[11px] text-secondary/70">
        Accès réservé aux comptes entreprise (distinct des comptes utilisateur).
      </p>
    </div>
  );
}

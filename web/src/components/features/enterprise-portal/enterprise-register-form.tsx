"use client";

import { HoraBadge } from "@/components/features/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { PinInput } from "@/components/ui/pin-input";
import { registerEnterpriseDevice } from "@/lib/api/devices";
import { registerEnterprise } from "@/lib/api/enterprises";
import { extractEnterpriseAuth } from "@/lib/auth/enterprise-auth";
import { getDeviceRegistrationPayload } from "@/lib/auth/device-context";
import {
  getEnterpriseAccessToken,
  setEnterpriseSession,
} from "@/lib/auth/enterprise-session";
import { isApiConfigured } from "@/lib/config/env";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const infoSchema = z.object({
  nom_entreprise: z.string().min(1, "Nom requis").max(200),
  phone: z.string().min(5, "Téléphone requis"),
});

const pinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, "PIN : 4 à 6 chiffres"),
});

type InfoValues = z.infer<typeof infoSchema>;
type PinValues = z.infer<typeof pinSchema>;

export function EnterpriseRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [infoData, setInfoData] = useState({ nom_entreprise: "", phone: "" });
  const [error, setError] = useState<unknown>(null);

  const infoForm = useForm<InfoValues>({
    resolver: zodResolver(infoSchema),
    defaultValues: { nom_entreprise: "", phone: "" },
  });

  const pinForm = useForm<PinValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "" },
  });

  const pinValue = pinForm.watch("pin");

  function onInfoSubmit(values: InfoValues) {
    setError(null);
    setInfoData({
      nom_entreprise: values.nom_entreprise.trim(),
      phone: values.phone.trim(),
    });
    setStep(2);
    pinForm.reset({ pin: "" });
  }

  async function onPinSubmit(values: PinValues) {
    setError(null);
    if (!isApiConfigured()) {
      setError(
        new Error("Configurez NEXT_PUBLIC_API_BASE_URL dans .env.local."),
      );
      return;
    }
    try {
      const raw = await registerEnterprise({
        nom_entreprise: infoData.nom_entreprise,
        phone: infoData.phone,
        pin: values.pin,
      });
      const apiKey =
        raw && typeof raw === "object" && "api_key" in raw
          ? String((raw as { api_key?: unknown }).api_key ?? "")
          : "";
      if (apiKey) {
        window.alert(
          `Conservez cette clé API (affichée une seule fois) :\n\n${apiKey}`,
        );
      }
      const auth = extractEnterpriseAuth(raw);
      if (auth) {
        setEnterpriseSession(auth);
        void registerEnterpriseDevice(
          getDeviceRegistrationPayload("enterprise"),
          getEnterpriseAccessToken,
        ).catch(() => {});
        router.replace("/portail-entreprise");
        router.refresh();
        return;
      }
      router.push("/portail-entreprise/login");
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="space-y-4">
      <ErrorBanner error={error} />

      {step === 1 ? (
        <div key="step-info" className="auth-slide-enter">
          <p className="mb-6 text-[11px] leading-relaxed text-secondary">
            Inscrivez votre entreprise sur <HoraBadge /> pour
            gérer liaisons, autorisations et clés API.
          </p>

          <form
            className="space-y-2.5"
            onSubmit={infoForm.handleSubmit(onInfoSubmit)}
            noValidate
          >
            <div>
              <Label htmlFor="reg-ent-name" className="text-[11px]">
                Nom de l&apos;entreprise
              </Label>
              <Input
                id="reg-ent-name"
                placeholder="Acme Corp"
                className="h-9 text-xs"
                {...infoForm.register("nom_entreprise")}
              />
              {infoForm.formState.errors.nom_entreprise ? (
                <p className="mt-0.5 text-[11px] text-error" role="alert">
                  {infoForm.formState.errors.nom_entreprise.message}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="reg-ent-phone" className="text-[11px]">
                Téléphone
              </Label>
              <PhoneInput
                id="reg-ent-phone"
                value={infoForm.watch("phone") ?? ""}
                onChange={(e164) =>
                  infoForm.setValue("phone", e164, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                aria-invalid={Boolean(infoForm.formState.errors.phone)}
                placeholder="01 23 45 67 89"
              />
              {infoForm.formState.errors.phone ? (
                <p className="mt-0.5 text-[11px] text-error" role="alert">
                  {infoForm.formState.errors.phone.message}
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-9 w-full gap-2 text-xs"
              loading={infoForm.formState.isSubmitting}
            >
              Continuer
              <IconArrowRight className="size-3.5" />
            </Button>
          </form>
        </div>
      ) : (
        <div key="step-pin" className="auth-slide-enter">
          <p className="mb-6 text-[11px] leading-relaxed text-secondary">
            Protégez votre compte <HoraBadge /> entreprise — choisissez
            un code PIN sécurisé.
          </p>

          <form
            className="space-y-3"
            onSubmit={pinForm.handleSubmit(onPinSubmit)}
            noValidate
          >
            <p className="text-center text-xs text-secondary">
              Code PIN pour{" "}
              <span className="font-semibold text-foreground">
                {infoData.nom_entreprise}
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
                Créer le compte
                <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <p className="text-center text-[11px] text-secondary">
        <Link
          href="/portail-entreprise/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Déjà inscrit ? Connexion
        </Link>
      </p>
      <p className="text-center text-[11px] text-secondary/70">
        Vous recevrez une clé API affichée une seule fois à l&apos;inscription.
      </p>
    </div>
  );
}

"use client";

import { HoraBadge } from "@/components/features/auth/auth-shell";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { PinInput } from "@/components/ui/pin-input";
import { createContact } from "@/lib/api/contacts";
import { isApiError } from "@/lib/api/errors";
import { registerUserDevice } from "@/lib/api/devices";
import { registerUser } from "@/lib/api/users";
import { getDeviceRegistrationPayload } from "@/lib/auth/device-context";
import { getAccessToken, setSession } from "@/lib/auth/session";
import { isApiConfigured } from "@/lib/config/env";
import { normalizeSecurityAnswer } from "@/lib/utils/security-answer";
import { extractAccessToken, extractRefreshToken, extractUserId } from "@/types/api";
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
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50),
});

const phoneSchema = z.object({
  phone: z
    .string()
    .min(8, "Numéro trop court")
    .max(20, "Numéro trop long")
    .regex(/^\+\d{7,18}$/, "Numéro invalide (format E.164)"),
});

const pinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, "PIN : 4 à 6 chiffres"),
  pin_confirmation: z.string().regex(/^\d{4,6}$/, "PIN : 4 à 6 chiffres"),
}).refine((data) => data.pin === data.pin_confirmation, {
  message: "Les codes PIN ne correspondent pas",
  path: ["pin_confirmation"],
});

const questionsSchema = z.object({
  q1: z.string().min(1, "Question requise"),
  a1: z.string().min(1, "Réponse requise"),
  q2: z.string().min(1, "Question requise"),
  a2: z.string().min(1, "Réponse requise"),
  q3: z.string().min(1, "Question requise"),
  a3: z.string().min(1, "Réponse requise"),
  q4: z.string().min(1, "Question requise"),
  a4: z.string().min(1, "Réponse requise"),
  q5: z.string().min(1, "Question requise"),
  a5: z.string().min(1, "Réponse requise"),
});

type NameValues = z.infer<typeof nameSchema>;
type PhoneValues = z.infer<typeof phoneSchema>;
type PinValues = z.infer<typeof pinSchema>;
type QuestionsValues = z.infer<typeof questionsSchema>;

export function RegisterForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [nameData, setNameData] = useState({ nom: "", prenom: "", username: "" });
  const [phoneData, setPhoneData] = useState("");
  const [pinData, setPinData] = useState({ pin: "", pin_confirmation: "" });
  const [error, setError] = useState<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nameForm = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { nom: "", prenom: "", username: "" },
  });

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const pinForm = useForm<PinValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "", pin_confirmation: "" },
  });

  const questionsForm = useForm<QuestionsValues>({
    resolver: zodResolver(questionsSchema),
    defaultValues: { q1: "", a1: "", q2: "", a2: "", q3: "", a3: "", q4: "", a4: "", q5: "" },
  });

  function onNameSubmit(values: NameValues) {
    setError(null);
    setNameData({ nom: values.nom.trim(), prenom: values.prenom.trim(), username: values.username.trim() });
    setStep(2);
  }

  function onPhoneSubmit(values: PhoneValues) {
    setError(null);
    setPhoneData(values.phone.trim());
    setStep(3);
  }

  function onPinSubmit(values: PinValues) {
    setError(null);
    setPinData(values);
    setStep(4);
  }

  async function onQuestionsSubmit(values: QuestionsValues) {
    setError(null);
    if (!isApiConfigured()) {
      setError(new Error("Configurez NEXT_PUBLIC_API_BASE_URL dans .env.local."));
      return;
    }
    try {
      const security_questions = [
        { question: values.q1.trim(), answer: normalizeSecurityAnswer(values.a1) },
        { question: values.q2.trim(), answer: normalizeSecurityAnswer(values.a2) },
        { question: values.q3.trim(), answer: normalizeSecurityAnswer(values.a3) },
        { question: values.q4.trim(), answer: normalizeSecurityAnswer(values.a4) },
        { question: values.q5.trim(), answer: normalizeSecurityAnswer(values.a5) },
      ];

      const payload = {
        nom: nameData.nom,
        prenom: nameData.prenom,
        username: nameData.username,
        pin: pinData.pin,
        pin_confirmation: pinData.pin_confirmation,
        security_questions,
      };

      const raw = await registerUser(payload, getAccessToken);
      const token = extractAccessToken(raw);
      const userId = extractUserId(raw);
      const refreshToken = extractRefreshToken(raw);

      if (!token || !userId) {
        router.push("/login");
        return;
      }

      setSession(token, userId, refreshToken);
      
      if (phoneData) {
        await createContact({ user_id: userId, phone_number: phoneData }).catch(() => {});
      }

      void registerUserDevice(getDeviceRegistrationPayload("user"), getAccessToken).catch(() => {});
      router.replace("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <ErrorBanner error={error} />

      {step === 1 ? (
        <div key="step-name" className="auth-slide-enter">
          <form className="space-y-2.5" onSubmit={nameForm.handleSubmit(onNameSubmit)} noValidate>
            <div>
              <Label htmlFor="reg-nom" className="text-[11px]">{t("common.name")}</Label>
              <Input id="reg-nom" placeholder="Thomas" className="h-9 text-xs" {...nameForm.register("nom")} />
              {nameForm.formState.errors.nom && <p className="mt-0.5 text-[11px] text-error">{nameForm.formState.errors.nom.message}</p>}
            </div>
            <div>
              <Label htmlFor="reg-prenom" className="text-[11px]">{t("common.firstname")}</Label>
              <Input id="reg-prenom" placeholder="Jean" className="h-9 text-xs" {...nameForm.register("prenom")} />
              {nameForm.formState.errors.prenom && <p className="mt-0.5 text-[11px] text-error">{nameForm.formState.errors.prenom.message}</p>}
            </div>
            <div>
              <Label htmlFor="reg-username" className="text-[11px]">{t("auth.register.usernameLabel")}</Label>
              <Input id="reg-username" placeholder="jean_thomas" className="h-9 text-xs" {...nameForm.register("username")} />
              {nameForm.formState.errors.username && <p className="mt-0.5 text-[11px] text-error">{nameForm.formState.errors.username.message}</p>}
            </div>
            <Button type="submit" className="h-9 w-full gap-2 text-xs" loading={nameForm.formState.isSubmitting}>
              {t("common.continue")} <IconArrowRight className="size-3.5" />
            </Button>
          </form>
        </div>
      ) : step === 2 ? (
        <div key="step-phone" className="auth-slide-enter">
          <form className="space-y-2.5" onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} noValidate>
            <div>
              <Label htmlFor="reg-phone" className="text-[11px]">{t("auth.login.phoneLabel")}</Label>
              <PhoneInput
                id="reg-phone"
                value={phoneForm.watch("phone") ?? ""}
                onChange={(e164) => phoneForm.setValue("phone", e164, { shouldValidate: true })}
                placeholder="07 00 00 00 00"
              />
              {phoneForm.formState.errors.phone && <p className="mt-0.5 text-[11px] text-error">{phoneForm.formState.errors.phone.message}</p>}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" className="h-9 flex-1 text-xs" onClick={() => setStep(1)}>
                {t("common.edit")}
              </Button>
              <Button type="submit" className="h-9 flex-1 gap-2 text-xs" loading={phoneForm.formState.isSubmitting}>
                {t("common.continue")} <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      ) : step === 3 ? (
        <div key="step-pin" className="auth-slide-enter">
          <form className="space-y-3" onSubmit={pinForm.handleSubmit(onPinSubmit)} noValidate>
            <div className="space-y-2">
              <Label className="text-[11px]">Choisissez un PIN</Label>
              <div className="flex justify-center">
                <PinInput value={pinForm.watch("pin")} onChange={(v) => pinForm.setValue("pin", v, { shouldValidate: true })} />
              </div>
              <Label className="text-[11px]">Confirmez le PIN</Label>
              <div className="flex justify-center">
                <PinInput value={pinForm.watch("pin_confirmation")} onChange={(v) => pinForm.setValue("pin_confirmation", v, { shouldValidate: true })} />
              </div>
              {pinForm.formState.errors.pin_confirmation && <p className="text-center text-[11px] text-error">{pinForm.formState.errors.pin_confirmation.message}</p>}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" className="h-9 flex-1 text-xs" onClick={() => setStep(2)}>
                {t("common.edit")}
              </Button>
              <Button type="submit" className="h-9 flex-1 gap-2 text-xs">
                {t("common.continue")} <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div key="step-questions" className="auth-slide-enter">
          <p className="mb-4 text-center text-xs font-semibold text-foreground">Questions de sécurité (5 requises)</p>
          <form className="space-y-4" onSubmit={questionsForm.handleSubmit(onQuestionsSubmit)} noValidate>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1.5 border-b pb-2 last:border-0">
                <Label className="text-[10px] text-secondary">Question {i}</Label>
                <Input placeholder={`Ex: Ville de naissance ?`} className="h-8 text-xs" {...questionsForm.register(`q${i}` as any)} />
                <Input placeholder="Votre réponse" className="h-8 text-xs" {...questionsForm.register(`a${i}` as any)} />
              </div>
            ))}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" className="h-9 flex-1 text-xs" onClick={() => setStep(3)}>
                {t("common.edit")}
              </Button>
              <Button type="submit" className="h-9 flex-1 gap-2 text-xs" loading={questionsForm.formState.isSubmitting}>
                {t("auth.register.submit")} <IconArrowRight className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <p className="text-center text-xs text-secondary">
        {t("auth.register.alreadyIn")}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">{t("auth.login.submit")}</Link>
      </p>

      <div className="flex justify-center">
        <Link
          href="/portail-entreprise/inscription"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3.5 py-1.5 text-[11px] font-medium text-secondary transition-all duration-300 hover:-translate-y-px hover:border-primary/40 hover:text-primary"
        >
          <IconBuilding className="size-3.5" />
          {t("auth.register.entLink")}
        </Link>
      </div>
    </div>
  );
}

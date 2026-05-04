"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/ui/pin-input";
import { confirmEnterprisePinRecovery, confirmUserPinRecovery, requestEnterprisePinRecovery, requestUserPinRecovery } from "@/lib/api/pin-recovery";
import { isApiConfigured } from "@/lib/config/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const phoneSchema = z.object({
  phone: z.string().min(5, "Numéro requis").max(30),
});

const recoverySchema = z.object({
  answers: z.array(z.object({
    question_id: z.string(),
    question: z.string(),
    answer: z.string().min(1, "Réponse requise"),
  })),
  pin: z.string().regex(/^\d{4,6}$/, "PIN : 4 à 6 chiffres"),
  pin_confirmation: z.string().regex(/^\d{4,6}$/, "PIN : 4 à 6 chiffres"),
}).refine((data) => data.pin === data.pin_confirmation, {
  message: "Les codes PIN ne correspondent pas",
  path: ["pin_confirmation"],
});

export function PinRecoveryView() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<{ question_id: string; question: string }[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [ok, setOk] = useState<string | null>(null);

  const phoneForm = useForm<{ phone: string }>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const recoveryForm = useForm<{
    answers: { question_id: string; question: string; answer: string }[];
    pin: string;
    pin_confirmation: string;
  }>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { answers: [], pin: "", pin_confirmation: "" },
  });

  async function onPhoneSubmit(values: { phone: string }) {
    setError(null);
    try {
      // Note: On utilise l'API que j'ai ajoutée dans lib/api/users.ts
      const { fetchPinRecoveryQuestions } = await import("@/lib/api/users");
      const res = await fetchPinRecoveryQuestions(values.phone.trim());
      setUserId(res.data.user_id);
      setQuestions(res.data.questions);
      recoveryForm.setValue("answers", res.data.questions.map((q: any) => ({ ...q, answer: "" })));
      setStep(2);
    } catch (e) {
      setError(e);
    }
  }

  async function onRecoverySubmit(values: any) {
    setError(null);
    try {
      const { confirmPinRecovery } = await import("@/lib/api/users");
      await confirmPinRecovery({
        user_id: userId!,
        answers: values.answers.map((a: any) => ({ question_id: a.question_id, answer: a.answer })),
        pin: values.pin,
        pin_confirmation: values.pin_confirmation,
      });
      setOk("Votre PIN a été réinitialisé avec succès.");
      setStep(3);
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="space-y-6">
      <ErrorBanner error={error} />
      
      {step === 1 ? (
        <form className="space-y-4" onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
          <div>
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input id="phone" placeholder="+225..." {...phoneForm.register("phone")} />
          </div>
          <Button type="submit" className="w-full" loading={phoneForm.formState.isSubmitting}>
            Suivant
          </Button>
        </form>
      ) : step === 2 ? (
        <form className="space-y-6" onSubmit={recoveryForm.handleSubmit(onRecoverySubmit)}>
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Répondez aux questions de sécurité :</p>
            {questions.map((q, i) => (
              <div key={q.question_id} className="space-y-1.5">
                <Label className="text-[11px] text-secondary">{q.question}</Label>
                <Input 
                  placeholder="Votre réponse" 
                  className="h-9 text-xs"
                  {...recoveryForm.register(`answers.${i}.answer` as any)} 
                />
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label className="text-[11px]">Nouveau PIN</Label>
              <div className="flex justify-center">
                <PinInput value={recoveryForm.watch("pin")} onChange={(v) => recoveryForm.setValue("pin", v, { shouldValidate: true })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px]">Confirmez le nouveau PIN</Label>
              <div className="flex justify-center">
                <PinInput value={recoveryForm.watch("pin_confirmation")} onChange={(v) => recoveryForm.setValue("pin_confirmation", v, { shouldValidate: true })} />
              </div>
              {recoveryForm.formState.errors.pin_confirmation && (
                <p className="text-center text-[11px] text-error">{recoveryForm.formState.errors.pin_confirmation.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(1)}>Retour</Button>
            <Button type="submit" className="flex-1" loading={recoveryForm.formState.isSubmitting}>Réinitialiser</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-6 text-sm text-foreground">
            <p className="font-bold text-primary mb-2">Succès !</p>
            {ok}
          </div>
          <Button className="w-full" onClick={() => window.location.href = "/login"}>Retour à la connexion</Button>
        </div>
      )}
    </div>
  );
}


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

const requestSchema = z.object({
  phone: z.string().min(5, "Numéro requis").max(30),
});

const confirmSchema = z.object({
  token: z.string().min(10, "Token requis"),
  pin: z.string().regex(/^\d{4,6}$/, "PIN : 4 à 6 chiffres"),
});

type RequestValues = z.infer<typeof requestSchema>;
type ConfirmValues = z.infer<typeof confirmSchema>;

export function PinRecoveryView() {
  const [kind, setKind] = useState<"user" | "enterprise">("user");
  const [error, setError] = useState<unknown>(null);
  const [ok, setOk] = useState<string | null>(null);

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { phone: "" },
  });
  const confirmForm = useForm<ConfirmValues>({
    resolver: zodResolver(confirmSchema),
    defaultValues: { token: "", pin: "" },
  });

  async function onRequest(kind: "user" | "enterprise", values: RequestValues) {
    setError(null);
    setOk(null);
    if (!isApiConfigured()) {
      setError(new Error("Configurez NEXT_PUBLIC_API_BASE_URL dans .env.local."));
      return;
    }
    const payload = { phone: values.phone.trim() };
    const res =
      kind === "user"
        ? await requestUserPinRecovery(payload)
        : await requestEnterprisePinRecovery(payload);
    setOk(`Demande envoyée. Réponse: ${JSON.stringify(res)}`);
  }

  async function onConfirm(kind: "user" | "enterprise", values: ConfirmValues) {
    setError(null);
    setOk(null);
    if (!isApiConfigured()) {
      setError(new Error("Configurez NEXT_PUBLIC_API_BASE_URL dans .env.local."));
      return;
    }
    const res =
      kind === "user"
        ? await confirmUserPinRecovery({ token: values.token.trim(), pin: values.pin })
        : await confirmEnterprisePinRecovery({
            token: values.token.trim(),
            pin: values.pin,
          });
    setOk(`PIN mis à jour. Réponse: ${JSON.stringify(res)}`);
  }

  const pinValue = confirmForm.watch("pin");

  return (
    <div className="space-y-6">
      <ErrorBanner error={error} />
      {ok ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          {ok}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={kind === "user" ? "primary" : "secondary"}
          onClick={() => setKind("user")}
        >
          Utilisateur
        </Button>
        <Button
          type="button"
          variant={kind === "enterprise" ? "primary" : "secondary"}
          onClick={() => setKind("enterprise")}
        >
          Entreprise
        </Button>
      </div>

      <form
        className="space-y-3"
        onSubmit={requestForm.handleSubmit((v) => onRequest(kind, v))}
        noValidate
      >
        <div>
          <Label htmlFor="pr-phone">Téléphone (alias accepté)</Label>
          <Input id="pr-phone" {...requestForm.register("phone")} />
        </div>
        <Button type="submit" loading={requestForm.formState.isSubmitting}>
          Demander un reset PIN {kind === "user" ? "utilisateur" : "entreprise"}
        </Button>
      </form>

      <form
        className="space-y-3"
        onSubmit={confirmForm.handleSubmit((v) => onConfirm(kind, v))}
        noValidate
      >
        <div>
          <Label htmlFor="pr-token">Token</Label>
          <Input id="pr-token" {...confirmForm.register("token")} />
        </div>
        <div>
          <Label htmlFor="pr-pin-0">Nouveau PIN</Label>
          <div className="mt-2">
            <PinInput
              value={pinValue}
              onChange={(v) => confirmForm.setValue("pin", v, { shouldValidate: true })}
              disabled={confirmForm.formState.isSubmitting}
            />
          </div>
        </div>
        <Button type="submit" loading={confirmForm.formState.isSubmitting}>
          Confirmer reset PIN {kind === "user" ? "utilisateur" : "entreprise"}
        </Button>
      </form>
    </div>
  );
}


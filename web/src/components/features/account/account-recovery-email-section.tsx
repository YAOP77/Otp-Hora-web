"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUserRecoveryEmail } from "@/lib/api/users";
import { getAccessToken } from "@/lib/auth/session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export function AccountRecoveryEmailSection({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<unknown>(null);

  const mutation = useMutation({
    mutationFn: () => setUserRecoveryEmail(email.trim(), getAccessToken),
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setEmail("");
    },
    onError: (e) => setError(e),
  });

  return (
    <section className="mt-8 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5">
      <h2 className="text-base font-semibold text-foreground">Email de récupération</h2>
      <p className="mt-1 text-sm text-secondary">
        Définit l’email de récupération (PUT /api/users/me/recovery-email). Vérifiez-le ensuite via le lien reçu ou{" "}
        <Link href="/verify-email" className="text-primary underline-offset-4 hover:underline">
          la page de vérification
        </Link>
        .
      </p>
      <ErrorBanner error={error} />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Label htmlFor="recovery-email">Email</Label>
          <Input
            id="recovery-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
          />
        </div>
        <Button
          type="button"
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
          disabled={!email.trim()}
        >
          Enregistrer
        </Button>
      </div>
    </section>
  );
}

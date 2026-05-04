"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createContact } from "@/lib/api/contacts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AccountAddContactSection({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<unknown>(null);

  const mutation = useMutation({
    mutationFn: () =>
      createContact({
        user_id: userId,
        phone_number: phone.trim(),
      }),
    onSuccess: async () => {
      setError(null);
      setPhone("");
      await queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (e) => setError(e),
  });

  return (
    <section className="mt-8 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5">
      <h2 className="text-base font-semibold text-foreground">Ajouter un contact</h2>
      <p className="mt-1 text-sm text-secondary">
        POST /api/contacts — numéro au format international (E.164), associé à votre user_id.
      </p>
      <ErrorBanner error={error} />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Label htmlFor="contact-phone">Téléphone</Label>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+225 …"
          />
        </div>
        <Button
          type="button"
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
          disabled={!phone.trim() || phone.trim().length < 5}
        >
          Ajouter le contact
        </Button>
      </div>
    </section>
  );
}

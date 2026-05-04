"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/lib/api/users";
import { isApiError } from "@/lib/api/errors";
import { getAccessToken } from "@/lib/auth/session";
import type { User } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  user: User;
};

export function EditProfileDialog({ open, onClose, userId, user }: Props) {
  const titleId = useId();
  const queryClient = useQueryClient();
  const [nom, setNom] = useState(user.nom ?? "");
  const [prenom, setPrenom] = useState(user.prenom ?? "");
  const [username, setUsername] = useState(
    typeof user.username === "string" ? user.username : "",
  );
  const [pin, setPin] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNom(user.nom ?? "");
      setPrenom(user.prenom ?? "");
      setUsername(typeof user.username === "string" ? user.username : "");
      setPin("");
      setFormError(null);
    }
  }, [open, user]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload: {
        nom?: string;
        prenom?: string;
        username?: string;
        pin?: string;
      } = {};
      if (nom.trim() !== (user.nom ?? "").trim()) payload.nom = nom.trim();
      if (prenom.trim() !== (user.prenom ?? "").trim()) {
        payload.prenom = prenom.trim();
      }
      const cur = (typeof user.username === "string" ? user.username : "").trim().toLowerCase();
      if (username.trim().toLowerCase() !== cur) payload.username = username.trim();
      if (pin.trim()) payload.pin = pin.trim();
      if (Object.keys(payload).length === 0) {
        throw new Error("Aucune modification.");
      }
      return updateUserProfile(userId, payload, getAccessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", userId] });
      onClose();
    },
    onError: (err: unknown) => {
      if (isApiError(err)) {
        setFormError(err.message);
        return;
      }
      if (err instanceof Error) {
        setFormError(err.message);
        return;
      }
      setFormError("Une erreur est survenue.");
    },
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="Fermer"
        onClick={() => !mutation.isPending && onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] w-full max-w-md rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 shadow-lg"
      >
        <h2 id={titleId} className="text-lg font-semibold text-foreground">
          Modifier le profil
        </h2>
        <p className="mt-1 text-sm text-secondary">
          Mise à jour via l&apos;API (nom, prénom, nom d&apos;utilisateur, code PIN).
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setFormError(null);
            mutation.mutate();
          }}
        >
          <div>
            <Label htmlFor="edit-prenom">Prénom</Label>
            <Input
              id="edit-prenom"
              name="prenom"
              autoComplete="given-name"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <div>
            <Label htmlFor="edit-nom">Nom</Label>
            <Input
              id="edit-nom"
              name="nom"
              autoComplete="family-name"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <div>
            <Label htmlFor="edit-username">Nom d&apos;utilisateur</Label>
            <Input
              id="edit-username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={mutation.isPending}
              placeholder="ex. jean_thomas"
            />
          </div>
          <div>
            <Label htmlFor="edit-pin">Nouveau code PIN (optionnel)</Label>
            <Input
              id="edit-pin"
              name="pin"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              placeholder="Laisser vide pour ne pas changer"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>

          {formError ? (
            <p className="text-sm text-[var(--error)]" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={mutation.isPending}>
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

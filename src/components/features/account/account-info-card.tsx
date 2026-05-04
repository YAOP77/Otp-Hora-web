"use client";

import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/features/account/edit-profile-dialog";
import type { SVGProps } from "react";
import { useState } from "react";
import type { User } from "@/types/api";

function IconProfileDoc(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

function IconPencil(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function formatFullName(data: User): string | null {
  const parts = [data.prenom, data.nom].filter(Boolean);
  if (parts.length) return parts.join(" ");
  if (data.name) return data.name;
  return null;
}

function primaryPhone(data: User): string | null {
  const fromContacts = data.contacts?.find((c) => c.phone_number)?.phone_number;
  if (fromContacts) return fromContacts;
  if (data.phone) return data.phone;
  return null;
}

export function AccountInfoCard({ data }: { data: User }) {
  const [editOpen, setEditOpen] = useState(false);
  const fullName = formatFullName(data);
  const status = data.status ?? "—";
  const phone = primaryPhone(data);
  const userId =
    data.user_id ?? data.id ?? data.userId ?? "";

  const rows: { label: string; description: string; hint?: string }[] = [
    {
      label: "Nom et Prénom",
      description: fullName ?? "—",
    },
    {
      label: "Statut",
      description: status,
    },
    {
      label: "Contact",
      description: phone ?? "—",
      hint:
        data.contacts?.[0]?.verified_at != null
          ? "Numéro vérifié"
          : undefined,
    },
  ];

  if (typeof data.linked_accounts_count === "number") {
    rows.push({
      label: "Comptes liés",
      description: String(data.linked_accounts_count),
    });
  }

  return (
    <>
      <section
        className="relative z-[1] max-w-md rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-sm sm:max-w-lg sm:p-6"
        aria-labelledby="account-info-heading"
      >
        <header className="border-b border-[var(--dash-border)] pb-4 sm:pb-5">
          <h2
            id="account-info-heading"
            className="text-lg font-semibold tracking-tight text-primary sm:text-xl"
          >
            Informations du compte
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-secondary">
            Consultez les détails liés à votre profil et à vos moyens de contact.
          </p>
        </header>

        <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-main)] text-foreground">
              <IconProfileDoc className="size-[18px]" />
            </span>
            <span className="text-sm font-semibold text-foreground sm:text-base">
              Détails du profil
            </span>
          </div>
          {userId ? (
            <Button
              type="button"
              variant="primary"
              className="min-h-9 shrink-0 gap-1.5 px-3 py-1.5 text-xs font-semibold sm:text-sm"
              onClick={() => setEditOpen(true)}
            >
              <IconPencil className="size-3.5" />
              Modifier le profil
            </Button>
          ) : null}
        </div>

        <ul className="mt-5 flex flex-col gap-0 divide-y divide-[var(--dash-border)] rounded-xl border border-[var(--dash-border)] bg-[var(--dash-main)]/40 dark:bg-zinc-900/30 sm:mt-6">
          {rows.map((row) => (
            <li key={row.label} className="px-3 py-3 sm:px-4 sm:py-3.5">
              <p className="text-sm font-semibold text-foreground">{row.label}</p>
              <p className="mt-0.5 text-sm text-secondary">{row.description}</p>
              {row.hint ? (
                <p className="mt-1 text-xs text-secondary">{row.hint}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {userId ? (
        <EditProfileDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          userId={userId}
          user={data}
        />
      ) : null}
    </>
  );
}

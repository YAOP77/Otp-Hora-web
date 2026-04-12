"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useHasMounted } from "@/hooks/use-has-mounted";
import type { User } from "@/types/api";

type UserExtras = User & {
  linked_accounts_count?: number;
  contacts?: { phone_number?: string }[];
};

const HERO_IMAGE = "/assets/Image%20user/Otp-security-User.jpg";

function displayPhone(u: UserExtras): string | null {
  if (u.phone) return u.phone;
  const c = u.contacts?.[0]?.phone_number;
  return c ?? null;
}

export function ProfileCard({
  user,
  isLoading,
}: {
  user: User | undefined;
  isLoading: boolean;
}) {
  const mounted = useHasMounted();
  const showSkeleton = !mounted || isLoading;

  if (showSkeleton) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#111111] p-5 sm:p-6"
        aria-busy
        aria-label="Chargement du profil"
      >
        <div className="relative z-[1] flex gap-4">
          <Skeleton className="size-[64px] shrink-0 rounded-full bg-white/15" />
          <div className="flex flex-col gap-2 pt-1">
            <Skeleton className="h-8 w-48 bg-white/15" />
            <Skeleton className="h-4 w-40 bg-white/10" />
            <Skeleton className="h-3 w-52 bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5">
        <p className="text-sm font-medium [color:var(--dash-text)]">
          Profil indisponible pour le moment.
        </p>
        <p className="mt-1 text-xs [color:var(--dash-muted)]">
          Réessayez plus tard ou vérifiez votre connexion.
        </p>
      </div>
    );
  }

  const u = user as UserExtras;
  const fullName = [u.prenom, u.nom].filter(Boolean).join(" ").trim() || u.name || "Utilisateur";
  const phone = displayPhone(u);
  const linked =
    typeof u.linked_accounts_count === "number" ? u.linked_accounts_count : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-6 sm:p-8">
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-[#0a0a0a]/75" aria-hidden />

      <div className="relative z-[1]">
        <div className="flex items-center gap-4">
          <div className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-white/15 text-xl font-bold text-white backdrop-blur-sm">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{fullName}</h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#0B3A6E] dark:text-[#7dafe6]">
              Compte sécurisé
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect width="14" height="20" x="5" y="2" rx="2" />
              <path d="M12 18h.01" />
            </svg>
            {phone ?? "Téléphone non renseigné"}
          </div>
          {linked !== null ? (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Comptes liés : {linked}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

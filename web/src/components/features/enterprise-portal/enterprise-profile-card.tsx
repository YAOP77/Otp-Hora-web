"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useHasMounted } from "@/hooks/use-has-mounted";

type Enterprise = {
  nom_entreprise?: string;
  phone_e164?: string;
  email?: string;
  status?: string;
};

const HERO_IMAGE = "/assets/Image%20company/Otp-security-User-Company.jpg";

export function EnterpriseProfileCard({
  enterprise,
  isLoading,
}: {
  enterprise: (Enterprise | unknown) | undefined;
  isLoading: boolean;
}) {
  const mounted = useHasMounted();
  const showSkeleton = !mounted || isLoading;

  if (showSkeleton) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#111111] p-5 sm:p-6"
        aria-busy
        aria-label="Chargement du profil entreprise"
      >
        <div className="relative z-[1] flex gap-4">
          <Skeleton className="size-[72px] shrink-0 rounded-full bg-white/15" />
          <div className="flex flex-col gap-2 pt-1">
            <Skeleton className="h-8 w-48 bg-white/15" />
            <Skeleton className="h-4 w-40 bg-white/10" />
            <Skeleton className="h-3 w-52 bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!enterprise) {
    return (
      <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5">
        <p className="text-sm font-medium [color:var(--dash-text)]">Profil entreprise indisponible pour le moment.</p>
        <p className="mt-1 text-xs [color:var(--dash-muted)]">Réessayez plus tard ou vérifiez votre connexion.</p>
      </div>
    );
  }

  const ent = enterprise as Enterprise;
  const name = ent.nom_entreprise || "Entreprise sans nom";
  const phone = ent.phone_e164 || "Téléphone non configuré";
  const email = ent.email || "Email non configuré";
  const status = ent.status || "Inconnu";

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
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{name}</h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#0B3A6E] dark:text-[#7dafe6]">
              {status}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect width="14" height="20" x="5" y="2" rx="2" />
              <path d="M12 18h.01" />
            </svg>
            {phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {email}
          </div>
        </div>
      </div>
    </div>
  );
}

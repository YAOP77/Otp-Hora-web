"use client";

import { EnterpriseProfileCard } from "@/components/features/enterprise-portal/enterprise-profile-card";
import { ShortcutTile } from "@/components/features/dashboard/shortcut-tile";
import { useEnterpriseQuery } from "@/hooks/use-enterprise-query";
import { dashboardAssets } from "@/lib/config/dashboard-assets";
import Link from "next/link";
import { useMemo } from "react";

export function EnterpriseDashboardHomeView() {
  const { data: enterprise, isLoading, isError } = useEnterpriseQuery();

  const ent = useMemo(() => (enterprise ?? {}) as Record<string, unknown>, [enterprise]);
  const hasEmail =
    typeof ent.email === "string" && ent.email.length > 0 && ent.email !== "Non configuré";

  return (
    <div className="w-full">
      <header className="mb-8 md:mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0B3A6E] dark:text-white md:text-3xl">
          Espace entreprise
        </h1>
      </header>

      <div className="flex flex-col gap-6">
        {isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-300/80 bg-[var(--dash-surface)] px-4 py-3 text-sm text-red-800 dark:text-red-300"
          >
            Impossible de charger le profil entreprise. Vérifiez votre connexion ou réessayez plus tard.
          </div>
        ) : null}

        {/* Bande email manquant */}
        {!isLoading && !isError && !hasEmail ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-[#0B3A6E] px-4 py-3 text-sm text-white">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>Configurez votre email de récupération pour sécuriser votre compte.</span>
            </div>
            <Link
              href="/portail-entreprise/account"
              className="shrink-0 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-bold transition-all hover:bg-white/20"
            >
              Mise à jour
            </Link>
          </div>
        ) : null}

        <section aria-labelledby="enterprise-heading" className="space-y-3">
          <h2
            id="enterprise-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[#0B3A6E]/80 dark:text-white/60"
          >
            Profil entreprise
          </h2>
          <EnterpriseProfileCard enterprise={enterprise} isLoading={isLoading} />
        </section>

        <section aria-labelledby="shortcuts-heading" className="space-y-4">
          <h2
            id="shortcuts-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[#0B3A6E]/80 dark:text-white/60"
          >
            Modules de gestion
          </h2>
          <div className="shortcut-tiles-grid grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <ShortcutTile
              title="Compte"
              imageSrc={dashboardAssets.shortcutProfile}
              imageAlt="Compte entreprise"
              href="/portail-entreprise/account"
            />
            <ShortcutTile
              title="Utilisateurs liés"
              imageSrc={dashboardAssets.shortcutSecurity}
              imageAlt="Utilisateurs liés"
              href="/portail-entreprise/users"
            />
            <ShortcutTile
              title="Historique d'accès"
              imageSrc={dashboardAssets.shortcutDevices}
              imageAlt="Historique d'accès"
              href="/portail-entreprise/history"
            />
            <ShortcutTile
              title="Besoin d'aide ?"
              imageSrc={dashboardAssets.shortcutHelp}
              imageAlt="Aide"
              href="/portail-entreprise/settings"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

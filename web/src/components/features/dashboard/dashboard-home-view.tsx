"use client";

import { ProfileCard } from "@/components/features/dashboard/profile-card";
import { ShortcutTile } from "@/components/features/dashboard/shortcut-tile";
import { WelcomeBanner } from "@/components/features/dashboard/welcome-banner";
import { useUserQuery } from "@/hooks/use-user-query";
import { dashboardAssets } from "@/lib/config/dashboard-assets";

export function DashboardHomeView() {
  const { data: user, isLoading, isError } = useUserQuery();

  return (
    <div className="w-full">
      <header className="mb-8 md:mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0B3A6E] dark:text-white md:text-3xl">
          Tableau de bord
        </h1>
      </header>

      <div className="flex flex-col gap-6">
        {isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-300/80 bg-[var(--dash-surface)] px-4 py-3 text-sm text-red-800 dark:text-red-300"
          >
            Impossible de charger le profil. Vérifiez votre connexion ou réessayez plus tard.
          </div>
        ) : null}

        <section aria-labelledby="account-heading" className="space-y-3">
          <h2
            id="account-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[#0B3A6E]/80 dark:text-white/60"
          >
            Mon compte
          </h2>
          <ProfileCard user={user} isLoading={isLoading} />
        </section>

        <section aria-labelledby="shortcuts-heading" className="space-y-4">
          <h2
            id="shortcuts-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[#0B3A6E]/80 dark:text-white/60"
          >
            Raccourcis OTP Hora
          </h2>
          <div className="shortcut-tiles-grid grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <ShortcutTile
              title="Liaisons & identité"
              imageSrc={dashboardAssets.shortcutSecurity}
              imageAlt=""
              href="/enterprise"
            />
            <ShortcutTile
              title="Historique de connexion"
              imageSrc={dashboardAssets.shortcutDevices}
              imageAlt=""
              href="/devices"
            />
            <ShortcutTile
              title="Paramètres"
              imageSrc={dashboardAssets.shortcutHelp}
              imageAlt=""
              href="/settings"
            />
            <ShortcutTile
              title="Profil"
              imageSrc={dashboardAssets.shortcutProfile}
              imageAlt=""
              href="/account"
            />
          </div>
        </section>

        <WelcomeBanner />
      </div>
    </div>
  );
}

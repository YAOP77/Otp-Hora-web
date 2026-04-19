"use client";

import { ProfileCard } from "@/components/features/dashboard/profile-card";
import { ShortcutTile } from "@/components/features/dashboard/shortcut-tile";
import { WelcomeBanner } from "@/components/features/dashboard/welcome-banner";
import { useI18n } from "@/components/providers/i18n-provider";
import { useUserQuery } from "@/hooks/use-user-query";
import { dashboardAssets } from "@/lib/config/dashboard-assets";

export function DashboardHomeView() {
  const { t } = useI18n();
  const { data: user, isLoading, isError } = useUserQuery();

  return (
    <div className="w-full">
      <header className="mb-8 md:mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0B3A6E] dark:text-white md:text-3xl">
          {t("nav.dashboard")}
        </h1>
      </header>

      <div className="flex flex-col gap-6">
        {isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-300/80 bg-[var(--dash-surface)] px-4 py-3 text-sm text-red-800 dark:text-red-300"
          >
            {t("nav.errorProfile")}
          </div>
        ) : null}

        <section aria-labelledby="account-heading" className="space-y-3">
          <h2
            id="account-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[#0B3A6E]/80 dark:text-white/60"
          >
            {t("nav.myAccount")}
          </h2>
          <ProfileCard user={user} isLoading={isLoading} />
        </section>

        <section aria-labelledby="shortcuts-heading" className="space-y-4">
          <h2
            id="shortcuts-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[#0B3A6E]/80 dark:text-white/60"
          >
            {t("nav.shortcuts")}
          </h2>
          <div className="shortcut-tiles-grid grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <ShortcutTile
              title={t("nav.links")}
              imageSrc={dashboardAssets.shortcutSecurity}
              imageAlt=""
              href="/enterprise"
            />
            <ShortcutTile
              title={t("nav.history")}
              imageSrc={dashboardAssets.shortcutDevices}
              imageAlt=""
              href="/devices"
            />
            <ShortcutTile
              title={t("nav.settings")}
              imageSrc={dashboardAssets.shortcutHelp}
              imageAlt=""
              href="/settings"
            />
            <ShortcutTile
              title={t("nav.profile")}
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

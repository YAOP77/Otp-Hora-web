"use client";

import { SettingsMorePanel } from "@/components/features/settings/settings-more-panel";
import { PageHeader } from "@/components/ui/page-header";

export default function SettingsPage() {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Paramètres"
        description="Préférences, sécurité et session sur cet appareil."
      />
      <SettingsMorePanel />
    </div>
  );
}

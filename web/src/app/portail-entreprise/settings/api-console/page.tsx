import { ApiConsoleView } from "@/components/features/settings/api-console-view";
import { PageHeader } from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio API - Portail Entreprise",
  description: "Console interne pour valider l'intégration des 39 endpoints OTP Hora.",
};

export default function EnterpriseApiConsolePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Studio API entreprise"
        description="Couverture complète des 39 APIs backend pour tests, diagnostic et intégration technique."
      />
      <ApiConsoleView />
    </div>
  );
}

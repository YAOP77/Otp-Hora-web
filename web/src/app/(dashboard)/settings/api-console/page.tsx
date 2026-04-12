import { ApiConsoleView } from "@/components/features/settings/api-console-view";
import { PageHeader } from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Console API",
  description: "Console de validation : couverture complète des endpoints OTP Hora.",
};

export default function ApiConsolePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Console API"
        description="Interface interne pour déclencher les 39 APIs documentées et observer les réponses / erreurs."
      />
      <ApiConsoleView />
    </div>
  );
}


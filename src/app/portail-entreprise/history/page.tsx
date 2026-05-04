import type { Metadata } from "next";
import { EnterpriseHistoryPageView } from "@/components/features/enterprise-portal/enterprise-history-page-view";

export const metadata: Metadata = {
  title: "Historique d'accès - Portail Entreprise",
  description: "Historique des connexions et activités de votre compte entreprise.",
};

export default function EnterpriseHistoryPage() {
  return <EnterpriseHistoryPageView />;
}

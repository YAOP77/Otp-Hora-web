import { EnterpriseDashboardHomeView } from "@/components/features/enterprise-portal/enterprise-dashboard-home-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord - Portail Entreprise",
  description: "Tableau de bord de votre compte entreprise OTP Hora.",
};

export default function PortailEntreprisePage() {
  return <EnterpriseDashboardHomeView />;
}

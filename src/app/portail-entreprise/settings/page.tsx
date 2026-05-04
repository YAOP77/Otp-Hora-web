import type { Metadata } from "next";
import { EnterpriseSettingsPageView } from "@/components/features/enterprise-portal/enterprise-settings-page-view";

export const metadata: Metadata = {
  title: "Paramètres - Portail Entreprise",
  description: "Paramètres et configuration de votre compte entreprise.",
};

export default function EnterpriseSettingsPage() {
  return <EnterpriseSettingsPageView />;
}

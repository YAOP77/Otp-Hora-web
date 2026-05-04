import type { Metadata } from "next";
import { EnterpriseAccountPageView } from "@/components/features/enterprise-portal/enterprise-account-page-view";

export const metadata: Metadata = {
  title: "Compte - Portail Entreprise",
  description: "Gestion du profil et des informations de votre compte entreprise.",
};

export default function EnterpriseAccountPage() {
  return <EnterpriseAccountPageView />;
}

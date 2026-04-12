import type { Metadata } from "next";
import { EnterpriseUsersPageView } from "@/components/features/enterprise-portal/enterprise-users-page-view";

export const metadata: Metadata = {
  title: "Utilisateurs liés - Portail Entreprise",
  description: "Gestion des utilisateurs associés à votre compte entreprise.",
};

export default function EnterpriseUsersPage() {
  return <EnterpriseUsersPageView />;
}

import type { Metadata } from "next";
import { EnterpriseDevicesPageView } from "@/components/features/enterprise-portal/enterprise-devices-page-view";

export const metadata: Metadata = {
  title: "Appareils - Portail Entreprise",
  description: "Gestion des appareils associés à votre compte entreprise.",
};

export default function EnterpriseDevicesPage() {
  return <EnterpriseDevicesPageView />;
}

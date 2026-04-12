import { DashboardHomeView } from "@/components/features/dashboard/dashboard-home-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil",
  description: "Tableau de bord OTP Hora — compte et raccourcis.",
};

export default function DashboardPage() {
  return <DashboardHomeView />;
}

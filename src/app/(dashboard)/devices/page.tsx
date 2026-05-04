import { DevicesPageView } from "@/components/features/devices/devices-page-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historique de connexion",
};

export default function DevicesPage() {
  return <DevicesPageView />;
}

import { LandingHome } from "@/components/features/marketing/landing-home";
import { MarketingFooter } from "@/components/features/marketing/marketing-footer";
import { MarketingHeader } from "@/components/features/marketing/marketing-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "OTP Hora sur le web : authentification, compte, appareils, contacts et liaisons entreprise — même backend que l'application mobile.",
  openGraph: {
    title: "OTP Hora — Interface web",
    description:
      "Validez vos actions, gérez votre compte et vos liaisons professionnelles depuis le navigateur.",
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <LandingHome />
      <MarketingFooter />
    </div>
  );
}

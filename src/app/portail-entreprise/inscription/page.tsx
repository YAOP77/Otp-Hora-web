import { EnterpriseRegisterForm } from "@/components/features/enterprise-portal/enterprise-register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription entreprise",
};

export default function PortailEntrepriseInscriptionPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Inscription entreprise
      </h1>
      <div className="mt-3">
        <EnterpriseRegisterForm />
      </div>
    </>
  );
}

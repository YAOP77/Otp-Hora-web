import { EnterpriseLoginForm } from "@/components/features/enterprise-portal/enterprise-login-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Connexion entreprise",
};

export default function PortailEntrepriseLoginPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Connexion entreprise
      </h1>
      <div className="mt-3">
        <Suspense
          fallback={
            <p className="text-center text-sm text-secondary">Chargement…</p>
          }
        >
          <EnterpriseLoginForm />
        </Suspense>
      </div>
    </>
  );
}

import { LoginForm } from "@/components/features/auth/login-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à OTP Hora avec votre téléphone et votre code PIN.",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Connexion
      </h1>
      <div className="mt-3">
        <Suspense
          fallback={
            <p className="text-center text-sm text-secondary">Chargement…</p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}

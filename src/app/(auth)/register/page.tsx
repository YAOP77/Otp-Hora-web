import { RegisterForm } from "@/components/features/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez un compte OTP Hora.",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Inscription
      </h1>
      <div className="mt-3">
        <RegisterForm />
      </div>
    </>
  );
}

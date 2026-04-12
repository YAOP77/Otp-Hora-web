import { AuthShell } from "@/components/features/auth/auth-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthShell
      title="Bienvenue sur OTP Hora"
      subtitle="Plateforme d'authentification sécurisée — gérez votre compte, vos appareils et vos liaisons en toute confiance."
      variant="user"
    >
      {children}
    </AuthShell>
  );
}

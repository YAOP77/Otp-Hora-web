import { AuthShell } from "@/components/features/auth/auth-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthShell
      titleKey="auth.welcome"
      subtitleKey="auth.welcome.sub"
      variant="user"
    >
      {children}
    </AuthShell>
  );
}

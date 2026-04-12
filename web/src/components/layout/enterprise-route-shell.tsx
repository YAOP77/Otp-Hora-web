"use client";

import { AuthShell } from "@/components/features/auth/auth-shell";
import { EnterpriseAuthGuard } from "@/components/features/auth/enterprise-auth-guard";
import { EnterpriseAppShell } from "@/components/layout/enterprise-app-shell";
import { DashboardViewTransition } from "@/components/layout/dashboard-view-transition";
import { usePathname } from "next/navigation";

const publicPaths = new Set([
  "/portail-entreprise/login",
  "/portail-entreprise/inscription",
]);

export function EnterpriseRouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname != null && publicPaths.has(pathname);

  if (isPublic) {
    return (
      <AuthShell
        title="Portail Entreprise"
        subtitle="Espace réservé aux comptes entreprise — gérez vos liaisons, autorisations et clés API depuis une interface dédiée."
        backHref="/"
        variant="enterprise"
      >
        {children}
      </AuthShell>
    );
  }

  return (
    <EnterpriseAuthGuard>
      <EnterpriseAppShell>
        <DashboardViewTransition>{children}</DashboardViewTransition>
      </EnterpriseAppShell>
    </EnterpriseAuthGuard>
  );
}

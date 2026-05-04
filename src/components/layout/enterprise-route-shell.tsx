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
        titleKey="auth.enterprise.title"
        subtitleKey="auth.enterprise.sub"
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

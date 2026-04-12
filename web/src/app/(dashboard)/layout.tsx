import { DashboardAuthGuard } from "@/components/features/auth/dashboard-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardViewTransition } from "@/components/layout/dashboard-view-transition";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardAuthGuard>
      <AppShell>
        <DashboardViewTransition>{children}</DashboardViewTransition>
      </AppShell>
    </DashboardAuthGuard>
  );
}

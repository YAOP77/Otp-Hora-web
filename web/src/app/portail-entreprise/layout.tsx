import { EnterpriseRouteShell } from "@/components/layout/enterprise-route-shell";

export default function PortailEntrepriseLayout({ children }: { children: React.ReactNode }) {
  return <EnterpriseRouteShell>{children}</EnterpriseRouteShell>;
}

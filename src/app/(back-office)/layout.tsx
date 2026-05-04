import { BackOfficeGuard } from "@/components/features/back-office/back-office-guard";
import "@/app/admin/back-office.css";

export default function BackOfficeLayout({ children }: { children: React.ReactNode }) {
  return <BackOfficeGuard>{children}</BackOfficeGuard>;
}

import { UserIdentityHub } from "@/components/features/enterprise/user-identity-hub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liaisons & identité",
};

export default function EnterprisePage() {
  return <UserIdentityHub />;
}

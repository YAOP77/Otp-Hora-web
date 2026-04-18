import { EnterpriseRouter } from "@/components/features/enterprise/enterprise-router";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Liaisons & identité",
};

export default function EnterprisePage() {
  return (
    <Suspense fallback={null}>
      <EnterpriseRouter />
    </Suspense>
  );
}

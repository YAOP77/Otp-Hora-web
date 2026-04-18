"use client";

import { EnterpriseConsentView } from "@/components/features/enterprise/enterprise-consent-view";
import { UserIdentityHub } from "@/components/features/enterprise/user-identity-hub";
import { useSearchParams } from "next/navigation";

/**
 * Routeur côté client pour /enterprise :
 *  - `?link_id=<uuid>` → flux de consentement partenaire (plein écran,
 *    bypass auth guard, login inline) via `EnterpriseConsentView`.
 *  - Sinon → hub utilisateur classique dans la chrome du dashboard.
 *
 * Les deux cohabitent sur la même route pour conserver l'URL attendue
 * par les applications partenaires (`/enterprise?link_id=...`).
 */
export function EnterpriseRouter() {
  const searchParams = useSearchParams();
  const linkId = searchParams.get("link_id");

  if (linkId) {
    return <EnterpriseConsentView linkId={linkId} />;
  }

  return <UserIdentityHub />;
}

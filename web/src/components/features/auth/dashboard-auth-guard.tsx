"use client";

import { clearSession, getAccessToken, getUserId } from "@/lib/auth/session";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Vérifie la cohérence jeton / cookie : si le cookie a expiré ou été supprimé,
 * le middleware redirige ; si le jeton manque encore, déconnexion locale.
 *
 * Exception : /enterprise?link_id=<uuid> est un flux de consentement public
 * (partenaire OAuth-like) qui gère son propre login inline — on n'impose
 * pas d'auth côté client pour ne pas casser ce parcours.
 */
export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isConsentFlow =
      pathname === "/enterprise" && searchParams.get("link_id");
    if (isConsentFlow) return;

    const token = getAccessToken();
    const userId = getUserId();
    if (!token || !userId) {
      clearSession();
      router.replace("/login");
    }
  }, [router, pathname, searchParams]);

  return <>{children}</>;
}

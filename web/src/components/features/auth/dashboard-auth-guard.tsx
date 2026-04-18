"use client";

import { clearSession, getAccessToken, getUserId } from "@/lib/auth/session";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Vérifie la cohérence jeton / cookie : si le cookie a expiré ou été supprimé,
 * le middleware redirige ; si le jeton manque encore, déconnexion locale puis
 * redirection vers /login en préservant l'URL courante dans `redirect`.
 */
export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = getAccessToken();
    const userId = getUserId();
    if (!token || !userId) {
      clearSession();
      const current = `${pathname ?? "/"}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const login = new URL("/login", window.location.origin);
      login.searchParams.set("redirect", current);
      router.replace(`${login.pathname}${login.search}`);
    }
  }, [router, pathname, searchParams]);

  return <>{children}</>;
}

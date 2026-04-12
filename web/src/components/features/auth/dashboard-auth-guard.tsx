"use client";

import { clearSession, getAccessToken, getUserId } from "@/lib/auth/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Vérifie la cohérence jeton / cookie : si le cookie a expiré ou été supprimé,
 * le middleware redirige ; si le jeton manque encore, déconnexion locale.
 */
export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    const userId = getUserId();
    if (!token || !userId) {
      clearSession();
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}

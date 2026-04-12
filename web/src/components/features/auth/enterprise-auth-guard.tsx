"use client";

import { clearEnterpriseSession, getEnterpriseAccessToken } from "@/lib/auth/enterprise-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Vérifie que l'utilisateur est connecté au portail entreprise.
 * Si pas de token, redirige vers la page de connexion entreprise.
 */
export function EnterpriseAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getEnterpriseAccessToken();
    if (!token) {
      clearEnterpriseSession();
      router.replace("/portail-entreprise/login");
    }
  }, [router]);

  return <>{children}</>;
}

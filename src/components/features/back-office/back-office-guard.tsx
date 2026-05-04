"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { getAccessToken } from "@/lib/auth/session";
import { createHttpClient } from "@/lib/api/http-client";
import { unwrapApiData } from "@/types/api";
import { BoSidebar } from "./bo-sidebar";
import { BoHeader } from "./bo-header";

export function BackOfficeGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mounted = useHasMounted();
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState<{ nom?: string; prenom?: string; email?: string } | null>(null);

  useEffect(() => {
    if (!mounted) return;

    const token = getAccessToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const { request } = createHttpClient({ getToken: () => token });
    request<unknown>("GET", "/api/back-office/me")
      .then((raw) => {
        const user = unwrapApiData<{ role?: string; nom?: string; prenom?: string; email?: string }>(raw);
        if (user?.role === "admin") {
          setAdmin(user);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      })
      .finally(() => setChecking(false));
  }, [mounted, router]);

  if (!mounted || checking) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0a0b0f",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "3px solid rgba(99,102,241,0.2)",
            borderTopColor: "#6366f1",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <div style={{ color: "#64748b", fontSize: 13 }}>Vérification des droits…</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!admin) return null;

  const adminName = admin.nom && admin.prenom
    ? `${admin.prenom} ${admin.nom}`
    : admin.nom || "Administrateur";

  return (
    <div className="bo-root bo-layout">
      <BoSidebar adminName={adminName} adminEmail={admin.email} />
      <div className="bo-main">
        <BoHeader adminName={adminName} adminEmail={admin.email} />
        <main className="bo-content">{children}</main>
      </div>
    </div>
  );
}

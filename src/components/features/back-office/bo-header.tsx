"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";

const titles: Record<string, { title: string; breadcrumb: string }> = {
  "/admin": { title: "Tableau de bord", breadcrumb: "Back-Office / Vue d'ensemble" },
  "/admin/users": { title: "Utilisateurs", breadcrumb: "Back-Office / Gestion" },
  "/admin/enterprises": { title: "Entreprises", breadcrumb: "Back-Office / Gestion" },
  "/admin/sessions": { title: "Sessions actives", breadcrumb: "Back-Office / Sécurité" },
  "/admin/settings": { title: "Paramètres", breadcrumb: "Back-Office / Configuration" },
  "/admin/activity": { title: "Journal d'activité", breadcrumb: "Back-Office / Sécurité" },
};

export function BoHeader({
  adminName,
  adminEmail,
}: {
  adminName?: string;
  adminEmail?: string;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const page = titles[pathname] ?? { title: "Back-Office", breadcrumb: "" };
  const initials = adminName
    ? adminName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "AD";
  const isDark = mounted && theme === "dark";

  return (
    <header className="bo-header">
      <div style={{ flex: 1 }}>
        <div className="bo-header-title">{page.title}</div>
        {page.breadcrumb && <div className="bo-header-breadcrumb">{page.breadcrumb}</div>}
      </div>

      <div className="bo-header-actions">
        {/* Bouton thème */}
        <button
          className="bo-icon-btn"
          onClick={toggleTheme}
          title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
          aria-label="Changer de thème"
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{ width: 16, height: 16 }}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{ width: 16, height: 16 }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div style={{ width: 1, height: 22, background: "var(--dash-border)" }} />

        {/* Avatar admin */}
        <div className="bo-avatar">
          <div className="bo-avatar-img">{initials}</div>
          <div>
            <div className="bo-avatar-name">{adminName || "Admin"}</div>
            <div className="bo-avatar-role">Administrateur</div>
            {adminEmail ? (
              <div style={{ fontSize: 11, color: "var(--bo-text-muted)", marginTop: 2 }}>{adminEmail}</div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

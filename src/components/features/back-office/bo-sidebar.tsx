"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { clearSession } from "@/lib/auth/session";
import "@/app/admin/back-office.css";

const navItems = [
  {
    section: "Vue d'ensemble",
    items: [
      {
        href: "/admin",
        label: "Tableau de bord",
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h10.5a.75.75 0 0 1 0 1.5H12v13.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5H2V3.5h-.25A.75.75 0 0 1 1 2.75ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM8 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM8.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z" clipRule="evenodd" />
            <path d="M14.75 9a.75.75 0 0 0-.75.75V17c0 .138.112.25.25.25h1.25a.25.25 0 0 0 .25-.25V9.75a.75.75 0 0 0-.75-.75h-.25Z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Gestion",
    items: [
      {
        href: "/admin/users",
        label: "Utilisateurs",
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 17a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
          </svg>
        ),
      },
      {
        href: "/admin/enterprises",
        label: "Entreprises",
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm6.5 0v.325a41.622 41.622 0 0 0-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25ZM10 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            <path d="M2 13.443c0 1.104.73 2.044 1.79 2.412A11.955 11.955 0 0 0 10 17c2.375 0 4.58-.633 6.21-1.145C17.27 15.487 18 14.547 18 13.443v-.38a11.93 11.93 0 0 1-1.97.609A13.437 13.437 0 0 1 10 14a13.437 13.437 0 0 1-6.03-.93A11.93 11.93 0 0 1 2 12.461v.982Z" />
          </svg>
        ),
      },
      {
        href: "/admin/sessions",
        label: "Sessions actives",
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Sécurité",
    items: [
      {
        href: "/admin/activity",
        label: "Journal d'activité",
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75H10a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        ),
      },
      {
        href: "/admin/settings",
        label: "Paramètres",
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          </svg>
        ),
      },
    ],
  },
];

export function BoSidebar({
  adminName,
  adminEmail,
}: {
  adminName?: string;
  adminEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearSession();
    router.push("/admin/login");
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const initials = adminName
    ? adminName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  return (
    <aside className="bo-sidebar">
      {/* Logo */}
      <div className="bo-sidebar-logo">
        <div className="bo-sidebar-logo-mark">H</div>
        <div className="bo-sidebar-logo-text">
          <span className="bo-sidebar-logo-title">OTP Hora</span>
          <span className="bo-sidebar-logo-sub">Back-Office</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bo-nav">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="bo-nav-section">{group.section}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`bo-nav-item ${isActive(item.href) ? "active" : ""}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="bo-sidebar-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", marginBottom: 8 }}>
          <div className="bo-avatar-img">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bo-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {adminName || "Administrateur"}
            </div>
            <div style={{ fontSize: 11, color: "var(--bo-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {adminEmail || ""}
            </div>
          </div>
        </div>
        <button className="bo-nav-item" onClick={logout} style={{ color: "var(--bo-danger)", width: "100%" }}>
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
            <path fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25ZM9.47 11.03a.75.75 0 0 0 1.06-1.06L9.56 9h5.69a.75.75 0 0 0 0-1.5H9.56l.97-.97a.75.75 0 1 0-1.06-1.06l-2.25 2.25a.75.75 0 0 0 0 1.06l2.25 2.25Z" clipRule="evenodd" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

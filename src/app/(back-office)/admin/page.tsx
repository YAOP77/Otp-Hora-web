"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/session";
import { fetchUsers } from "@/lib/api/back-office";
import { unwrapApiData } from "@/types/api";
import Link from "next/link";

type Stats = {
  total_users: number;
  active_users: number;
  suspended_users: number;
  total_enterprises: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const getToken = () => token;

    fetchUsers(getToken)
      .then((raw) => {
        const users: any[] = unwrapApiData<any[]>(raw) ?? [];
        const active = users.filter((u) => u.status === "active").length;
        const suspended = users.filter((u) => u.status === "suspended" || u.status === "blocked").length;
        setStats({
          total_users: users.length,
          active_users: active,
          suspended_users: suspended,
          total_enterprises: 0,
        });
        setRecentUsers(users.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Utilisateurs total",
      value: stats?.total_users ?? "—",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 17a9.953 9.953 0 0 1-5.385-1.572Z" />
        </svg>
      ),
      iconBg: "rgba(99,102,241,0.15)",
      iconColor: "#818cf8",
      accent: "linear-gradient(90deg,#6366f1,#818cf8)",
      delta: "total",
    },
    {
      label: "Comptes actifs",
      value: stats?.active_users ?? "—",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
      ),
      iconBg: "rgba(16,185,129,0.15)",
      iconColor: "#10b981",
      accent: "linear-gradient(90deg,#10b981,#34d399)",
      delta: "actifs",
    },
    {
      label: "Comptes suspendus",
      value: stats?.suspended_users ?? "—",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
        </svg>
      ),
      iconBg: "rgba(239,68,68,0.15)",
      iconColor: "#ef4444",
      accent: "linear-gradient(90deg,#ef4444,#f87171)",
      delta: "suspendus",
    },
    {
      label: "Entreprises",
      value: stats?.total_enterprises ?? "—",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm6.5 0v.325a41.622 41.622 0 0 0-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25ZM10 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          <path d="M2 13.443c0 1.104.73 2.044 1.79 2.412A11.955 11.955 0 0 0 10 17c2.375 0 4.58-.633 6.21-1.145C17.27 15.487 18 14.547 18 13.443v-.38a11.93 11.93 0 0 1-1.97.609A13.437 13.437 0 0 1 10 14a13.437 13.437 0 0 1-6.03-.93A11.93 11.93 0 0 1 2 12.461v.982Z" />
        </svg>
      ),
      iconBg: "rgba(6,182,212,0.15)",
      iconColor: "#06b6d4",
      accent: "linear-gradient(90deg,#06b6d4,#22d3ee)",
      delta: "partenaires",
    },
  ];

  return (
    <div>
      {/* En-tête */}
      <div>
        <h1 className="bo-page-title">Tableau de bord</h1>
        <p className="bo-page-sub">Vue d'ensemble de la plateforme OTP Hora.</p>
      </div>

      {/* Stats */}
      <div className="bo-stats-grid">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bo-stat-card"
            style={{ "--card-accent": card.accent } as any}
          >
            <div className="bo-stat-icon" style={{ background: card.iconBg, color: card.iconColor }}>
              {card.icon}
            </div>
            <div className="bo-stat-value">
              {loading ? (
                <div className="bo-pulse" style={{ width: 60, height: 32, borderRadius: 6 }} />
              ) : (
                card.value
              )}
            </div>
            <div className="bo-stat-label">{card.label}</div>
            <span className="bo-stat-delta neutral">{card.delta}</span>
          </div>
        ))}
      </div>

      {/* Derniers utilisateurs */}
      <div className="bo-table-wrap" style={{ marginTop: 28 }}>
        <div className="bo-table-head">
          <span className="bo-table-title">Derniers utilisateurs inscrits</span>
          <Link
            href="/admin/users"
            style={{
              fontSize: 12,
              color: "var(--bo-primary-light)",
              textDecoration: "none",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Voir tous
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <table className="bo-table">
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="bo-loading-row">
                  <td><div className="bo-pulse" style={{ width: "70%", maxWidth: 200 }} /></td>
                  <td><div className="bo-pulse" style={{ width: "50%", maxWidth: 160 }} /></td>
                  <td><div className="bo-pulse" style={{ width: 60 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : recentUsers.length === 0 ? (
          <div className="bo-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <p>Aucun utilisateur trouvé.</p>
          </div>
        ) : (
          <table className="bo-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Statut</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => {
                const initials = ((u.prenom?.[0] ?? "") + (u.nom?.[0] ?? "")).toUpperCase() || "U";
                return (
                  <tr key={u.user_id}>
                    <td>
                      <div className="bo-user-cell">
                        <div className="bo-user-avatar">{initials}</div>
                        <div>
                          <div className="bo-user-name">{u.prenom} {u.nom}</div>
                          <div className="bo-user-key">@{u.username || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {u.email || <span style={{ color: "var(--bo-text-muted)" }}>—</span>}
                        {u.email && (
                          <span className={`bo-badge ${u.email_verified ? "verified" : "unverified"}`} style={{ "--bo-badge-dot": "none" } as any}>
                            {u.email_verified ? "✓" : "×"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`bo-badge ${u.status}`}>{u.status}</span>
                    </td>
                    <td style={{ color: u.role === "admin" ? "var(--bo-primary-light)" : "var(--bo-text-muted)" }}>
                      {u.role ?? "user"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Raccourcis */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
        <Link href="/admin/users" style={{ textDecoration: "none" }}>
          <div className="bo-stat-card" style={{ "--card-accent": "linear-gradient(90deg,#6366f1,#818cf8)", cursor: "pointer" } as any}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bo-text)", marginBottom: 4 }}>Gérer les utilisateurs</div>
                <div style={{ fontSize: 12, color: "var(--bo-text-muted)" }}>Modifier statuts, déconnecter appareils</div>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, color: "var(--bo-primary-light)", flexShrink: 0 }}>
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Link>

        <Link href="/admin/enterprises" style={{ textDecoration: "none" }}>
          <div className="bo-stat-card" style={{ "--card-accent": "linear-gradient(90deg,#06b6d4,#22d3ee)", cursor: "pointer" } as any}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bo-text)", marginBottom: 4 }}>Gérer les entreprises</div>
                <div style={{ fontSize: 12, color: "var(--bo-text-muted)" }}>API keys, statuts, liaisons utilisateurs</div>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, color: "#06b6d4", flexShrink: 0 }}>
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/session";
import { fetchUsers, deactivateUserDevices } from "@/lib/api/back-office";
import { unwrapApiData } from "@/types/api";

export default function SessionsPage() {
  const [usersWithDevices, setUsersWithDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = () => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    fetchUsers(() => token)
      .then((raw) => {
        const users: any[] = unwrapApiData<any[]>(raw) ?? [];
        // Filtrer ceux qui ont des appareils actifs
        const active = users.filter((u) => (u.devices?.length ?? 0) > 0);
        setUsersWithDevices(active);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  async function handleDeactivate(userId: string) {
    const token = getAccessToken();
    if (!token) return;
    setActionLoading(userId);
    try {
      await deactivateUserDevices(userId, () => token);
      setUsersWithDevices((prev) => prev.filter((u) => u.user_id !== userId));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  }

  const filtered = usersWithDevices.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.nom?.toLowerCase().includes(q) ||
      u.prenom?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div>
        <h1 className="bo-page-title">Sessions actives</h1>
        <p className="bo-page-sub">Utilisateurs avec des appareils connectés. Vous pouvez déconnecter à distance.</p>
      </div>

      <div className="bo-table-wrap" style={{ marginTop: 24 }}>
        <div className="bo-table-head">
          <span className="bo-table-title">
            {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""} avec session active
          </span>
          <div className="bo-search">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <table className="bo-table">
            <tbody>
              {[1,2,3].map((i) => (
                <tr key={i} className="bo-loading-row">
                  <td colSpan={4}><div className="bo-pulse" style={{ width: "100%", height: 14 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : filtered.length === 0 ? (
          <div className="bo-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <p>Aucune session active détectée.</p>
          </div>
        ) : (
          <table className="bo-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Appareils actifs</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const initials = ((u.prenom?.[0] ?? "") + (u.nom?.[0] ?? "")).toUpperCase() || "U";
                const deviceCount = u.devices?.length ?? 0;
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
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {u.devices?.slice(0, 3).map((d: any) => (
                          <span
                            key={d.device_id}
                            style={{
                              padding: "3px 8px",
                              background: "var(--bo-surface-2)",
                              border: "1px solid var(--bo-border)",
                              borderRadius: 6,
                              fontSize: 11,
                              color: "var(--bo-text-dim)",
                            }}
                          >
                            {d.device_name || d.user_agent?.split(" ")[0] || "Appareil inconnu"}
                          </span>
                        ))}
                        {deviceCount > 3 && (
                          <span style={{ fontSize: 11, color: "var(--bo-text-muted)" }}>+{deviceCount - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`bo-badge ${u.status}`}>
                        {u.status === "active" ? "Actif" : u.status}
                      </span>
                    </td>
                    <td>
                      <div className="bo-row-actions" style={{ opacity: 1 }}>
                        <button
                          className="bo-action-btn danger"
                          disabled={actionLoading === u.user_id}
                          onClick={() => handleDeactivate(u.user_id)}
                        >
                          {actionLoading === u.user_id ? "En cours…" : "⚡ Tout déconnecter"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

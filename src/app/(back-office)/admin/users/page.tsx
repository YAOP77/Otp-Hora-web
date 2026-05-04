"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/session";
import { fetchUsers, changeUserStatus, deactivateUserDevices } from "@/lib/api/back-office";
import { unwrapApiData } from "@/types/api";

type User = {
  user_id: string;
  nom: string;
  prenom: string;
  username?: string;
  email?: string;
  email_verified?: boolean;
  status: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "active" | "suspended" | "blocked">("all");

  const loadUsers = () => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    fetchUsers(() => token)
      .then((raw) => {
        const list: User[] = unwrapApiData<User[]>(raw) ?? [];
        setUsers(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  useEffect(() => {
    let result = users;
    if (tab !== "all") result = result.filter((u) => u.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.nom?.toLowerCase().includes(q) ||
          u.prenom?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, tab, users]);

  async function handleStatus(userId: string, status: "active" | "suspended" | "blocked") {
    const token = getAccessToken();
    if (!token) return;
    setActionLoading(userId + status);
    try {
      await changeUserStatus(userId, status, () => token);
      setUsers((prev) => prev.map((u) => u.user_id === userId ? { ...u, status } : u));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  }

  async function handleDeactivate(userId: string) {
    const token = getAccessToken();
    if (!token) return;
    setActionLoading(userId + "deactivate");
    try {
      await deactivateUserDevices(userId, () => token);
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  }

  const counts = {
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    blocked: users.filter((u) => u.status === "blocked").length,
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 className="bo-page-title">Utilisateurs</h1>
          <p className="bo-page-sub">{users.length} compte{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""} sur la plateforme.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bo-tabs" style={{ marginTop: 24 }}>
        {(["all", "active", "suspended", "blocked"] as const).map((t) => (
          <button key={t} className={`bo-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "all" ? "Tous" : t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="bo-nav-badge" style={{ marginLeft: 6 }}>{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="bo-table-wrap" style={{ marginTop: 0 }}>
        {/* Barre de recherche */}
        <div className="bo-table-head">
          <span className="bo-table-title">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
          <div className="bo-search">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              placeholder="Rechercher par nom, email, username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <table className="bo-table">
            <tbody>
              {[1,2,3,4,5].map((i) => (
                <tr key={i} className="bo-loading-row">
                  <td colSpan={5}><div className="bo-pulse" style={{ width: "100%", height: 14 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : filtered.length === 0 ? (
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
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
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
                        <span>{u.email || <span style={{ color: "var(--bo-text-muted)" }}>—</span>}</span>
                        {u.email && (
                          <span className={`bo-badge ${u.email_verified ? "verified" : "unverified"}`}>
                            {u.email_verified ? "Vérifié" : "Non vérifié"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: "var(--bo-text-muted)", fontSize: 12 }}>
                      {(u as any).contacts?.[0]?.phone_number ?? "—"}
                    </td>
                    <td>
                      <span className={`bo-badge ${u.status}`}>
                        {u.status === "active" ? "Actif" : u.status === "suspended" ? "Suspendu" : u.status === "blocked" ? "Bloqué" : u.status}
                      </span>
                    </td>
                    <td>
                      <div className="bo-row-actions">
                        {u.status !== "active" && (
                          <button
                            className="bo-action-btn success"
                            disabled={actionLoading === u.user_id + "active"}
                            onClick={() => handleStatus(u.user_id, "active")}
                          >
                            Activer
                          </button>
                        )}
                        {u.status !== "suspended" && (
                          <button
                            className="bo-action-btn"
                            disabled={actionLoading === u.user_id + "suspended"}
                            onClick={() => handleStatus(u.user_id, "suspended")}
                          >
                            Suspendre
                          </button>
                        )}
                        {u.status !== "blocked" && (
                          <button
                            className="bo-action-btn danger"
                            disabled={actionLoading === u.user_id + "blocked"}
                            onClick={() => handleStatus(u.user_id, "blocked")}
                          >
                            Bloquer
                          </button>
                        )}
                        <button
                          className="bo-action-btn danger"
                          disabled={actionLoading === u.user_id + "deactivate"}
                          onClick={() => handleDeactivate(u.user_id)}
                          title="Déconnecter tous les appareils"
                        >
                          ⚡ Décon. appareils
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

"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/session";
import { createHttpClient } from "@/lib/api/http-client";
import { unwrapApiData } from "@/types/api";

type Enterprise = {
  company_id: string;
  nom_entreprise: string;
  username?: string | null;
  email?: string | null;
  email_verified_at?: string | null;
  status: string;
  phone_e164?: string | null;
  deleted_at?: string | null;
};

export default function EnterprisesPage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [filtered, setFiltered] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "active" | "suspended">("all");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setLoadError(null);
    const { request } = createHttpClient({ getToken: () => token });
    request<unknown>("GET", "/api/back-office/enterprises")
      .then((raw) => {
        const list: Enterprise[] = unwrapApiData<Enterprise[]>(raw) ?? [];
        setEnterprises(list);
        setFiltered(list);
      })
      .catch((e: unknown) => {
        setEnterprises([]);
        setFiltered([]);
        setLoadError(e instanceof Error ? e.message : "Impossible de charger les entreprises.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = enterprises;
    if (tab === "active") {
      result = result.filter(
        (e) => !e.deleted_at && (e.status === "active" || e.status === "valider"),
      );
    } else if (tab === "suspended") {
      result = result.filter(
        (e) =>
          Boolean(e.deleted_at) ||
          e.status === "suspended" ||
          e.status === "blocked",
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.nom_entreprise?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.username?.toLowerCase().includes(q) ||
          e.company_id.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, tab, enterprises]);

  const counts = {
    all: enterprises.length,
    active: enterprises.filter(
      (e) => !e.deleted_at && (e.status === "active" || e.status === "valider"),
    ).length,
    suspended: enterprises.filter(
      (e) =>
        Boolean(e.deleted_at) ||
        e.status === "suspended" ||
        e.status === "blocked",
    ).length,
  };

  return (
    <div>
      <div>
        <h1 className="bo-page-title">Entreprises</h1>
        <p className="bo-page-sub">{enterprises.length} entreprise{enterprises.length > 1 ? "s" : ""} enregistrée{enterprises.length > 1 ? "s" : ""} sur la plateforme.</p>
      </div>

      {/* Tabs */}
      <div className="bo-tabs" style={{ marginTop: 24 }}>
        {(["all", "active", "suspended"] as const).map((t) => (
          <button key={t} className={`bo-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "all" ? "Toutes" : t === "active" ? "Actives" : "Suspendues"}
            <span className="bo-nav-badge" style={{ marginLeft: 6 }}>{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="bo-table-wrap" style={{ marginTop: 0 }}>
        <div className="bo-table-head">
          <span className="bo-table-title">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
          <div className="bo-search">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              placeholder="Rechercher une entreprise…"
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
        ) : loadError ? (
          <div className="bo-empty">
            <p>Erreur de chargement</p>
            <p style={{ fontSize: 12, marginTop: 4, color: "var(--bo-text-muted)" }}>{loadError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bo-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <p>Aucune entreprise trouvée.</p>
            <p style={{ fontSize: 12, marginTop: 4, color: "var(--bo-text-muted)" }}>
              Aucun compte entreprise ne correspond aux filtres ou à la recherche.
            </p>
          </div>
        ) : (
          <table className="bo-table">
            <thead>
              <tr>
                <th>Entreprise</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const initials = (e.nom_entreprise ?? "?").slice(0, 2).toUpperCase();
                return (
                  <tr key={e.company_id}>
                    <td>
                      <div className="bo-user-cell">
                        <div className="bo-user-avatar" style={{ background: "linear-gradient(135deg,#06b6d4,#0284c7)" }}>
                          {initials}
                        </div>
                        <div>
                          <div className="bo-user-name">{e.nom_entreprise}</div>
                          <div className="bo-user-key">
                            {e.username ? `@${e.username}` : `${e.company_id.slice(0, 8)}…`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {e.email || <span style={{ color: "var(--bo-text-muted)" }}>—</span>}
                        {e.email && (
                          <span className={`bo-badge ${e.email_verified_at ? "verified" : "unverified"}`}>
                            {e.email_verified_at ? "Vérifié" : "Non vérifié"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: "var(--bo-text-muted)", fontSize: 12 }}>
                      {e.phone_e164 ?? "—"}
                    </td>
                    <td>
                      <span className={`bo-badge ${e.status === "valider" || e.status === "active" ? "active" : "suspended"}`}>
                        {e.status}
                      </span>
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

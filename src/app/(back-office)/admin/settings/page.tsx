"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/session";
import { createHttpClient } from "@/lib/api/http-client";
import { unwrapApiData } from "@/types/api";
import { changeUserStatus } from "@/lib/api/back-office";

type Admin = {
  user_id: string;
  nom: string;
  prenom: string;
  email: string;
  status: string;
  role: string;
};

type Msg = { type: "success" | "error"; text: string } | null;

export default function SettingsPage() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [msg, setMsg] = useState<Msg>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadAdmins = () => {
    const token = getAccessToken();
    if (!token) return;
    setLoadingAdmins(true);
    const { request } = createHttpClient({ getToken: () => token });
    request<unknown>("GET", "/api/back-office/admins")
      .then((raw) => {
        const list = unwrapApiData<Admin[]>(raw) ?? [];
        setAdmins(list);
      })
      .catch(console.error)
      .finally(() => setLoadingAdmins(false));
  };

  useEffect(() => { loadAdmins(); }, []);

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (form.password !== form.confirm) {
      setMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (form.password.length < 6) {
      setMsg({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères." });
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    try {
      const { request } = createHttpClient({ getToken: () => token });
      await request("POST", "/api/back-office/admins", {
        json: { nom: form.nom, prenom: form.prenom, email: form.email, password: form.password },
      });
      setMsg({ type: "success", text: `Administrateur ${form.prenom} ${form.nom} créé avec succès.` });
      setForm({ nom: "", prenom: "", email: "", password: "", confirm: "" });
      loadAdmins();
    } catch (err: any) {
      const detail = err?.message || "Erreur lors de la création.";
      setMsg({ type: "error", text: detail });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(userId: string, status: "active" | "suspended" | "blocked") {
    const token = getAccessToken();
    if (!token) return;
    setActionLoading(userId + status);
    try {
      await changeUserStatus(userId, status, () => token);
      setAdmins((prev) => prev.map((a) => a.user_id === userId ? { ...a, status } : a));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  }

  return (
    <div>
      <h1 className="bo-page-title">Paramètres</h1>
      <p className="bo-page-sub">Configuration du back-office et gestion des accès administrateurs.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24, alignItems: "start" }}>

        {/* Colonne Gauche : Liste des admins */}
        <div className="bo-table-wrap" style={{ marginTop: 0 }}>
          <div className="bo-table-head">
            <span className="bo-table-title">Liste des administrateurs</span>
          </div>
          {loadingAdmins ? (
            <div style={{ padding: 20 }}>
              {[1, 2, 3].map(i => <div key={i} className="bo-pulse" style={{ height: 40, marginBottom: 10 }} />)}
            </div>
          ) : (
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.user_id}>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dash-text)" }}>{admin.prenom} {admin.nom}</div>
                      <div style={{ fontSize: 11, color: "var(--dash-muted)" }}>{admin.email}</div>
                    </td>
                    <td>
                      <span className={`bo-badge ${admin.status}`}>{admin.status}</span>
                    </td>
                    <td>
                      <div className="bo-row-actions">
                        {admin.status === "active" ? (
                          <button
                            className="bo-action-btn"
                            disabled={!!actionLoading}
                            onClick={() => handleStatus(admin.user_id, "suspended")}
                          >
                            Suspendre
                          </button>
                        ) : (
                          <button
                            className="bo-action-btn success"
                            disabled={!!actionLoading}
                            onClick={() => handleStatus(admin.user_id, "active")}
                          >
                            Réactiver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Colonne Droite : Formulaire & Infos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Ajouter un admin */}
          <div className="bo-card" style={{ marginTop: 0 }}>
            <div className="bo-card-title">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, color: "var(--primary)" }}>
                  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.046 15.253c-.18.018-.277.088-.884.88-.455.591-.704 1.409-.704 2.117 0 .368.149.75.451.942.453.285 1.11.308 1.72.308h9.742c.61 0 1.267-.023 1.72-.308.302-.192.451-.574.451-.942 0-.708-.249-1.526-.704-2.117-.607-.792-.704-.862-.884-.88a13.07 13.07 0 0 0-2.054.023A3.5 3.5 0 0 0 10 17.5a3.5 3.5 0 0 0-1.9-.577 13.07 13.07 0 0 0-2.054-.023Z" />
                  <path d="M13.5 6a.5.5 0 0 1 .5.5V8h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V9h-1.5a.5.5 0 0 1 0-1H13V6.5a.5.5 0 0 1 .5-.5Z" />
                </svg>
                Nouvel administrateur
              </div>
            </div>

            {msg && (
              <div style={{
                padding: "10px 14px",
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 13,
                background: msg.type === "success" ? "rgba(46,125,50,0.1)" : "rgba(198,40,40,0.08)",
                color: msg.type === "success" ? "var(--success)" : "var(--error)",
                border: `1px solid ${msg.type === "success" ? "rgba(46,125,50,0.2)" : "rgba(198,40,40,0.2)"}`,
              }}>
                {msg.type === "success" ? "✓ " : "⚠ "}{msg.text}
              </div>
            )}

            <form onSubmit={handleAddAdmin}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="bo-field">
                  <label htmlFor="admin-prenom">Prénom</label>
                  <input id="admin-prenom" className="bo-input" placeholder="Jean" value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
                </div>
                <div className="bo-field">
                  <label htmlFor="admin-nom">Nom</label>
                  <input id="admin-nom" className="bo-input" placeholder="Christ" value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
                </div>
              </div>

              <div className="bo-field">
                <label htmlFor="admin-email-new">Adresse email</label>
                <input id="admin-email-new" type="email" className="bo-input" placeholder="jean.christ@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div className="bo-field">
                <label htmlFor="admin-pwd">Mot de passe</label>
                <input id="admin-pwd" type="password" className="bo-input" placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>

              <div className="bo-field">
                <label htmlFor="admin-pwd2">Confirmer</label>
                <input id="admin-pwd2" type="password" className="bo-input" placeholder="••••••••"
                  value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
              </div>

              <button type="submit" className="bo-btn-primary" disabled={loading} style={{ width: "100%" }}>
                {loading ? "Création en cours…" : "Créer l'administrateur"}
              </button>
            </form>
          </div>

          <div className="bo-card" style={{ marginTop: 0 }}>
            <div className="bo-card-title">Système</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "API", value: "v1.2" },
                { label: "Mode", value: process.env.NODE_ENV },
              ].map((item) => (
                <div key={item.label} style={{ padding: "8px 12px", background: "var(--dash-main)", borderRadius: 8, border: "1px solid var(--dash-border)" }}>
                  <div style={{ fontSize: 10, color: "var(--dash-muted)", fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dash-text)", marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

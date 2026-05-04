"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/api/back-office";
import { setSession } from "@/lib/auth/session";
import { isApiError } from "@/lib/api/errors";
import "@/app/admin/back-office.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(email, password);
      const accessToken = res?.data?.access_token || res?.access_token;
      const userId = res?.data?.user_id || res?.user_id;
      const refreshToken = res?.data?.refresh_token || res?.refresh_token;

      if (!accessToken || !userId) {
        throw new Error("Réponse API invalide");
      }

      setSession(accessToken, userId, refreshToken);
      router.push("/admin");
    } catch (err) {
      if (isApiError(err) && err.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else if (isApiError(err) && err.status === 403) {
        setError("Accès refusé. Droits administrateur requis.");
      } else if (isApiError(err)) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue. Vérifiez que le serveur est actif.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bo-root bo-login-page">
      {/* Panneau visuel gauche */}
      <div className="bo-login-visual">
        <div className="bo-login-visual-logo">H</div>
        <h1 className="bo-login-visual-title">OTP Hora<br />Back-Office</h1>
        <p className="bo-login-visual-sub">
          Espace d'administration sécurisé.<br />
          Accès réservé aux administrateurs.
        </p>

        <div className="bo-login-features">
          <div className="bo-login-feature">
            <div className="bo-login-feature-icon" style={{ background: "rgba(99,102,241,0.15)" }}>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18, color: "#818cf8" }}>
                <path d="M9 6a3 3 0 1 1 6 0A3 3 0 0 1 9 6Zm-7 9a7 7 0 1 1 14 0H2Z" />
              </svg>
            </div>
            <div>
              <span className="bo-login-feature-title">Gestion des utilisateurs</span>
              <span className="bo-login-feature-text">Consultez, filtrez et modifiez les comptes</span>
            </div>
          </div>
          <div className="bo-login-feature">
            <div className="bo-login-feature-icon" style={{ background: "rgba(6,182,212,0.15)" }}>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18, color: "#06b6d4" }}>
                <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm6.5 0v.325a41.622 41.622 0 0 0-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25ZM10 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                <path d="M2 13.443c0 1.104.73 2.044 1.79 2.412A11.955 11.955 0 0 0 10 17c2.375 0 4.58-.633 6.21-1.145C17.27 15.487 18 14.547 18 13.443v-.38a11.93 11.93 0 0 1-1.97.609A13.437 13.437 0 0 1 10 14a13.437 13.437 0 0 1-6.03-.93A11.93 11.93 0 0 1 2 12.461v.982Z" />
              </svg>
            </div>
            <div>
              <span className="bo-login-feature-title">Gestion des entreprises</span>
              <span className="bo-login-feature-text">Suivi des comptes entreprises et API keys</span>
            </div>
          </div>
          <div className="bo-login-feature">
            <div className="bo-login-feature-icon" style={{ background: "rgba(16,185,129,0.15)" }}>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18, color: "#10b981" }}>
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="bo-login-feature-title">Sécurité & Sessions</span>
              <span className="bo-login-feature-text">Déconnexion à distance et supervision</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bo-login-panel">
        <div className="bo-login-form">
          <h2 className="bo-login-form-title">Connexion Admin</h2>
          <p className="bo-login-form-sub">Entrez vos identifiants d'administrateur.</p>

          {error && <div className="bo-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="bo-field">
              <label htmlFor="admin-email">Adresse email</label>
              <input
                id="admin-email"
                type="email"
                className="bo-input"
                placeholder="admin@otphora.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="bo-field">
              <label htmlFor="admin-password">Mot de passe</label>
              <input
                id="admin-password"
                type="password"
                className="bo-input"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="bo-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                  </svg>
                  Connexion…
                </>
              ) : (
                <>
                  <svg style={{ width: 16, height: 16 }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.06a.75.75 0 1 0-1.065-1.054l-2.35 2.38a.75.75 0 0 0 0 1.064l2.35 2.38a.75.75 0 1 0 1.065-1.054l-1.048-1.06H18.25A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                  </svg>
                  Accéder au Back-Office
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

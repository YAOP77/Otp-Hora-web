"use client";

import { Button } from "@/components/ui/button";
import { healthcheck } from "@/lib/api/health";
import { isApiConfigured } from "@/lib/config/env";
import Link from "next/link";
import { useState } from "react";

export function SettingsApiHealth() {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ping() {
    setError(null);
    setText(null);
    if (!isApiConfigured()) {
      setError("NEXT_PUBLIC_API_BASE_URL manquant.");
      return;
    }
    setLoading(true);
    try {
      const t = await healthcheck();
      setText(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider [color:var(--dash-muted)]">
        API & diagnostics
      </h2>
      <p className="mt-2 text-sm [color:var(--dash-muted)]">
        GET /api/health (réponse texte) et accès aux outils avancés.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" loading={loading} onClick={ping}>
          Tester l’API (health)
        </Button>
        <Button type="button" variant="secondary" asChild>
          <Link href="/settings/api-console">Console API (39 endpoints)</Link>
        </Button>
        <Button type="button" variant="secondary" asChild>
          <Link href="/verify-email">Vérifier email utilisateur</Link>
        </Button>
      </div>
      {text ? (
        <p className="mt-3 rounded-lg bg-background px-3 py-2 font-mono text-sm text-foreground">{text}</p>
      ) : null}
      {error ? (
        <p className="mt-2 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}

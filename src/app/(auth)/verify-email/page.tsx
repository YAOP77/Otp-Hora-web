"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyEnterpriseEmail } from "@/lib/api/enterprises";
import { verifyUserEmail } from "@/lib/api/users";
import { isApiConfigured } from "@/lib/config/env";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyEnterpriseBlock() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setOk(null);
    if (!isApiConfigured()) {
      setError(new Error("NEXT_PUBLIC_API_BASE_URL manquant."));
      return;
    }
    setLoading(true);
    try {
      const r = await verifyEnterpriseEmail(token.trim());
      setOk(JSON.stringify(r, null, 2));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 rounded-xl border border-border bg-background/50 p-5">
      <h2 className="text-base font-bold text-foreground">Vérification entreprise</h2>
      <div className="mt-4 space-y-4">
        <ErrorBanner error={error} />
        {ok ? (
          <pre className="max-h-48 overflow-auto rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
            {ok}
          </pre>
        ) : null}
        <div>
          <Label htmlFor="verify-token-ent">Token</Label>
          <Input
            id="verify-token-ent"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <Button
          type="button"
          className="w-full"
          loading={loading}
          onClick={onSubmit}
        >
          Vérifier (entreprise)
        </Button>
      </div>
    </div>
  );
}

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const [token, setToken] = useState(tokenFromUrl);
  const [error, setError] = useState<unknown>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setOk(null);
    if (!isApiConfigured()) {
      setError(new Error("NEXT_PUBLIC_API_BASE_URL manquant."));
      return;
    }
    if (token.trim().length < 20) {
      setError(new Error("Token invalide (min. 20 caractères selon la doc)."));
      return;
    }
    setLoading(true);
    try {
      const r = await verifyUserEmail(token.trim());
      setOk(JSON.stringify(r, null, 2));
      router.refresh();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <ErrorBanner error={error} />
      {ok ? (
        <pre className="max-h-48 overflow-auto rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
          {ok}
        </pre>
      ) : null}
      <div>
        <Label htmlFor="verify-token">Token reçu par email</Label>
        <Input
          id="verify-token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>
      <Button
        type="button"
        className="w-full"
        loading={loading}
        onClick={onSubmit}
      >
        Vérifier
      </Button>
      <p className="text-center text-sm text-secondary">
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Connexion utilisateur
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Vérification email
      </h1>
      <p className="mt-1 text-[11px] text-secondary">
        Collez le token reçu par email pour valider votre adresse.
      </p>
      <div className="mt-3">
        <Suspense
          fallback={
            <p className="text-center text-sm text-secondary">Chargement…</p>
          }
        >
          <VerifyEmailInner />
        </Suspense>
        <VerifyEnterpriseBlock />
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "otp-hora-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 left-5 z-[100] max-w-sm animate-[cookie-slide_0.5s_ease-out_both_0.8s] rounded-2xl border border-border/60 bg-background p-5 opacity-0 shadow-2xl"
      role="dialog"
      aria-label="Consentement aux cookies"
    >
      <p className="text-sm font-semibold text-foreground">
        Confidentialité &amp; cookies
      </p>
      <p className="mt-2 text-xs leading-relaxed text-secondary">
        Nous utilisons des cookies essentiels pour le fonctionnement du site et
        des cookies analytiques pour améliorer votre expérience.{" "}
        <Link
          href="/legal/privacy"
          className="text-primary underline-offset-4 hover:underline"
        >
          En savoir plus
        </Link>
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={accept}
          className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-px hover:bg-primary/90"
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={decline}
          className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-xs font-medium text-secondary transition-all duration-300 hover:-translate-y-px hover:text-foreground"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}

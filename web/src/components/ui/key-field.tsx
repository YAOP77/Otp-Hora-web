"use client";

import { useToast } from "@/components/ui/toast";
import type { ReactNode, SVGProps } from "react";
import { useState } from "react";

function IconEye(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconEyeOff(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
function IconCopy(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}>
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16V6a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

type KeyFieldProps = {
  label: string;
  value: string | null | undefined;
  /** Message du toast de confirmation (ex: "user-key copiée."). */
  copyMessage: string;
  /** Affichage quand `value` est null (ex: bouton Régénérer). */
  fallback?: ReactNode;
};

export function KeyField({ label, value, copyMessage, fallback }: KeyFieldProps) {
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);

  if (!value) {
    return fallback ? <>{fallback}</> : null;
  }

  /** Masquage : on garde les 2 derniers caractères visibles pour reconnaître la clé. */
  const masked = value.length > 4
    ? `${"•".repeat(Math.max(4, value.length - 2))}${value.slice(-2)}`
    : "••••";

  function copy() {
    if (!value) return;
    void navigator.clipboard
      .writeText(value)
      .then(() => toast(copyMessage))
      .catch(() => toast("Copie impossible.", "error"));
  }

  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-secondary">
        {label}
      </span>
      <code className="truncate font-mono text-xs tracking-wide text-foreground">
        {visible ? value : masked}
      </code>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer" : "Afficher"}
          title={visible ? "Masquer" : "Afficher"}
          className="inline-flex size-6 items-center justify-center rounded-md text-secondary transition-colors hover:bg-neutral-100 hover:text-foreground dark:hover:bg-zinc-800"
        >
          {visible ? <IconEyeOff className="size-3.5" /> : <IconEye className="size-3.5" />}
        </button>
        <button
          type="button"
          onClick={copy}
          aria-label="Copier"
          title="Copier"
          className="inline-flex size-6 items-center justify-center rounded-md text-secondary transition-colors hover:bg-neutral-100 hover:text-foreground dark:hover:bg-zinc-800"
        >
          <IconCopy className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

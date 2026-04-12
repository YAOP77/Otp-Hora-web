"use client";

import { IconChevronRight } from "@/components/features/dashboard/icons";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  deleteEnterpriseMe,
  logoutEnterprise,
  setEnterpriseRecoveryEmail,
  updateEnterpriseMe,
} from "@/lib/api/enterprises";
import {
  clearEnterpriseSession,
  getEnterpriseAccessToken,
} from "@/lib/auth/enterprise-session";
import { useEnterpriseQuery } from "@/hooks/use-enterprise-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ReactNode, SVGProps } from "react";
import { useEffect, useState } from "react";

const FAQ_ITEMS = [
  { q: "Qu'est-ce qu'OTP Hora ?", a: "OTP Hora est une plateforme d'authentification et de gestion de compte : vous validez les actions importantes et gérez vos contacts, appareils et liens avec des entreprises partenaires." },
  { q: "Le web utilise-t-il le même backend que l'application mobile ?", a: "Oui. Les endpoints et les règles métier sont alignés sur le client Flutter pour éviter les écarts fonctionnels." },
  { q: "Comment me connecter ?", a: "Utilisez votre numéro de téléphone et votre code PIN, comme sur l'application, depuis la page Connexion." },
  { q: "Où trouver les mentions légales ?", a: "Les conditions d'utilisation et la politique de confidentialité sont disponibles en pied de page." },
] as const;

const NOTIFICATION_KEY = "otp_hora_ent_notifications";

/* ─── Shared row components (user settings style) ────────── */

function PairCard({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm last:mb-0 dark:border-zinc-700 dark:bg-zinc-900/40">
      <div className="divide-y divide-neutral-100 dark:divide-zinc-700/80">{children}</div>
    </div>
  );
}

function LinkRow({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a
      href={href}
      className="group flex items-start justify-between gap-3 px-3 py-2 transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-zinc-800/50"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-secondary">{description}</p>
      </div>
      <IconChevronRight className="mt-0.5 size-5 shrink-0 text-foreground opacity-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-90" />
    </a>
  );
}

function ClickRow({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start justify-between gap-3 px-3 py-2 text-left transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-zinc-800/50"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-secondary">{description}</p>
      </div>
      <IconChevronRight className="mt-0.5 size-5 shrink-0 text-foreground opacity-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-90" />
    </button>
  );
}

function ToggleRow({
  title,
  description,
  on,
  hydrated,
  onToggle,
}: {
  title: string;
  description: string;
  on: boolean;
  hydrated: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-secondary">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={!hydrated}
        onClick={onToggle}
        className={`relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3A6E] disabled:opacity-50 ${
          on ? "bg-[#0B3A6E]" : "bg-neutral-300 dark:bg-zinc-600"
        }`}
      >
        <span className={`pointer-events-none absolute left-1 top-1 size-6 rounded-full bg-white shadow transition-transform duration-300 ${on ? "translate-x-6" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function DangerRow({ title, description, onAction }: { title: string; description: string; onAction: () => void }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-secondary">{description}</p>
      </div>
      <Button
        type="button"
        variant="secondary"
        className="min-h-9 shrink-0 border-red-300/70 px-3 py-1.5 text-sm text-[var(--error)] hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-950/20"
        onClick={onAction}
      >
        Supprimer
      </Button>
    </div>
  );
}

function LogoutRow({ title, description, loading, onLogout }: { title: string; description: string; loading: boolean; onLogout: () => void }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-secondary">{description}</p>
      </div>
      <Button variant="secondary" className="min-h-9 shrink-0 px-3 py-1.5 text-sm" loading={loading} onClick={onLogout}>
        Se déconnecter
      </Button>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────── */
function IconX(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><path d="m18 6-12 12M6 6l12 12" /></svg>);
}
function IconSave(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>);
}

/* ─── Main view ──────────────────────────────────────────── */

export function EnterpriseSettingsPageView() {
  const { data: enterprise, isLoading } = useEnterpriseQuery();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const [error, setError] = useState<unknown>(null);
  const [notifications, setNotifications] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(NOTIFICATION_KEY);
      if (v !== null) setNotifications(v === "1");
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  const persistNotif = (on: boolean) => {
    setNotifications(on);
    try { localStorage.setItem(NOTIFICATION_KEY, on ? "1" : "0"); } catch { /* ignore */ }
  };

  /* Logout */
  const logoutMutation = useMutation({
    mutationFn: () => logoutEnterprise(getEnterpriseAccessToken),
    onSettled: () => {
      clearEnterpriseSession();
      router.replace("/portail-entreprise/login");
      router.refresh();
    },
  });

  const [faqOpen, setFaqOpen] = useState(false);

  /* Delete account via popup */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePin, setDeletePin] = useState("");
  const [deleteError, setDeleteError] = useState<unknown>(null);

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!/^\d{4,6}$/.test(deletePin))
        throw new Error("Saisissez le PIN (4 à 6 chiffres) pour confirmer.");
      return deleteEnterpriseMe(deletePin, getEnterpriseAccessToken);
    },
    onSuccess: () => {
      clearEnterpriseSession();
      toast("Compte supprimé.");
      router.replace("/portail-entreprise/login");
      router.refresh();
    },
    onError: (err) => setDeleteError(err),
  });

  const notifDesc = hydrated
    ? notifications
      ? "Vous recevrez les alertes importantes dans le navigateur."
      : "Les notifications navigateur sont désactivées."
    : "Préférence enregistrée sur cet appareil.";

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Paramètres"
        description="Préférences, sécurité et session de votre entreprise."
      />

      <ErrorBanner error={error} />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-secondary">
          Général
        </h2>
        <PairCard>
          <LinkRow
            href="/portail-entreprise/account"
            title="Compte entreprise"
            description="Modifiez les informations de l'entreprise, le téléphone ou le code PIN."
          />
          <LinkRow
            href="/portail-entreprise/account"
            title="Email de récupération"
            description="Configurez ou consultez votre email de récupération de compte."
          />
        </PairCard>

        <PairCard>
          <LinkRow
            href="/portail-entreprise/users"
            title="Utilisateurs liés"
            description="Consultez les utilisateurs associés à votre entreprise."
          />
          <LinkRow
            href="/portail-entreprise/history"
            title="Historique d'accès"
            description="Dernières connexions et appareils enregistrés."
          />
        </PairCard>

        <PairCard>
          <ToggleRow
            title="Notifications"
            description={notifDesc}
            on={notifications}
            hydrated={hydrated}
            onToggle={() => persistNotif(!notifications)}
          />
          <ClickRow
            title="FAQ"
            description="Réponses aux questions courantes sur OTP Hora."
            onClick={() => setFaqOpen(true)}
          />
        </PairCard>

        <PairCard>
          <DangerRow
            title="Supprimer le compte entreprise"
            description="Action définitive et irréversible."
            onAction={() => {
              setDeletePin("");
              setDeleteError(null);
              setDeleteOpen(true);
            }}
          />
          <LogoutRow
            title="Se déconnecter"
            description="Terminez votre session sur cet appareil."
            loading={logoutMutation.isPending}
            onLogout={() => logoutMutation.mutate()}
          />
        </PairCard>
      </section>
      )}

      {/* Delete account popup */}
      <Modal
        open={deleteOpen}
        onClose={() => !deleteMutation.isPending && setDeleteOpen(false)}
        title="Supprimer le compte entreprise"
        footer={
          <>
            <Button variant="secondary" className="h-9 gap-1.5 text-xs" onClick={() => setDeleteOpen(false)} disabled={deleteMutation.isPending}>
              <IconX className="size-3.5" />
              Annuler
            </Button>
            <Button
              className="h-9 gap-1.5 bg-[var(--error)] text-xs hover:bg-[var(--error)]/90"
              onClick={() => deleteMutation.mutate()}
              loading={deleteMutation.isPending}
            >
              <IconSave className="size-3.5" />
              Supprimer définitivement
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {deleteError ? <ErrorBanner error={deleteError} /> : null}
          <p className="text-sm text-secondary">
            Cette action est <strong className="text-foreground">irréversible</strong>. Saisissez votre code PIN pour confirmer.
          </p>
          <div>
            <Label htmlFor="delete-pin" className="text-[11px]">Code PIN de confirmation</Label>
            <Input
              id="delete-pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={deletePin}
              onChange={(e) => setDeletePin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="h-9 text-xs"
              placeholder="4 à 6 chiffres"
            />
          </div>
        </div>
      </Modal>

      {/* FAQ popup */}
      <Modal
        open={faqOpen}
        onClose={() => setFaqOpen(false)}
        title="Questions fréquentes"
        footer={
          <Button variant="secondary" className="h-9 gap-1.5 text-xs" onClick={() => setFaqOpen(false)}>
            <IconX className="size-3.5" />
            Fermer
          </Button>
        }
      >
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group rounded-lg border border-border">
              <summary className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-foreground">
                {item.q}
                <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-secondary transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="border-t border-border/60 px-3 py-2.5 text-xs leading-relaxed text-secondary">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Modal>
    </div>
  );
}

"use client";

import { IconChevronRight } from "@/components/features/dashboard/icons";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { deleteUserAccount, logout } from "@/lib/api/users";
import { clearSession, getAccessToken, getUserId } from "@/lib/auth/session";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode, SVGProps } from "react";
import { useEffect, useId, useState } from "react";

const NOTIFICATION_KEY = "otp_hora_notifications";

const FAQ_ITEMS = [
  { q: "Qu'est-ce qu'OTP Hora ?", a: "OTP Hora est une plateforme d'authentification et de gestion de compte : vous validez les actions importantes et gérez vos contacts, appareils et liens avec des entreprises partenaires." },
  { q: "Le web utilise-t-il le même backend que l'application mobile ?", a: "Oui. Les endpoints et les règles métier sont alignés sur le client Flutter pour éviter les écarts fonctionnels." },
  { q: "Comment me connecter ?", a: "Utilisez votre numéro de téléphone et votre code PIN, comme sur l'application, depuis la page Connexion." },
  { q: "Où trouver les mentions légales ?", a: "Les conditions d'utilisation et la politique de confidentialité sont disponibles en pied de page." },
] as const;

function PairCard({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm last:mb-0 dark:border-zinc-700/80 dark:bg-zinc-900/40">
      <div className="divide-y divide-neutral-100 dark:divide-zinc-700/80">{children}</div>
    </div>
  );
}

function SettingsLinkRow({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-3 px-3 py-2 transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-zinc-800/50"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-secondary">{description}</p>
      </div>
      <IconChevronRight className="mt-0.5 size-5 shrink-0 text-foreground opacity-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-90" />
    </Link>
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

function ToggleRow({ title, description, on, hydrated, onToggle }: { title: string; description: string; on: boolean; hydrated: boolean; onToggle: () => void }) {
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
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3A6E] disabled:opacity-50 ${
          on ? "bg-[#0B3A6E]" : "bg-neutral-300 dark:bg-zinc-600"
        }`}
      >
        <span className={`pointer-events-none absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow transition-transform duration-300 ${on ? "translate-x-5" : "translate-x-0"}`} />
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
        className="min-h-8 shrink-0 border-red-300/70 px-3 py-1 text-xs text-[var(--error)] hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-950/20"
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
      <Button variant="secondary" className="min-h-8 shrink-0 px-3 py-1 text-xs" loading={loading} onClick={onLogout}>
        Se déconnecter
      </Button>
    </div>
  );
}

function IconX(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><path d="m18 6-12 12M6 6l12 12" /></svg>);
}

export function SettingsMorePanel() {
  const router = useRouter();
  const sectionTitleId = useId();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<unknown>(null);
  const [faqOpen, setFaqOpen] = useState(false);

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

  const signOut = useMutation({
    mutationFn: () => logout(getAccessToken),
    onSettled: () => {
      clearSession();
      router.replace("/login");
      router.refresh();
    },
  });

  const deleteAccount = useMutation({
    mutationFn: () => {
      const id = getUserId();
      if (!id) throw new Error("Non connecté");
      return deleteUserAccount(id, getAccessToken);
    },
    onSuccess: () => {
      clearSession();
      toast("Compte supprimé.");
      router.replace("/login");
      router.refresh();
    },
    onError: (err) => setDeleteError(err),
  });

  const notifDescription = hydrated
    ? notifications
      ? "Vous recevrez les alertes importantes dans le navigateur."
      : "Les notifications navigateur sont désactivées."
    : "Préférence enregistrée sur cet appareil.";

  return (
    <>
      <section aria-labelledby={sectionTitleId}>
        <h2 id={sectionTitleId} className="mb-3 text-xs font-semibold uppercase tracking-wider text-secondary">
          Général
        </h2>

        <div className="space-y-0">
          <PairCard>
            <SettingsLinkRow href="/account" title="Modifier mon profil" description="Mettez à jour votre nom, prénom ou code PIN." />
            <SettingsLinkRow href="/account" title="Sécurité" description="Code PIN et session sur cet appareil." />
          </PairCard>

          <PairCard>
            <SettingsLinkRow href="/devices" title="Historique de connexion" description="Consultez vos dernières connexions." />
            <SettingsLinkRow href="/legal/terms" title="Conditions d'utilisation" description="Texte juridique applicable." />
          </PairCard>

          <PairCard>
            <ToggleRow title="Notifications" description={notifDescription} on={notifications} hydrated={hydrated} onToggle={() => persistNotif(!notifications)} />
            <ClickRow title="FAQ" description="Réponses aux questions courantes sur OTP Hora." onClick={() => setFaqOpen(true)} />
          </PairCard>

          <PairCard>
            <DangerRow
              title="Supprimer mon compte"
              description="Action définitive et irréversible."
              onAction={() => {
                setDeleteError(null);
                setDeleteOpen(true);
              }}
            />
            <LogoutRow
              title="Se déconnecter"
              description="Terminez votre session sur cet appareil."
              loading={signOut.isPending}
              onLogout={() => signOut.mutate()}
            />
          </PairCard>
        </div>
      </section>

      {/* Delete account popup */}
      <Modal
        open={deleteOpen}
        onClose={() => !deleteAccount.isPending && setDeleteOpen(false)}
        title="Supprimer définitivement le compte ?"
        footer={
          <>
            <Button variant="secondary" className="h-9 gap-1.5 text-xs" onClick={() => setDeleteOpen(false)} disabled={deleteAccount.isPending}>
              <IconX className="size-3.5" />
              Annuler
            </Button>
            <Button
              className="h-9 gap-1.5 bg-[var(--error)] text-xs hover:bg-[var(--error)]/90"
              loading={deleteAccount.isPending}
              onClick={() => deleteAccount.mutate()}
            >
              Supprimer mon compte
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {deleteError ? <ErrorBanner error={deleteError} /> : null}
          <p className="text-sm text-secondary">
            Cette action est <strong className="text-foreground">irréversible</strong>. Vous serez déconnecté après confirmation.
          </p>
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
              <p className="border-t border-border/60 px-3 py-2.5 text-xs leading-relaxed text-secondary">{item.a}</p>
            </details>
          ))}
        </div>
      </Modal>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useUserQuery } from "@/hooks/use-user-query";
import { createContact } from "@/lib/api/contacts";
import { setUserRecoveryEmail, updateUserProfile } from "@/lib/api/users";
import { getAccessToken } from "@/lib/auth/session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import type { SVGProps } from "react";
import { useCallback, useEffect, useState } from "react";

function IconUser(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
}
function IconCheck(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>);
}
function IconPhone(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></svg>);
}
function IconMail(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
}
function IconPen(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>);
}
function IconPlus(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><path d="M5 12h14M12 5v14" /></svg>);
}
function IconX(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><path d="m18 6-12 12M6 6l12 12" /></svg>);
}
function IconSave(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>);
}
function IconInfo(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>);
}

const HAPPY_IMG = "/assets/image%20accueil/Happy%20Bunch%20-%20Chat.png";

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { data, isLoading, isError, error } = useUserQuery();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = data?.user_id ?? data?.userId ?? data?.id ?? "";

  const fullName = data ? [data.prenom, data.nom].filter(Boolean).join(" ") || data.name || "—" : "—";
  const status = data?.status ?? "—";
  const phone = data?.phone ?? data?.contacts?.[0]?.phone_number ?? "—";
  const email = (data as Record<string, unknown> | undefined)?.email as string | undefined ?? "Non configuré";
  const recoveryEmail = (data as Record<string, unknown> | undefined)?.recovery_email as string | undefined ?? "";
  const hasRecoveryEmail = recoveryEmail.length > 0;

  /* ── Edit modal ──────────────────── */
  const [editOpen, setEditOpen] = useState(false);
  const [editNom, setEditNom] = useState("");
  const [editPrenom, setEditPrenom] = useState("");
  const [editPin, setEditPin] = useState("");
  const [editError, setEditError] = useState<unknown>(null);

  const openEdit = useCallback(() => {
    setEditNom(data?.nom ?? "");
    setEditPrenom(data?.prenom ?? "");
    setEditPin("");
    setEditError(null);
    setEditOpen(true);
  }, [data]);

  const editMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string> = {};
      if (editNom.trim() !== (data?.nom ?? "").trim()) payload.nom = editNom.trim();
      if (editPrenom.trim() !== (data?.prenom ?? "").trim()) payload.prenom = editPrenom.trim();
      if (editPin.trim()) payload.pin = editPin.trim();
      if (Object.keys(payload).length === 0) throw new Error("Aucune modification.");
      return updateUserProfile(userId, payload, getAccessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setEditOpen(false);
      toast("Profil mis à jour avec succès.");
    },
    onError: (err) => setEditError(err),
  });

  /* ── Recovery email modal ────────── */
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState("");
  const [recoveryError, setRecoveryError] = useState<unknown>(null);

  const recoveryMutation = useMutation({
    mutationFn: () => setUserRecoveryEmail(recoveryInput.trim(), getAccessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setRecoveryOpen(false);
      toast("Email de récupération enregistré.");
    },
    onError: (err) => setRecoveryError(err),
  });

  /* ── Add contact modal ───────────── */
  const [contactOpen, setContactOpen] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const [contactError, setContactError] = useState<unknown>(null);

  const contactMutation = useMutation({
    mutationFn: () => createContact({ user_id: userId, phone_number: contactPhone.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setContactOpen(false);
      toast("Contact ajouté.");
    },
    onError: (err) => setContactError(err),
  });

  const infoRows = [
    { icon: IconUser, label: "Nom complet", value: fullName },
    { icon: IconCheck, label: "Statut", value: status },
    { icon: IconPhone, label: "Téléphone", value: phone },
    { icon: IconMail, label: "Email", value: email },
  ];

  return (
    <div className="flex w-full gap-6">
      <div className="min-w-0 flex-1">
        <PageHeader title="Compte" description="Consultez et modifiez les informations de votre profil." />

        {!mounted || isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="mt-6 h-64 w-full max-w-2xl" />
          </div>
        ) : isError ? (
          <ErrorBanner error={error} />
        ) : (
          <div className="flex flex-col gap-6">
            {!hasRecoveryEmail ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-400/50 bg-amber-500/90 px-4 py-2.5 text-sm font-medium text-white">
                <IconInfo className="size-4 shrink-0" />
                Veuillez enregistrer un email de récupération pour sécuriser votre compte.
              </div>
            ) : null}

            <section className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900 sm:p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-bold text-foreground">Informations du profil</h2>
                {userId ? (
                  <button type="button" onClick={openEdit} className="inline-flex items-center gap-1.5 rounded-lg border border-[#0B3A6E]/30 bg-[#0B3A6E]/5 px-3 py-1.5 text-xs font-semibold text-[#0B3A6E] transition-all duration-300 hover:bg-[#0B3A6E] hover:text-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/15">
                    <IconPen className="size-3.5" />
                    Modifier le profil
                  </button>
                ) : null}
              </div>
              <ul className="mt-5 space-y-4">
                {infoRows.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-[#0B3A6E] dark:text-[#7dafe6]" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{label}</p>
                      <p className="text-sm text-foreground">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900 sm:p-6">
              {hasRecoveryEmail ? (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-800 dark:bg-green-950/40 dark:text-green-300">
                  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
                  L&apos;email de récupération est enregistré.
                </div>
              ) : null}
              <h2 className="text-base font-bold text-foreground">Email de récupération</h2>
              <p className="mt-1 text-xs text-secondary">
                {hasRecoveryEmail ? "Cet email est utilisé pour récupérer l'accès à votre compte." : "Ajoutez un email de récupération pour sécuriser votre compte."}
              </p>
              {hasRecoveryEmail ? (
                <div className="mt-4"><Input value={recoveryEmail} disabled className="h-9 max-w-sm bg-neutral-100 text-xs dark:bg-zinc-800" /></div>
              ) : (
                <button type="button" onClick={() => { setRecoveryInput(""); setRecoveryError(null); setRecoveryOpen(true); }} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0B3A6E] px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-px hover:bg-[#0B3A6E]/90">
                  <IconPlus className="size-3.5" />
                  Ajouter un email
                </button>
              )}
            </section>

            {userId ? (
              <section className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900 sm:p-6">
                <h2 className="text-base font-bold text-foreground">Ajouter un contact</h2>
                <p className="mt-1 text-xs text-secondary">Ajoutez un numéro de téléphone au format international.</p>
                <button type="button" onClick={() => { setContactPhone(""); setContactError(null); setContactOpen(true); }} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0B3A6E] px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-px hover:bg-[#0B3A6E]/90">
                  <IconPlus className="size-3.5" />
                  Ajouter un contact
                </button>
              </section>
            ) : null}
          </div>
        )}
      </div>

      <div className="hidden shrink-0 items-start pt-20 xl:flex">
        <Image src={HAPPY_IMG} alt="" width={280} height={280} className="h-auto w-[240px]" aria-hidden />
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Modifier le profil" footer={<><Button variant="secondary" className="h-9 gap-1.5 text-xs" onClick={() => setEditOpen(false)}><IconX className="size-3.5" />Annuler</Button><Button className="h-9 gap-1.5 bg-[#0B3A6E] text-xs hover:bg-[#0B3A6E]/90" onClick={() => editMutation.mutate()} loading={editMutation.isPending}><IconSave className="size-3.5" />Enregistrer</Button></>}>
        <div className="space-y-3">
          {editError ? <ErrorBanner error={editError} /> : null}
          <div><Label htmlFor="edit-prenom" className="text-[11px]">Prénom</Label><Input id="edit-prenom" value={editPrenom} onChange={(e) => setEditPrenom(e.target.value)} className="h-9 text-xs" /></div>
          <div><Label htmlFor="edit-nom" className="text-[11px]">Nom</Label><Input id="edit-nom" value={editNom} onChange={(e) => setEditNom(e.target.value)} className="h-9 text-xs" /></div>
          <div><Label htmlFor="edit-pin" className="text-[11px]">Code PIN (optionnel)</Label><Input id="edit-pin" type="password" inputMode="numeric" maxLength={6} value={editPin} onChange={(e) => setEditPin(e.target.value)} className="h-9 text-xs" placeholder="Laisser vide pour ne pas changer" /></div>
        </div>
      </Modal>

      <Modal open={recoveryOpen} onClose={() => setRecoveryOpen(false)} title="Email de récupération" footer={<><Button variant="secondary" className="h-9 gap-1.5 text-xs" onClick={() => setRecoveryOpen(false)}><IconX className="size-3.5" />Annuler</Button><Button className="h-9 gap-1.5 bg-[#0B3A6E] text-xs hover:bg-[#0B3A6E]/90" onClick={() => recoveryMutation.mutate()} loading={recoveryMutation.isPending}><IconSave className="size-3.5" />Enregistrer</Button></>}>
        <div className="space-y-3">
          {recoveryError ? <ErrorBanner error={recoveryError} /> : null}
          <div><Label htmlFor="recovery-email" className="text-[11px]">Adresse email</Label><Input id="recovery-email" type="email" value={recoveryInput} onChange={(e) => setRecoveryInput(e.target.value)} className="h-9 text-xs" placeholder="vous@exemple.com" /></div>
        </div>
      </Modal>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Ajouter un contact" footer={<><Button variant="secondary" className="h-9 gap-1.5 text-xs" onClick={() => setContactOpen(false)}><IconX className="size-3.5" />Annuler</Button><Button className="h-9 gap-1.5 bg-[#0B3A6E] text-xs hover:bg-[#0B3A6E]/90" onClick={() => contactMutation.mutate()} loading={contactMutation.isPending} disabled={!contactPhone.trim() || contactPhone.trim().length < 5}><IconSave className="size-3.5" />Ajouter</Button></>}>
        <div className="space-y-3">
          {contactError ? <ErrorBanner error={contactError} /> : null}
          <div><Label htmlFor="contact-phone" className="text-[11px]">Téléphone (E.164)</Label><Input id="contact-phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="h-9 text-xs" placeholder="+225 …" /></div>
        </div>
      </Modal>
    </div>
  );
}

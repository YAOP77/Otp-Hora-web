"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useEnterpriseQuery } from "@/hooks/use-enterprise-query";
import { setEnterpriseRecoveryEmail, updateEnterpriseMe } from "@/lib/api/enterprises";
import { getEnterpriseAccessToken } from "@/lib/auth/enterprise-session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import type { SVGProps } from "react";
import { useCallback, useMemo, useState } from "react";

/* ─── Inline icons ───────────────────────────────────────── */
function IconBuilding(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M10 6h4M10 10h4M10 14h4M10 18h4" /></svg>);
}
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

export function EnterpriseAccountPageView() {
  const { t } = useI18n();
  const { data: enterprise, isLoading, isError, error } = useEnterpriseQuery();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const enterpriseData = useMemo(() => (enterprise ?? {}) as Record<string, unknown>, [enterprise]);

  const companyName = typeof enterpriseData.nom_entreprise === "string" ? enterpriseData.nom_entreprise : "Entreprise";
  const companyUsername =
    typeof enterpriseData.username === "string" && enterpriseData.username.trim()
      ? `@${enterpriseData.username.trim()}`
      : "—";
  const companyPhone = typeof enterpriseData.phone_e164 === "string" ? enterpriseData.phone_e164 : "Non configuré";
  const companyStatus = typeof enterpriseData.status === "string" ? enterpriseData.status : "—";
  const companyEmail = typeof enterpriseData.email === "string" ? enterpriseData.email : "Non configuré";
  const recoveryEmail =
    typeof enterpriseData.recovery_email === "string" ? enterpriseData.recovery_email : "";
  const hasRecoveryEmail = recoveryEmail.length > 0;

  /* ─── Edit modal state ────────────────────────── */
  const [editOpen, setEditOpen] = useState(false);
  const [editNom, setEditNom] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPin, setEditPin] = useState("");
  const [editError, setEditError] = useState<unknown>(null);

  const openEdit = useCallback(() => {
    const ent = (enterprise ?? {}) as Record<string, unknown>;
    setEditNom(companyName === "Entreprise" ? "" : companyName);
    setEditUsername(typeof ent.username === "string" ? ent.username : "");
    setEditPhone(companyPhone === "Non configuré" ? "" : companyPhone);
    setEditPin("");
    setEditError(null);
    setEditOpen(true);
  }, [companyName, companyPhone, enterprise]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {};
      if (editNom.trim()) payload.nom_entreprise = editNom.trim();
      const curU = (typeof enterpriseData.username === "string" ? enterpriseData.username : "")
        .trim()
        .toLowerCase();
      if (editUsername.trim().toLowerCase() !== curU) payload.username = editUsername.trim();
      if (editPhone.trim()) payload.phone = editPhone.trim();
      if (editPin.trim()) {
        if (!/^\d{4,6}$/.test(editPin.trim()))
          throw new Error("Le code PIN doit contenir 4 à 6 chiffres.");
        payload.pin = editPin.trim();
      }
      if (Object.keys(payload).length === 0) throw new Error("Aucune modification.");
      return updateEnterpriseMe(payload, getEnterpriseAccessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enterprise", "me"] });
      setEditOpen(false);
      toast("Informations mises à jour avec succès.");
    },
    onError: (err) => setEditError(err),
  });

  /* ─── Recovery email modal state ──────────────── */
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState("");
  const [recoveryError, setRecoveryError] = useState<unknown>(null);

  const recoveryMutation = useMutation({
    mutationFn: (email: string) => setEnterpriseRecoveryEmail(email, getEnterpriseAccessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enterprise", "me"] });
      setRecoveryOpen(false);
      toast("Email de récupération enregistré.");
    },
    onError: (err) => setRecoveryError(err),
  });

  const infoRows = [
    { icon: IconBuilding, label: t("header.enterprise"), value: companyName },
    { icon: IconUser, label: t("account.username"), value: companyUsername },
    { icon: IconCheck, label: t("common.status"), value: companyStatus },
    { icon: IconPhone, label: t("common.phone"), value: companyPhone },
    { icon: IconMail, label: t("common.email"), value: companyEmail },
  ];

  return (
    <div className="flex w-full gap-6">
      <div className="min-w-0 flex-1">
        <PageHeader
          title={t("ent.account")}
          description={t("ent.accountDesc")}
        />

        {/* Bande email manquant */}
        {!isLoading && !isError && !hasRecoveryEmail ? (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-400/50 bg-amber-500/90 px-4 py-2.5 text-sm font-medium text-white">
            <IconInfo className="size-4 shrink-0" />
            {t("account.bandMissingEmail")}
          </div>
        ) : null}

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="mt-6 h-64 w-full max-w-2xl" />
          </div>
        ) : null}

        {!isLoading && (isError) ? <ErrorBanner error={error} /> : null}

        {!isLoading && !isError ? (
          <div className="flex flex-col gap-6">
            {/* ── Card informations entreprise ──────────────── */}
            <section className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900 sm:p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-bold text-foreground">
                  {t("account.info")}
                </h2>
                <button
                  type="button"
                  onClick={openEdit}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#0B3A6E]/30 bg-[#0B3A6E]/5 px-3 py-1.5 text-xs font-semibold text-[#0B3A6E] transition-all duration-300 hover:bg-[#0B3A6E] hover:text-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/15"
                >
                  <IconPen className="size-3.5" />
                  {t("account.editProfile")}
                </button>
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

            {/* ── Card email de récupération ────────────────── */}
            <section className="max-w-2xl rounded-lg border border-neutral-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900 sm:p-6">
              {hasRecoveryEmail ? (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-800 dark:bg-green-950/40 dark:text-green-300">
                  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t("account.recoveryConfigured")}
                </div>
              ) : null}

              <h2 className="text-base font-bold text-foreground">{t("account.recoveryEmail")}</h2>
              <p className="mt-1 text-xs text-secondary">
                {hasRecoveryEmail ? t("account.recoveryDesc") : t("account.recoveryMissing")}
              </p>

              {hasRecoveryEmail ? (
                <div className="mt-4">
                  <Input
                    value={recoveryEmail}
                    disabled
                    className="h-9 max-w-sm bg-neutral-100 text-xs dark:bg-zinc-800"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryInput("");
                    setRecoveryError(null);
                    setRecoveryOpen(true);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0B3A6E] px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-px hover:bg-[#0B3A6E]/90"
                >
                  <IconPlus className="size-3.5" />
                  {t("account.addEmail")}
                </button>
              )}
            </section>
          </div>
        ) : null}
      </div>

      {/* Illustration droite */}
      <div className="hidden shrink-0 items-start pt-20 xl:flex">
        <Image
          src={HAPPY_IMG}
          alt=""
          width={280}
          height={280}
          className="h-auto w-[240px]"
          aria-hidden
        />
      </div>

      {/* ── Modal : Modifier les informations ──────────────── */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Modifier les informations"
        footer={
          <>
            <Button
              variant="secondary"
              className="h-9 gap-1.5 text-xs"
              onClick={() => setEditOpen(false)}
            >
              <IconX className="size-3.5" />
              Annuler
            </Button>
            <Button
              className="h-9 gap-1.5 bg-[#0B3A6E] text-xs hover:bg-[#0B3A6E]/90"
              onClick={() => updateMutation.mutate()}
              loading={updateMutation.isPending}
            >
              <IconSave className="size-3.5" />
              Enregistrer
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {editError ? <ErrorBanner error={editError} /> : null}
          <div>
            <Label htmlFor="edit-nom" className="text-[11px]">Nom de l&apos;entreprise</Label>
            <Input id="edit-nom" value={editNom} onChange={(e) => setEditNom(e.target.value)} className="h-9 text-xs" placeholder={companyName} />
          </div>
          <div>
            <Label htmlFor="edit-ent-username" className="text-[11px]">{t("account.username")}</Label>
            <Input id="edit-ent-username" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="h-9 text-xs" autoComplete="username" placeholder="ex. acme_sas" />
          </div>
          <div>
            <Label htmlFor="edit-phone" className="text-[11px]">Téléphone</Label>
            <Input id="edit-phone" type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="h-9 text-xs" placeholder={companyPhone} />
          </div>
          <div>
            <Label htmlFor="edit-pin" className="text-[11px]">Code PIN</Label>
            <Input id="edit-pin" type="password" inputMode="numeric" maxLength={6} value={editPin} onChange={(e) => setEditPin(e.target.value.replace(/\D/g, "").slice(0, 6))} className="h-9 text-xs" placeholder="Nouveau PIN (4 à 6 chiffres)" />
          </div>
        </div>
      </Modal>

      {/* ── Modal : Email de récupération ──────────────────── */}
      <Modal
        open={recoveryOpen}
        onClose={() => setRecoveryOpen(false)}
        title="Email de récupération"
        footer={
          <>
            <Button variant="secondary" className="h-9 gap-1.5 text-xs" onClick={() => setRecoveryOpen(false)}>
              <IconX className="size-3.5" />
              Annuler
            </Button>
            <Button
              className="h-9 gap-1.5 bg-[#0B3A6E] text-xs hover:bg-[#0B3A6E]/90"
              onClick={() => recoveryMutation.mutate(recoveryInput)}
              loading={recoveryMutation.isPending}
            >
              <IconSave className="size-3.5" />
              Enregistrer
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {recoveryError ? <ErrorBanner error={recoveryError} /> : null}
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <IconInfo className="size-3.5 shrink-0" />
            L&apos;email de récupération ne pourra plus être modifié ni supprimé une fois enregistré.
          </div>
          <div>
            <Label htmlFor="recovery-email" className="text-[11px]">Adresse email</Label>
            <Input
              id="recovery-email"
              type="email"
              value={recoveryInput}
              onChange={(e) => setRecoveryInput(e.target.value)}
              className="h-9 text-xs"
              placeholder="email@entreprise.com"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

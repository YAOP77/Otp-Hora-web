"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { useTheme } from "@/components/providers/theme-provider";
import type { TranslationKey } from "@/lib/i18n/translations";
import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";

function IconSun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function IconMoon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  );
}
function IconArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

export type AuthVariant = "user" | "enterprise";

export function AuthShell({
  children,
  titleKey,
  subtitleKey,
  backHref = "/",
  variant = "user",
}: {
  children: React.ReactNode;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  backHref?: string;
  variant?: AuthVariant;
}) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { lang, toggleLang, t } = useI18n();
  const isDark = mounted && theme === "dark";

  const vectorClass =
    variant === "enterprise"
      ? "auth-vector-enterprise"
      : "auth-vector-user";

  return (
    <div className="flex min-h-screen">
      {/* ─── Panneau gauche : branding + vector animé ──────── */}
      <div
        className={`${vectorClass} relative hidden overflow-hidden bg-[#061C38] lg:flex lg:w-[44%] lg:flex-col lg:items-center lg:justify-center lg:p-12`}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="landing-orb-a absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-[#0a2e5c]/60 blur-[80px]" />
          <div className="landing-orb-b absolute -right-16 bottom-1/3 h-56 w-56 rounded-full bg-[#0d3668]/50 blur-[70px]" />
          <div className="landing-orb-c absolute bottom-10 left-1/3 h-48 w-48 rounded-full bg-[#0B3A6E]/40 blur-[65px]" />
        </div>

        <div className="relative z-10 flex max-w-md flex-col items-center text-center">
          <Image
            src="/assets/image%20app/Hora-Logo.png"
            alt="OTP Hora"
            width={194}
            height={154}
            priority
            className="h-16 w-auto"
          />
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
            {t(titleKey)}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            {t(subtitleKey)}
          </p>

          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <span
              className="auth-vector-shape absolute left-[10%] top-[12%] block size-12 rounded-md border-2 border-white/[0.06]"
              style={{ transform: "rotate(18deg)" }}
            />
            <span
              className="auth-vector-shape-alt absolute bottom-[18%] right-[12%] block size-9 rounded-md border-2 border-white/[0.05]"
              style={{ transform: "rotate(-14deg)" }}
            />
            <span
              className="auth-vector-shape absolute right-[24%] top-[24%] block size-7 rounded-full border-2 border-white/[0.04]"
              style={{ transform: "rotate(8deg)" }}
            />
          </div>
        </div>
      </div>

      {/* ─── Panneau droit : formulaire ────────────────────── */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Barre top : mobile logo + desktop toggles */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold text-foreground lg:hidden"
          >
            <Image
              src="/assets/image%20app/Hora-Logo.png"
              alt="OTP Hora"
              width={194}
              height={154}
              className="h-8 w-auto"
            />
            <span className="text-lg tracking-tight">OTP Hora</span>
          </Link>

          {/* Espace gauche desktop vide */}
          <span className="hidden lg:block" />

          {/* Toggles top-right */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? t("common.theme.light") : t("common.theme.dark")}
              title={isDark ? t("common.theme.light") : t("common.theme.dark")}
              className="inline-flex size-8 items-center justify-center rounded-full border border-border/60 text-secondary transition-all duration-300 hover:-translate-y-px hover:border-primary/50 hover:text-primary"
            >
              {isDark ? (
                <IconSun className="size-[15px]" />
              ) : (
                <IconMoon className="size-[15px]" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleLang}
              aria-label={t("header.changeLanguage")}
              title={lang === "fr" ? t("common.lang.fr") : t("common.lang.en")}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-border/60 px-2.5 text-[10px] font-bold uppercase tracking-wide text-secondary transition-all duration-300 hover:-translate-y-px hover:border-primary/50 hover:text-primary"
            >
              <IconGlobe className="size-[14px]" />
              {lang === "fr" ? "FR" : "EN"}
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            {/* Bouton retour */}
            <Link
              href={backHref}
              title={t("auth.back.home")}
              className="mb-6 inline-flex size-10 items-center justify-center rounded-full border border-border/70 text-secondary transition-all duration-300 hover:border-transparent hover:bg-[#061C38] hover:text-white"
            >
              <IconArrowLeft className="size-[18px]" />
            </Link>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Badge « Hora » rotatif pour texte contextuel ──────────── */
export function HoraBadge() {
  return (
    <span
      className="relative -top-px mx-0.5 inline-flex items-center rounded bg-[#061C38] px-1.5 py-[1px] text-[11px] font-bold text-white"
      style={{ transform: "rotate(-3deg)", display: "inline-block" }}
    >
      Hora
    </span>
  );
}

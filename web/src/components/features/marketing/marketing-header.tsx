"use client";

import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/components/providers/i18n-provider";
import { useTheme } from "@/components/providers/theme-provider";
import type { TranslationKey } from "@/lib/i18n/translations";
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

export const SUB_NAV_LINKS: ReadonlyArray<{
  href: string;
  labelKey: TranslationKey;
}> = [
  { href: "#features", labelKey: "subnav.features" },
  { href: "#start", labelKey: "subnav.start" },
  { href: "#download", labelKey: "subnav.download" },
  { href: "#about", labelKey: "subnav.about" },
  { href: "#contact", labelKey: "subnav.contact" },
  { href: "#faq", labelKey: "subnav.faq" },
];

export function MarketingHeader() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { lang, toggleLang, t } = useI18n();
  const isDark = mounted && theme === "dark";

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <Logo />

        <nav
          className="flex shrink-0 items-center gap-1 sm:gap-2"
          aria-label="Navigation principale"
        >
          <Link
            href="/login"
            className="nav-link-animated hidden rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:text-primary sm:inline-flex sm:items-center"
          >
            {t("header.user")}
          </Link>
          <span className="hidden text-secondary/40 sm:inline" aria-hidden>
            |
          </span>
          <Link
            href="/portail-entreprise/login"
            className="nav-link-animated hidden rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:text-primary sm:inline-flex sm:items-center"
          >
            {t("header.enterprise")}
          </Link>
          <span className="hidden text-secondary/40 sm:inline" aria-hidden>
            |
          </span>
          <Link
            href="/register"
            className="nav-link-animated hidden rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:text-primary sm:inline-flex sm:items-center"
          >
            {t("header.createAccount")}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? t("common.theme.light") : t("common.theme.dark")}
            title={isDark ? t("common.theme.light") : t("common.theme.dark")}
            className="ml-1 inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/40 text-secondary transition-all duration-300 hover:-translate-y-px hover:border-primary/50 hover:text-primary"
          >
            {isDark ? <IconSun className="size-[18px]" /> : <IconMoon className="size-[18px]" />}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            aria-label={t("header.changeLanguage")}
            title={lang === "fr" ? t("common.lang.fr") : t("common.lang.en")}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 text-xs font-bold uppercase tracking-wide text-secondary transition-all duration-300 hover:-translate-y-px hover:border-primary/50 hover:text-primary"
          >
            <IconGlobe className="size-[16px]" />
            {lang === "fr" ? "FR" : "EN"}
          </button>

          <Link
            href="/register"
            className="inline-flex min-h-10 items-center rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-px hover:bg-primary/90 sm:hidden"
          >
            {t("header.signup")}
          </Link>
        </nav>
      </div>
      </div>

      {/* Sous-header collé au header principal, flottant (absolute)
           → ne contribue pas à la hauteur du header, section 1 démarre
             au ras de la barre principale. Masqué sur mobile. */}
      <div className="pointer-events-none absolute left-0 right-0 top-full z-40 hidden justify-center px-4 sm:flex">
        <nav
          aria-label="Sections du site"
          className="pointer-events-auto flex h-7 max-w-xl items-center gap-5 overflow-x-auto border border-t-0 border-white/10 bg-[#061C38] px-5 shadow-[0_8px_22px_rgba(6,28,56,0.25)]"
          style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
        >
          {SUB_NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[10px] font-medium text-white/70 transition-colors duration-200 hover:text-white"
            >
              {t(item.labelKey)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}


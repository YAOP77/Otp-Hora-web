"use client";

import {
  NavIconBuilding,
  NavIconDashboard,
  NavIconHistory,
  NavIconSettings,
  NavIconUser,
} from "@/components/layout/dashboard-nav-icons";
import { ThemeToggleNav } from "@/components/layout/theme-toggle-nav";
import { useI18n } from "@/components/providers/i18n-provider";
import type { TranslationKey } from "@/lib/i18n/translations";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

type NavLinkItem = {
  href: string;
  labelKey: TranslationKey;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const navLinks: NavLinkItem[] = [
  { href: "/portail-entreprise", labelKey: "nav.dashboard", Icon: NavIconDashboard },
  { href: "/portail-entreprise/account", labelKey: "nav.account", Icon: NavIconUser },
  { href: "/portail-entreprise/users", labelKey: "nav.linkedUsers", Icon: NavIconBuilding },
  { href: "/portail-entreprise/history", labelKey: "nav.accessHistory", Icon: NavIconHistory },
  { href: "/portail-entreprise/settings", labelKey: "nav.settings", Icon: NavIconSettings },
];

const linkGroups = [navLinks.slice(0, 2), navLinks.slice(2, 4)];

function NavLinkRow({
  href,
  labelKey,
  Icon,
  onNavigate,
}: NavLinkItem & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const active =
    href === "/portail-entreprise"
      ? pathname === "/portail-entreprise"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`nav-link-row flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3A6E] ${
        active
          ? "border-[#0B3A6E]/30 bg-[#0B3A6E] text-white dark:border-[#0B3A6E] dark:bg-[#0B3A6E] dark:text-white"
          : "border-transparent [color:var(--dash-muted)] hover:bg-[var(--dash-nav-hover)] hover:[color:var(--dash-text)]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={`nav-icon size-[18px] shrink-0 ${active ? "opacity-100" : "opacity-75"}`} />
      {t(labelKey)}
    </Link>
  );
}

export function EnterpriseSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const settingsLink = navLinks[4];

  return (
    <div className="flex h-full flex-col bg-[var(--dash-sidebar)]">
      <div className="px-4 py-5">
        <Link
          href="/portail-entreprise"
          onClick={onNavigate}
          className="flex items-center gap-2 [color:var(--dash-text)]"
        >
          <Image
            src="/assets/image%20app/Hora-Logo.png"
            alt="OTP Hora"
            width={194}
            height={154}
            className="h-9 w-auto"
          />
          <span className="text-sm font-semibold tracking-tight">OTP Hora</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4 pt-2" aria-label="Navigation Entreprise">
        <div className="flex flex-col gap-0">
          {linkGroups.map((items) => (
            <div key={items[0].href} className="mb-3 border-b border-[var(--dash-border)] pb-3">
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <NavLinkRow {...item} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mb-3 border-b border-[var(--dash-border)] pb-3">
            <ul className="space-y-0.5">
              <li>
                <ThemeToggleNav />
              </li>
              <li>
                <NavLinkRow {...settingsLink} onNavigate={onNavigate} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

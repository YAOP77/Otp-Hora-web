"use client";

import { IconMenu } from "@/components/features/dashboard/icons";
import { EnterpriseSidebar } from "@/components/layout/enterprise-sidebar";
import { IconClose } from "@/components/layout/dashboard-nav-icons";
import Link from "next/link";
import { useState } from "react";

export function EnterpriseAppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--dash-main)]">
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col bg-[var(--dash-sidebar)] lg:flex">
        <EnterpriseSidebar />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
            aria-label="Fermer le menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,280px)] flex-col bg-[var(--dash-sidebar)] shadow-xl">
            <div className="flex items-center justify-end px-2 py-2">
              <button
                type="button"
                className="rounded-lg p-2 [color:var(--dash-muted)] hover:bg-[var(--dash-nav-hover)]"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer"
              >
                <IconClose className="size-6" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <EnterpriseSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col bg-[var(--dash-main)]">
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 backdrop-blur-sm lg:hidden bg-[var(--dash-main)]">
          <Link
            href="/portail-entreprise"
            className="text-sm font-semibold [color:var(--dash-text)]"
            onClick={() => setMobileOpen(false)}
          >
            Portail Entreprise
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl [color:var(--dash-muted)] transition hover:bg-[var(--dash-nav-hover)] hover:text-[#0B3A6E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3A6E]"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
          >
            <IconMenu className="size-6" />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

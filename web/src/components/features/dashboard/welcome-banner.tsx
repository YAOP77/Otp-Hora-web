"use client";

import { IconSparkle } from "@/components/features/dashboard/icons";

export function WelcomeBanner() {
  return (
    <section
      aria-label="Bienvenue"
      className="flex items-start gap-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-900/50 hover:shadow-sm dark:hover:border-zinc-100/65 sm:items-center sm:p-6"
    >
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[var(--dash-border)] bg-[var(--dash-main)] text-[#0B3A6E]"
        aria-hidden
      >
        <IconSparkle className="size-6" />
      </div>
      <div className="min-w-0">
        <h2 className="text-base font-semibold [color:var(--dash-text)] sm:text-lg">
          Bienvenue sur Hora
        </h2>
        <p className="mt-1 text-sm leading-relaxed [color:var(--dash-muted)]">
          Votre espace est prêt. Accédez à vos raccourcis et à votre compte depuis ce tableau de
          bord.
        </p>
      </div>
    </section>
  );
}

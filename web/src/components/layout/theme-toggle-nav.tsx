"use client";

import { useTheme } from "@/components/providers/theme-provider";
import type { SVGProps } from "react";

function IconSun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/** Ligne de navigation : bascule clair / sombre (après « Liaison de connexion »). */
export function ThemeToggleNav() {
  const { theme, toggleTheme, mounted } = useTheme();

  const isDark = mounted && theme === "dark";
  const label = isDark ? "Mode clair" : "Mode sombre";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3A6E] [color:var(--dash-muted)] hover:bg-[var(--dash-nav-hover)] hover:[color:var(--dash-text)]"
    >
      {isDark ? (
        <IconSun className="size-[18px] shrink-0 opacity-90" />
      ) : (
        <IconMoon className="size-[18px] shrink-0 opacity-90" />
      )}
      <span>{label}</span>
    </button>
  );
}

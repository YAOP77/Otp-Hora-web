import type { SVGProps } from "react";

const common = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function NavIconDashboard(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} aria-hidden {...p}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="11" width="7" height="10" rx="1.5" />
      <rect x="3" y="15" width="7" height="6" rx="1.5" />
    </svg>
  );
}

export function NavIconUser(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} aria-hidden {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20v-1c0-2.5 2-4.5 7-4.5s7 2 7 4.5v1" />
    </svg>
  );
}

export function NavIconDevice(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} aria-hidden {...p}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M10 18h4" />
    </svg>
  );
}

export function NavIconBuilding(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} aria-hidden {...p}>
      <path d="M4 22V4a2 2 0 0 1 2-2h8v20" />
      <path d="M14 22V10h6v12" />
      <path d="M10 6h2" />
      <path d="M10 10h2" />
      <path d="M10 14h2" />
      <path d="M6 6h2" />
      <path d="M6 10h2" />
      <path d="M6 14h2" />
    </svg>
  );
}

/** Icône engrenage (paramètres). */
export function NavIconSettings(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} aria-hidden {...p}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.21.32.32.7.32 1.09v.09A1.65 1.65 0 0 0 21 12v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function NavIconHistory(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} aria-hidden {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function NavIconTerminal(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} aria-hidden {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m8 10 2 2-2 2" />
      <path d="M13 15h3" />
    </svg>
  );
}

export function NavIconLogout(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} aria-hidden {...p}>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconClose(p: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
      {...p}
    >
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

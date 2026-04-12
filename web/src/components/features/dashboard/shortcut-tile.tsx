"use client";

import { IconChevronRight } from "@/components/features/dashboard/icons";
import Image from "next/image";
import Link from "next/link";

type ShortcutTileProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
  comingSoon?: boolean;
};

const IMG = 152;

/** Transitions fluides bordure / ombre (Tableau de bord). */
const cardTransition =
  "transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[border-color]";

const cardHoverInteractive = `${cardTransition} hover:border-neutral-900/50 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:hover:border-zinc-100/70`;

const cardFocus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function ShortcutTile({
  title,
  imageSrc,
  imageAlt,
  href,
  comingSoon,
}: ShortcutTileProps) {
  const inner = (
    <>
      <div className="relative z-10 flex items-start justify-between gap-2 pr-2">
        <span className="text-[15px] font-semibold leading-snug [color:var(--dash-text)]">
          {title}
        </span>
        <IconChevronRight
          className={`mt-0.5 size-[18px] shrink-0 opacity-45 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            comingSoon ? "" : "group-hover:translate-x-1 group-hover:opacity-70"
          }`}
        />
      </div>
      {comingSoon ? (
        <span className="relative z-10 mt-2 inline-flex w-fit rounded-md border border-[var(--dash-border)] bg-[var(--dash-main)]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide [color:var(--dash-muted)] dark:bg-zinc-800/80">
          Bientôt disponible
        </span>
      ) : null}
      <div
        className="pointer-events-none absolute bottom-0 right-0 flex h-[160px] w-[160px] items-end justify-end sm:h-[172px] sm:w-[172px]"
        aria-hidden
      >
        <div className="shortcut-tile-img -translate-x-0.5 translate-y-0.5 rotate-[-10deg]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={172}
            height={172}
            className="object-contain object-right object-bottom opacity-[0.97]"
            sizes="(max-width:640px) 160px, 172px"
          />
        </div>
      </div>
    </>
  );

  const surface = `border-2 border-neutral-200 dark:border-zinc-700 bg-[var(--dash-surface)] ${cardTransition}`;

  const className = `shortcut-tile-card group relative block min-h-[180px] overflow-hidden rounded-2xl p-4 pr-2 ${surface} ${cardFocus} ${
    comingSoon
      ? "cursor-not-allowed opacity-[0.97]"
      : `${cardHoverInteractive} hover:shadow-sm`
  }`;

  if (href && !comingSoon) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <div
      role="group"
      aria-label={title}
      className={className}
      tabIndex={comingSoon ? 0 : undefined}
    >
      {inner}
    </div>
  );
}

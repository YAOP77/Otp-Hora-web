"use client";

import { useEffect, useRef, useState } from "react";
import type { SVGProps } from "react";

function IconSearch(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconFilter(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

type SearchFilterProps = {
  search: string;
  onSearchChange: (v: string) => void;
  placeholder?: string;
  filters: readonly string[];
  activeFilter: string;
  onFilterChange: (v: string) => void;
  /** Si vrai, l'input prend toute la largeur disponible (pas de max-w-xs). */
  grow?: boolean;
};

export function SearchFilter({
  search,
  onSearchChange,
  placeholder = "Rechercher…",
  filters,
  activeFilter,
  onFilterChange,
  grow = false,
}: SearchFilterProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropdownOpen]);

  return (
    <div className="flex items-center gap-1.5">
      {/* Search input */}
      <div className={`relative flex-1 ${grow ? "" : "max-w-xs"}`}>
        <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-secondary" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-[11px] text-foreground placeholder:text-secondary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0B3A6E]"
        />
      </div>

      {/* Filter dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-[11px] font-medium text-secondary transition-colors hover:text-foreground"
        >
          <IconFilter className="size-3.5" />
          {activeFilter}
        </button>

        {dropdownOpen ? (
          <div className="absolute right-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  onFilterChange(f);
                  setDropdownOpen(false);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left text-[11px] font-medium transition-colors ${
                  activeFilter === f
                    ? "bg-[#0B3A6E]/10 text-[#0B3A6E] dark:bg-[#0B3A6E]/30 dark:text-white"
                    : "text-secondary hover:bg-neutral-50 hover:text-foreground dark:hover:bg-zinc-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

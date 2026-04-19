"use client";

import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY,
  type CountryCode,
} from "@/lib/data/country-codes";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { SVGProps } from "react";

function IconChevronDown(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconSearch(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

type PhoneInputProps = {
  /** Numéro complet au format E.164 (ex: "+2250777123456"). */
  value: string;
  /** Notifie la nouvelle valeur complète E.164. */
  onChange: (e164: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
};

/** Estimation raisonnable de la hauteur max du dropdown (panier + liste). */
const DROPDOWN_MAX_HEIGHT = 280;

/**
 * Split une valeur E.164 en { country, national } — on tente de trouver le plus
 * long préfixe `dial` qui matche. Si rien ne matche, on retombe sur le pays
 * par défaut et on considère que toute la valeur est nationale.
 */
function splitE164(value: string): { country: CountryCode; national: string } {
  const digits = value.replace(/^\+/, "").replace(/\D/g, "");
  if (!digits) return { country: DEFAULT_COUNTRY, national: "" };
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (digits.startsWith(c.dial)) {
      return { country: c, national: digits.slice(c.dial.length) };
    }
  }
  return { country: DEFAULT_COUNTRY, national: digits };
}

export function PhoneInput({
  value,
  onChange,
  id,
  placeholder = "07 00 00 00 00",
  disabled,
  className = "",
  "aria-invalid": invalid,
}: PhoneInputProps) {
  const autoId = useId();
  const inputId = id ?? `phone-${autoId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const initial = useMemo(() => splitE164(value), [value]);
  const [country, setCountry] = useState<CountryCode>(initial.country);
  const [national, setNational] = useState<string>(initial.national);

  useEffect(() => {
    const s = splitE164(value);
    setCountry(s.country);
    setNational(s.national);
  }, [value]);

  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  /** Positionnement intelligent : si l'espace sous le bouton < hauteur estimée,
   *  on ouvre vers le haut. Recalculé à chaque ouverture et au resize/scroll. */
  useEffect(() => {
    if (!open) return;
    const compute = () => {
      const btn = triggerRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow);
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  function emit(nextCountry: CountryCode, nextNational: string) {
    const cleanNational = nextNational.replace(/\D/g, "");
    const e164 = cleanNational ? `+${nextCountry.dial}${cleanNational}` : "";
    onChange(e164);
  }

  function onNationalChange(raw: string) {
    const cleaned = raw.replace(/\D/g, "").slice(0, 15);
    setNational(cleaned);
    emit(country, cleaned);
  }

  function onPickCountry(c: CountryCode) {
    setCountry(c);
    setOpen(false);
    emit(c, national);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.iso.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex h-9 items-stretch rounded-lg border border-border bg-background text-xs focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${
          invalid ? "border-error/60" : ""
        } ${disabled ? "opacity-50" : ""}`}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => !disabled && setOpen((v) => !v)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          title={`${country.name} (+${country.dial})`}
          className="inline-flex shrink-0 items-center gap-1 rounded-l-lg border-r border-border bg-neutral-50 px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-neutral-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800"
        >
          <span className="text-base leading-none">{country.flag}</span>
          <span className="tabular-nums">+{country.dial}</span>
          <IconChevronDown className="size-3 opacity-60" />
        </button>

        <input
          id={inputId}
          type="tel"
          autoComplete="tel-national"
          inputMode="numeric"
          pattern="\d*"
          disabled={disabled}
          placeholder={placeholder}
          value={national}
          onChange={(e) => onNationalChange(e.target.value)}
          className="min-w-0 flex-1 rounded-r-lg bg-transparent px-3 text-xs text-foreground placeholder:text-secondary/60 focus:outline-none"
        />
      </div>

      {open ? (
        <div
          className={`absolute left-0 right-0 z-50 overflow-hidden rounded-lg border border-border bg-background shadow-lg ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="relative border-b border-border/70 p-1.5">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-3 -translate-y-1/2 text-secondary" />
            <input
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un pays…"
              className="h-7 w-full rounded-md bg-transparent pl-7 pr-2 text-[11px] text-foreground placeholder:text-secondary/60 focus:outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-[11px] text-secondary">
                Aucun résultat
              </li>
            ) : (
              filtered.map((c) => (
                <li key={c.iso}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={country.iso === c.iso}
                    onClick={() => onPickCountry(c)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] transition-colors ${
                      country.iso === c.iso
                        ? "bg-[#0B3A6E]/10 text-[#0B3A6E] dark:bg-[#0B3A6E]/30 dark:text-white"
                        : "text-foreground hover:bg-neutral-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="tabular-nums text-secondary">+{c.dial}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

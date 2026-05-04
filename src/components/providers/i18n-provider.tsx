"use client";

import {
  translations,
  type Lang,
  type TranslationKey,
} from "@/lib/i18n/translations";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  mounted: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "otp-hora-lang";

function applyHtmlLang(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: Lang = "fr";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "fr" || stored === "en") initial = stored;
    } catch {
      /* ignore */
    }
    setLangState(initial);
    applyHtmlLang(initial);
    setMounted(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    applyHtmlLang(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "fr" ? "en" : "fr";
      applyHtmlLang(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = translations[lang];
      return (dict as Record<string, string>)[key] ?? translations.fr[key] ?? key;
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t, mounted }),
    [lang, setLang, toggleLang, t, mounted],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

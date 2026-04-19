"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { PageHeader } from "@/components/ui/page-header";
import { SearchFilter } from "@/components/ui/search-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { getEnterpriseLoginHistory } from "@/lib/api/enterprises";
import { getEnterpriseAccessToken } from "@/lib/auth/enterprise-session";
import { unwrapApiData } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { SVGProps } from "react";

type LoginEntry = {
  history_id: string;
  label: string;
  device_name: string | null;
  connected_at: string;
};

function IconClock(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>);
}
function IconDevice(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></svg>);
}
function IconLogin(p: SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>);
}

const FILTERS = ["Tous", "Aujourd'hui", "7 jours"] as const;

export function EnterpriseHistoryPageView() {
  const { t } = useI18n();
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["enterprise", "login-history"],
    queryFn: async () => {
      const result = await getEnterpriseLoginHistory(getEnterpriseAccessToken);
      const data = unwrapApiData<{ login_history?: unknown }>(result);
      return Array.isArray(data?.login_history) ? (data.login_history as LoginEntry[]) : [];
    },
  });

  const [error] = useState<unknown>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("Tous");

  const filtered = useMemo(() => {
    let list = history;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.label?.toLowerCase().includes(q) ||
          e.device_name?.toLowerCase().includes(q),
      );
    }
    if (filter === "Aujourd'hui") {
      const today = new Date().toDateString();
      list = list.filter((e) => new Date(e.connected_at).toDateString() === today);
    } else if (filter === "7 jours") {
      const week = Date.now() - 7 * 86400000;
      list = list.filter((e) => new Date(e.connected_at).getTime() >= week);
    }
    return list;
  }, [history, search, filter]);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={t("history.title")}
        description={t("history.desc")}
      />

      <ErrorBanner error={error} />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ) : (
      <>
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder={t("devices.search")}
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
        grow
      />

      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white py-10 dark:border-zinc-700 dark:bg-zinc-900">
            <EmptyState
              title={t("history.empty.title")}
              description={t("history.empty.desc")}
            />
          </div>
        ) : (
          filtered.map((entry) => {
            const date = new Date(entry.connected_at);
            return (
              <div
                key={entry.history_id}
                className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 transition-colors hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800/50"
              >
                <IconLogin className="size-4 shrink-0 text-[#0B3A6E] dark:text-[#7dafe6]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-foreground">
                      {entry.label || "Connexion"}
                    </p>
                    {entry.device_name ? (
                      <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-secondary dark:bg-zinc-800">
                        <IconDevice className="size-2.5" />
                        {entry.device_name}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-[11px] text-secondary">
                  <IconClock className="size-3" />
                  {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            );
          })
        )}
      </div>
      </>
      )}
    </div>
  );
}

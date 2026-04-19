"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { PageHeader } from "@/components/ui/page-header";
import { SearchFilter } from "@/components/ui/search-filter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  listEnterpriseLinks,
  type EnterpriseLinkItem,
} from "@/lib/api/flow-links";
import { getEnterpriseAccessToken } from "@/lib/auth/enterprise-session";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { SVGProps } from "react";

function statusBadge(status: string): string {
  if (status === "approved")
    return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300";
  if (status === "rejected")
    return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function IconDots(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

export function EnterpriseUsersPageView() {
  const { t } = useI18n();
  const FILTERS = [t("common.all"), t("links.filter.pending"), t("links.filter.approved"), t("links.filter.rejected")];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>(FILTERS[0]);
  const status: "pending" | "approved" | "rejected" | undefined =
    filter === FILTERS[1]
      ? "pending"
      : filter === FILTERS[2]
        ? "approved"
        : filter === FILTERS[3]
          ? "rejected"
          : undefined;
  const statusLabel = (s: string): string => {
    if (s === "approved") return t("links.status.approved");
    if (s === "rejected") return t("links.status.rejected");
    if (s === "pending") return t("links.status.pending");
    return s;
  };

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["enterprise", "links", status ?? "all"],
    queryFn: () => listEnterpriseLinks(getEnterpriseAccessToken, status),
  });

  const filtered = useMemo(() => {
    let list = data as EnterpriseLinkItem[];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((l) => {
        const u = l.user;
        return (
          u?.nom?.toLowerCase().includes(q) ||
          u?.prenom?.toLowerCase().includes(q) ||
          u?.user_key?.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [data, search]);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={t("links.title.enterprise")}
        description={t("links.desc.enterprise")}
      />

      {isError ? <ErrorBanner error={error} /> : null}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ) : (
        <>
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            placeholder={t("links.search.enterprise")}
            filters={FILTERS}
            activeFilter={filter}
            onFilterChange={setFilter}
            grow
          />

          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <div className="grid grid-cols-[2.5fr_1.2fr_1fr_1fr_auto] gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-secondary dark:border-zinc-700 dark:bg-zinc-800">
              <span>{t("links.col.user")}</span>
              <span>{t("links.col.userKey")}</span>
              <span>{t("common.status")}</span>
              <span>{t("links.col.date")}</span>
              <span className="text-right">{t("common.action")}</span>
            </div>

            {filtered.length === 0 ? (
              <div className="px-4 py-12">
                <EmptyState
                  title={t("links.empty.enterprise.title")}
                  description={t("links.empty.enterprise.desc")}
                />
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-zinc-800">
                {filtered.map((link) => {
                  const u = link.user ?? {};
                  const name = [u.prenom, u.nom].filter(Boolean).join(" ") || "—";
                  return (
                    <div
                      key={link.link_id}
                      className="grid grid-cols-[2.5fr_1.2fr_1fr_1fr_auto] items-center gap-2 px-4 py-2 text-xs transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800/50"
                    >
                      <p className="font-medium text-foreground">{name}</p>
                      <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-secondary dark:bg-zinc-800">
                        {u.user_key ?? "—"}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadge(
                          link.status,
                        )}`}
                      >
                        {statusLabel(link.status)}
                      </span>
                      <p className="text-[11px] text-secondary">
                        {link.created_at
                          ? new Date(link.created_at).toLocaleDateString()
                          : "—"}
                      </p>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex size-7 items-center justify-center rounded-md text-secondary transition-colors hover:bg-neutral-100 hover:text-foreground dark:hover:bg-zinc-700"
                          title="Actions"
                        >
                          <IconDots className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

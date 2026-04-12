"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { PageHeader } from "@/components/ui/page-header";
import { SearchFilter } from "@/components/ui/search-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccessToken } from "@/lib/auth/session";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { SVGProps } from "react";

type LinkedEnterprise = {
  id: string;
  nom_entreprise?: string;
  phone_e164?: string;
  status?: string;
  linked_at?: string;
  created_at?: string;
};

const FILTERS = ["Tous", "Actif", "Inactif"] as const;

function IconDots(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

export function UserIdentityHub() {
  const { data: links = [], isLoading, isError, error } = useQuery({
    queryKey: ["user", "linked-enterprises"],
    queryFn: async () => {
      // Attempt to fetch linked enterprises for the user
      try {
        const { fetchUser } = await import("@/lib/api/users");
        const userId = typeof window !== "undefined" ? sessionStorage.getItem("otp_hora_user_id") : null;
        if (!userId) return [];
        const user = await fetchUser(userId, getAccessToken);
        if (user && typeof user === "object" && "linked_enterprises" in user) {
          return (user as { linked_enterprises: unknown }).linked_enterprises as LinkedEnterprise[];
        }
        return [];
      } catch {
        return [];
      }
    },
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("Tous");

  const filtered = useMemo(() => {
    let list = Array.isArray(links) ? (links as LinkedEnterprise[]) : [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.nom_entreprise?.toLowerCase().includes(q) ||
          e.phone_e164?.toLowerCase().includes(q),
      );
    }
    if (filter !== "Tous") {
      const s = filter.toLowerCase();
      list = list.filter((e) => (e.status ?? "actif").toLowerCase() === s);
    }
    return list;
  }, [links, search, filter]);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Liaisons & identité"
        description="Entreprises associées à votre compte utilisateur."
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
        placeholder="Rechercher par nom ou téléphone…"
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-secondary dark:border-zinc-700 dark:bg-zinc-800">
          <span>Entreprise</span>
          <span>Téléphone</span>
          <span>Statut</span>
          <span>Date de liaison</span>
          <span className="text-right">Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-10">
            <EmptyState
              title="Aucune liaison"
              description="Aucune entreprise n'est encore liée à votre compte."
            />
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-zinc-800">
            {filtered.map((ent) => (
              <div
                key={ent.id}
                className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-2 px-4 py-2 text-xs transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800/50"
              >
                <p className="font-medium text-foreground">
                  {ent.nom_entreprise ?? "—"}
                </p>
                <p className="text-secondary">{ent.phone_e164 ?? "—"}</p>
                <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                  {ent.status ?? "Actif"}
                </span>
                <p className="text-[11px] text-secondary">
                  {ent.linked_at ?? ent.created_at
                    ? new Date(ent.linked_at ?? ent.created_at ?? "").toLocaleDateString()
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
            ))}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}

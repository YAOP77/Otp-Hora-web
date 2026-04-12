"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { PageHeader } from "@/components/ui/page-header";
import { SearchFilter } from "@/components/ui/search-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { getEnterpriseLinkedUsers } from "@/lib/api/enterprises";
import { getEnterpriseAccessToken } from "@/lib/auth/enterprise-session";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { SVGProps } from "react";

type LinkedUser = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  status?: string;
  created_at: string;
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

export function EnterpriseUsersPageView() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["enterprise", "linked-users"],
    queryFn: async () => {
      const result = await getEnterpriseLinkedUsers(getEnterpriseAccessToken);
      return Array.isArray(result) ? result : [];
    },
  });

  const [error] = useState<unknown>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("Tous");

  const filtered = useMemo(() => {
    let list = users as LinkedUser[];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.nom?.toLowerCase().includes(q) ||
          u.prenom?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q),
      );
    }
    if (filter !== "Tous") {
      const s = filter.toLowerCase();
      list = list.filter((u) => (u.status ?? "actif").toLowerCase() === s);
    }
    return list;
  }, [users, search, filter]);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Utilisateurs liés"
        description="Consultez les utilisateurs associés à votre entreprise."
      />

      <ErrorBanner error={error} />

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
        placeholder="Rechercher par nom, prénom ou email…"
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-secondary dark:border-zinc-700 dark:bg-zinc-800">
          <span>Nom</span>
          <span>Téléphone</span>
          <span>Statut</span>
          <span>Date de liaison</span>
          <span className="text-right">Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-10">
            <EmptyState
              title="Aucun utilisateur"
              description="Aucun utilisateur n'est encore lié à votre entreprise."
            />
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-zinc-800">
            {filtered.map((user: LinkedUser) => (
              <div
                key={user.id}
                className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-2 px-4 py-2 text-xs transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-800/50"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-[11px] text-secondary">{user.email}</p>
                </div>
                <p className="text-secondary">—</p>
                <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                  {user.status ?? "Actif"}
                </span>
                <p className="text-[11px] text-secondary">
                  {new Date(user.created_at).toLocaleDateString()}
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

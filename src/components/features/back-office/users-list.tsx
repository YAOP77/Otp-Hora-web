"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, changeUserStatus, deactivateUserDevices } from "@/lib/api/back-office";
import { getAccessToken } from "@/lib/auth/session";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useToast } from "@/components/ui/toast";

export function UsersList() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "users", search],
    queryFn: () => fetchUsers(getAccessToken, search),
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "active" | "suspended" | "blocked" }) =>
      changeUserStatus(userId, status, getAccessToken),
    onSuccess: () => {
      toast("Statut de l'utilisateur mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => toast("Erreur lors de la mise à jour du statut."),
  });

  const deactivateMutation = useMutation({
    mutationFn: (userId: string) => deactivateUserDevices(userId, getAccessToken),
    onSuccess: () => {
      toast("Tous les appareils de l'utilisateur ont été déconnectés.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => toast("Erreur lors de la déconnexion des appareils."),
  });

  const users = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Rechercher par username, nom ou téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md bg-white dark:bg-zinc-900"
        />
        <Button onClick={() => refetch()} variant="secondary">Rafraîchir</Button>
      </div>

      {isError && <ErrorBanner error={error} />}

      <div className="rounded-lg border border-neutral-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <table className="w-full text-left text-sm text-secondary">
          <thead className="bg-neutral-50 text-xs uppercase text-foreground dark:bg-zinc-800/50">
            <tr>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Appareils Actifs</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4">
                  <Skeleton className="h-6 w-full" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr key={u.user_id} className="border-t border-neutral-100 dark:border-zinc-800">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{u.prenom} {u.nom}</div>
                    <div className="text-xs">@{u.username || "—"}</div>
                  </td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold leading-none ${
                      u.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      u.status === 'suspended' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u._count?.user_devices || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {u.status === "active" ? (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-7 px-2 text-[10px] text-amber-600 hover:bg-amber-50"
                          onClick={() => statusMutation.mutate({ userId: u.user_id, status: "suspended" })}
                        >
                          Suspendre
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-7 px-2 text-[10px] text-green-600 hover:bg-green-50"
                          onClick={() => statusMutation.mutate({ userId: u.user_id, status: "active" })}
                        >
                          Activer
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-7 px-2 text-[10px] text-error hover:bg-error/10"
                        onClick={() => {
                          if (confirm("Déconnecter tous les appareils de cet utilisateur ?")) {
                            deactivateMutation.mutate(u.user_id);
                          }
                        }}
                      >
                        Déconnecter (Tous)
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

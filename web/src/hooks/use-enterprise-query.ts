"use client";

import { fetchEnterpriseMe } from "@/lib/api/enterprises";
import { getEnterpriseAccessToken } from "@/lib/auth/enterprise-session";
import { unwrapApiData } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export function useEnterpriseQuery() {
  const token = getEnterpriseAccessToken();

  return useQuery({
    queryKey: ["enterprise", "me"],
    queryFn: async () => {
      if (!token) throw new Error("Non connecté à l'espace entreprise");
      const raw = await fetchEnterpriseMe(() => token);
      return unwrapApiData<Record<string, unknown>>(raw);
    },
    enabled: Boolean(token),
  });
}

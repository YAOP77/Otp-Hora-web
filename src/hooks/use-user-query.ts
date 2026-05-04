"use client";

import { fetchUser } from "@/lib/api/users";
import { getAccessToken, getUserId } from "@/lib/auth/session";
import { useQuery } from "@tanstack/react-query";

export function useUserQuery() {
  const userId = getUserId();

  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Non connecté");
      return fetchUser(userId, getAccessToken);
    },
    enabled: Boolean(userId),
  });
}

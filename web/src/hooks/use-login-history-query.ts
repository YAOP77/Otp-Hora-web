"use client";

import { listUserLoginHistory } from "@/lib/api/users";
import { getAccessToken } from "@/lib/auth/session";
import { unwrapApiData } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export function useLoginHistoryQuery() {
  const userId = typeof window !== "undefined" ? sessionStorage.getItem("otp_hora_user_id") : null;

  return useQuery({
    queryKey: ["user", "login-history", userId],
    queryFn: async () => {
      const raw = await listUserLoginHistory(getAccessToken);
      const data = unwrapApiData(raw);
      if (data && typeof data === "object" && "login_history" in data) {
        return (data as { login_history: unknown }).login_history;
      }
      return data;
    },
    enabled: Boolean(userId),
  });
}

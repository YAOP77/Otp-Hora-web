"use client";

import { useEffect, useState } from "react";

/** Évite les mismatches d’hydratation pour tout contenu dépendant du client (ex. TanStack Query). */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

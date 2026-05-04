"use client";

import { usePathname } from "next/navigation";

export function DashboardViewTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="mx-auto w-full max-w-5xl animate-dashboard-enter">
      {children}
    </div>
  );
}

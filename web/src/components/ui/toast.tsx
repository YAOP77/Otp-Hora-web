"use client";

import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from "react";

type ToastData = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type ToastContextValue = {
  toast: (message: string, type?: ToastData["type"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((message: string, type: ToastData["type"] = "success") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[300] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} data={t} onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastItem({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const colors =
    data.type === "success"
      ? "border-green-300/70 bg-green-50 text-green-800 dark:border-green-500/40 dark:bg-green-950/80 dark:text-green-200"
      : data.type === "error"
        ? "border-red-300/70 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-950/80 dark:text-red-200"
        : "border-border bg-background text-foreground";

  const icon =
    data.type === "success" ? (
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ) : data.type === "error" ? (
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6M9 9l6 6" />
      </svg>
    ) : null;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${colors}`}
      style={{
        animation: leaving ? "toast-out 0.3s ease-in forwards" : "toast-in 0.35s ease-out both",
      }}
      onClick={onDismiss}
      role="status"
    >
      {icon}
      {data.message}
    </div>
  );
}

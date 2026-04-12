import { isApiError } from "@/lib/api/errors";

export function ErrorBanner({ error }: { error: unknown }) {
  const message = error
    ? isApiError(error)
      ? error.message
      : error instanceof Error
        ? error.message
        : "Une erreur est survenue."
    : null;

  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
    >
      {message}
    </div>
  );
}

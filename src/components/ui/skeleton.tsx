export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/80 ${className}`}
      aria-hidden
    />
  );
}

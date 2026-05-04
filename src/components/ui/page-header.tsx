export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-secondary">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

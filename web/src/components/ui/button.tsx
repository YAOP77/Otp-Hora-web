import {
  cloneElement,
  type ButtonHTMLAttributes,
  forwardRef,
  isValidElement,
  type ReactElement,
} from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50",
  secondary:
    "border border-border bg-background text-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50",
  ghost:
    "text-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = "",
      variant = "primary",
      loading,
      disabled,
      children,
      asChild,
      ...props
    },
    ref,
  ) {
    const classes = `inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${variants[variant]} ${className}`;

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;
      return cloneElement(child, {
        className: [classes, child.props.className].filter(Boolean).join(" "),
      });
    }

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        className={`${classes} btn-loading-container`}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-loading={loading ? "true" : undefined}
        {...props}
      >
        {children}
        {loading ? (
          <span className="btn-loading-dots" aria-hidden>
            <span className="btn-dot" />
            <span className="btn-dot" />
            <span className="btn-dot" />
            <span className="sr-only">Chargement</span>
          </span>
        ) : null}
      </button>
    );
  },
);

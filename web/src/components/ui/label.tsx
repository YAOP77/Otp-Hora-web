import { type LabelHTMLAttributes, forwardRef } from "react";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  function Label({ className = "", ...props }, ref) {
    return (
      <label
        ref={ref}
        className={`mb-1 block text-sm font-medium text-foreground ${className}`}
        {...props}
      />
    );
  },
);

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

// Input estilizado só com Tailwind. `forwardRef` para integrar com react-hook-form.
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border bg-elevated px-3 text-sm text-text",
          "placeholder:text-text-muted transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-brand",
          invalid ? "border-danger" : "border-border",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

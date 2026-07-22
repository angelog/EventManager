import { forwardRef, type ChangeEvent, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  mask?: "phone";
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className, mask, onChange, ...props }, ref) => {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      if (mask === "phone") {
        event.target.value = formatPhone(event.target.value);
      }

      onChange?.(event);
    }

    return (
      <input
        ref={ref}
        {...props}
        onChange={handleChange}
        className={cn(
          "h-11 w-full rounded-lg border bg-elevated px-3 text-sm text-text",
          "placeholder:text-text-muted transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-brand",
          invalid ? "border-danger" : "border-border",
          className,
        )}
      />
    );
  },
);

Input.displayName = "Input";
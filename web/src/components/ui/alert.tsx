import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "error" | "success" | "info";

interface AlertProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  error: "border-danger/40 bg-danger/10 text-danger",
  success: "border-success/40 bg-success/10 text-success",
  info: "border-info/40 bg-info/10 text-info",
};

// Feedback de erro/sucesso em bloco (ex.: erro retornado pela API no submit).
export function Alert({ tone = "error", children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

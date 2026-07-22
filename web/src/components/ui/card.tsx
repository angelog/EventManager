import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

// Superfície de conteúdo (cards de evento, blocos de formulário, etc.).
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5",
        className,
      )}
      {...props}
    />
  );
}

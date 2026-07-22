import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "brand" | "neutral" | "success";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  brand: "bg-brand/15 text-brand-light",
  neutral: "bg-elevated text-text-body",
  success: "bg-success/15 text-success",
};

// Selo compacto (ex.: quantidade de inscritos, "Você é o dono").
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

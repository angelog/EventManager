import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Junta classes condicionais (clsx) e resolve conflitos de utilitários Tailwind
// (tailwind-merge). Ex.: cn("px-2", isActive && "bg-brand", "px-4") -> "bg-brand px-4".
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

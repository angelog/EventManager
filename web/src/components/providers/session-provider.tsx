"use client";

import { type ReactNode, useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Participant } from "@/types";

interface SessionProviderProps {
  initialParticipant: Participant | null;
  children: ReactNode;
}

// Hidrata a store de auth com a sessão resolvida no servidor (via cookie).
// O initializer do useState roda uma única vez, antes do primeiro paint.
export function SessionProvider({
  initialParticipant,
  children,
}: SessionProviderProps) {
  useState(() => {
    useAuthStore.setState({ participant: initialParticipant });
  });

  return <>{children}</>;
}

import { create } from "zustand";
import type { Participant } from "@/types";

interface AuthState {
  participant: Participant | null;
  setParticipant: (participant: Participant | null) => void;
  clear: () => void;
}

// Estado global da sessão. Hidratado no boot pelo SessionProvider (cookie → /auth/me).
export const useAuthStore = create<AuthState>((set) => ({
  participant: null,
  setParticipant: (participant) => set({ participant }),
  clear: () => set({ participant: null }),
}));

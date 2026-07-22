import { cookies } from "next/headers";
import { authApi, authConfig } from "@/lib/api";
import type { Participant } from "@/types";
import { TOKEN_COOKIE } from "./constants";

// Lê o token do cookie httpOnly (server-side). Usado nos Route Handlers do BFF.
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

// Lê o cookie httpOnly (server-side) e resolve o participante autenticado via
// /auth/me. Usado no root layout para hidratar o estado da sessão.
export async function getServerSession(): Promise<Participant | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    return await authApi.me(authConfig(token));
  } catch {
    return null;
  }
}

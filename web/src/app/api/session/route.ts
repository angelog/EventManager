import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { authApi, getApiError } from "@/lib/api";
import { SESSION_MAX_AGE, TOKEN_COOKIE } from "@/lib/auth/constants";

// POST /api/session -> login: valida na API, grava o token em cookie httpOnly
// e devolve o participante (sem expor o token ao JS do cliente).
export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const { participant, token } = await authApi.login(body);

    const store = await cookies();
    store.set({
      name: TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return NextResponse.json({ participant });
  } catch (error) {
    const { status, message } = getApiError(error);
    return NextResponse.json({ message }, { status });
  }
}

// DELETE /api/session -> logout: limpa o cookie de sessão.
export async function DELETE() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  return NextResponse.json({ ok: true });
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authConfig, getApiError, participantsApi } from "@/lib/api";
import { TOKEN_COOKIE } from "@/lib/auth/constants";
import { getSessionToken } from "@/lib/auth/session";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT -> atualiza o próprio cadastro (a API valida self-only via token).
export async function PUT(request: Request, { params }: RouteContext) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  try {
    const participant = await participantsApi.update(
      Number(id),
      body,
      authConfig(token),
    );
    return NextResponse.json(participant);
  } catch (error) {
    const { status, message } = getApiError(error);
    return NextResponse.json({ message }, { status });
  }
}

// DELETE -> remove a própria conta e encerra a sessão (limpa o cookie).
export async function DELETE(_request: Request, { params }: RouteContext) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await participantsApi.remove(Number(id), authConfig(token));
    const store = await cookies();
    store.delete(TOKEN_COOKIE);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, message } = getApiError(error);
    return NextResponse.json({ message }, { status });
  }
}

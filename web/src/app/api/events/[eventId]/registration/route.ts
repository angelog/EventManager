import { NextResponse } from "next/server";
import { authApi, authConfig, getApiError, registrationsApi } from "@/lib/api";
import { getSessionToken } from "@/lib/auth/session";

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

export async function POST(_request: Request, { params }: RouteContext) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const { eventId } = await params;
  try {
    const registration = await registrationsApi.register(
      Number(eventId),
      authConfig(token),
    );
    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    const { status, message } = getApiError(error);
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const { eventId } = await params;
  try {
    const me = await authApi.me(authConfig(token));
    await registrationsApi.cancel(Number(eventId), me.id, authConfig(token));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, message } = getApiError(error);
    return NextResponse.json({ message }, { status });
  }
}

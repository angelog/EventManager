import { NextResponse } from "next/server";
import { authConfig, eventsApi, getApiError } from "@/lib/api";
import { getSessionToken } from "@/lib/auth/session";

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const { eventId } = await params;
  const body = await request.json();
  try {
    const event = await eventsApi.update(
      Number(eventId),
      body,
      authConfig(token),
    );
    return NextResponse.json(event);
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
    await eventsApi.remove(Number(eventId), authConfig(token));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, message } = getApiError(error);
    return NextResponse.json({ message }, { status });
  }
}

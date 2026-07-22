import { NextResponse } from "next/server";
import { authConfig, eventsApi, getApiError } from "@/lib/api";
import { getSessionToken } from "@/lib/auth/session";

// POST /api/events -> cria um evento em nome do participante autenticado.
export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  try {
    const event = await eventsApi.create(body, authConfig(token));
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    const { status, message } = getApiError(error);
    return NextResponse.json({ message }, { status });
  }
}

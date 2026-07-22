"use client";

import { useRouter } from "next/navigation";
import { getApiErrorMessage, internalApi } from "@/lib/api";
import type { CreateEventPayload } from "@/types";
import { EventForm, type EventFormResult } from "./event-form";

export function CreateEventForm() {
  const router = useRouter();

  async function onSubmit(
    payload: CreateEventPayload,
  ): Promise<EventFormResult> {
    try {
      const { data } = await internalApi.post("/api/events", payload);
      router.push(`/events/${data.id}`);
      router.refresh();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error) };
    }
  }

  return <EventForm submitLabel="Criar evento" onSubmit={onSubmit} />;
}

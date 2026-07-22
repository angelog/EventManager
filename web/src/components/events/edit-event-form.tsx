"use client";

import { useRouter } from "next/navigation";
import { getApiErrorMessage, internalApi } from "@/lib/api";
import type { EventFormValues } from "@/lib/schemas/event";
import type { CreateEventPayload } from "@/types";
import { EventForm, type EventFormResult } from "./event-form";

interface EditEventFormProps {
  eventId: number;
  defaultValues: EventFormValues;
}

export function EditEventForm({ eventId, defaultValues }: EditEventFormProps) {
  const router = useRouter();

  async function onSubmit(
    payload: CreateEventPayload,
  ): Promise<EventFormResult> {
    try {
      await internalApi.put(`/api/events/${eventId}`, payload);
      router.push(`/events/${eventId}`);
      router.refresh();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error) };
    }
  }

  return (
    <EventForm
      submitLabel="Salvar alterações"
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    />
  );
}

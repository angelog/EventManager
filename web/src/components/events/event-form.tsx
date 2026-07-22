"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Field, Input, Textarea } from "@/components/ui";
import { type EventFormValues, eventSchema } from "@/lib/schemas/event";
import type { CreateEventPayload } from "@/types";

export interface EventFormResult {
  ok: boolean;
  message?: string;
}

interface EventFormProps {
  defaultValues?: EventFormValues;
  submitLabel: string;
  // Recebe o payload pronto; devolve ok/erro. O redirect fica com o pai.
  onSubmit: (payload: CreateEventPayload) => Promise<EventFormResult>;
}

export function EventForm({
  defaultValues,
  submitLabel,
  onSubmit,
}: EventFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  async function handle(values: EventFormValues) {
    setFormError(null);
    const payload: CreateEventPayload = {
      name: values.name,
      description: values.description?.trim() || undefined,
      date: new Date(values.date).toISOString(),
    };

    const result = await onSubmit(payload);
    if (!result.ok) {
      setFormError(result.message ?? "Não foi possível salvar o evento.");
    }
  }

  // `defaultValue` nativo garante a exibição do valor inicial no DOM (edição),
  // independentemente do react-hook-form/React Compiler. O RHF mantém o estado
  // (seedado por defaultValues) para validação e submit.
  return (
    <form
      onSubmit={handleSubmit(handle)}
      className="flex flex-col gap-4"
      noValidate
    >
      {formError && <Alert>{formError}</Alert>}

      <Field label="Nome" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          placeholder="Ex.: React Summit Brasil"
          defaultValue={defaultValues?.name}
          invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field
        label="Descrição (opcional)"
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          placeholder="Sobre o que é o evento?"
          defaultValue={defaultValues?.description}
          invalid={!!errors.description}
          {...register("description")}
        />
      </Field>

      <Field label="Data e hora" htmlFor="date" error={errors.date?.message}>
        <Input
          id="date"
          type="datetime-local"
          className="[color-scheme:dark]"
          defaultValue={defaultValues?.date}
          invalid={!!errors.date}
          {...register("date")}
        />
      </Field>

      <Button type="submit" loading={isSubmitting} className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}

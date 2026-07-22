import { notFound, redirect } from "next/navigation";
import { EditEventForm } from "@/components/events/edit-event-form";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui";
import { eventsApi } from "@/lib/api";
import { getServerSession } from "@/lib/auth/session";
import { toDatetimeLocalValue } from "@/lib/utils/format";
import type { EventDetail } from "@/types";

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { eventId } = await params;
  const id = Number(eventId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const session = await getServerSession();
  if (!session) redirect(`/login?from=/events/${id}/edit`);

  let event: EventDetail;
  try {
    event = await eventsApi.getById(id);
  } catch {
    notFound();
  }

  if (event.createdById !== session.id) {
    redirect(`/events/${id}`);
  }

  return (
    <Container className="py-10">
      <Card className="mx-auto max-w-xl">
        <h1 className="mb-1 text-xl font-bold text-text">Editar evento</h1>
        <p className="mb-6 text-sm text-text-muted">
          Atualize os dados do evento.
        </p>
        <EditEventForm
          eventId={id}
          defaultValues={{
            name: event.name,
            description: event.description ?? "",
            date: toDatetimeLocalValue(event.date),
          }}
        />
      </Card>
    </Container>
  );
}

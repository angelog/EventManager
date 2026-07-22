import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteEventButton } from "@/components/events/delete-event-button";
import { ParticipantList } from "@/components/events/participant-list";
import { RegistrationButton } from "@/components/events/registration-button";
import { Container } from "@/components/layout/container";
import { Badge, Button, Card } from "@/components/ui";
import { authConfig, eventsApi } from "@/lib/api";
import { getServerSession, getSessionToken } from "@/lib/auth/session";
import { formatDate, formatParticipants } from "@/lib/utils/format";
import type { EventDetail } from "@/types";

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { eventId } = await params;
  const id = Number(eventId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [session, token] = await Promise.all([
    getServerSession(),
    getSessionToken(),
  ]);

  let event: EventDetail;
  try {
    // Repassa o token para que o dono do evento receba os dados de contato
    // dos inscritos (a API só os expõe ao organizador).
    event = await eventsApi.getById(id, token ? authConfig(token) : undefined);
  } catch {
    notFound();
  }

  const isOwner = session?.id === event.createdById;
  const isRegistered =
    !!session && event.participants.some((p) => p.id === session.id);

  return (
    <Container className="flex flex-col gap-6 py-10">
      <Link href="/events" className="text-sm text-text-muted hover:text-text">
        ← Voltar para eventos
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-text">{event.name}</h1>
                <p className="mt-1 text-sm text-text-muted">
                  {formatDate(event.date)}
                </p>
              </div>
              {isOwner && <Badge tone="success">Você é o organizador</Badge>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">
                {formatParticipants(event.participantsCount)}
              </Badge>
              <span className="text-sm text-text-muted">
                Organizado por {event.createdBy.name}
              </span>
            </div>

            {event.description && (
              <p className="whitespace-pre-line text-text-body">
                {event.description}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
              <div className="sm:max-w-xs sm:flex-1">
                <RegistrationButton
                  eventId={event.id}
                  isRegistered={isRegistered}
                  isAuthenticated={!!session}
                />
              </div>
              {isOwner && (
                <div className="flex gap-2 sm:ml-auto">
                  <Link href={`/events/${event.id}/edit`}>
                    <Button variant="secondary">Editar</Button>
                  </Link>
                  <DeleteEventButton eventId={event.id} />
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="mb-4 font-semibold text-text">
            Inscritos ({event.participantsCount})
          </h2>
          <ParticipantList participants={event.participants} />
        </Card>
      </div>
    </Container>
  );
}

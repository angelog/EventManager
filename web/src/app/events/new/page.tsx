import { CreateEventForm } from "@/components/events/create-event-form";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui";


export default function NewEventPage() {
  return (
    <Container className="py-10">
      <Card className="mx-auto max-w-xl">
        <h1 className="mb-1 text-xl font-bold text-text">Criar evento</h1>
        <p className="mb-6 text-sm text-text-muted">
          Preencha os dados do novo evento.
        </p>
        <CreateEventForm />
      </Card>
    </Container>
  );
}

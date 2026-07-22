import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { EventsPagination } from "@/components/events/events-pagination";
import { SearchBar } from "@/components/events/search-bar";
import { Container } from "@/components/layout/container";
import { Alert, Button } from "@/components/ui";
import { eventsApi } from "@/lib/api";
import type { EventListItem, PaginationMeta } from "@/types";

const PAGE_SIZE = 6;

interface EventsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { page: pageParam, search } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let events: EventListItem[] = [];
  let meta: PaginationMeta | null = null;
  let error = false;

  try {
    const result = await eventsApi.list({ page, limit: PAGE_SIZE, search });
    events = result.data;
    meta = result.meta;
  } catch {
    error = true;
  }

  return (
    <Container className="flex flex-col gap-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Eventos</h1>
          <p className="mt-1 text-sm text-text-muted">
            Explore os eventos e inscreva-se.
          </p>
        </div>
        <Link href="/events/new">
          <Button>Criar evento</Button>
        </Link>
      </div>

      <SearchBar initialValue={search} />

      {error ? (
        <Alert>Não foi possível carregar os eventos. Tente novamente.</Alert>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-text-body">Nenhum evento encontrado.</p>
          <p className="mt-1 text-sm text-text-muted">
            {search
              ? "Tente outra busca ou crie um novo evento."
              : "Seja o primeiro a criar um evento."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {meta && (
            <EventsPagination page={meta.page} totalPages={meta.totalPages} />
          )}
        </>
      )}
    </Container>
  );
}

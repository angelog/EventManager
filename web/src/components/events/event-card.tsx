import Link from "next/link";
import { Badge } from "@/components/ui";
import { formatDate, formatParticipants } from "@/lib/utils/format";
import type { EventListItem } from "@/types";

interface EventCardProps {
  event: EventListItem;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors group-hover:border-brand">
        <h3 className="line-clamp-2 font-semibold text-text">{event.name}</h3>
        <p className="text-sm text-text-muted">{formatDate(event.date)}</p>
        {event.description && (
          <p className="line-clamp-2 text-sm text-text-body">
            {event.description}
          </p>
        )}
        <div className="mt-auto pt-2">
          <Badge tone="brand">
            {formatParticipants(event.participantsCount)}
          </Badge>
        </div>
      </article>
    </Link>
  );
}

import type { Participant } from "@/types";

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  if (participants.length === 0) {
    return <p className="text-sm text-text-muted">Nenhum inscrito ainda.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {participants.map((participant) => (
        <li key={participant.id} className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-semibold text-brand-light">
            {participant.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm text-text">{participant.name}</p>
            <p className="truncate text-xs text-text-muted">
              {participant.email}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Tipos do domínio — espelham o contrato da API (../api/src/docs/openapi.yaml).

export interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  name: string;
  description: string | null;
  date: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventListItem extends Event {
  participantsCount: number;
}

// Inscrito exibido no detalhe do evento. Dados de contato (email/phone) só vêm
// preenchidos quando o solicitante é o dono do evento; senão, apenas id e nome.
export type EventAttendee = Pick<Participant, "id" | "name"> &
  Partial<Pick<Participant, "email" | "phone" | "createdAt" | "updatedAt">>;

export interface EventDetail extends Event {
  createdBy: EventAttendee;
  participants: EventAttendee[];
  participantsCount: number;
}

export interface Registration {
  id: number;
  eventId: number;
  participantId: number;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  error: string;
  message: string;
  details?: { field: string; message: string }[];
}

export interface AuthResponse {
  participant: Participant;
  token: string;
}

export interface CreateEventPayload {
  name: string;
  description?: string;
  date: string;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateParticipantPayload {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
}
